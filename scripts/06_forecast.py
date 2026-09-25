import os
import torch
import pandas as pd
import numpy as np
from datetime import timedelta
from chronos import ChronosPipeline

def generate_forecasts():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, 'data', 'cleaned_data_uz.csv')
    out_file = os.path.join(base_dir, 'data', 'forecasts.csv')
    
    print(f"Loading data from {data_file}...")
    df = pd.read_csv(data_file)
    df['Date'] = pd.to_datetime(df['Date'])
    df['Current_Price_Sum'] = pd.to_numeric(df['Current_Price_Sum'], errors='coerce')
    df = df.dropna(subset=['Current_Price_Sum'])
    df = df.sort_values(by='Date')
    
    print("Loading AI Model (amazon/chronos-t5-mini)...")
    pipeline = ChronosPipeline.from_pretrained(
        "amazon/chronos-t5-mini",
        device_map="auto",
        torch_dtype=torch.float32,
    )
    
    products = df['Product_Name'].unique()
    total = len(products)
    print(f"Found {total} unique products to forecast.")
    
    forecasts = []
    
    for i, prod in enumerate(products):
        print(f"[{i+1}/{total}] Forecasting: {prod}")
        
        p_df = df[df['Product_Name'] == prod].copy()
        p_df = p_df.groupby('Date', as_index=False)['Current_Price_Sum'].mean()
        p_df = p_df.sort_values(by='Date')
        
        if len(p_df) >= 5:
            prices = p_df['Current_Price_Sum'].values
            context = torch.tensor(prices, dtype=torch.float32)
            
            # Predict 1 step (1 week)
            forecast = pipeline.predict(context.unsqueeze(0), prediction_length=1, num_samples=20)
            samples = forecast[0, :, 0].numpy()
            
            p_min = float(np.percentile(samples, 10))
            p_max = float(np.percentile(samples, 90))
            p_median = float(np.median(samples))
            
            last_date = p_df['Date'].iloc[-1]
            next_date = last_date + timedelta(days=7)
            
            forecasts.append({
                'Product_Name': prod,
                'Forecast_Date': next_date,
                'Min_Price': p_min,
                'Max_Price': p_max,
                'Median_Price': p_median
            })
            
    print(f"Saving {len(forecasts)} forecasts to {out_file}...")
    f_df = pd.DataFrame(forecasts)
    f_df.to_csv(out_file, index=False)
    print("Forecasting successfully completed!")

if __name__ == "__main__":
    generate_forecasts()
