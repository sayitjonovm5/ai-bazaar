"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, TrendingUp, Package, Calendar, MoreHorizontal, Search, Sparkles, Store } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ProductIcon from "@/components/ProductIcon";
import { useCurrency } from "@/lib/currency-context";
import CurrencyToggle from "@/components/CurrencyToggle";

export default function Dashboard() {
  const { formatPrice, currencyCode, currency, rate } = useCurrency();
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
          <CurrencyToggle size="sm" />

          <div className="relative flex-1 sm:w-64">
            <input 
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white/65 backdrop-blur-xl border border-white/70 rounded-full shadow-2xs focus:outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-2xs">
            <button className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-xs">
              Bugun
            </button>
            <button className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900">
              Haftalik
            </button>
            <button className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900">
              Oylik
            </button>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            + Tovar qo'shish
          </Link>
        </div>
      </div>

      {pinnedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-xs text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hech qanday mahsulot saqlanmagan</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            O'zingizga kerakli narxlarni kuzatib boring. Dashboardda ko'rish uchun Qidiruv sahifasidan mahsulotlarni qistiring.
          </p>
          <Link href="/search" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow-md transition-all">
            Mahsulot qidirish →
          </Link>
        </div>
      ) : (
        <>
          {/* Top 4-Column Micro-Structured Translucent KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* KPI 1 */}
            <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/65 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:bg-white/90 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center">
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
            <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/65 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:bg-white/90 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center ${avgGrowth >= 0 ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-700 border border-rose-500/20'}`}>
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
            <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/65 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:bg-white/90 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-full">
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
            <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/65 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:bg-white/90 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-full">
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
                  className="group bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/65 shadow-xs hover:shadow-lg hover:border-blue-400/50 hover:bg-white/90 transition-all duration-200 flex flex-col justify-between"
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
                    
                    <div className="flex items-baseline justify-between mb-4 mt-2 pt-2 border-t border-slate-100/80">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {formatPrice(p.currentPrice)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 ml-1">{currencyCode}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.changePercent >= 0 ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-700 border border-rose-500/20'}`}>
                        {p.changePercent > 0 ? "+" : ""}{p.changePercent}%
                      </span>
                    </div>

                    {/* Recharts Area for Product */}
                    <div className="h-32 -mx-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={p.chartData?.map((d: any) => ({ ...d, date: new Date(d.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) }))} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`colorHist${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id={`colorFore${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis domain={[0, 'auto']} hide />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '10px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(226, 232, 240, 0.9)', 
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                            formatter={(value: any) => [`${formatPrice(value)} ${currencyCode}`, 'Narx']}
                          />
                          <Area type="monotone" dataKey="historical" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill={`url(#colorHist${idx})`} connectNulls />
                          <Area type="monotone" dataKey="forecastMedian" stroke="#10b981" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill={`url(#colorFore${idx})`} connectNulls />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Card Footer Legend */}
                  <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mr-1.5" />
                        Tarixiy
                      </span>
                      <span className="flex items-center font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
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
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/70 shadow-sm sticky top-4">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100/80">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Bozor Dinamikasi</h2>
                    <span className="text-xs text-slate-400">Kompozit narxlar indeksi</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                    Jonli Indeks
                  </span>
                </div>

                <div className="h-64 -mx-2 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketIndexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIndexHist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIndexFore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                          borderRadius: '10px', 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(226, 232, 240, 0.9)', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                        formatter={(value: any) => [`${Number(value || 0).toFixed(2)} ball`, 'Bozor Indeksi']}
                      />
                      <Area type="monotone" dataKey="historicalIndex" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIndexHist)" connectNulls />
                      <Area type="monotone" dataKey="forecastIndex" stroke="#10b981" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorIndexFore)" connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100/80">
                  <span className="flex items-center font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5" />
                    Hozirgi Indeks
                  </span>
                  <span className="flex items-center font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                    7-kunlik prognoz
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/5 backdrop-blur-md border border-slate-900/5 flex items-center space-x-3.5">
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
