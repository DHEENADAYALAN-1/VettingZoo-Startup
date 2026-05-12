import streamlit as st
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- PDF TEXT EXTRACTION ----------------
def extract_text_from_pdf(uploaded_pdf):
    text = ""
    reader = PyPDF2.PdfReader(uploaded_pdf)
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.lower()

# ---------------- SKILL EXTRACTION ----------------
SKILLS = [
    "python", "java", "sql", "aws", "git", "linux", "cloud",
    "html", "css", "javascript", "react", "node", "mongodb",
    "machine learning", "data science", "nlp", "docker"
]

def extract_skills(text):
    text = text.lower()
    found = []
    for skill in SKILLS:
        if skill in text:
            found.append(skill)
    return sorted(list(set(found)))

# ---------------- TEXT SIMILARITY (TF-IDF) ----------------
def calculate_text_similarity(resume_text, job_text):
    docs = [resume_text, job_text]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(docs)
    sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return round(sim * 100, 2)

# ---------------- MATCHING ENGINE ----------------
def match_resume_to_job(resume_text, job_text, threshold=60.0):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matched = sorted(list(resume_set.intersection(job_set)))
    missing = sorted(list(job_set - resume_set))

    skill_score = (len(matched) / len(job_skills)) * 100 if job_skills else 0.0
    similarity_score = calculate_text_similarity(resume_text, job_text)

    final_score = round((0.7 * skill_score) + (0.3 * similarity_score), 2)
    recommendation = "SELECTED ✅" if final_score >= threshold else "NOT SELECTED ❌"

    return resume_skills, job_skills, matched, missing, skill_score, similarity_score, final_score, recommendation

# ---------------- STREAMLIT UI ----------------
st.set_page_config(page_title="AI Resume Screening System", layout="centered")
st.title("vetting zoo")
st.write("Upload a resume PDF and paste a Job Description to get ATS match score.")

threshold = st.slider("Selection Threshold (%)", 0, 100, 60)

uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])
job_desc = st.text_area("Paste Job Description here")

if uploaded_file and job_desc.strip():
    resume_text = extract_text_from_pdf(uploaded_file)
    job_text = job_desc.lower()

    resume_skills, job_skills, matched, missing, skill_score, similarity_score, final_score, recommendation = match_resume_to_job(
        resume_text, job_text, threshold=threshold
    )

    st.subheader("Resume Skills Found")
    st.write(resume_skills)

    st.subheader("Job Skills Required")
    st.write(job_skills)

    st.subheader("Matched Skills")
    st.write(matched)

    st.subheader("Missing Skills (Need to Learn)")
    st.write(missing)

    st.subheader("Scores")
    st.write(f"Skill Match Score: {skill_score:.2f}%")
    st.write(f"Text Similarity Score (TF-IDF): {similarity_score:.2f}%")
    st.write(f"Final Score: {final_score:.2f}%")

    st.subheader("Recommendation")
    if "SELECTED" in recommendation:
        st.success(recommendation)
    else:
        st.error(recommendation)

    # --------- DOWNLOAD REPORT ----------
    report = f"""
AI RESUME SCREENING REPORT
--------------------------
Skill Match Score: {skill_score:.2f}%
Text Similarity Score (TF-IDF): {similarity_score:.2f}%
Final Score: {final_score:.2f}%
Recommendation: {recommendation}

Resume Skills Found:
{', '.join(resume_skills)}

Job Required Skills:
{', '.join(job_skills)}

Matched Skills:
{', '.join(matched)}

Missing Skills:
{', '.join(missing)}
"""

    st.download_button(
        label="Download Report",
        data=report,
        file_name="resume_report.txt",
        mime="text/plain"
    )

else:
    st.info("Upload a resume PDF and paste the Job Description to see results.")
