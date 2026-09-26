import csv
import re
import os
import sys
import json

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
    result = []
    for char in text:
        result.append(CYRILLIC_TO_LATIN.get(char, char))
    return ''.join(result)

def translate_to_uzbek(text, translation_cache):
    if not text:
        return text
        
    # Use API translated cache first if available
    if text in translation_cache:
        # API might return same text if it failed to translate, 
        # so we still apply regex replacements below
        text = translation_cache[text]
    
    # Simple direct string replacements (case insensitive handling using regex)
    replacements = {
        r'\(shtuka\)': '(dona)',
        r'\(sht\)': '(dona)',
        r'\(litr\)': '(litr)',
        r'\(kub\.m\)': '(kub metr)',
        r'\(kub\.metr\)': '(kub metr)',
        r'\(kv\.m\)': '(kv. metr)',
        r'v meshkax': 'qoplarda',
        r'v bochkax': 'bochkalarda',
        r'v ballonax': 'balonlarda',
        r'v tubax': 'tubalarda',
        r'v bankax': 'bankalarda',
        r'v PET butilkax': 'PET idishlarda',
        r'v granulax': 'granulalarda',
        r'mernoy dlini': "o'lchamli uzunlikda",
        r'nemernoy dlini': "o'lchamsiz uzunlikda",
        r'bez izm\.': '■',
        r'bez izm': '■',
        r'без изм\.': '■',
        r'без изм': '■',
        r'bez izmeneniya': '■',
        # Russian common raw materials translation fallback
        r'\bArmatura\b': 'Armatura',
        r'\bAvtobenzin\b': 'Avtobenzin',
        r'\bAzot\b': 'Azot',
        r'\bAmmofos\b': 'Ammofos',
        r'\bAlyuminieviy\b': 'Alyumin',
        r'\bAlyuminievaya\b': 'Alyumin',
        r'\bBeton\b': 'Beton',
        r'\bBitum\b': 'Bitum',
        r'\bBalka\b': 'Balka',
        r'\bBolt\b': 'Bolt',
        r'\bGayka\b': 'Gayka',
        r'\bVitraji\b': 'Vitrajlar',
        r'\bGruntovka\b': 'Gruntovka'
    }
    
    for pattern, repl in replacements.items():
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
        
    # Regex replacements for complex technical terms
    # Diameter: d14mm or d-14mm or 14mm
    text = re.sub(r'\bd[- ]?(\d+)\s*mm\b', r'diametri \1 mm', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(\d+)\s*mm\b', r'diametri \1 mm', text, flags=re.IGNORECASE)
    
    # Steel grades: st 35 GS -> 35 GS markali po'lat
    text = re.sub(r'\bst\s*(\d+)\s*GS\b', r'\1 GS markali po\'lat', text, flags=re.IGNORECASE)
    text = re.sub(r'\bst\s*(\d+)[pP][sS]\b', r'\1ps markali po\'lat', text, flags=re.IGNORECASE)
    text = re.sub(r'\bst\s*(\d+)[sS][pP]\b', r'\1sp markali po\'lat', text, flags=re.IGNORECASE)
    
    return text

def clean_data(input_csv, output_csv, cache_file):
    print(f"Reading from {input_csv}...")
    if not os.path.exists(input_csv):
        print("Input file does not exist!")
        return
        
    translation_cache = {}
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            translation_cache = json.load(f)
        print(f"Loaded {len(translation_cache)} cached translations.")
        
    from process_units import parse_product_unit

    with open(input_csv, mode='r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        original_fieldnames = list(reader.fieldnames)
        if 'Unit' in original_fieldnames:
            fieldnames = original_fieldnames
        else:
            idx = original_fieldnames.index('Product_Name') + 1
            fieldnames = original_fieldnames[:idx] + ['Unit'] + original_fieldnames[idx:]
        
        with open(output_csv, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            
            count = 0
            for row in reader:
                # all_data.csv has latinized names, so we can just look them up
                original_name = row['Product_Name']
                translated_name = translate_to_uzbek(original_name, translation_cache)
                clean_name, unit = parse_product_unit(translated_name)
                row['Product_Name'] = clean_name
                row['Unit'] = unit
                
                # Update price change direction
                direction = transliterate(row['Price_Change_Direction']).strip()
                if 'bez izm' in direction.lower() or 'без изм' in direction.lower():
                    row['Price_Change_Direction'] = '■'
                else:
                    row['Price_Change_Direction'] = direction
                    
                # Transliterate Last_Trading_Week
                row['Last_Trading_Week'] = transliterate(row['Last_Trading_Week'])
                
                writer.writerow(row)
                count += 1
                
    print(f"Processed {count} rows. Saved to {output_csv}.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_csv = os.path.join(base_dir, 'data/all_data.csv')
    output_csv = os.path.join(base_dir, 'data/cleaned_data_uz.csv')
    cache_file = os.path.join(base_dir, 'data/translations.json')
    clean_data(input_csv, output_csv, cache_file)

