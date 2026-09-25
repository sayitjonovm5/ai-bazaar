import os
import time
import subprocess
import schedule
from datetime import datetime

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
trigger_file = os.path.join(base_dir, 'data', 'new_data_trigger.flag')
scripts_dir = os.path.join(base_dir, 'scripts')

def run_weekend_scraper():
    # Only run on Saturday (5) or Sunday (6)
    today = datetime.today().weekday()
    if today in [5, 6]:
        print(f"[{datetime.now()}] Weekend detected. Running scraper...")
        scraper_script = os.path.join(scripts_dir, '04_weekend_scraper.py')
        subprocess.run(['python', scraper_script])
    else:
        print(f"[{datetime.now()}] Not a weekend. Skipping scraper.")

def run_midnight_pipeline():
    print(f"[{datetime.now()}] Running midnight check...")
    if not os.path.exists(trigger_file):
        print("No new data trigger found. Skipping pipeline.")
        return

    print("New data trigger found! Starting processing pipeline...")
    with open(trigger_file, 'r') as f:
        new_pdf_path = f.read().strip()

    # 1. Parse the new PDF
    print(f"Parsing new PDF: {new_pdf_path}")
    pdf_script = os.path.join(scripts_dir, '02_pdf_pipeline.py')
    subprocess.run(['python', pdf_script, new_pdf_path])

    # 2. Translate new products
    print("Translating new products...")
    translate_script = os.path.join(scripts_dir, '02b_translate_playwright.py')
    subprocess.run(['python', translate_script])

    # 3. Clean the data (this will apply the translation cache as well)
    print("Cleaning and translating data...")
    clean_script = os.path.join(scripts_dir, '03_clean_data.py')
    subprocess.run(['python', clean_script])

    # 3. Run forecasts
    print("Running forecasting models...")
    forecast_script = os.path.join(scripts_dir, '06_forecast.py')
    subprocess.run(['python', forecast_script])
    print("Forecasting finished. Updated forecasts.csv")

    # Clean up trigger file so we don't re-run tomorrow night
    os.remove(trigger_file)
    print("Pipeline complete. Trigger file removed.")

# --- Setup Schedule ---

# Every 5 hours for the scraper
schedule.every(5).hours.do(run_weekend_scraper)

# Every day at midnight for the processing pipeline
schedule.every().day.at("00:00").do(run_midnight_pipeline)

if __name__ == '__main__':
    print("Scheduler started. Waiting for jobs...")
    print("- Weekend scraper will run every 5 hours (on Sat/Sun)")
    print("- Pipeline will run at 00:00 midnight if new data exists")
    
    # Run scraper once on startup just to check immediately
    run_weekend_scraper()
    
    while True:
        schedule.run_pending()
        time.sleep(60)
