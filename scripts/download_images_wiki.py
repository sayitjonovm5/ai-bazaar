import os
import requests
import time

categories = {
    "Yoqilg'i": "Gasoline",
    "Qurilish materiallari": "Cement",
    "Metallurgiya": "Rebar",
    "Qishloq xo'jaligi va oziq-ovqat": "Agriculture",
    "Kimyoviy moddalar": "Chemical_substance",
    "Polimerlar va plastmassa": "Plastic",
    "Boshqa": "Box"
}

output_dir = "frontend/public/products"
os.makedirs(output_dir, exist_ok=True)

def get_wikipedia_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=600"
    try:
        response = requests.get(url, headers={"User-Agent": "AIBazaarScript/1.0"})
        data = response.json()
        pages = data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                return pages[page_id]['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching from Wikipedia: {e}")
    return None

for cat_name, wiki_title in categories.items():
    filename = cat_name.replace(" ", "_").replace("'", "").replace("-", "_").lower() + ".jpg"
    filepath = os.path.join(output_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {cat_name}, file exists.")
        continue
        
    print(f"Downloading image for {cat_name} from Wikipedia ({wiki_title})...")
    img_url = get_wikipedia_image(wiki_title)
    if img_url:
        try:
            response = requests.get(img_url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"Saved to {filepath}")
            else:
                print(f"Failed to download image from {img_url}")
        except Exception as e:
            print(f"Error downloading {img_url}: {e}")
    else:
        print(f"No image found for {cat_name}")
        
    time.sleep(1)
