"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, TrendingUp, Package, Calendar, MoreHorizontal, Search, Sparkles, Store } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ProductIcon from "@/components/ProductIcon";

export default function Dashboard() {
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);
  const [marketIndexData, setMarketIndexData] = useState<any[]>([]);
  const [avgGrowth, setAvgGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      setPinnedProducts([]);
      setIsLoading(false);
      return;
    }

    // Fetch products and pinned IDs
    Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/user/pins").then(res => res.json())
    ])
    .then(async ([allProducts, pinnedIds]) => {
      if (Array.isArray(allProducts) && Array.isArray(pinnedIds)) {
        const pinned = allProducts.filter(p => pinnedIds.includes(p.id));
        
        // Fetch detailed chart data for each pinned product
        const detailPromises = pinned.map(p => 
          fetch(`/api/product/${encodeURIComponent(p.id)}`).then(res => res.json())
        );
        
        const details = await Promise.all(detailPromises);
        
        const pinnedWithDetails = pinned.map(p => {
          const detail = details.find(d => d.id === p.id);
          return {
            ...p,
            chartData: detail?.chartData || []
          };
        });
        
        setPinnedProducts(pinnedWithDetails);

        // Calculate O'rtacha o'sish (Average Growth)
        if (pinnedWithDetails.length > 0) {
          const totalGrowth = pinnedWithDetails.reduce((sum, p) => sum + (p.changePercent || 0), 0);
          setAvgGrowth(totalGrowth / pinnedWithDetails.length);
        }

        // Calculate Bozor Dinamikasi (Market Dynamics Index)
        calculateMarketIndex(pinnedWithDetails);
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [session]);

  const calculateMarketIndex = (products: any[]) => {
    const dateMap = new Map();
    
    products.forEach(product => {
      if (!product.chartData || product.chartData.length === 0) return;
      
      // Find baseline price (first historical data point)
      const baselinePoint = product.chartData.find((d: any) => d.historical !== undefined);
      const baselinePrice = baselinePoint?.historical || 1; // avoid div by 0
      
      product.chartData.forEach((point: any) => {
        const existing = dateMap.get(point.date) || { sumIndexHistorical: 0, sumIndexForecast: 0, countHistorical: 0, countForecast: 0 };
        
        if (point.historical !== undefined) {
          existing.sumIndexHistorical += (point.historical / baselinePrice) * 100;
          existing.countHistorical += 1;
        }
        if (point.forecastMedian !== undefined) {
          existing.sumIndexForecast += (point.forecastMedian / baselinePrice) * 100;
          existing.countForecast += 1;
        }
        
        dateMap.set(point.date, existing);
      });
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    
    const indexData = sortedDates.map(date => {
      const data = dateMap.get(date);
      // Format date for chart
      const d = new Date(date);
      const formattedDate = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
      
      return {
        date: formattedDate,
        historicalIndex: data.countHistorical > 0 ? parseFloat((data.sumIndexHistorical / data.countHistorical).toFixed(2)) : undefined,
        forecastIndex: data.countForecast > 0 ? parseFloat((data.sumIndexForecast / data.countForecast).toFixed(2)) : undefined,
      };
    });

    setMarketIndexData(indexData);
  };

  const handleUnpin = async (id: string) => {
    if (!session?.user) return;
    // Optimistic UI update
    setPinnedProducts(prev => {
      const newPinned = prev.filter(p => p.id !== id);
      calculateMarketIndex(newPinned);
      return newPinned;
    });

    try {
      await fetch("/api/user/pins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: id })
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate overall market growth from the index (first day vs last forecast day)
  let overallMarketGrowth = 0;
  if (marketIndexData.length > 0) {
    const firstVal = marketIndexData.find(d => d.historicalIndex !== undefined)?.historicalIndex || 100;
    const lastVal = marketIndexData[marketIndexData.length - 1].forecastIndex || marketIndexData[marketIndexData.length - 1].historicalIndex || 100;
    overallMarketGrowth = ((lastVal - firstVal) / firstVal) * 100;
  }

  return (
    <div className="max-w-[1520px] mx-auto space-y-6 sm:space-y-8 font-sans pb-10">
      
      {/* Top Enterprise Header Bar matching BullBird layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Boshqaruv Paneli
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              UZEX Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bozor dinamikasi, mahsulotlar va Amazon Chronos AI prognozlari
          </p>
        </div>

        {/* Right Search & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm glass-input rounded-full text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center glass-pill p-1 rounded-full">
            <button className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-xs transition-all">
              Bugun
            </button>
            <button className="px-3.5 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Haftalik
            </button>
            <button className="px-3.5 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Oylik
            </button>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center px-4.5 py-2 rounded-full text-xs font-bold glass-btn-blue text-white transition-all cursor-pointer"
          >
            + Tovar qo'shish
          </Link>
        </div>
      </div>

      {pinnedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 glass-panel rounded-3xl text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hech qanday mahsulot saqlanmagan</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            O'zingizga kerakli narxlarni kuzatib boring. Dashboardda ko'rish uchun Qidiruv sahifasidan mahsulotlarni qistiring.
          </p>
          <Link href="/search" className="px-6 py-2.5 glass-btn-blue text-white rounded-full text-sm font-bold transition-all">
            Mahsulot qidirish →
          </Link>
        </div>
      ) : (
        <>
          {/* Top 4-Column Micro-Structured Translucent KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* KPI 1 */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/25 flex items-center justify-center shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center">
                  +1 yangi
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Kuzatilayotgan tovarlar
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {pinnedProducts.length}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">ta tovar</span>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/25 flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center ${avgGrowth >= 0 ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-700 border border-rose-500/25'}`}>
                  {avgGrowth >= 0 ? "▲" : "▼"} {Math.abs(avgGrowth).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  O'rtacha o'sish dinamikasi
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {avgGrowth > 0 ? "+" : ""}{avgGrowth.toFixed(1)}%
                  </h2>
                  <span className="text-xs font-normal text-slate-400">(7 kun)</span>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 border border-indigo-500/25 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                  AI Active
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Chronos-T5 AI Modeli
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    7-Kunlik
                  </h2>
                  <span className="text-xs font-semibold text-indigo-600">bashorat</span>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/25 flex items-center justify-center shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full">
                  UZEX Jonli
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Bozor Umumiy Dinamikasi
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${overallMarketGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {overallMarketGrowth > 0 ? "+" : ""}{overallMarketGrowth.toFixed(1)}%
                  </h2>
                  <span className="text-xs font-normal text-slate-400">umumiy</span>
                </div>
              </div>
            </div>

          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Pinned Commodity Cards (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-max">
              {pinnedProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="group glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <ProductIcon name={p.name} category={p.category} size="md" />
                        <div className="min-w-0">
                          <Link 
                            href={`/product/${encodeURIComponent(p.id)}`} 
                            className="text-slate-900 font-bold text-sm hover:text-blue-600 transition-colors truncate block max-w-[210px]" 
                            title={p.name}
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-medium">1 {p.unit || 'birlik'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUnpin(p.id)} 
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1 cursor-pointer" 
                        title="O'chirish"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-baseline justify-between mb-4 mt-2 pt-2 border-t border-white/50">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {p.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 ml-1">UZS</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.changePercent >= 0 ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-700 border border-rose-500/25'}`}>
                        {p.changePercent > 0 ? "+" : ""}{p.changePercent}%
                      </span>
                    </div>

                    {/* Recharts Area for Product */}
                    <div className="h-32 -mx-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={p.chartData?.map((d: any) => ({ ...d, date: new Date(d.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) }))} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`colorHist${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id={`colorFore${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis domain={[0, 'auto']} hide />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '14px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.92)',
                              backdropFilter: 'blur(16px)',
                              border: '1px solid rgba(255, 255, 255, 0.9)', 
                              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                            formatter={(value: any) => [`${Number(value || 0).toLocaleString()} UZS`, 'Narx']}
                          />
                          <Area type="monotone" dataKey="historical" stroke="#2563eb" strokeWidth={2.8} fillOpacity={1} fill={`url(#colorHist${idx})`} connectNulls />
                          <Area type="monotone" dataKey="forecastMedian" stroke="#10b981" strokeWidth={2.8} strokeDasharray="4 4" fillOpacity={1} fill={`url(#colorFore${idx})`} connectNulls />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Card Footer Legend */}
                  <div className="mt-3 pt-3 border-t border-white/50 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mr-1.5 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
                        Tarixiy
                      </span>
                      <span className="flex items-center font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                        Chronos AI
                      </span>
                    </div>
                    <Link
                      href={`/product/${encodeURIComponent(p.id)}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-0.5 transition-transform"
                    >
                      Batafsil →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Bozor Dinamikasi Index (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="glass-panel rounded-3xl p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/50">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Bozor Dinamikasi</h2>
                    <span className="text-xs text-slate-400">Kompozit narxlar indeksi</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 rounded-full shadow-2xs">
                    Jonli Indeks
                  </span>
                </div>

                <div className="h-64 -mx-2 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketIndexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIndexHist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIndexFore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        dy={8}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tickFormatter={(v) => v.toFixed(0)}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '14px', 
                          backgroundColor: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.9)', 
                          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                        formatter={(value: any) => [`${Number(value || 0).toFixed(2)} ball`, 'Bozor Indeksi']}
                      />
                      <Area type="monotone" dataKey="historicalIndex" stroke="#2563eb" strokeWidth={2.8} fillOpacity={1} fill="url(#colorIndexHist)" connectNulls />
                      <Area type="monotone" dataKey="forecastIndex" stroke="#10b981" strokeWidth={2.8} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorIndexFore)" connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-4 border-b border-white/50">
                  <span className="flex items-center font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
                    Hozirgi Indeks
                  </span>
                  <span className="flex items-center font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                    7-kunlik prognoz
                  </span>
                </div>

                <div className="glass-pill p-4 rounded-2xl flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Bozor umumiy tendentsiyasi</p>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className={`text-xl font-black ${overallMarketGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {overallMarketGrowth > 0 ? "+" : ""}{overallMarketGrowth.toFixed(1)}%
                      </span>
                      <span className="text-xs font-semibold text-slate-400">(haftalik o'sish)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
