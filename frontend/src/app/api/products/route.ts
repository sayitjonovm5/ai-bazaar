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
    
    // Process the data: Group by Product_Name to get current price, category, and historical prices
    const productMap = new Map();
    
    data.forEach((row: any) => {
      if (!row.Product_Name || !row.Current_Price_Sum) return;
      
      const priceStr = String(row.Current_Price_Sum).replace(/[\s,]/g, '');
      const price = parseFloat(priceStr);
      if (isNaN(price)) return;
      
      if (!productMap.has(row.Product_Name)) {
          let pName = row.Product_Name;
          pName = pName.replace(/Avtobenzin/gi, "Benzin")
                       .replace(/Ammiachnaya selitra/gi, "Ammiakli selitra")
                       .replace(/Alyumin kompozitnaya panel/gi, "Alyuminiy kompozit panel")
                       .replace(/Amiak vodniy/gi, "Suvli ammiak")
                       .replace(/Azot gazoobrazniy/gi, "Gaz holatidagi azot")
                       .replace(/Azot jidkiy/gi, "Suyuq azot")
                       .replace(/Ammiak bezvodniy/gi, "Suvsiz ammiak")
                       .replace(/Balka \(Dvutavr\)/gi, "Balka (I-nur)")
                       .replace(/Krug g\.k/gi, "Doira g.k")
                       .replace(/Truba stalnaya/gi, "Po'lat quvur");

          productMap.set(row.Product_Name, {
            id: row.Product_Name, // Using name as ID for simplicity
            name: pName,
            category: row.Category || "Boshqa",
          unit: "unit", // Can be extracted from name if needed
          currentPrice: price,
          changePercent: parseFloat(row.Price_Change_Percent) || 0,
          historicalPrices: [price], // Will build this up
        });
      } else {
        const p = productMap.get(row.Product_Name);
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
