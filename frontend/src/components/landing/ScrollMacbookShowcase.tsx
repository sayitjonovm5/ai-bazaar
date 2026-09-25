"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Cloud, 
  ChevronDown, 
  Share2, 
  Play, 
  Plus, 
  Layers, 
  Sparkles, 
  MousePointer, 
  Presentation, 
  GitFork, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  Lock, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check
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

export default function ScrollMacbookShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hotspotActive, setHotspotActive] = useState<string | null>(null);
  const [simulatedOrderPlaced, setSimulatedOrderPlaced] = useState(false);

  // Track scroll progress inside the sticky container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Calculate progress from 0 to 1
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollableDistance, 0), 1);
      setScrollProgress(progress);

      // Determine active tab based on progress
      if (progress < 0.33) {
        setActiveTab(0);
      } else if (progress < 0.67) {
        setActiveTab(1);
      } else {
        setActiveTab(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manual Tab Click to scroll container smoothly
  const handleTabClick = (index: 0 | 1 | 2) => {
    setActiveTab(index);
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollHeight = rect.height - window.innerHeight;

    let targetScroll = containerTop;
    if (index === 0) targetScroll += scrollHeight * 0.05;
    if (index === 1) targetScroll += scrollHeight * 0.45;
    if (index === 2) targetScroll += scrollHeight * 0.85;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section 
      ref={containerRef} 
      id="interactive-showcase" 
      className="relative w-full h-[260vh] bg-gradient-to-b from-white via-slate-50 to-white"
    >
      {/* Sticky Container pinned in viewport */}
      <div className="sticky top-12 sm:top-16 min-h-[660px] h-[90vh] flex flex-col items-center justify-start max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Top View Switcher Navigation (Overflow Style) */}
        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          <div className="inline-flex p-1.5 rounded-full bg-slate-100/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
            <button
              onClick={() => handleTabClick(0)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 0
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Canvas / Flow View</span>
            </button>

            <button
              onClick={() => handleTabClick(1)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 1
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MousePointer className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Prototype View</span>
            </button>

            <button
              onClick={() => handleTabClick(2)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 2
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-purple-600" />
              <span>3. Story / Presentation</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-medium hidden sm:block">
            {activeTab === 0 && "Scroll down or click tabs to explore connected screen flows"}
            {activeTab === 1 && "Interactive Prototype mode: Click pulsing hotspots on the screen"}
            {activeTab === 2 && "Presentation Mode: Board-ready walk-through with team annotations"}
          </p>
        </div>

        {/* MacBook Window Container Frame */}
        <div className="relative w-full flex-1 max-h-[78vh] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col ring-1 ring-slate-900/5">
          
          {/* macOS Title Bar */}
          <div className="h-11 sm:h-12 bg-slate-100/90 border-b border-slate-200/80 px-4 flex items-center justify-between select-none shrink-0">
            {/* 3 Colored Dots */}
            <div className="flex items-center space-x-2 w-24">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs inline-block" />
            </div>

            {/* Document Title with Cloud Icon */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white/80 px-3.5 py-1 rounded-md border border-slate-200/70 shadow-2xs">
              <Cloud className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate max-w-[200px] sm:max-w-xs">
                {activeTab === 0 && "Bookgeek user flow • Overflow Canvas"}
                {activeTab === 1 && "Interactive Prototype • iPhone 16 Canvas"}
                {activeTab === 2 && "Executive Board Story • Step 03 of 05"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2.5 w-auto justify-end text-slate-500">
              <span className="text-xs font-semibold bg-slate-200/70 px-2 py-0.5 rounded text-slate-700 hidden sm:inline-flex items-center">
                {activeTab === 0 ? "85%" : activeTab === 1 ? "115%" : "100%"}
                <ChevronDown className="w-2.5 h-2.5 ml-1 text-slate-500" />
              </span>
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-blue-600 text-[10px] text-white font-bold">SL</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-indigo-600 text-[10px] text-white font-bold">MV</span>
              </div>
              <button className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors hidden sm:block">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors">
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>

          {/* Sub Toolbar */}
          <div className="h-10 bg-white border-b border-slate-200/70 px-4 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="flex items-center font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">
                <Plus className="w-3 h-3 mr-1" />
                Add Screen
              </span>
              {/* Overflow Blue Connector Pill */}
              <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold border border-blue-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Connector style 1</span>
                <ChevronDown className="w-3 h-3 text-blue-500" />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-400">
              <Layers className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
              <Sliders className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
              <div className="h-3.5 w-px bg-slate-200" />
              <Lock className="w-3.5 h-3.5 hover:text-slate-600 cursor-pointer" />
            </div>
          </div>

          {/* Dynamic Inner Canvas */}
          <div className="relative flex-1 bg-slate-50/70 overflow-hidden select-none">
            
            {/* Infinite Canvas Grid dots */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            {/* ---------------- STATE 1: FLOW / CANVAS VIEW ---------------- */}
            {activeTab === 0 && (
              <div className="absolute inset-0 p-4 sm:p-8 flex items-center justify-center transition-all duration-500 animate-in fade-in">
                
                {/* SVG Bezier Connector Lines with Flow Dash Animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>
                  
                  {/* Connector Path: Screen 1 to Screen 2 */}
                  <path
                    d="M 280 220 C 340 220, 360 220, 420 220"
                    fill="none"
                    stroke="url(#flowGrad)"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="animate-flow-dash hidden md:block"
                  />
                  <circle cx="280" cy="220" r="5" fill="#2563EB" className="hidden md:block" />
                  <polygon points="420,216 428,220 420,224" fill="#4F46E5" className="hidden md:block" />

                  {/* Connector Path: Screen 2 to Screen 3 */}
                  <path
                    d="M 680 220 C 740 220, 760 220, 820 220"
                    fill="none"
                    stroke="url(#flowGrad)"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="animate-flow-dash hidden lg:block"
                  />
                  <circle cx="680" cy="220" r="5" fill="#4F46E5" className="hidden lg:block" />
                  <polygon points="820,216 828,220 820,224" fill="#2563EB" className="hidden lg:block" />
                </svg>

                {/* Connected Screen Cards Layout */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 z-20 w-full max-w-5xl">
                  
                  {/* Screen 1: Catalog */}
                  <div className="w-64 bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-2">
                      <span>01. BROWSE CATALOG</span>
                      <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Live</span>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-2 text-xs text-slate-500 mb-3 flex items-center">
                      <span className="truncate">🔍 Search 24,000+ items...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-800">Sement PST-I-G-KK-1</div>
                        <div className="text-[11px] text-slate-500">1,980,000 UZS / tonna</div>
                      </div>
                      <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/80">
                        <div className="text-xs font-bold text-blue-900">Varaq po'lat g.k 10x1500</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">+32.8% haftalik o'sish</div>
                      </div>
                    </div>
                  </div>

                  {/* Screen 2: Central AI Forecast Screen */}
                  <div className="w-72 bg-white rounded-2xl p-4.5 border-2 border-blue-500 shadow-xl ring-4 ring-blue-500/10">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                      <span className="text-blue-700 uppercase tracking-wide">02. CHRONOS AI FORECAST</span>
                      <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        98.4%
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Varaq po'lat 3sp markali</h4>
                    <div className="text-lg font-extrabold text-slate-900 mb-2">
                      17,000,000 <span className="text-xs font-normal text-slate-500">UZS</span>
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="h-28 w-full -ml-2 mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                          <defs>
                            <linearGradient id="flowHist" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" hide />
                          <Area type="monotone" dataKey="hist" stroke="#2563EB" strokeWidth={2.5} fill="url(#flowHist)" />
                          <Area type="monotone" dataKey="fore" stroke="#10B981" strokeWidth={2.5} strokeDasharray="3 3" fill="none" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="text-emerald-600 font-bold">Kutilayotgan: 18.2M UZS</span>
                      <span className="text-slate-400">7 kunlik</span>
                    </div>
                  </div>

                  {/* Screen 3: Procurement & Checkout */}
                  <div className="w-64 bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 hidden sm:block">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-2">
                      <span>03. SMART PROCUREMENT</span>
                      <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Action</span>
                    </div>
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/80 mb-3">
                      <div className="text-[11px] font-bold text-emerald-800 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        AI Tavsiyasi: Hozir xarid qilish
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-1">
                        Kelgusi haftadagi 1.2M UZS narx ko'tarilishidan saqlaning
                      </div>
                    </div>
                    <button className="w-full py-2 bg-slate-950 text-white rounded-xl text-xs font-bold shadow-sm">
                      Bitim tuzish (UZEX)
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ---------------- STATE 2: PROTOTYPE VIEW ---------------- */}
            {activeTab === 1 && (
              <div className="absolute inset-0 p-4 sm:p-8 flex items-center justify-center transition-all duration-500 animate-in zoom-in-95">
                <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-indigo-500/80 shadow-2xl ring-8 ring-indigo-500/5">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100 mb-4">
                    <span className="font-semibold text-indigo-600 flex items-center">
                      <MousePointer className="w-3.5 h-3.5 mr-1" />
                      Live Prototype Simulator
                    </span>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      Interactive Hotspots Active
                    </span>
                  </div>

                  {/* Main Product Screen */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          Xom-ashyo Birjasi
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                          Varaq g.k 10x1500mm
                        </h3>
                        <p className="text-xs text-slate-500">Po'lat 3sp markali • Tonna</p>
                      </div>

                      {/* Hotspot 1: Price Change Badge */}
                      <div 
                        onClick={() => setHotspotActive("price")}
                        className="relative cursor-pointer group"
                      >
                        <span className="absolute -inset-1 rounded-lg bg-blue-500/30 animate-ping pointer-events-none" />
                        <span className="relative inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300">
                          +32.8%
                        </span>
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-40 w-full bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                        <span>Haftalik Narx vs Chronos AI</span>
                        <span className="text-emerald-600">Max: 19.4M</span>
                      </div>
                      <div className="h-28 w-full -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <XAxis dataKey="day" hide />
                            <Tooltip formatter={(v: number) => [`${v.toLocaleString()} UZS`, "Narx"]} />
                            <Area type="monotone" dataKey="hist" stroke="#2563EB" strokeWidth={2.5} fill="#bfdbfe" />
                            <Area type="monotone" dataKey="fore" stroke="#10B981" strokeWidth={2.5} strokeDasharray="3 3" fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Hotspot 2: Simulated Action Button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setSimulatedOrderPlaced(true);
                          setHotspotActive("order");
                        }}
                        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                          simulatedOrderPlaced
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-950 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {simulatedOrderPlaced ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Bitim Muvaffaqiyatli Tasdiqlandi (Tejaldi: 14%)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Optimal Narxda Xarid Qilish (17,000,000 UZS)</span>
                          </>
                        )}
                      </button>

                      {!simulatedOrderPlaced && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white" />
                        </span>
                      )}
                    </div>

                    {/* Hotspot Toast */}
                    {hotspotActive && (
                      <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                        <span>
                          {hotspotActive === "price" && "💡 AI tahlili: Narx 3 hafta ichida 12M dan 17M gacha ko'tarildi."}
                          {hotspotActive === "order" && "✅ Prototiplash natijasi: Xarid buyrug'i tizimga uzatildi!"}
                        </span>
                        <button 
                          onClick={() => setHotspotActive(null)}
                          className="font-bold ml-2 text-blue-700 hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            )}

            {/* ---------------- STATE 3: STORY / PRESENTATION VIEW ---------------- */}
            {activeTab === 2 && (
              <div className="absolute inset-0 p-4 sm:p-8 flex flex-col items-center justify-between transition-all duration-500 animate-in fade-in">
                
                {/* Presentation Slide Header */}
                <div className="w-full max-w-3xl flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold">
                      SLIDE 03 / 08
                    </span>
                    <span className="text-slate-900 font-bold">
                      Boshqaruv Kengashi Xarid Strategiyasi
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="flex items-center text-emerald-600 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      5 kishi jonli tomosha qilmoqda
                    </span>
                  </div>
                </div>

                {/* Central Presentation Slide Card with Avatars & Speech Bubbles */}
                <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl my-auto">
                  
                  {/* Floating Avatar Comment 1 (Elena) */}
                  <div className="absolute -top-6 -left-3 sm:-left-6 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xl max-w-xs z-30 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] text-white font-bold flex items-center justify-center">
                        EV
                      </div>
                      <span className="text-xs font-bold text-slate-900">Elena V.</span>
                      <span className="text-[10px] text-slate-400">Ta'minot rahbari</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      "Chronos AI prognozi bo'yicha 17M UZS narxda zaxira oldik. 45 million so'm tejab qolindi! 👏"
                    </p>
                  </div>

                  {/* Floating Avatar Comment 2 (Marcus) */}
                  <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xl max-w-xs z-30 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-[10px] text-white font-bold flex items-center justify-center">
                        MK
                      </div>
                      <span className="text-xs font-bold text-slate-900">Marcus K.</span>
                      <span className="text-[10px] text-slate-400">Moliya direktori</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      "Tahlil va grafiklar to'liq tasdiqlandi. Kelgusi oylik xarid limiti ma'qullandi. ✅"
                    </p>
                  </div>

                  {/* Slide Content */}
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-full">
                      Tahliliy xulosa va qaror
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Qurilish va Metallurgiya Xom-ashyo Narxlari Prognozi
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Chronos-T5 neyron tarmog'i 5 yillik UZEX haftalik byulletenlarini qayta ishlab, po'lat narxlarida 12% ga yaqin mavsumiy o'sish tendentsiyasini aniqladi.
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tavsiya</span>
                        <span className="text-sm font-extrabold text-emerald-600">Oldindan Xarid</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tejalgan Mablag'</span>
                        <span className="text-sm font-extrabold text-blue-600">~14.2%</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-semibold">Model Ishonchi</span>
                        <span className="text-sm font-extrabold text-purple-600">98.4%</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Presenter Footer Bar */}
                <div className="w-full max-w-3xl flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-700">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-slate-700">3 / 8</span>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-700">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    📝 Ma'ruzachi eslatmasi: Boshqaruv a'zolariga 7 kunlik narx koridorini batafsil tushuntiring.
                  </div>

                  <button className="flex items-center space-x-1 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                    <Maximize2 className="w-3 h-3 mr-1" />
                    Full Screen
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
