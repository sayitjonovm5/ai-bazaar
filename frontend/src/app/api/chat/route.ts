import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

    if (!OLLAMA_BASE_URL || !OLLAMA_MODEL) {
      return NextResponse.json(
        { error: "Ollama configuration is missing in the backend." },
        { status: 500 }
      );
    }

    // --- Upgraded RAG Implementation (Both Historical & Forecast Data) ---
    let contextData = "";
    try {
      const dataPath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
      const forecastPath = path.join(process.cwd(), "..", "data", "forecasts.csv");
      
      const stopWords = ["salom", "assalom", "assalomu", "alaykum", "narxi", "qancha", "aytib", "bering", "iltimos", "qanday", "nima", "haqida", "bilan", "uchun", "kuningiz", "yaxshimi"];
      const words = message.toLowerCase().split(/[\s?.,]+/)
        .filter((w: string) => w.length > 3 && !stopWords.includes(w));
      
      if (words.length > 0 && fs.existsSync(dataPath)) {
        // 1. Read Current Market Data
        const dContent = fs.readFileSync(dataPath, "utf8");
        const { data: rawData } = Papa.parse(dContent, { header: true, skipEmptyLines: true });
        
        // Find most recent price for matching products
        const matches = new Map();
        
        (rawData as any[]).forEach(row => {
          if (!row.Product_Name) return;
          const name = row.Product_Name.toLowerCase();
          const cat = (row.Category || "").toLowerCase();
          
          if (words.some((word: string) => name.includes(word) || cat.includes(word))) {
            // Keep overwriting so we get the latest row (assuming chronological)
            matches.set(row.Product_Name, row);
          }
        });

        const topMatches = Array.from(matches.values()).slice(0, 10); // Top 10 products
        
        if (topMatches.length > 0) {
          contextData = "Here is the most relevant market data from our database based on the user's query:\n\n";
          
          // 2. Try to attach Forecast Data if it exists
          let forecastData: any[] = [];
          if (fs.existsSync(forecastPath)) {
            const fContent = fs.readFileSync(forecastPath, "utf8");
            forecastData = Papa.parse(fContent, { header: true, skipEmptyLines: true }).data as any[];
          }

          topMatches.forEach(row => {
            const price = row.Current_Price_Sum;
            const change = row.Price_Change_Percent || "0";
            const unit = row.Unit || "tonna";
            contextData += `- Product: ${row.Product_Name} (Category: ${row.Category}, Unit: ${unit})\n`;
            contextData += `  Current Price: ${price} UZS per ${unit} (Changed by ${change}% recently).\n`;
            
            const forecast = forecastData.find(f => f.Product_Name === row.Product_Name && (!f.Unit || f.Unit === unit)) ||
                             forecastData.find(f => f.Product_Name === row.Product_Name);
            if (forecast) {
              contextData += `  AI Forecast (${forecast.Forecast_Date}): Expected Median Price ${forecast.Median_Price} UZS per ${unit} (Range: ${forecast.Min_Price} - ${forecast.Max_Price}).\n`;
            }
            contextData += "\n";
          });
        }
      }
    } catch (e) {
      console.error("Error reading RAG context:", e);
    }

    const systemPrompt = `You are an AI assistant specializing strictly in data, economics, and entrepreneurship. Answer the user's question directly using the provided market data if applicable. If the user's question is NOT related to data, economics, entrepreneurship, or market analysis, you MUST decline to answer and state that you only answer questions related to these topics (e.g. say "I can only answer questions related to data, economics, and entrepreneurship."). Do not use conversational filler.`;
    
    const systemContent = contextData 
      ? `${systemPrompt}\n\n${contextData}`
      : systemPrompt;

    const chatUrl = OLLAMA_BASE_URL.replace('/api/generate', '/api/chat');

    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message }
        ],
        stream: false,
        options: {
          num_ctx: 2048
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama Error:", errorText);
      return NextResponse.json(
        { error: `Failed to connect to Ollama: ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Clean up APST token artifacts from the custom Uzbek model
    let reply = data.message?.content || data.response || "";
    reply = reply.replace(/APST/g, "'");
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error connecting to AI model." },
      { status: 500 }
    );
  }
}
