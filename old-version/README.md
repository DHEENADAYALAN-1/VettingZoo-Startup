Vetting Zoo

OVERVIEW
This project is an AI-powered Resume Screening system similar to an ATS.
It extracts skills from a resume PDF and matches them with a Job Description
to generate a suitability score and recommendation.

FEATURES
- Upload Resume (PDF)
- Paste Job Description
- Extract skills
- Matched skills + Missing skills
- Final Score + Recommendation
- Download report

TECH STACK
- Python
- Streamlit
- PyPDF2
- Scikit-learn (TF-IDF + Cosine Similarity)

HOW TO RUN
1) Install dependencies:
pip install -r requirements.txt

2) Run the app:
python -m streamlit run app.py

USAGE
1) Upload a resume PDF
2) Paste job description
3) See match score and recommendation
4) Download report
