import os
import sys
import json
import time
import pandas as pd
import cyrtranslit
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def load_cache(cache_file):
    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_cache(cache, cache_file):
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=4)

def chunk_products(products, max_chars=4000):
    chunks = []
    current_chunk = []
    current_length = 0
    for p in products:
        cyrillic_p = cyrtranslit.to_cyrillic(p, 'ru')
        length = len(cyrillic_p) + 1
        if current_length + length > max_chars:
            chunks.append(current_chunk)
            current_chunk = [p]
            current_length = length
        else:
            current_chunk.append(p)
            current_length += length
    if current_chunk:
        chunks.append(current_chunk)
    return chunks

def batch_translate(browser, chunk):
    page = browser.new_page()
    try:
        page.goto('https://translate.google.com/?sl=ru&tl=uz&op=translate', timeout=60000)
        
        source_text_area = page.locator('textarea[aria-label="Source text"]')
        source_text_area.wait_for(timeout=30000)
        
        cyrillic_lines = [cyrtranslit.to_cyrillic(p, 'ru') for p in chunk]
        batch_text = "\n".join(cyrillic_lines)
        
        source_text_area.fill(batch_text)
        
        # Wait for translation to populate
        time.sleep(5)
        
        # Target text container
        spans = page.locator('span[class="ryNqvb"]').all_inner_texts()
        if not spans:
            spans = page.locator('span[lang="uz"]').all_inner_texts()
            
        full_translation = "\n".join(spans)
        translated_lines = [line.strip() for line in full_translation.split('\n') if line.strip()]
        
        return translated_lines
    except Exception as e:
        print(f"  Error during translation: {e}")
        return []
    finally:
        page.close()

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, 'data', 'all_data.csv')
    cache_file = os.path.join(base_dir, 'data', 'translations.json')
    
    print(f"Reading data from {data_file}...")
    df = pd.read_csv(data_file)
    unique_products = df['Product_Name'].dropna().unique()
    cache = load_cache(cache_file)
    
    new_products = [p for p in unique_products if p not in cache]
    print(f"Need to translate {len(new_products)} products.")
    if not new_products:
        print("Everything is translated!")
        return
        
    chunks = chunk_products(new_products, max_chars=4000)
    print(f"Created {len(chunks)} batches.")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for i, chunk in enumerate(chunks):
            print(f"Translating batch {i+1}/{len(chunks)} (size: {len(chunk)} products)...")
            translated_lines = batch_translate(browser, chunk)
            
            if len(translated_lines) == len(chunk):
                for orig, transl in zip(chunk, translated_lines):
                    cache[orig] = transl
                save_cache(cache, cache_file)
                print(f"  Successfully cached batch {i+1}.")
            else:
                print(f"  Warning: Batch {i+1} length mismatch! Original: {len(chunk)}, Translated: {len(translated_lines)}.")
            
            time.sleep(2)
            
if __name__ == "__main__":
    main()
