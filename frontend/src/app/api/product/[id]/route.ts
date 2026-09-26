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

    const { searchParams } = new URL(request.url);
    const unitParam = searchParams.get("unit");

    // Filter historical data for this product
    let matchingRows = histData.filter((row: any) => row.Product_Name === productId);
    if (matchingRows.length === 0) {
      matchingRows = histData.filter((row: any) => (row.Product_Name || "").trim().toLowerCase() === productId.trim().toLowerCase());
    }

    // Determine unit
    let resolvedUnit = unitParam;
    if (unitParam) {
      const filtered = matchingRows.filter((row: any) => row.Unit === unitParam);
      if (filtered.length > 0) {
        matchingRows = filtered;
      }
    } else if (matchingRows.length > 0) {
      const unitCounts: Record<string, number> = {};
      matchingRows.forEach((r: any) => {
        const u = r.Unit || "tonna";
        unitCounts[u] = (unitCounts[u] || 0) + 1;
      });
      resolvedUnit = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])[0][0];
      matchingRows = matchingRows.filter((row: any) => (row.Unit || "tonna") === resolvedUnit);
    } else {
      resolvedUnit = "tonna";
    }

    const rawData = matchingRows.map((row: any) => ({
      Date: row.Date,
      Category: row.Category,
      Unit: row.Unit || resolvedUnit,
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
    const chartData: any[] = productHistory.map(h => ({
      date: h.date,
      historical: h.price
    }));

    if (chartData.length > 0) {
      const lastPoint = chartData[chartData.length - 1];
      
      // Look for a forecast
      const forecastRow = forecastData.find((r: any) => r.Product_Name === productId && (!r.Unit || r.Unit === resolvedUnit)) ||
                          forecastData.find((r: any) => r.Product_Name === productId);
      
      if (forecastRow) {
        // Connect the last historical point to the forecast line
        lastPoint.forecastMedian = lastPoint.historical;
        lastPoint.forecastRange = [lastPoint.historical, lastPoint.historical];
        
        // Calculate next week from today
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        // Add the forecast point
        chartData.push({
          date: nextWeekStr,
          forecastMedian: parseFloat(forecastRow.Median_Price),
          forecastRange: [parseFloat(forecastRow.Min_Price), parseFloat(forecastRow.Max_Price)]
        });
      }
    }

    return NextResponse.json({
      id: productId,
      name: productId,
      unit: resolvedUnit,
      chartData,
      rawData
    });
  } catch (error) {
    console.error("Error loading product detail data:", error);
    return NextResponse.json({ error: "Failed to load product details" }, { status: 500 });
  }
}
