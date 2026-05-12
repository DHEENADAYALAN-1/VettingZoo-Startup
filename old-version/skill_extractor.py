import spacy

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Predefined skill set (you can expand later)
SKILLS = [
    "python", "java", "machine learning", "deep learning", "nlp",
    "sql", "data science", "tensorflow", "pandas", "numpy",
    "html", "css", "javascript", "react", "aws", "docker",
    "git", "linux", "cloud", "flask", "streamlit"
]

def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))


if __name__ == "__main__":
    with open("resume_text.txt", "r", encoding="utf-8") as file:
        resume_text = file.read()

    skills = extract_skills(resume_text)

    print("\n===== EXTRACTED SKILLS =====\n")
    for skill in skills:
        print(skill)
