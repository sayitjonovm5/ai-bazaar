"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Cloud, 
  ChevronDown, 
  Share2, 
  Play, 
  Plus, 
  SlidersHorizontal, 
  Lock, 
  Eye, 
  LayoutGrid, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  ExternalLink,
  Layers,
  BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProductPreview {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentPrice: number;
  changePercent: number;
  expectedMin: number;
  expectedMax: number;
  expectedMedian: number;
  history: { date: string; historical?: number; forecast?: number }[];
}

const SAMPLE_PRODUCTS: ProductPreview[] = [
  {
    id: "varaq-polat",
    name: "Varaq g.k 10x1500x6000mm 3sp po'lat",
    category: "Metallurgiya",
    unit: "tonna",
    currentPrice: 17000000,
    changePercent: 32.8,
    expectedMin: 16800000,
    expectedMax: 18200000,
    expectedMedian: 17650000,
    history: [
      { date: "1-Hafta", historical: 12800000 },
      { date: "2-Hafta", historical: 13200000 },
      { date: "3-Hafta", historical: 14100000 },
      { date: "4-Hafta", historical: 15400000 },
      { date: "5-Hafta", historical: 17000000, forecast: 17000000 },
      { date: "6-Hafta (AI)", forecast: 17650000 },
      { date: "7-Hafta (AI)", forecast: 18100000 },
    ]
  },
  {
    id: "sement-pst",
    name: "Portlend tsement PST-I-G-KK-1 (ommaviy)",
    category: "Qurilish materiallari",
    unit: "tonna",
    currentPrice: 1980000,
    changePercent: 4.2,
    expectedMin: 1950000,
    expectedMax: 2040000,
    expectedMedian: 2010000,
    history: [
      { date: "1-Hafta", historical: 1900000 },
      { date: "2-Hafta", historical: 1910000 },
      { date: "3-Hafta", historical: 1940000 },
      { date: "4-Hafta", historical: 1960000 },
      { date: "5-Hafta", historical: 1980000, forecast: 1980000 },
      { date: "6-Hafta (AI)", forecast: 2010000 },
      { date: "7-Hafta (AI)", forecast: 2035000 },
    ]
  },
  {
    id: "dizel-moyi",
    name: "Dizel moyi 15v40 KNG-4-Lukoyl",
    category: "Yoqilg'i & Moylar",
    unit: "litr",
    currentPrice: 44000,
    changePercent: -1.8,
    expectedMin: 42500,
    expectedMax: 44500,
    expectedMedian: 43200,
    history: [
      { date: "1-Hafta", historical: 45200 },
      { date: "2-Hafta", historical: 44900 },
      { date: "3-Hafta", historical: 44600 },
      { date: "4-Hafta", historical: 44800 },
      { date: "5-Hafta", historical: 44000, forecast: 44000 },
      { date: "6-Hafta (AI)", forecast: 43500 },
      { date: "7-Hafta (AI)", forecast: 43200 },
    ]
  },
  {
    id: "paxta-tolasi",
    name: "Paxta tolasi 1-nav 5-turi (hosil 2026)",
    category: "Qishloq xo'jaligi",
    unit: "tonna",
    currentPrice: 20608000,
    changePercent: 8.5,
    expectedMin: 20400000,
    expectedMax: 21800000,
    expectedMedian: 21200000,
    history: [
      { date: "1-Hafta", historical: 18900000 },
      { date: "2-Hafta", historical: 19200000 },
      { date: "3-Hafta", historical: 19800000 },
      { date: "4-Hafta", historical: 20100000 },
      { date: "5-Hafta", historical: 20608000, forecast: 20608000 },
      { date: "6-Hafta (AI)", forecast: 21100000 },
      { date: "7-Hafta (AI)", forecast: 21450000 },
    ]
  }
];

