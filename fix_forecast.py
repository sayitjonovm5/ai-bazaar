import pandas as pd
import json

df = pd.read_csv('data/forecasts.csv')
with open('data/translations.json', encoding='utf-8') as f:
    trans = json.load(f)

df['Product_Name'] = df['Product_Name'].apply(lambda x: trans.get(x, x))
df.to_csv('data/forecasts.csv', index=False)
