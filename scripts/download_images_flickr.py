import os
import requests
import time

image_queries = {
    "rebar.jpg": "rebar,steel",
    "steel.jpg": "steel,metal",
    "steel_pipes.jpg": "pipe,steel",
    "cable.jpg": "cable,wire",
    "cotton.jpg": "cotton,bale",
    "cement.jpg": "cement,concrete",
    "plastic_pellets.jpg": "plastic,pellets",
    "fuel.jpg": "oil,fuel",
    "steel_profile.jpg": "steel,beam",
    "steel_round.jpg": "steel,bar",
    "agri_chemicals.jpg": "pesticide,chemical",
    "steel_hot_rolled.jpg": "steel,factory",
    "steel_sheet.jpg": "sheet,metal",
    "glass.jpg": "glass,window",
    "wheat.jpg": "wheat,grain",
    "walnuts.jpg": "walnut",
    "paint.jpg": "paint,bucket",
    "bolts.jpg": "bolt,nut",
    "generic.jpg": "box,package",
}

output_dir = "frontend/public/images/products"
os.makedirs(output_dir, exist_ok=True)

for filename, keyword in image_queries.items():
    filepath = os.path.join(output_dir, filename)
    if os.path.exists(filepath):
        print(f"Skipping {filename}")
        continue
        
    print(f"Downloading image for {filename} using keyword '{keyword}'...")
    # Using loremflickr to get a real image based on the keyword
    url = f"https://loremflickr.com/400/300/{keyword}/all"
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Saved {filename}")
        else:
            print(f"Failed to download for {filename}. Status: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        
    time.sleep(1)
