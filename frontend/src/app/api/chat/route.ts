import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;
    const currency = body?.currency === "USD" ? "USD" : "UZS";
    let exchangeRate = Number(body?.rate) || 0;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Determine exchange rate (from request or CBU API)
    if (!exchangeRate || exchangeRate <= 0) {
      try {
        const cbuRes = await fetch("https://cbu.uz/uz/arkhiv-kursov-valyut/json/", {
          headers: { Accept: "application/json" },
          next: { revalidate: 1800 },
        });
        if (cbuRes.ok) {
          const cbuData = await cbuRes.json();
          const usd = cbuData.find((item: any) => item.Ccy === "USD");
          if (usd && parseFloat(usd.Rate)) {
            exchangeRate = parseFloat(usd.Rate);
          }
        }
      } catch {
        exchangeRate = 12850;
      }
    }
    if (!exchangeRate || exchangeRate <= 0) {
      exchangeRate = 12850;
    }

    const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!OLLAMA_BASE_URL || !OLLAMA_MODEL) {
      return NextResponse.json(
        { error: "Ollama/Groq configuration is missing in the backend." },
        { status: 500 }
      );
    }

    // --- Upgraded RAG Implementation (Both Historical & Forecast Data with Currency Conversion) ---
    let contextData = "";
    try {
      const dataPath = path.join(process.cwd(), "..", "data", "cleaned_data_uz.csv");
      const forecastPath = path.join(process.cwd(), "..", "data", "forecasts.csv");
      
      const stopWords = ["salom", "assalom", "assalomu", "alaykum", "narxi", "qancha", "aytib", "bering", "iltimos", "qanday", "nima", "haqida", "bilan", "uchun", "kuningiz", "yaxshimi", "kursi", "kursini"];
      const words = message.toLowerCase().split(/[\s?.,]+/)
        .filter((w: string) => w.length > 2 && !stopWords.includes(w));
      
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
          contextData = "Foydalanuvchi so'roviga oid UZEX tovar-xomashyo birjasi ma'lumotlari:\n\n";
          
          // 2. Try to attach Forecast Data if it exists
          let forecastData: any[] = [];
          if (fs.existsSync(forecastPath)) {
            const fContent = fs.readFileSync(forecastPath, "utf8");
            forecastData = Papa.parse(fContent, { header: true, skipEmptyLines: true }).data as any[];
          }

          topMatches.forEach(row => {
            const rawPrice = row.Current_Price_Sum;
            const numPrice = parseFloat(String(rawPrice).replace(/[\s,]/g, "")) || 0;
            const usdPrice = (numPrice / exchangeRate).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const uzsPriceFormatted = Number(numPrice).toLocaleString("uz-UZ");
            const change = row.Price_Change_Percent || "0";
            const unit = row.Unit || "tonna";

            contextData += `- Mahsulot: ${row.Product_Name} (Kategoriya: ${row.Category}, O'lchov birligi: 1 ${unit})\n`;
            contextData += `  Joriy narx: ${uzsPriceFormatted} UZS (~ $${usdPrice} USD) 1 ${unit} uchun (Oxirgi o'zgarish: ${change}%).\n`;
            
            const forecast = forecastData.find(f => f.Product_Name === row.Product_Name && (!f.Unit || f.Unit === unit)) ||
                             forecastData.find(f => f.Product_Name === row.Product_Name);
            if (forecast) {
              const numForecast = parseFloat(String(forecast.Median_Price).replace(/[\s,]/g, "")) || 0;
              const usdForecast = (numForecast / exchangeRate).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              contextData += `  AI Prognozi (${forecast.Forecast_Date}): Kutilayotgan narx ${Number(numForecast).toLocaleString("uz-UZ")} UZS (~ $${usdForecast} USD) 1 ${unit} uchun (Oraliq: ${forecast.Min_Price} - ${forecast.Max_Price} UZS).\n`;
            }
            contextData += "\n";
          });
        }
      }

      // 3. Try to attach Marketplace Offers
      if (words.length > 0) {
        const orConditions = words.map((w: string) => ({ productName: { contains: w } }));
        const offers = await prisma.supplierOffer.findMany({
          where: { OR: orConditions },
          take: 5,
          orderBy: { createdAt: "desc" }
        });

        if (offers.length > 0) {
          if (!contextData) contextData = "Here is the most relevant market data based on the user's query:\n\n";
          contextData += "Active B2B Marketplace Offers:\n";
          offers.forEach((offer: any) => {
            contextData += `- Supplier: ${offer.companyName} is offering ${offer.productName}\n`;
            contextData += `  Price: ${offer.price} UZS\n`;
            if (offer.description) contextData += `  Description: ${offer.description}\n`;
            if (offer.phoneNumber || offer.contact) contextData += `  Contact: ${offer.phoneNumber || offer.contact}\n`;
            contextData += "\n";
          });
        }
      }
    } catch (e) {
      console.error("Error reading RAG context:", e);
    }

    const systemPrompt = `You are NarxNazar's expert AI market analyst and economic consultant specializing strictly in commodities, prices, exchange rates, data, economics, and entrepreneurship. Answer the user's questions directly in Uzbek (or the language of their message).

Current Official Exchange Rate (Central Bank of Uzbekistan / O'zbekiston Markaziy Banki):
1 USD = ${exchangeRate.toLocaleString("uz-UZ")} UZS.

User's Preferred Currency: ${currency} (${currency === "USD" ? "AQSh dollari / US Dollar" : "O'zbek so'mi / Uzbek Som"}).

Currency Rules:
- If the user's preferred currency is USD, or if they ask about prices in USD / dollars, calculate and present the prices in USD using the official rate (${exchangeRate.toLocaleString("uz-UZ")} UZS per 1 USD).
- Provide dual pricing where helpful (e.g. "$715.38 USD (9,192,600 UZS)") so the user has full clarity.
- If asked about exchange rates, currency trends, or devaluation/inflation impact, provide accurate insights based on the official CBU rate (1 USD = ${exchangeRate.toLocaleString("uz-UZ")} UZS).
- If the user's question is NOT related to data, economics, commodities, exchange rates, entrepreneurship, or market analysis, decline politely in Uzbek stating you only specialize in economic and market analysis.
- Do not use conversational filler. Be clear, accurate, and concise with structured markdown tables or bullet points when comparing commodities.`;
    
    const systemContent = contextData 
      ? `${systemPrompt}\n\n${contextData}`
      : systemPrompt;

    const chatUrl = OLLAMA_BASE_URL.replace('/api/generate', '/api/chat');

    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (GROQ_API_KEY) {
      fetchHeaders["Authorization"] = `Bearer ${GROQ_API_KEY}`;
    }

    const effectiveModel = (GROQ_API_KEY && (OLLAMA_MODEL === "llama-3.1-70b-versatile" || !OLLAMA_MODEL))
      ? "openai/gpt-oss-20b"
      : OLLAMA_MODEL;

    const response = await fetch(chatUrl, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message }
        ],
        stream: false
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
    let reply = data.choices?.[0]?.message?.content || data.message?.content || data.response || "";
    reply = reply.replace(/APST/g, "'");
    
    return NextResponse.json({ reply, currency, rate: exchangeRate });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error connecting to AI model." },
      { status: 500 }
    );
  }
}
