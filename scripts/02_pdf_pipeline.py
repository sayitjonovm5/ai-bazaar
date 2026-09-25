import sys
import os
import csv
import pdfplumber
import re
from datetime import datetime

# Transliteration dictionary for Cyrillic to Uzbek Latin
CYRILLIC_TO_LATIN = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'J',
    'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'X', 'Ц': 'S',
    'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': "'", 'Ы': 'I', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
    'Я': 'Ya', 'Ў': "O'", 'Қ': 'Q', 'Ғ': "G'", 'Ҳ': 'H',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 's',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': "'", 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya', 'ў': "o'", 'қ': 'q', 'ғ': "g'", 'ҳ': 'h'
}

def transliterate(text):
    if not text:
        return text
    # Replace common Russian endings if necessary, but letter-by-letter is usually fine
    result = []
    for char in text:
        result.append(CYRILLIC_TO_LATIN.get(char, char))
    return ''.join(result)

def categorize_product(product_name):
    name_lower = product_name.lower()
    if any(kw in name_lower for kw in ['бензин', 'дизель', 'нефть', 'мазут', 'газ', 'керосин', 'битум', 'уголь']):
        return "Yoqilg'i" # Fuel
    elif any(kw in name_lower for kw in ['азот', 'кислота', 'спирт', 'аммиак', 'селитра', 'карбамид', 'сера']):
        return "Kimyoviy moddalar" # Chemicals
    elif any(kw in name_lower for kw in ['цемент', 'бетон', 'стекло', 'арматура', 'труба', 'кирпич', 'гипс', 'шифер']):
        return "Qurilish materiallari" # Construction
    elif any(kw in name_lower for kw in ['пшеница', 'мука', 'сахар', 'масло', 'хлопок', 'шрот', 'шелуха', 'зерно', 'комбикорм', 'мясо']):
        return "Qishloq xo'jaligi va oziq-ovqat" # Agriculture and Food
    elif any(kw in name_lower for kw in ['сталь', 'медь', 'алюминий', 'прокат', 'катод', 'цинк', 'металлолом']):
        return "Metallurgiya" # Metallurgy
    elif any(kw in name_lower for kw in ['полиэтилен', 'полипропилен', 'пвх', 'полистирол']):
        return "Polimerlar va plastmassa" # Polymers and Plastics
    else:
        return "Boshqa" # Other

def clean_price(price_str):
    if not price_str:
        return ""
    # Remove spaces and replace commas with dots for float parsing
    clean_str = re.sub(r'\s+', '', price_str).replace(',', '.')
    try:
        return float(clean_str)
    except ValueError:
        return price_str

def extract_date(filename):
    # Extract end date from filename like 2024-09-04_to_2024-09-06.pdf
    match = re.search(r'to_(\d{4}-\d{2}-\d{2})', filename)
    if match:
        return match.group(1)
    return ""

def process_pdf(pdf_path, output_csv):
    print(f"Processing {pdf_path}...")
    filename = os.path.basename(pdf_path)
    file_date = extract_date(filename)
    
    file_exists = os.path.isfile(output_csv)
    
    with pdfplumber.open(pdf_path) as pdf:
        with open(output_csv, mode='a', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            if not file_exists:
                writer.writerow(['Date', 'Category', 'Product_Name', 'Current_Price_Sum', 'Price_Change_Direction', 'Price_Change_Sum', 'Price_Change_Percent', 'Last_Trading_Week'])
            
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    for i, row in enumerate(table):
                        # Skip headers and empty rows
                        if not row or len(row) < 6:
                            continue
                        if row[0] is None or 'Наименование продукции' in str(row[0]) or 'Узбекская' in str(row[0]):
                            continue
                        if str(row[0]).strip() == '':
                            continue
                            
                        # Assuming structure: Name, Price, Direction, Change(Sum), Change(%), Week
                        raw_name = str(row[0]).replace('\n', ' ')
                        name_lat = transliterate(raw_name)
                        category = categorize_product(raw_name)
                        
                        price = clean_price(str(row[1]))
                        direction = str(row[2]).replace('\n', ' ')
                        change_sum = clean_price(str(row[3]))
                        change_pct = clean_price(str(row[4]))
                        week = str(row[5]).replace('\n', ' ')
                        
                        writer.writerow([file_date, category, name_lat, price, direction, change_sum, change_pct, week])

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python pdf_pipeline.py <path_to_pdf>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    output_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data/all_data.csv')
    process_pdf(pdf_path, output_csv)
