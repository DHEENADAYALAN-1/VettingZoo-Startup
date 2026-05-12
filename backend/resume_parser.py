import PyPDF2

def extract_text_from_pdf(pdf_path):
    text = ""

    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)

            for page in reader.pages:
                extracted = page.extract_text()

                if extracted:
                    text += extracted

    except Exception as e:
        print("PDF ERROR:", e)

    return text