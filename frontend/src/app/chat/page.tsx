"use client";

import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I am your Bozor-Analitika market AI. You can ask me anything about current prices, market trends, or supplier comparisons.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong communicating with the AI.");
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: `⚠️ Error: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Market Analyst</h1>
        <p className="text-gray-500 mt-1">Ask questions about data and forecasts</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-100 text-gray-900 rounded-tl-none whitespace-pre-wrap"}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="my-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Ommabop savollar va tovarlar
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: "Avtobenzin A-92",
                    query: "Avtobenzin A-92 narxi va prognozi qanday?",
                    category: "Yoqilg'i",
                  },
                  {
                    name: "Sement PTs 400-D20",
                    query: "Sement PTs 400 narxi va kelgusi haftalik prognozi",
                    category: "Qurilish materiallari",
                  },
                  {
                    name: "Armatura diametri 12 mm",
                    query: "Armatura 12mm ning oxirgi haftadagi narx o'zgarishi",
                    category: "Metallurgiya",
                  },
                  {
                    name: "Bug'doy",
                    query: "Bug'doy va un mahsulotlari narxi qanday?",
                    category: "Qishloq xo'jaligi va oziq-ovqat",
                  },
                ].map((item) => (
                  <button
                    key={item.query}
                    onClick={() => {
                      setInput(item.query);
                    }}
                    className="flex items-center gap-3 p-3 text-left rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs text-gray-700 hover:text-blue-900 group"
                  >
                    <ProductIcon name={item.name} category={item.category} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{item.name}</div>
                      <div className="text-gray-500 truncate mt-0.5">{item.query}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                <Bot size={20} />
              </div>
              <div className="px-5 py-3 rounded-2xl max-w-[80%] bg-gray-100 text-gray-900 rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              disabled={isLoading}
              placeholder="Ask about price trends, e.g., 'Why did cement go up today?'"
              className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
