import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')


def test_pdf(path):
    print(f"Reading {path}...")
    try:
        with pdfplumber.open(path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
            if len(pdf.pages) > 0:
                first_page = pdf.pages[0]
                tables = first_page.extract_tables()
                print(f"Found {len(tables)} tables on first page")
                if tables:
                    for i, row in enumerate(tables[0][:30]):
                        print(f"Row {i}: {row}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_pdf(sys.argv[1])
