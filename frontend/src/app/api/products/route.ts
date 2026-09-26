import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
    
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(csvFilePath, "utf-8");
    const { data: records } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    // Group by Product_Name + Unit
    const productMap = new Map();

    records.forEach((row: any) => {
      const priceStr = row.Average_Price ? row.Average_Price.replace(/,/g, "") : "";
      const price = parseFloat(priceStr);
      if (isNaN(price)) return;
      
      const isForward = row.Product_Name.toLowerCase().includes('(forvard)');
      const contractType = isForward ? "Forvard" : "Spot";
      const cleanName = row.Product_Name.replace(/\s*\(\s*Forvard\s*\)/gi, '').trim();
      
      const unit = row.Unit || "tonna";
      const key = `${row.Product_Name}__${unit}`;
      
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: unit !== "tonna" ? `${row.Product_Name}?unit=${encodeURIComponent(unit)}` : row.Product_Name,
          name: cleanName,
          category: row.Category || "Other",
          contractType: contractType,
          unit: unit,
          currentPrice: price,
          changePercent: parseFloat(row.Price_Change_Percent) || 0,
          historicalPrices: [price],
        });
      } else {
        const p = productMap.get(key);
        p.historicalPrices.push(price);
        p.currentPrice = price;
        p.changePercent = parseFloat(row.Price_Change_Percent) || 0;
      }
    });

    const products = Array.from(productMap.values());
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}