import os
import requests
import time

image_queries = {
    "rebar.jpg": "steel rebar",
    "steel.jpg": "steel coil",
    "steel_pipes.jpg": "steel pipe stack",
    "cable.jpg": "electric cable spool",
    "cotton.jpg": "cotton bales",
    "cement.jpg": "cement bags",
    "plastic_pellets.jpg": "plastic resin pellets",
    "fuel.jpg": "oil drum",
    "steel_profile.jpg": "steel square pipe",
    "steel_round.jpg": "steel round bar",
    "agri_chemicals.jpg": "pesticide bottle",
    "steel_hot_rolled.jpg": "hot rolled steel",
    "steel_sheet.jpg": "steel sheet",
    "glass.jpg": "sheet glass",
    "wheat.jpg": "wheat grain",
    "walnuts.jpg": "walnuts",
    "paint.jpg": "paint bucket",
    "bolts.jpg": "steel bolts nuts",
    "generic.jpg": "shipping boxes",
}

output_dir = "frontend/public/images/products"
os.makedirs(output_dir, exist_ok=True)

def fetch_wikimedia_image(query):
    url = "https://en.wikipedia.org/w/api.php"
    # Step 1: Search for an article
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query + " hasimage:1",
        "gsrlimit": "3",
        "prop": "pageimages",
        "pithumbsize": "600"
    }
    
    headers = {'User-Agent': 'ProductImageDownloader/1.0'}
    
    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        
        if "query" in data and "pages" in data["query"]:
            pages = data["query"]["pages"]
            for page_id in pages:
                if "thumbnail" in pages[page_id]:
                    return pages[page_id]["thumbnail"]["source"]
    except Exception as e:
        print(f"Error fetching {query}: {e}")
        
    return None

for filename, query in image_queries.items():
    filepath = os.path.join(output_dir, filename)
    if os.path.exists(filepath):
        print(f"Skipping {filename}")
        continue
        
    print(f"Searching for {query}...")
    img_url = fetch_wikimedia_image(query)
    
    if img_url:
        print(f"Downloading {img_url}...")
        try:
            headers = {'User-Agent': 'ProductImageDownloader/1.0'}
            response = requests.get(img_url, headers=headers, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"Saved {filename}")
            else:
                print(f"Failed with status {response.status_code}")
        except Exception as e:
            print(f"Error downloading {img_url}: {e}")
    else:
        print(f"No image found for {query}")
        
    time.sleep(1)
