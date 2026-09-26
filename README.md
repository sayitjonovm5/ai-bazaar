# DON'T LOCALHOST THIS PROJECT. MOST OF THE FEATURES DO NOT WORK BECAUSE ALL NECESSARY DATABASE CREDENTIALS AND API KEYS ARE IN GITIGNORE!
# UZEX Analytics & AI Forecasting Platform

This project automates the extraction, cleaning, and AI-driven forecasting of product prices from UZEX (Uzbekistan Commodity Exchange) weekly bulletins.

## Directory Structure

The project has been organized into clear, logical components:

```text
C:\Users\Abrorjon\Documents\Data\
│
├── data/
│   ├── raw_pdfs/           # Original PDF weekly bulletins downloaded from UZEX
│   ├── all_data.csv        # Raw extracted tabular data (Cyrillic)
│   └── cleaned_data_uz.csv # Fully cleaned, localized (Uzbek), and formatted data
│
├── scripts/
│   ├── 01_download_archive.py # Automated scraper to download historical PDFs from UZEX archive
│   ├── 02_pdf_pipeline.py     # OCR/PDF extraction pipeline that builds all_data.csv
│   ├── 03_clean_data.py       # Linguistic normalization (abbreviations, Cyrillic->Latin) to cleaned_data_uz.csv
│   └── test_pdf.py            # Utility script for testing PDF table boundaries
│
├── dashboard/
│   └── app.py              # Streamlit Web Dashboard & Hugging Face Zero-Shot Forecaster
│
└── README.md
```

## How to use the Pipeline

If you ever need to update the data with a new week's PDF, you can run the pipeline sequentially from the project root:

1. **Download new data:** (or manually place the PDF in `data/raw_pdfs/`)
   ```powershell
   python scripts/01_download_archive.py
   ```
2. **Extract Tables to CSV:**
   ```powershell
   python scripts/02_pdf_pipeline.py
   ```
3. **Clean and Localize Text:**
   ```powershell
   python scripts/03_clean_data.py
   ```

## Web Dashboard & AI Forecaster

The platform features an interactive web dashboard built with Streamlit and Plotly. It uses **Amazon Chronos** (`amazon/chronos-t5-mini`), a powerful zero-shot time-series forecasting model from Hugging Face.

To run the dashboard:
```powershell
python -m streamlit run dashboard/app.py
```

### Batch Forecasting
Because AI models are heavy, the dashboard includes an **Administrator Mode**. By clicking **"Yangi prognozlarni hisoblash"** in the sidebar, the script will:
1. Load the AI model into memory.
2. Loop through every single unique product in `data/cleaned_data_uz.csv`.
3. Save the minimum, maximum, and average expected prices to a fast cache file (`data/forecasts.csv`).
4. Skip products with insufficient history (less than 5 weeks of data).

*(Note: If you have Streamlit running and need to move `forecasts.csv` manually into the `data/` folder, you may need to stop the server (Ctrl+C) first because Windows locks the file while the dashboard is displaying it!)*

## Environment Variables (.env)

> [!WARNING]
> We have intentionally committed the `.env` file to GitHub for this repository. Because we are developing as a team, everyone needs immediate access to the database credentials and the chatbot configuration to run the project locally without friction. 
> 
> **Important:** This approach is strictly for rapid development and collaboration. Before deploying to production, we must ensure all sensitive keys are securely managed and rotated.
