import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    // The Next.js app is running inside "frontend/", but the data folder is in the root directory
    const csvPath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
    const fileContent = fs.readFileSync(csvPath, "utf8");
    
    // Parse the CSV
    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    
    // Process the data: Group by Product_Name and Unit to get current price, category, and historical prices
    const productMap = new Map();
    
    data.forEach((row: any) => {
      if (!row.Product_Name || !row.Current_Price_Sum) return;
      
      const priceStr = String(row.Current_Price_Sum).replace(/[\s,]/g, '');
      const price = parseFloat(priceStr);
      if (isNaN(price)) return;
      
      const unit = row.Unit || "tonna";
      const key = `${row.Product_Name}__${unit}`;
      
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: unit !== "tonna" ? `${row.Product_Name}?unit=${encodeURIComponent(unit)}` : row.Product_Name,
          name: row.Product_Name,
          category: row.Category || "Other",
          unit: unit,
          currentPrice: price,
          changePercent: parseFloat(row.Price_Change_Percent) || 0,
          historicalPrices: [price], // Will build this up
        });
      } else {
        const p = productMap.get(key);
        p.historicalPrices.push(price);
        // Assuming data is chronological, the last seen is the current price
        p.currentPrice = price;
        p.changePercent = parseFloat(row.Price_Change_Percent) || 0;
      }
    });

    const products = Array.from(productMap.values()).map(p => {
      // Keep only last 10 prices for sparkline to keep payload small
      p.historicalPrices = p.historicalPrices.slice(-10);
      return p;
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
