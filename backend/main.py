from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
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

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Vetting Zoo AI Backend is running"}


def calculate_match(resume_text: str, job_description: str):
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matched_skills = sorted(list(resume_set.intersection(job_set)))
    missing_skills = sorted(list(job_set - resume_set))

    score = round((len(matched_skills) / len(job_skills)) * 100, 2) if job_skills else 0

    if score >= 80:
        insight = "Strong candidate fit. The resume matches most of the important job requirements."
        recommendation = "Highly Recommended"
    elif score >= 60:
        insight = "Good candidate fit. The resume matches several key requirements but has some skill gaps."
        recommendation = "Recommended"
    elif score >= 40:
        insight = "Moderate fit. The candidate has some relevant skills but needs improvement for this role."
        recommendation = "Needs Review"
    else:
        insight = "Low fit. The resume does not strongly match the job description requirements."
        recommendation = "Not Recommended"

    return {
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "ai_insight": insight,
        "recommendation": recommendation,
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
        print(resume_text)
    else:
        return {
            "error": "Currently only PDF resumes are supported."
        }

    result = calculate_match(resume_text, job_description)

    return {
        "filename": resume.filename,
        **result
    }