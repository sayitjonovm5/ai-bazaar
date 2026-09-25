import os
import sys
import re
import urllib.request
import urllib.parse
from datetime import date, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8')

DEST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data/raw_pdfs")
os.makedirs(DEST_DIR, exist_ok=True)

# Generate all Mondays for the last 2 years (from 2024-09-02 to 2026-09-21)
start_date = date(2024, 9, 2)
end_date = date(2026, 9, 21)

mondays = []
d = start_date
while d <= end_date:
    mondays.append(d)
    d += timedelta(days=7)

suffixes = [
    '-внутренний-1-1.pdf',
    '-внутренний-1.pdf',
    '-внутренний.pdf',
    '-внутренний-2.pdf',
    '-внутренний-1-2.pdf',
    '-внутренний-2-1.pdf',
    '-внутренний(1).pdf',
    '-внутр-рынок-1.pdf',
    '-внутр-рынок-1-1.pdf',
    '-внутр-рынок.pdf',
    '-внутр-рынок-2.pdf',
    '-внутр-рынок-3.pdf',
    '-внутр-рынок(1).pdf',
    '-внутр-рынок-1-2.pdf',
    '-внутренний_1.pdf',
    '-внутр.pdf',
    '.pdf',
    '-1.pdf',
    '-1-1.pdf',
    '-2.pdf',
]

offsets = [
    (0, 4),  # Mon - Fri
    (0, 5),  # Mon - Sat
    (0, 3),  # Mon - Thu
    (1, 4),  # Tue - Fri
    (2, 4),  # Wed - Fri
    (1, 5),  # Tue - Sat
    (3, 4),  # Thu - Fri
    (0, 2),  # Mon - Wed
    (2, 5),  # Wed - Sat
    (-1, 4),
    (-2, 4),
    (0, 6),
    (0, 7),
]

def check_file(fname):
    url = f"https://old.uzex.uz/files/uploads/{urllib.parse.quote(fname)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            if res.status == 200:
                length = int(res.headers.get('Content-Length', 0))
                if length > 20000:
                    return (fname, url, length)
    except Exception:
        pass
    return None

def find_week_file(monday):
    for s_off, e_off in offsets:
        d1 = monday + timedelta(days=s_off)
        d2 = monday + timedelta(days=e_off)
        prefix = f"{d1.strftime('%d-%m-%Y')}-{d2.strftime('%d-%m-%Y')}"
        for suff in suffixes:
            fname = prefix + suff
            res = check_file(fname)
            if res:
                return (monday, d1, d2, res[0], res[1], res[2])
    return (monday, None, None, None, None, None)

print(f"Scanning 2-year calendar period ({start_date} to {end_date}, {len(mondays)} calendar weeks)...")
found_items = []
with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(find_week_file, m) for m in mondays]
    for fut in as_completed(futures):
        res = fut.result()
        if res[3] is not None:
            found_items.append(res)

found_items.sort(key=lambda x: x[0])
print(f"Discovered {len(found_items)} weekly bulletin files across the 2-year range.\n")

def download_item(item):
    monday, d1, d2, fname, url, size = item
    
    # Standardized formatted filename: YYYY-MM-DD_to_YYYY-MM-DD.pdf
    formatted_name = f"{d1.strftime('%Y-%m-%d')}_to_{d2.strftime('%Y-%m-%d')}.pdf"
    dest_path = os.path.join(DEST_DIR, formatted_name)
    
    # Download file if not already downloaded or if size differs
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 20000:
        return (formatted_name, os.path.getsize(dest_path), "already exists")
        
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if not content.startswith(b'%PDF'):
                return (formatted_name, 0, "Invalid PDF header")
            with open(dest_path, 'wb') as f:
                f.write(content)
        return (formatted_name, len(content), "downloaded")
    except Exception as e:
        return (formatted_name, 0, f"Error: {e}")

print("Downloading files into 'data/raw_pdfs' folder...")
download_results = []
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(download_item, item) for item in found_items]
    for fut in as_completed(futures):
        res = fut.result()
        download_results.append(res)
        print(f"[{res[2].upper()}] {res[0]} ({res[1]:,} bytes)")

print("\n==========================================")
print(f"DOWNLOAD SUMMARY:")
print(f"Target folder: {DEST_DIR}")
print(f"Total files successfully saved: {len([r for r in download_results if r[1] > 0])} of {len(found_items)}")
print("==========================================")
