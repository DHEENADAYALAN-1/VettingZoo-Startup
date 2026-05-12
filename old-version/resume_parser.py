import PyPDF2

def extract_text_from_pdf(pdf_path):
    text = ""
    
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        
        for page in reader.pages:
            text += page.extract_text()
    
    return text


if __name__ == "__main__":
    pdf_path = "sample_resume.pdf"
    resume_text = extract_text_from_pdf(pdf_path)
    
    print("\n========== RESUME TEXT ==========\n")
    print(resume_text)
