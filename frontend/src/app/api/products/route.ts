import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
    
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(csvFilePath, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    // Group by Product_Name + Unit
    const productMap = new Map();

    records.forEach((row: any) => {
      const priceStr = row.Average_Price ? row.Average_Price.replace(/,/g, "") : "";
      const price = parseFloat(priceStr);
      if (isNaN(price)) return;
      
      const isForward = row.Product_Name.toLowerCase().includes('(forvard)');
      const contractType = isForward ? "Forvard" : "Spot";
      let cleanName = row.Product_Name.replace(/\s*\(\s*Forvard\s*\)/gi, '').trim();

      // Translations
      cleanName = cleanName.replace(/Avtobenzin/gi, "Benzin")
                   .replace(/Ammiachnaya selitra/gi, "Ammiakli selitra")
                   .replace(/Alyumin kompozitnaya panel/gi, "Alyuminiy kompozit panel")
                   .replace(/Amiak vodniy/gi, "Suvli ammiak")
                   .replace(/Azot gazoobrazniy/gi, "Gaz holatidagi azot")
                   .replace(/Azot jidkiy/gi, "Suyuq azot")
                   .replace(/Ammiak bezvodniy/gi, "Suvsiz ammiak")
                   .replace(/Balka \(Dvutavr\)/gi, "Balka (I-nur)")
                   .replace(/Krug g\.k/gi, "Doira g.k")
                   .replace(/Truba stalnaya/gi, "Po'lat quvur");
      
      const unit = row.Unit || "tonna";
      const key = `${row.Product_Name}__${unit}`;
      
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: unit !== "tonna" ? `${row.Product_Name}?unit=${encodeURIComponent(unit)}` : row.Product_Name,
          name: cleanName,
          category: row.Category || "Boshqa",
          contractType: contractType,
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

    const products = Array.from(productMap.values());
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}