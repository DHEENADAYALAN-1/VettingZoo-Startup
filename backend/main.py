from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import tempfile
from dotenv import load_dotenv
import google.generativeai as genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills, SKILLS, _normalize, _contains

app = FastAPI(title="Vetting Zoo Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()
MAX_FILE_MB = 10


async def read_resume_text(resume: UploadFile) -> str:
    """Read an uploaded PDF and return its text. The file is never kept on the server."""
    name = resume.filename or "resume.pdf"
    if not name.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail=f"{name}: only PDF resumes are supported.")

    content = await resume.read()
    if len(content) > MAX_FILE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"{name}: file is larger than {MAX_FILE_MB} MB.")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        tmp.write(content)
        tmp.close()
        text = extract_text_from_pdf(tmp.name)
    finally:
        try:
            os.remove(tmp.name)
        except OSError:
            pass

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail=f"{name}: could not read any text. Please upload a text-based PDF, not a scanned image.",
        )
    return text



GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

GEMINI_MODELS = [m for m in [os.getenv("GEMINI_MODEL"), "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"] if m]
_working_model = None


def discover_models():
    """Ask Google which models this key can use for text generation (flash models first)."""
    try:
        names = [m.name.replace("models/", "") for m in genai.list_models()
                 if "generateContent" in m.supported_generation_methods]
    except Exception:
        return []
    skip = ("preview", "exp", "image", "tts", "live", "audio", "thinking", "embedding", "vision")
    flash = [n for n in names if "flash" in n and not any(w in n for w in skip)]
    return flash or names


def call_gemini(prompt: str, errors: dict = None) -> str:
    """Try each model until one answers, and remember the one that works."""
    global _working_model
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")
    errors = errors if errors is not None else {}
    tried = []

    def attempt(name):
        global _working_model
        if name in tried:
            return None
        tried.append(name)
        try:
            text = genai.GenerativeModel(name).generate_content(prompt).text
            _working_model = name
            return text
        except Exception as e:
            errors[name] = str(e)[:160]
            return None

    for name in ([_working_model] if _working_model else []) + GEMINI_MODELS:
        text = attempt(name)
        if text:
            return text
    for name in discover_models()[:6]:
        text = attempt(name)
        if text:
            return text
    raise RuntimeError("No Gemini model answered")


@app.get("/ai-check")
def ai_check():
    """Open /ai-check in a browser to see whether Gemini works, and why not if it does not."""
    if not GEMINI_API_KEY:
        return {"configured": False, "ok": False, "error": "GEMINI_API_KEY is not set"}
    errors = {}
    try:
        call_gemini("Reply with the single word OK.", errors)
        return {"configured": True, "ok": True, "model": _working_model}
    except Exception as e:
        return {"configured": True, "ok": False, "error": str(e), "errors_by_model": errors,
                "models_your_key_can_use": discover_models()[:12]}


def find_evidence(text: str, skills, per_skill: int = 2):
    """For each skill, return up to 2 resume lines that show it (prefers descriptive lines)."""
    lines = [re.sub(r"\s+", " ", l).strip(" -\u2022\u2013\u2014\t") for l in text.splitlines()]
    lines = [l for l in lines if len(l) > 3]
    evidence = {}
    for skill in skills:
        terms = [skill, *SKILLS.get(skill, [])]
        hits = [l for l in lines if any(_contains(_normalize(l), t) for t in terms)]
        hits.sort(key=lambda l: len(l) < 60)  # long, descriptive lines first
        if hits:
            evidence[skill] = [h[:220] for h in hits[:per_skill]]
    return evidence


def generate_candidate_summary(resume_skills, matched=None, missing=None):
    matched = matched or []
    missing = missing or []
    parts = []
    total = len(matched) + len(missing)

    if total:
        line = f"Covers {len(matched)} of the {total} skills the role asks for"
        line += f", including {', '.join(matched[:4])}." if matched else "."
        parts.append(line)
        parts.append(f"Not found on the resume: {', '.join(missing[:4])}." if missing else "No required skills are missing.")

    domain = []
    if "machine learning" in resume_skills or "nlp" in resume_skills:
        domain.append("Shows AI and machine learning exposure.")
    if "docker" in resume_skills or "aws" in resume_skills:
        domain.append("Familiar with cloud and deployment tools.")
    if "react" in resume_skills or "javascript" in resume_skills:
        domain.append("Can work on modern frontends.")
    if "sql" in resume_skills or "postgresql" in resume_skills:
        domain.append("Has database and querying skills.")
    parts.extend(domain[:2])

    if not parts:
        parts.append("Candidate has foundational technical exposure with growth potential.")
    return " ".join(parts)


