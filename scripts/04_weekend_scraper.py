import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
from datetime import datetime

# Setup directories
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf_dir = os.path.join(base_dir, 'data', 'raw_pdfs')
os.makedirs(pdf_dir, exist_ok=True)
trigger_file = os.path.join(base_dir, 'data', 'new_data_trigger.flag')

def scrape_latest_pdf():
    print("Checking https://uzex.uz/en/pages/weekly-quotes for new PDFs...")
    url = "https://uzex.uz/en/pages/weekly-quotes"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch website: {e}")
        return
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all anchor tags that link to a pdf
    pdf_links = []
    for a in soup.find_all('a', href=True):
        if '.pdf' in a['href'].lower():
            pdf_links.append(a['href'])
            
    if not pdf_links:
        print("No PDF links found on the page.")
        return
        
    # The topmost one should be the latest week
    latest_pdf_url = pdf_links[0]
    if not latest_pdf_url.startswith('http'):
        if latest_pdf_url.startswith('/'):
            latest_pdf_url = "https://uzex.uz" + latest_pdf_url
        else:
            latest_pdf_url = "https://uzex.uz/" + latest_pdf_url
            
    # Extract filename from URL
    filename_raw = urllib.parse.unquote(latest_pdf_url.split('/')[-1])
    # The format might be like '09-09-2024-13-09-2024-внутренний.pdf'
    print(f"Latest PDF found: {filename_raw}")
    
    # To keep consistency with download_archive, let's just save it as the raw filename first,
    # or rename it to our standardized format YYYY-MM-DD_to_YYYY-MM-DD.pdf if we can parse the dates.
    import re
    # Look for dates like DD-MM-YYYY
    dates = re.findall(r'(\d{2}-\d{2}-\d{4})', filename_raw)
    if len(dates) >= 2:
        d1 = datetime.strptime(dates[0], '%d-%m-%Y')
        d2 = datetime.strptime(dates[1], '%d-%m-%Y')
        formatted_name = f"{d1.strftime('%Y-%m-%d')}_to_{d2.strftime('%Y-%m-%d')}.pdf"
    else:
        formatted_name = filename_raw

    dest_path = os.path.join(pdf_dir, formatted_name)
    
    if os.path.exists(dest_path):
        print(f"File {formatted_name} already exists. No new data to download.")
        return
        
    print(f"Downloading {formatted_name}...")
    try:
        pdf_resp = requests.get(latest_pdf_url, headers=headers, timeout=30)
        pdf_resp.raise_for_status()
        
        # Check if it's actually a PDF
        if not pdf_resp.content.startswith(b'%PDF'):
            print("Downloaded content is not a valid PDF.")
            return
            
        with open(dest_path, 'wb') as f:
            f.write(pdf_resp.content)
            
        print(f"Successfully downloaded {formatted_name}.")
        
        # Create a trigger file so the midnight script knows there's new data to process
        with open(trigger_file, 'w') as f:
            f.write(dest_path)
        print("Created new_data_trigger.flag")
        
    except Exception as e:
        print(f"Error downloading PDF: {e}")

if __name__ == '__main__':
    scrape_latest_pdf()
