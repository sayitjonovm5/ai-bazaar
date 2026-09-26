import time
import pandas as pd
import json
import os
import cyrtranslit
from playwright.sync_api import sync_playwright
from tqdm import tqdm

def load_cache(cache_file):
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_cache(cache, cache_file):
    with open(cache_file, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=4)

def chunk_products(products, max_chars=1000):
    chunks = []
    current_chunk = []
    current_len = 0
    
    for p in products:
        if current_len + len(p) > max_chars and current_chunk:
            chunks.append(current_chunk)
            current_chunk = [p]
            current_len = len(p)
        else:
            current_chunk.append(p)
            current_len += len(p)
            
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
        batch_text = " ||| ".join(cyrillic_lines)
        
        source_text_area.fill(batch_text)
        time.sleep(6)
        
        spans = page.locator('span[class="ryNqvb"]').all_inner_texts()
        if not spans:
            spans = page.locator('span[lang="uz"]').all_inner_texts()
            
        full_translation = " ".join(spans)
        translated_lines = [line.strip() for line in full_translation.split('|||') if line.strip()]
        
        if len(translated_lines) != len(chunk):
            translated_lines = [line.strip() for line in full_translation.replace('| | |', '|||').split('|||') if line.strip()]

        if len(translated_lines) != len(chunk):
            translated_lines = []
            
            # Use tqdm for the one-by-one progress bar
            for item in tqdm(cyrillic_lines, desc=f"Fallback one-by-one ({len(chunk)} items)", leave=False):
                source_text_area.fill('') # Clear previous translation
                page.wait_for_timeout(500)
                
                source_text_area.fill(item)
                page.wait_for_timeout(3000) # Wait for new translation to load
                
                item_spans = page.locator('span[class="ryNqvb"]').all_inner_texts()
                if not item_spans:
                    item_spans = page.locator('span[lang="uz"]').all_inner_texts()
                
                translated_lines.append(" ".join(item_spans).strip())
                
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
    
    new_products = []
    for p in unique_products:
        if p not in cache:
            new_products.append(p)
        else:
            t = cache[p]
            if 'Avtobenzin' in t or 'Dizelnoe' in t or 'Gasoline' in t or t == p:
                new_products.append(p)
                
    print(f"Need to translate {len(new_products)} products.")
    if not new_products:
        print("Everything is translated!")
        return
        
    chunks = chunk_products(new_products, max_chars=1000)
    print(f"Created {len(chunks)} batches.")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Add tqdm for the overall batch progress
        for i, chunk in enumerate(tqdm(chunks, desc="Total Batches")):
            translated_lines = batch_translate(browser, chunk)
            
            if len(translated_lines) == len(chunk):
                for orig, transl in zip(chunk, translated_lines):
                    cache[orig] = transl
                save_cache(cache, cache_file)
            else:
                pass
            
if __name__ == "__main__":
    main()