def generate_ai_recruiter_insights(resume_text, job_description, matched_skills, missing_skills):
    if not GEMINI_API_KEY:
        return "AI recruiter insights temporarily unavailable. Basic ATS analysis is still available."
    try:
        prompt = f"""
You are an expert AI recruiter.

Analyze this candidate professionally.

Resume:
{resume_text[:4000]}

Job Description:
{job_description[:2000]}

Matched Skills:
{matched_skills}

Missing Skills:
{missing_skills}

Generate a concise recruiter-friendly candidate summary only.
Avoid markdown formatting.
"""

        return call_gemini(prompt)

    except Exception as e:
        print("GEMINI ERROR:", e)
        return "AI recruiter insights temporarily unavailable. Basic ATS analysis is still available."


def calculate_match(resume_text: str, job_description: str):
    original_text = resume_text
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    matched_skills = sorted(list(set(resume_skills).intersection(set(job_skills))))
    missing_skills = sorted(list(set(job_skills) - set(resume_skills)))

    keyword_score = round((len(matched_skills) / len(job_skills)) * 100, 2) if job_skills else 0
    semantic_score = calculate_semantic_score(resume_text, job_description)

    final_score = round((keyword_score * 0.6) + (semantic_score * 0.4), 2)

    if final_score >= 80:
        insight = "Excellent alignment between candidate profile and job requirements."
        recommendation = "Highly Recommended"
        strengths = [
            "Strong technical alignment",
            "High semantic relevance to job role",
            "Good overall skill coverage",
        ]
        concerns = ["Verify practical project depth during interview"]

    elif final_score >= 60:
        insight = "Good candidate fit with moderate alignment across required skills."
        recommendation = "Recommended"
        strengths = [
            "Relevant technical background",
            "Partial alignment with hiring requirements",
        ]
        concerns = [
            "Some required skills are missing",
            "Needs deeper technical evaluation",
        ]

    elif final_score >= 40:
        insight = "Moderate profile match. Candidate may fit junior or trainable roles."
        recommendation = "Needs Review"
        strengths = ["Shows foundational technical understanding"]
        concerns = [
            "Multiple required skills missing",
            "Limited semantic similarity to target role",
        ]

    else:
        insight = "Low alignment with current job requirements."
        recommendation = "Not Recommended"
        strengths = ["Basic technical exposure detected"]
        concerns = [
            "Insufficient alignment with target position",
            "Significant skill gaps identified",
        ]

    summary_text = generate_ai_recruiter_insights(
        resume_text,
        job_description,
        matched_skills,
        missing_skills,
    )

    ai_source = "gemini"
    if "temporarily unavailable" in summary_text:
        ai_source = "rules"
        summary_text = generate_candidate_summary(resume_skills, matched_skills, missing_skills)

    interview_questions = [
        "Can you explain one project where you used your strongest technical skill?",
        "How would you improve this project for production-level deployment?",
        "What challenges did you face while working with databases or APIs?",
    ]

    for skill in matched_skills[:3]:
        interview_questions.append(
            f"Can you explain your practical experience with {skill}?"
        )

    for skill in missing_skills[:2]:
        interview_questions.append(
            f"This role requires {skill}. How would you learn or handle this requirement?"
        )

    return {
        "score": final_score,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "ai_insight": insight,
        "recommendation": recommendation,
        "candidate_summary": summary_text,
        "strengths": strengths,
        "concerns": concerns,
        "interview_questions": interview_questions,
        "evidence": find_evidence(original_text, matched_skills),
        "ai_source": ai_source,
    }


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Please paste a job description.")

    resume_text = await read_resume_text(resume)
    result = calculate_match(resume_text, job_description)

    return {
        "filename": resume.filename,
        **result
    }


@app.post("/analyze-multiple")
async def analyze_multiple_resumes(
    resumes: list[UploadFile] = File(...),
    job_description: str = Form(...)
):
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Please paste a job description.")

    all_results = []
    skipped = []

    for resume in resumes:
        try:
            resume_text = await read_resume_text(resume)
        except HTTPException as e:
            skipped.append(e.detail)
            continue

        result = calculate_match(resume_text, job_description)
        all_results.append({
            "filename": resume.filename,
            **result
        })

    if not all_results:
        raise HTTPException(
            status_code=400,
            detail="No readable PDF resumes. " + " ".join(skipped),
        )

    ranked_results = sorted(all_results, key=lambda x: x["score"], reverse=True)

    return {
        "total_candidates": len(ranked_results),
        "rankings": ranked_results,
        "skipped": skipped,
    }
