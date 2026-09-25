import { NextResponse } from "next/server";

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

    const response = await fetch(OLLAMA_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: message,
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
