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

    // --- Simple RAG Implementation ---
    let contextData = "";
    try {
      const forecastPath = path.join(process.cwd(), "..", "data", "forecasts.csv");
      if (fs.existsSync(forecastPath)) {
        const fContent = fs.readFileSync(forecastPath, "utf8");
        const { data: forecastData } = Papa.parse(fContent, { header: true, skipEmptyLines: true });
        
        // Very basic keyword matching
        const words = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
        
        const relevantForecasts = (forecastData as any[]).filter(row => 
          words.some(word => row.Product_Name?.toLowerCase().includes(word) || row.Category?.toLowerCase().includes(word))
        ).slice(0, 5); // Take top 5 matches to not overload the local LLM context

        if (relevantForecasts.length > 0) {
          contextData = "Here is some relevant market forecast data from our database:\n";
          relevantForecasts.forEach(row => {
            contextData += `- ${row.Product_Name} (${row.Category}): Forecasted Median Price is ${row.Median_Price} UZS (Min: ${row.Min_Price}, Max: ${row.Max_Price}) for ${row.Forecast_Date}.\n`;
          });
        }
      }
    } catch (e) {
      console.error("Error reading RAG context:", e);
    }

    const systemPrompt = `You are the Bozor-Analitika AI Analyst. You help users understand B2B market prices in Uzbekistan. Be concise and helpful.`;
    
    const finalPrompt = contextData 
      ? `${systemPrompt}\n\n${contextData}\nUser Question: ${message}\nAnswer:` 
      : `${systemPrompt}\n\nUser Question: ${message}\nAnswer:`;

    const response = await fetch(OLLAMA_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: finalPrompt,
        stream: false,
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
    
    return NextResponse.json({ reply: data.response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error connecting to AI model." },
      { status: 500 }
    );
  }
}
