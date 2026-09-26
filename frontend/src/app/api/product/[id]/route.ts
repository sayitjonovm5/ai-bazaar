import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    let productId = params.id;
    try {
      productId = decodeURIComponent(params.id);
    } catch (e) {
      // Ignore if it throws (meaning it's already decoded and has raw % signs)
    }
    
    // Parse historical data
    const histPath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
    const histContent = fs.readFileSync(histPath, "utf8");
    const { data: histData } = Papa.parse(histContent, { header: true, skipEmptyLines: true });
    
    // Parse forecast data
    const forecastPath = path.join(process.cwd(), "..", "data", "forecasts.csv");
    let forecastData: any = [];
    if (fs.existsSync(forecastPath)) {
      const fContent = fs.readFileSync(forecastPath, "utf8");
      const parsed = Papa.parse(fContent, { header: true, skipEmptyLines: true });
      forecastData = parsed.data;
    }

    // Filter historical data for this product
    const rawData = histData
      .filter((row: any) => row.Product_Name === productId)
      .map((row: any) => ({
        Date: row.Date,
        Category: row.Category,
        Current_Price: String(row.Current_Price_Sum).replace(/[\s,]/g, ''),
        Trend: row.Price_Change_Direction,
        Price_Change: String(row.Price_Change_Sum).replace(/[\s,]/g, ''),
        Price_Change_Percent: row.Price_Change_Percent,
        Period: row.Last_Trading_Week
      }));
    
    let productHistory = rawData
      .map((row: any) => ({
        date: new Date(row.Date).toISOString().split('T')[0],
        price: parseFloat(row.Current_Price) 
      }))
      .filter((h: any) => !isNaN(h.price))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter to last 20 periods for clean visualization
    productHistory = productHistory.slice(-20);
    
    // Format for Recharts
    const chartData = productHistory.map(h => ({
      date: h.date,
      historical: h.price
    }));

    if (chartData.length > 0) {
      const lastPoint = chartData[chartData.length - 1];
      
      // Look for a forecast
      const forecastRow = forecastData.find((r: any) => r.Product_Name === productId);
      
      if (forecastRow) {
        // Connect the last historical point to the forecast line
        lastPoint.forecastMedian = lastPoint.historical;
        lastPoint.forecastRange = [lastPoint.historical, lastPoint.historical];
        
        // Add the forecast point
        chartData.push({
          date: forecastRow.Forecast_Date.split(' ')[0], // handle potential datetime strings
          forecastMedian: parseFloat(forecastRow.Median_Price),
          forecastRange: [parseFloat(forecastRow.Min_Price), parseFloat(forecastRow.Max_Price)]
        });
      }
    }

    return NextResponse.json({
      id: productId,
      name: productId,
      chartData,
      rawData
    });
  } catch (error) {
    console.error("Error loading product detail data:", error);
    return NextResponse.json({ error: "Failed to load product details" }, { status: 500 });
  }
}
