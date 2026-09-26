"use client";

import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Salom! Men NarxNazar bozor AI tahlilchisiman. Mendan joriy narxlar, bozor tendensiyalari yoki ta'minotchilar taqqoslovi haqida so'rashingiz mumkin.",
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
        throw new Error(data.error || "AI bilan bog'lanishda xatolik yuz berdi.");
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
        <h1 className="text-3xl font-bold text-slate-900">AI Bozor Tahlilchisi</h1>
        <p className="text-slate-500 mt-1">Ma'lumotlar va prognozlar haqida savollar bering</p>
      </div>

      <div className="flex-1 bg-white/75 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/60 flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === "user" ? "bg-blue-500/15 border-blue-500/25 text-blue-700" : "bg-emerald-500/15 border-emerald-500/25 text-emerald-700"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-blue-600/90 text-white backdrop-blur-md rounded-tr-none shadow-md shadow-blue-600/20" : "bg-white/80 backdrop-blur-md border border-white/70 text-slate-800 rounded-tl-none whitespace-pre-wrap shadow-2xs"}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="my-6 pt-4 border-t border-white/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
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
                    className="flex items-center gap-3 p-3 text-left rounded-xl bg-white/60 backdrop-blur-md border border-white/70 hover:bg-white/90 hover:border-blue-300 hover:shadow-xs transition-all text-xs text-slate-700 hover:text-blue-900 group"
                  >
                    <ProductIcon name={item.name} category={item.category} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 truncate">{item.name}</div>
                      <div className="text-slate-500 truncate mt-0.5">{item.query}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/15 border border-emerald-500/25 text-emerald-700">
                <Bot size={20} />
              </div>
              <div className="px-5 py-3 rounded-2xl max-w-[80%] bg-white/80 backdrop-blur-md border border-white/70 text-slate-800 rounded-tl-none flex items-center gap-1 shadow-2xs">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              disabled={isLoading}
              placeholder="Narx tendensiyalari haqida so'rang, masalan: 'Sement narxi nega bugun oshdi?'"
              className="w-full pl-6 pr-14 py-4 bg-white/65 backdrop-blur-xl border border-white/70 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 shadow-2xs disabled:opacity-50 transition-all text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 p-2.5 bg-blue-600/90 text-white rounded-full hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
