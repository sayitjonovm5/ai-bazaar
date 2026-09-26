import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

let cachedProducts: any[] | null = null;
let cachedLiteProducts: { name: string; category: string }[] | null = null;
let lastMtime: number = 0;

function loadProducts() {
  const csvFilePath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
  
  if (!fs.existsSync(csvFilePath)) {
    return null;
  }

  const stat = fs.statSync(csvFilePath);
  if (cachedProducts && cachedLiteProducts && stat.mtimeMs === lastMtime) {
    return { full: cachedProducts, lite: cachedLiteProducts };
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const { data: records } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

  // Group by Product_Name + Unit
  const productMap = new Map();
  const liteMap = new Map<string, string>();

  records.forEach((row: any) => {
    if (!row.Product_Name) return;
    const rawPrice = row.Current_Price_Sum || row.Average_Price || row.Price;
    if (!rawPrice) return;
    
    const priceStr = String(rawPrice).replace(/[\s,]/g, "");
    const price = parseFloat(priceStr);
    if (isNaN(price)) return;
    
    const isForward = row.Product_Name.toLowerCase().includes('(forvard)');
    const contractType = isForward ? "Forvard" : "Spot";
    const cleanName = row.Product_Name.replace(/\s*\(\s*Forvard\s*\)/gi, '').trim();
    const category = row.Category || "Boshqa";
    
    if (!liteMap.has(cleanName)) {
      liteMap.set(cleanName, category);
    }

    const unit = row.Unit || "tonna";
    const key = `${row.Product_Name}__${unit}`;
    
    if (!productMap.has(key)) {
      productMap.set(key, {
        id: unit !== "tonna" ? `${row.Product_Name}?unit=${encodeURIComponent(unit)}` : row.Product_Name,
        name: cleanName,
        category: category,
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

  cachedProducts = Array.from(productMap.values()).map((p: any) => {
    // Keep only last 10 prices for sparkline chart to keep payload snappy and fast
    p.historicalPrices = p.historicalPrices.slice(-10);
    return p;
  });

  cachedLiteProducts = Array.from(liteMap.entries()).map(([name, category]) => ({
    name,
    category,
  }));

  lastMtime = stat.mtimeMs;
  return { full: cachedProducts, lite: cachedLiteProducts };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const isLite = url.searchParams.get("lite") === "true";
    
    const data = loadProducts();
    if (!data) {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }

    return NextResponse.json(isLite ? data.lite : data.full);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
