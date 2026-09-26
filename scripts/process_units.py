import csv
import re
import os
import sys

def parse_product_unit(name, existing_unit=None):
    if not name:
        return name, existing_unit if existing_unit else 'tonna'
        
    unit_defs = [
        # (dona) and synonyms
        (r'\s*\((?:dona|shtuka|sht\.?|parcha|bo[\'ʼ`]lak|piece)\)[\)]*', 'dona'),
        # (litr) and synonyms
        (r'\s*\((?:litr|liter|litrda)\)[\)]*', 'litr'),
        # (dekalitr)
        (r'\s*\(dekalitr\)[\)]*', 'dekalitr'),
        # (desilitr)
        (r'\s*\(desilitr\)[\)]*', 'desilitr'),
        # (kv. metr) and synonyms
        (r'\s*\((?:kv\.?\s*metr|kv\.m)\)[\)]*', 'kv. metr'),
        # (kub metr) and synonyms
        (r'\s*\((?:kub\.?\s*metr|kubometr|kub\s*m|cubic\s*meter|kub\.m|m3)\)[\)]*', 'kub metr'),
        # (metr) and synonyms
        (r'\s*\((?:chiziqli\s+metr|pogonniy\s+metr|metr|meter)\)[\)]*', 'metr'),
        # (kilogramm) and synonyms
        (r'\s*\((?:kilogramm(?:da)?|v\s+kilogrammax|kg)\)[\)]*', 'kg'),
        # (gramm) and synonyms
        (r'\s*\((?:gramm?|gr\.?)\)[\)]*', 'gramm'),
        # (qoplarda) and packaging synonyms
        (r'\s*\((?:qoplarda(?:\s+shtuka)?|sumkalarda|v\s+meshkax(?:\s+shtuka)?|in\s+bags|bir\s+qopda|qopda|qop)\)[\)]*', 'qop'),
        # (tonna) if explicitly present
        (r'\s*\((?:tonna(?:da)?|ton|tn\.?)\)[\)]*', 'tonna'),
        # unclosed parenthesis at end of line (e.g. (litr, (dona., (kub.metr)
        (r'\s*\((?:litr|liter)[^\)]*$', 'litr'),
        (r'\s*\((?:dona|shtuka)[^\)]*$', 'dona'),
        (r'\s*\((?:kub\.?metr|kubometr)[^\)]*$', 'kub metr'),
    ]
    
    found_unit = None
    clean_name = name
    for pattern, unit in unit_defs:
        match = re.search(pattern, clean_name, re.IGNORECASE)
        if match:
            found_unit = unit
            clean_name = re.sub(pattern, '', clean_name, count=1, flags=re.IGNORECASE)
            break
            
    # Also if packaging like (qoplarda) was present along with a measurement unit (e.g. (qoplarda) (dona)),
    # remove packaging tag from name
    clean_name = re.sub(r'\s*\((?:qoplarda|sumkalarda|v\s+meshkax|in\s+bags)\)[\)]*', '', clean_name, flags=re.IGNORECASE)
    
    # Clean up double spaces and trailing characters
    clean_name = re.sub(r'\s+', ' ', clean_name).strip()
    clean_name = re.sub(r'[\s,\-]+$', '', clean_name).strip()
    
    if not found_unit:
        found_unit = existing_unit if existing_unit else 'tonna'
        
    return clean_name, found_unit

def process_file(file_path):
    print(f"Processing {file_path}...")
    temp_file = file_path + ".tmp"
    
    unit_stats = {}
    row_count = 0
    
    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        original_fieldnames = list(reader.fieldnames)
        
        # Determine new fieldnames: insert 'Unit' after 'Product_Name' if not already present
        if 'Unit' in original_fieldnames:
            new_fieldnames = original_fieldnames
        else:
            idx = original_fieldnames.index('Product_Name') + 1
            new_fieldnames = original_fieldnames[:idx] + ['Unit'] + original_fieldnames[idx:]
            
        with open(temp_file, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=new_fieldnames)
            writer.writeheader()
            
            for row in reader:
                orig_name = row['Product_Name']
                existing_unit = row.get('Unit', None)
                clean_name, unit = parse_product_unit(orig_name, existing_unit)
                
                row['Product_Name'] = clean_name
                row['Unit'] = unit
                
                unit_stats[unit] = unit_stats.get(unit, 0) + 1
                row_count += 1
                
                writer.writerow(row)
                
    # Replace original file with temp file
    os.replace(temp_file, file_path)
    print(f"Finished {file_path}: {row_count} rows processed.")
    for u, cnt in sorted(unit_stats.items(), key=lambda x: x[1], reverse=True):
        print(f"  {u:12s}: {cnt:6d}")

def process_forecasts(file_path):
    if not os.path.exists(file_path):
        return
    print(f"Processing forecasts {file_path}...")
    temp_file = file_path + ".tmp"
    row_count = 0
    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = list(reader.fieldnames)
        if 'Unit' not in fieldnames:
            fieldnames = ['Product_Name', 'Unit'] + [f for f in fieldnames if f != 'Product_Name']
            
        with open(temp_file, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in reader:
                orig_name = row['Product_Name']
                existing_unit = row.get('Unit', None)
                clean_name, unit = parse_product_unit(orig_name, existing_unit)
                row['Product_Name'] = clean_name
                row['Unit'] = unit
                row_count += 1
                writer.writerow(row)
                
    os.replace(temp_file, file_path)
    print(f"Finished forecasts {file_path}: {row_count} rows processed.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cleaned_csv = os.path.join(base_dir, 'data', 'cleaned_data_uz.csv')
    all_data_csv = os.path.join(base_dir, 'data', 'all_data.csv')
    forecasts_csv = os.path.join(base_dir, 'data', 'forecasts.csv')
    
    process_file(cleaned_csv)
    process_file(all_data_csv)
    process_forecasts(forecasts_csv)
