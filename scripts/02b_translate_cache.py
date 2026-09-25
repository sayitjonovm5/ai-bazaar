import pandas as pd
import json
import os
import time
import sys
sys.stdout.reconfigure(encoding='utf-8')
os.environ["translators_default_region"] = "EN"
import translators as ts
import random

def load_cache(cache_file):
    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_cache(cache, cache_file):
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=4)

import cyrtranslit

def robust_translate(text):
    cyrillic_text = cyrtranslit.to_cyrillic(text, 'ru')
    print(f"  [Cyrillic]: {cyrillic_text}")
    engines = ['bing', 'google', 'alibaba', 'yandex']
    random.shuffle(engines) # Randomize to avoid hitting one service too hard
    for engine in engines:
        try:
            res = ts.translate_text(cyrillic_text, translator=engine, from_language='ru', to_language='uz')
            return res
        except Exception as e:
            continue
    return None

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, 'data', 'all_data.csv')
    cache_file = os.path.join(base_dir, 'data', 'translations.json')
    
    print(f"Reading unique products from {data_file}...")
    df = pd.read_csv(data_file)
    unique_products = df['Product_Name'].dropna().unique()
    print(f"Found {len(unique_products)} unique products.")
    
    cache = load_cache(cache_file)
    
    new_products = [p for p in unique_products if p not in cache]
    print(f"Need to translate {len(new_products)} new products.")
    
    added_count = 0
    try:
        for i, prod in enumerate(new_products):
            print(f"[{i+1}/{len(new_products)}] Translating: {prod}")
            translation = robust_translate(prod)
            
            if translation:
                cache[prod] = translation
                added_count += 1
                
                # Save cache every 10 items so we don't lose progress if it crashes
                if added_count % 10 == 0:
                    save_cache(cache, cache_file)
            else:
                print(f"Failed to translate '{prod}' across all engines. Skipping for now.")
                
            # Random delay between 0.5 and 1.5 seconds to bypass rate limits
            time.sleep(random.uniform(0.5, 1.5))
            
    except KeyboardInterrupt:
        print("\nTranslation interrupted by user.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        save_cache(cache, cache_file)
        print(f"Added {added_count} new translations to cache.")

if __name__ == "__main__":
    main()
