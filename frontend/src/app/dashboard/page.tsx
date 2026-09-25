"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, TrendingUp, Package, Calendar, MoreHorizontal } from "lucide-react";
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bosh sahifa</h1>
        <p className="text-gray-500 mt-1">Bozor dinamikasi, mahsulotlar va prognozlar — barchasi bir joyda.</p>
      </div>

      {pinnedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Hech qanday mahsulot saqlanmagan</h3>
          <p className="text-gray-500 mb-6 text-center max-w-sm">
            O'zingizga kerakli narxlarni kuzatib boring. Dashboardda ko'rish uchun Qidiruv sahifasidan mahsulotlarni qistiring.
          </p>
          <Link href="/search" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Mahsulot qidirish
          </Link>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Jamoa Mahsulotlar</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold text-gray-900">{pinnedProducts.length}</h2>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+1 yangi</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-10">
                {/* Decorative mini sparkline */}
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-blue-500 fill-none" strokeWidth="2">
                  <path d="M0 25 Q 25 15, 50 20 T 100 5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">O'rtacha o'sish</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {avgGrowth > 0 ? "+" : ""}{avgGrowth.toFixed(1)}%
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">(so'nggi 7 kun)</p>
                </div>
              </div>
              <div className="w-20 h-10">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-blue-500 fill-none" strokeWidth="2">
                  <path d="M0 25 L 20 20 L 40 22 L 60 15 L 80 10 L 100 5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Product Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start auto-rows-max">
              {pinnedProducts.map((p, idx) => (
                <div key={p.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <ProductIcon name={p.name} category={p.category} size="md" />
                      <div className="min-w-0">
                        <Link href={`/product/${encodeURIComponent(p.id)}`} className="text-gray-900 font-semibold hover:text-blue-600 truncate block max-w-[190px]" title={p.name}>
                          {p.name}
                        </Link>
                        <p className="text-xs text-gray-400">{p.unit || 'birlik'}</p>
                      </div>
                    </div>
                    <button onClick={() => handleUnpin(p.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="O'chirish">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {p.currentPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">uzs</span>
                    </h2>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${p.changePercent >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {p.changePercent > 0 ? "+" : ""}{p.changePercent}%
                    </span>
                  </div>

                  {/* Recharts Area for Product */}
                  <div className="h-32 -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={p.chartData?.map((d: any) => ({ ...d, date: new Date(d.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) }))} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`colorHist${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id={`colorFore${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis domain={[0, 'auto']} hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [`${value.toLocaleString()} UZS`, 'Narx']}
                        />
                        <Area type="monotone" dataKey="historical" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill={`url(#colorHist${idx})`} connectNulls />
                        <Area type="monotone" dataKey="forecastMedian" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill={`url(#colorFore${idx})`} connectNulls />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-xs">
                    <div className="flex items-center space-x-3 text-gray-500">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div> Hozirgi</span>
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div> Prognoz (7 kun)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      7 kun prognoz
                    </div>
                    <div className="flex items-center text-green-600 font-medium">
                      +{(Math.random() * 3 + 0.1).toFixed(1)}%
                      <svg viewBox="0 0 40 15" className="w-8 h-3 ml-2 stroke-green-500 fill-none" strokeWidth="2">
                        <path d="M0 10 L 10 5 L 20 8 L 30 2 L 40 5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Bozor Dinamikasi */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bozor dinamikasi</h2>
                
                <div className="flex space-x-2 mb-6">
                  <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full">7 kun</button>
                  <button className="px-4 py-1.5 text-gray-500 text-sm font-medium rounded-full hover:bg-gray-50">30 kun</button>
                  <button className="px-4 py-1.5 text-gray-500 text-sm font-medium rounded-full hover:bg-gray-50">90 kun</button>
                </div>

                <div className="h-64 -mx-2 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketIndexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIndexHist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIndexFore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9ca3af'}}
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tickFormatter={(v) => v.toFixed(0)}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value.toFixed(2)} ball`, 'Bozor Indeksi']}
                      />
                      <Area type="monotone" dataKey="historicalIndex" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIndexHist)" connectNulls />
                      <Area type="monotone" dataKey="forecastIndex" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorIndexFore)" connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-8 border-b border-gray-100 pb-6">
                  <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div> Hozirgi Index</span>
                  <span className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div> Prognoz (7 kun)</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bozor umumiy o'sishi</p>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className={`text-lg font-bold ${overallMarketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {overallMarketGrowth > 0 ? "+" : ""}{overallMarketGrowth.toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-400">(so'nggi 7 kun)</span>
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
