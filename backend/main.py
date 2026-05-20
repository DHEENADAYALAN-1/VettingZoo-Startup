from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai
from sentence_transformers import SentenceTransformer, util

from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills

app = FastAPI(title="Vetting Zoo Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")

genai.configure(api_key=os.getenv("AIzaSyBeQqN7WYU8zwnD-pksIphwMfrKdMbf798"))
gemini_model = genai.GenerativeModel("gemini-1.5-flash")


@app.get("/")
def home():
    return {"message": "Vetting Zoo AI Backend is running"}


def calculate_semantic_score(resume_text: str, job_description: str):
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)
    jd_embedding = model.encode(job_description, convert_to_tensor=True)
    similarity = util.cos_sim(resume_embedding, jd_embedding).item()
    return round(similarity * 100, 2)


def generate_candidate_summary(resume_skills):
    summary = []

    if "machine learning" in resume_skills or "nlp" in resume_skills:
        summary.append("Demonstrates strong AI and machine learning exposure.")

    if "python" in resume_skills:
        summary.append("Shows solid backend and scripting capabilities using Python.")

    if "sql" in resume_skills:
        summary.append("Possesses strong database and analytical querying skills.")

    if "docker" in resume_skills or "aws" in resume_skills:
        summary.append("Understands cloud infrastructure and scalable deployment concepts.")

    if "react" in resume_skills or "javascript" in resume_skills:
        summary.append("Capable of contributing to modern frontend application development.")

    if not summary:
        summary.append("Candidate has foundational technical exposure with growth potential.")

    return " ".join(summary)


def generate_ai_recruiter_insights(resume_text, job_description, matched_skills, missing_skills):
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

        response = gemini_model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("GEMINI ERROR:", e)
        return "AI recruiter insights temporarily unavailable. Basic ATS analysis is still available."


def calculate_match(resume_text: str, job_description: str):
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

    if "temporarily unavailable" in summary_text:
        summary_text = generate_candidate_summary(resume_skills)

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
    }


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, resume.filename)

    with open(file_path, "wb") as f:
        content = await resume.read()
        f.write(content)

    if resume.filename.lower().endswith(".pdf"):
        resume_text = extract_text_from_pdf(file_path)
    else:
        return {"error": "Currently only PDF resumes are supported."}

    if not resume_text.strip():
        return {
            "error": "Could not extract text from this PDF. Please upload a text-based resume PDF."
        }

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
    all_results = []

    for resume in resumes:
        file_path = os.path.join(UPLOAD_FOLDER, resume.filename)

        with open(file_path, "wb") as f:
            content = await resume.read()
            f.write(content)

        if resume.filename.lower().endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_path)
        else:
            continue

        if not resume_text.strip():
            continue

        result = calculate_match(resume_text, job_description)

        all_results.append({
            "filename": resume.filename,
            **result
        })

    ranked_results = sorted(
        all_results,
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "total_candidates": len(ranked_results),
        "rankings": ranked_results
    }