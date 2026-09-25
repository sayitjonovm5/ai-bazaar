"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Cloud, 
  ChevronDown, 
  Share2, 
  Play, 
  Plus, 
  Lock, 
  Eye, 
  LayoutGrid, 
  CreditCard,
  FileCheck2,
  TrendingUp, 
  Sparkles, 
  ExternalLink,
  Layers,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { day: "Dush", hist: 16500, fore: 16500 },
  { day: "Sesh", hist: 17100, fore: 17100 },
  { day: "Chor", hist: 16800, fore: 16800 },
  { day: "Pay", hist: 17400, fore: 17400 },
  { day: "Juma", hist: 18200, fore: 18200 },
  { day: "Shan (AI)", fore: 18900 },
  { day: "Yak (AI)", fore: 19400 },
];

export default function MacbookMockup() {
  const [activeCanvasTab, setActiveCanvasTab] = useState<"flow" | "forecast">("flow");
  const [selectedProduct, setSelectedProduct] = useState("Varaq g.k 10x1500mm 3sp po'lat");

  return (
    <div id="mockup" className="relative w-full max-w-5xl mx-auto px-2 sm:px-4">
      
      {/* Decorative ambient backdrop glow matching the deep rich aura */}
      <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 rounded-3xl blur-2xl -z-10 opacity-80 transform-gpu" />

      {/* MacBook Window Container */}
      <div className="w-full bg-white rounded-2xl md:rounded-3xl shadow-[0_30px_90px_-20px_rgba(15,23,42,0.35)] border border-slate-200/90 overflow-hidden ring-1 ring-slate-900/10">
        
        {/* macOS Title Bar (Exact Overflow screenshot style) */}
        <div className="h-11 sm:h-12 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between select-none">
          
          {/* Traffic Light Buttons */}
          <div className="flex items-center space-x-2 w-28">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs inline-block" />
          </div>

          {/* Center Document Title (Exact text from uploaded image) */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50/80 hover:bg-slate-100/80 px-3.5 py-1 rounded-md border border-slate-200/60 shadow-2xs cursor-pointer transition-colors">
            <Cloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate max-w-[200px] sm:max-w-xs text-slate-800">
              Bookgeek user flow
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Right Window Controls (Matching uploaded image) */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-slate-500 w-auto justify-end">
            <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700 hidden sm:inline-flex items-center">
              100%
              <ChevronDown className="w-2.5 h-2.5 ml-1 text-slate-500" />
            </span>
            {/* Avatar circle */}
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
              👤
            </div>
            <button className="hidden sm:flex items-center justify-center p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center justify-center p-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors">
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>

        </div>

        {/* macOS Sub-Toolbar (Exact Overflow layout with icons and blue connector pill) */}
        <div className="h-10 sm:h-11 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between text-xs text-slate-600 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center space-x-3 shrink-0">
            <span className="flex items-center font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
              <Plus className="w-3.5 h-3.5 mr-0.5" />
              <ChevronDown className="w-2.5 h-2.5" />
            </span>

            {/* Overflow Blue Connector Pill Badge (from uploaded image) */}
            <div className="flex items-center space-x-1.5 bg-blue-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[11px]">Connector style 1</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Tool items (curve, pen, T, grid) */}
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-xs font-bold text-slate-700 cursor-pointer">⤹</span>
              <span className="text-xs font-bold text-slate-700 cursor-pointer">✎</span>
              <span className="text-xs font-bold bg-slate-800 text-white w-4 h-4 rounded flex items-center justify-center cursor-pointer">T</span>
              <span className="text-xs text-slate-400 cursor-pointer">░</span>
            </div>
          </div>

          {/* Alignment Tools in Center */}
          <div className="hidden md:flex items-center space-x-2 text-slate-400 text-xs">
            <span className="cursor-pointer hover:text-slate-700">⇤</span>
            <span className="cursor-pointer hover:text-slate-700">⇥</span>
            <span className="cursor-pointer hover:text-slate-700">⇪</span>
            <span className="cursor-pointer hover:text-slate-700">⇩</span>
            <span className="cursor-pointer hover:text-slate-700">☰</span>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* View Switcher: Screenshot Flow vs AI Live */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setActiveCanvasTab("flow")}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeCanvasTab === "flow" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                }`}
              >
                User Flow View
              </button>
              <button
                onClick={() => setActiveCanvasTab("forecast")}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeCanvasTab === "forecast" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                }`}
              >
                AI Forecast View
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200" />
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <Lock className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>

        </div>

        {/* Mockup Canvas Area */}
        <div className="relative min-h-[380px] sm:min-h-[440px] bg-[#fbfbfc] p-6 sm:p-10 flex items-center justify-center select-none overflow-hidden">
          
          {/* Subtle Canvas Dot Grid */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* 1. EXACT OVERFLOW USER FLOW VIEW (Matching the uploaded image) */}
          {activeCanvasTab === "flow" && (
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-16 z-10 animate-in fade-in duration-300">
              
              {/* Dynamic SVG Connector Arrow connecting Screen 1 to Screen 2 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-20">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
                  </marker>
                </defs>
                <path
                  d="M 310 160 C 370 160, 440 160, 500 160"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                />
                <circle cx="310" cy="160" r="4.5" fill="#3b82f6" />
              </svg>

              {/* Screen 1: "Checkout" (Exact replica of left screen in image) */}
              <div className="w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-200">
                
                {/* Phone Top Notch bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-3">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <div className="text-xs text-slate-400 mb-2 cursor-pointer">‹</div>
                
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                  Checkout
                </h3>

                {/* Credit Card Mockup Component */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4 flex items-center space-x-3">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs shadow-xs">
                    💳
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Jessie Ford Jr.</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-wider">1234 - 5678 - XXXX</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                    Expiry date
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 font-medium">
                    12 / 28
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Total: 1,980,000 UZS</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">1 Tonna</span>
                </div>
              </div>

              {/* Screen 2: "Payment Success" (Exact replica of right screen in image) */}
              <div className="w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-200">
                
                {/* Phone Top Notch bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-6">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-12 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3 shadow-2xs border border-slate-200/60">
                    📄
                  </div>

                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Payment Success
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Your UZEX order has been placed successfully.
                  </p>

                  <div className="mt-6 w-full p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200/70">
                    Receipt #84920 Generated
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. LIVE COMMODITY FORECAST CANVAS */}
          {activeCanvasTab === "forecast" && (
            <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl animate-in fade-in duration-300 z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                    Chronos AI 7-Kunlik Bashorat
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedProduct}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Joriy Birja Narxi</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    17,000,000 UZS
                  </span>
                </div>
              </div>

              {/* Sparkline chart */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="mockBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <Tooltip formatter={(v: number) => [`${v.toLocaleString()} UZS`, "Narx"]} />
                    <Area type="monotone" dataKey="hist" stroke="#2563EB" strokeWidth={3} fill="url(#mockBlue)" />
                    <Area type="monotone" dataKey="fore" stroke="#10B981" strokeWidth={3} strokeDasharray="4 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5" />
                    Hozirgi narx
                  </span>
                  <span className="flex items-center font-bold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                    Chronos AI Prognozi (+14.2%)
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  Platformaga o'tish →
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