export default function MacbookMockup() {
  const [selectedProduct, setSelectedProduct] = useState<ProductPreview>(SAMPLE_PRODUCTS[0]);
  const [activeCategory, setActiveCategory] = useState<string>("Barchasi");

  const categories = ["Barchasi", "Metallurgiya", "Qurilish materiallari", "Yoqilg'i & Moylar", "Qishloq xo'jaligi"];

  const filteredProducts = activeCategory === "Barchasi" 
    ? SAMPLE_PRODUCTS 
    : SAMPLE_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div id="mockup" className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
      
      {/* Decorative ambient backdrop glow */}
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10 opacity-70 transform-gpu" />

      {/* MacBook Window Container */}
      <div className="w-full bg-white rounded-2xl md:rounded-3xl shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] border border-slate-200/90 overflow-hidden ring-1 ring-slate-900/5">
        
        {/* macOS Title Bar */}
        <div className="h-11 sm:h-12 bg-slate-100/90 border-b border-slate-200/80 px-4 flex items-center justify-between select-none">
          
          {/* Traffic Light Buttons */}
          <div className="flex items-center space-x-2 w-28">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-xs cursor-pointer inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-xs cursor-pointer inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-xs cursor-pointer inline-block" />
          </div>

          {/* Center Document Title */}
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-white/70 px-3 py-1 rounded-md border border-slate-200/60 shadow-2xs">
            <Cloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate max-w-[220px] sm:max-w-xs font-semibold text-slate-800">
              NarxNazar Cloud • Jonli Birja Tahlili
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Right Window Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-slate-500 w-auto justify-end">
            <span className="hidden sm:inline-flex items-center text-xs font-medium bg-slate-200/60 px-2 py-0.5 rounded text-slate-700">
              100%
              <ChevronDown className="w-2.5 h-2.5 ml-1" />
            </span>
            {/* Avatar Stack */}
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-blue-500 text-[10px] text-white font-bold">AZ</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-emerald-500 text-[10px] text-white font-bold">MK</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-amber-500 text-[10px] text-white font-bold">UX</span>
            </div>
            <button className="hidden sm:flex items-center justify-center p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center justify-center p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors">
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>

        </div>

        {/* macOS Sub-Toolbar (Overflow style) */}
        <div className="h-10 sm:h-11 bg-white border-b border-slate-200/70 px-4 flex items-center justify-between text-xs text-slate-600 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 shrink-0">
            <button className="flex items-center px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-medium text-slate-700 transition-colors">
              <Plus className="w-3 h-3 mr-1" />
              Yangi tahlil
            </button>
            {/* Blue pill indicator like 'Connector style 1' in Overflow */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Chronos-T5 AI Modeli</span>
              <ChevronDown className="w-3 h-3 text-blue-500" />
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center space-x-1 text-slate-400">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <Layers className="w-4 h-4 text-slate-400" />
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Haftalik Byulleten: 2026-Sentabr
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <Lock className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Mockup Canvas Body */}
        <div className="p-4 sm:p-6 bg-slate-50/70">
          
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Interactive Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Product Selection List */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                <span>Birja Tovar Lotlari</span>
                <span className="text-blue-600">4 / 10,000+</span>
              </div>

              {filteredProducts.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                      isSelected
                        ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                        : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          {prod.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          1 {prod.unit} uchun narx
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${
                        prod.changePercent >= 0 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}>
                        {prod.changePercent > 0 ? "+" : ""}{prod.changePercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-base font-bold text-slate-900">
                        {prod.currentPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">UZS</span>
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI: ~{prod.expectedMedian.toLocaleString()} UZS
                      </span>
                    </div>
                  </div>
                );
              })}

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-medium text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-colors"
              >
                Barcha 10,000+ tovarlarni ko'rish
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>

            {/* Right Column: AI Forecast Visual Canvas */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              
              {/* Product Header & AI Confidence */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Tanlangan tovar tahlili
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Joriy narx</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {selectedProduct.currentPrice.toLocaleString()} UZS
                    </span>
                  </div>
                </div>

                {/* AI Forecast Summary Bar */}
                <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block">Kutilayotgan Min</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {selectedProduct.expectedMin.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      Mediana Prognoz
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                      {selectedProduct.expectedMedian.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block">Kutilayotgan Max</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {selectedProduct.expectedMax.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Recharts Area for Selected Product */}
                <div className="h-52 sm:h-56 w-full -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProduct.history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="landingColorHist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="landingColorFore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                      />
                      <YAxis 
                        hide 
                        domain={['dataMin - 100000', 'dataMax + 100000']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '10px', 
                          border: '1px solid #e2e8f0', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                        formatter={(val: any) => [`${Number(val || 0).toLocaleString()} UZS`, "Narx"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="historical" 
                        stroke="#3b82f6" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#landingColorHist)" 
                        connectNulls 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="forecast" 
                        stroke="#10b981" 
                        strokeWidth={2.5} 
                        strokeDasharray="4 4" 
                        fillOpacity={1} 
                        fill="url(#landingColorFore)" 
                        connectNulls 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart Legend & Call to Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
                    Tarixiy birja narxi
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                    Chronos AI 7 kunlik prognozi
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  To'liq tahlilni ochish →
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
