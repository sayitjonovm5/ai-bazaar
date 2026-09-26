import os
import requests

urls = {
    "fuel.jpg": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop&q=80",
    "cement.jpg": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&q=80",
    "steel.jpg": "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400&h=300&fit=crop&q=80",
    "plastic_pellets.jpg": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80",
    "agri_chemicals.jpg": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop&q=80",
    "generic.jpg": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&q=80"
}

output_dir = "public/images/products"
os.makedirs(output_dir, exist_ok=True)

for name, url in urls.items():
    filepath = os.path.join(output_dir, name)
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Saved {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")
