def load_text(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().lower()


def extract_skills(text, skills_list):
    found = []
    for skill in skills_list:
        if skill in text:
            found.append(skill)
    return sorted(list(set(found)))


# Skill list (expand anytime)
SKILLS = [
    "python", "java", "sql", "aws", "git", "linux", "cloud",
    "html", "css", "javascript", "react", "node", "mongodb",
    "machine learning", "data science", "nlp", "docker"
]

THRESHOLD = 60.0  # selection rule


# Load files
resume_text = load_text("resume_text.txt")
job_text = load_text("job_description.txt")

# Extract skills
resume_skills = extract_skills(resume_text, SKILLS)
job_skills = extract_skills(job_text, SKILLS)

resume_set = set(resume_skills)
job_set = set(job_skills)

# Match & missing
matched = sorted(list(resume_set.intersection(job_set)))
missing = sorted(list(job_set - resume_set))

# Score
score = (len(matched) / len(job_skills)) * 100 if job_skills else 0.0

# Recommendation
recommendation = "SELECTED ✅" if score >= THRESHOLD else "NOT SELECTED ❌"

# Print ATS-style report
print("\n========== ATS RESUME MATCH REPORT ==========")

print("\nResume Skills Found:")
print(resume_skills)

print("\nJob Skills Required:")
print(job_skills)

print("\nMatched Skills:")
print(matched)

print("\nMissing Skills (Need to Learn):")
print(missing)

print(f"\nSuitability Score: {score:.2f}%")
print(f"Recommendation: {recommendation}")

print("\n============================================\n")
