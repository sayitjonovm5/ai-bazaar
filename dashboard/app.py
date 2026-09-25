import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import numpy as np
from datetime import timedelta
import os

st.set_page_config(page_title="UZEX Narxlar Prognozi", layout="wide")

@st.cache_data
def load_data():
    df = pd.read_csv("data/cleaned_data_uz.csv")
    df['Date'] = pd.to_datetime(df['Date'])
    df['Current_Price_Sum'] = pd.to_numeric(df['Current_Price_Sum'], errors='coerce')
    df = df.dropna(subset=['Current_Price_Sum'])
    df = df.sort_values(by='Date')
    return df

@st.cache_data
def load_forecasts():
    if os.path.exists("data/forecasts.csv"):
        df = pd.read_csv("data/forecasts.csv")
        df['Forecast_Date'] = pd.to_datetime(df['Forecast_Date'])
        return df
    return None

def generate_all_forecasts(df):
    import torch
    from chronos import ChronosPipeline
    
    st.info("AI Model yuklanmoqda... (Biroz kutib turing)")
    # Load model only when button is pressed, saves memory for normal users!
    pipeline = ChronosPipeline.from_pretrained(
        "amazon/chronos-t5-mini",
        device_map="auto",
        torch_dtype=torch.float32,
    )
    
    products = df['Product_Name'].unique()
    total = len(products)
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    forecasts = []
    
    for i, prod in enumerate(products):
        status_text.text(f"Hisoblanmoqda ({i+1}/{total}): {prod}")
        
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
            
        progress_bar.progress((i + 1) / total)
        
    status_text.text("Barcha mahsulotlar hisoblab bo'lindi. Faylga saqlanmoqda...")
    f_df = pd.DataFrame(forecasts)
    f_df.to_csv("data/forecasts.csv", index=False)
    st.cache_data.clear()
    st.success("Barcha prognozlar data/forecasts.csv fayliga saqlandi!")
    st.rerun()

st.title("UZEX Mahsulotlari: AI Narx Prognozi")
st.markdown("Oldindan hisoblangan jadval (forecasts.csv) asosida ishlovchi tezkor dashboard.")

# Sidebar - Admin Actions
st.sidebar.header("Administrator")
df = load_data()
if st.sidebar.button("Yangi prognozlarni hisoblash (Barcha mahsulotlar)"):
    generate_all_forecasts(df)

# Sidebar - User Filters
st.sidebar.header("Filtrlar")
forecasts_df = load_forecasts()

categories = df['Category'].dropna().unique().tolist()
selected_category = st.sidebar.selectbox("Kategoriya tanlang", sorted(categories))

products = df[df['Category'] == selected_category]['Product_Name'].dropna().unique().tolist()
selected_product = st.sidebar.selectbox("Mahsulotni tanlang", sorted(products))

product_data = df[df['Product_Name'] == selected_product].copy()
product_data = product_data.groupby('Date', as_index=False)['Current_Price_Sum'].mean()
product_data = product_data.sort_values(by='Date')

if len(product_data) < 5:
    st.warning("Prognoz qilish uchun ma'lumotlar yetarli emas")
else:
    last_date = product_data['Date'].iloc[-1]
    last_price = product_data['Current_Price_Sum'].values[-1]
    
    if forecasts_df is not None:
        f_row = forecasts_df[forecasts_df['Product_Name'] == selected_product]
        if not f_row.empty:
            next_date = f_row['Forecast_Date'].iloc[0]
            p_min = f_row['Min_Price'].iloc[0]
            p_max = f_row['Max_Price'].iloc[0]
            p_median = f_row['Median_Price'].iloc[0]
            
            delta_median = p_median - last_price
            
            st.subheader(f"Prognoz Natijalari ({next_date.strftime('%Y-%m-%d')})")
            col1, col2, col3 = st.columns(3)
            col1.metric("Kutilayotgan O'rtacha Narx", f"{p_median:,.0f} so'm", f"{delta_median:,.0f} so'm")
            col2.metric("Minimal Ehtimoliy Narx", f"{p_min:,.0f} so'm")
            col3.metric("Maksimal Ehtimoliy Narx", f"{p_max:,.0f} so'm")
            
            st.subheader("Tarixiy Narxlar va Prognoz Grafigi")
            fig = go.Figure()
            
            # Tarixiy data
            fig.add_trace(go.Scatter(x=product_data['Date'], y=product_data['Current_Price_Sum'], mode='lines+markers', name='Tarixiy Narxlar', line=dict(color='blue')))
            
            # Kelajak
            x_forecast = [last_date, next_date]
            y_median = [last_price, p_median]
            y_min = [last_price, p_min]
            y_max = [last_price, p_max]
            
            fig.add_trace(go.Scatter(x=x_forecast, y=y_max, mode='lines', line=dict(width=0), showlegend=False, hoverinfo='skip'))
            fig.add_trace(go.Scatter(x=x_forecast, y=y_min, mode='lines', line=dict(width=0), fill='tonexty', fillcolor='rgba(255, 0, 0, 0.2)', name='Prognoz Marjasi (Min-Max)'))
            fig.add_trace(go.Scatter(x=x_forecast, y=y_median, mode='lines+markers', name="O'rtacha Prognoz", line=dict(color='red', dash='dash')))
            
            fig.update_layout(
                xaxis_title="Sana", 
                yaxis_title="Narx (so'm)", 
                hovermode="x unified", 
                template="plotly_white",
                xaxis=dict(fixedrange=True),
                yaxis=dict(fixedrange=True, rangemode='tozero')
            )
            st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
        else:
            st.warning("Ushbu mahsulot uchun tayyor prognoz topilmadi. Chap tomondagi 'Yangi prognozlarni hisoblash' tugmasini bosing.")
    else:
        st.warning("Prognozlar bazasi (forecasts.csv) topilmadi! Iltimos, chap tomondagi 'Yangi prognozlarni hisoblash' tugmasini bosib hisob-kitobni boshlang.")
