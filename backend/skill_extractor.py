import re

# skill -> alternative spellings that should count as the same skill
SKILLS = {
    # languages
    "python": [], "java": [], "c++": [], "javascript": [], "typescript": [],
    "sql": [], "r": [],
    # frontend
    "react": ["react.js", "reactjs"], "next.js": ["nextjs", "next js"],
    "html": [], "css": [], "tailwind css": ["tailwind"], "vite": [],
    # backend
    "fastapi": ["fast api"], "flask": [], "django": [], "node.js": ["nodejs", "node js"],
    "rest api": ["rest apis", "restful"], "supabase": [], "streamlit": [],
    # data / ML
    "machine learning": ["ml"], "deep learning": [], "nlp": ["natural language processing"],
    "llm": ["llms", "large language model", "large language models"],
    "data science": [], "data analytics": ["data analysis"],
    "tensorflow": [], "pytorch": [], "scikit-learn": ["sklearn", "scikit learn"],
    "xgboost": [], "pandas": [], "numpy": [], "spacy": [],
    "sentence transformers": [], "tf-idf": ["tfidf"], "vector database": ["vector databases"],
    # databases
    "postgresql": ["postgres"], "mysql": [], "mongodb": [], "oracle": ["oracle sql"],
    "power bi": ["powerbi"], "tableau": [], "kafka": [], "spark": ["apache spark", "pyspark"],
    # cloud / devops
    "aws": ["amazon web services"], "azure": [], "gcp": ["google cloud"],
    "docker": [], "kubernetes": ["k8s"], "git": [], "github": [], "ci/cd": ["cicd", "ci cd"],
    "linux": [], "cloud": [], "vercel": [], "render": [],
}


def _normalize(text: str) -> str:
    # PDFs often have double spaces / line breaks inside phrases
    text = text.lower().replace("’", "'")
    return re.sub(r"\s+", " ", text)


def _contains(text: str, term: str) -> bool:
    # whole-word match, so "git" does not match "digital" and "java" not "javascript"
    pattern = r"(?<![a-z0-9+#])" + re.escape(term) + r"(?![a-z0-9+#])"
    return re.search(pattern, text) is not None


def extract_skills(text):
    text = _normalize(text)
    found = []
    for skill, aliases in SKILLS.items():
        if skill == "r":  # single letter is too noisy to detect safely
            continue
        if any(_contains(text, term) for term in [skill, *aliases]):
            found.append(skill)
    return sorted(set(found))
