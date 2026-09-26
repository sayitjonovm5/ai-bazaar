import os
import requests
from duckduckgo_search import DDGS
import time

categories = {
    "Yoqilg'i": "fuel pump illustration",
    "Qurilish materiallari": "cement bags bricks illustration",
    "Metallurgiya": "steel rebar metal beams illustration",
    "Qishloq xo'jaligi va oziq-ovqat": "agriculture wheat grains illustration",
    "Kimyoviy moddalar": "chemicals flask laboratory illustration",
    "Polimerlar va plastmassa": "plastic pellets polymer illustration",
    "Boshqa": "generic cardboard box product illustration"
}

output_dir = "frontend/public/products"
os.makedirs(output_dir, exist_ok=True)

with DDGS() as ddgs:
    for cat_name, query in categories.items():
        filename = cat_name.replace(" ", "_").replace("'", "").lower() + ".jpg"
        filepath = os.path.join(output_dir, filename)
        
        if os.path.exists(filepath):
            continue
            
        print(f"Searching for {query}...")
        results = list(ddgs.images(query, max_results=1))
        if results:
            image_url = results[0]['image']
            print(f"Downloading {image_url}...")
            try:
                response = requests.get(image_url, timeout=10)
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    print(f"Saved to {filepath}")
                else:
                    print("Failed to download.")
            except Exception as e:
                print(f"Error downloading: {e}")
        time.sleep(2)
