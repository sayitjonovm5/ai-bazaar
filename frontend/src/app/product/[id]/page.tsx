"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LineChart, Line, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Building2, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import ProductIcon from "@/components/ProductIcon";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", price: "", description: "", contact: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product forecast & history
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/product/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.chartData) {
          setChartData(data.chartData);
        }
        if (data.rawData) {
          // Reverse the data to show newest rows first in the table
          setRawData(data.rawData.slice().reverse());
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  // Fetch suppliers
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/product/${id}/suppliers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuppliers(data);
        }
        setIsLoadingSuppliers(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingSuppliers(false);
      });
  }, [id]);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert("Please sign in to publish an offer.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/product/${id}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      });
      
      if (!res.ok) throw new Error("Failed to post offer");
      
      const newOffer = await res.json();
      setSuppliers(prev => [...prev, newOffer]);
      setNewSupplier({ name: "", price: "", description: "", contact: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const decodedName = typeof id === "string" ? decodeURIComponent(id) : "";

  return (
    <div className="max-w-7xl mx-auto py-6 h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ProductIcon name={decodedName} size="xl" showCategoryHint={true} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{decodedName}</h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered narx tahlili, haftalik prognoz va B2B ta'minotchi takliflari</p>
          </div>
        </div>
        <Link 
          href="/search" 
          className="inline-flex items-center gap-2 self-start md:self-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Barcha mahsulotlar
        </Link>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-8 min-h-0">
        {/* Left Side: Product Forecast & Analysis & Table */}
        <div className="flex-1 overflow-y-auto pr-0 lg:pr-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tarixiy narxlar va kelgusi hafta prognozi</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12}} 
                    domain={[0, 'auto']}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any, name: string) => {
                      if (Array.isArray(value)) return [`${value[0].toLocaleString()} - ${value[1].toLocaleString()}`, 'Prognoz oraliq (Min-Max)'];
                      return [value.toLocaleString(), name === 'historical' ? 'Tarixiy narx' : 'O\'rtacha prognoz'];
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecastRange" 
                    fill="rgba(255, 0, 0, 0.15)" 
                    stroke="none" 
                    connectNulls
                  />
                  <Line 
                    type="monotone" 
                    dataKey="historical" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecastMedian" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }} 
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Raw Data Table Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tarixiy ma'lumotlar jadvallari (Xom ashyo)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Sana (Date)</th>
                    <th className="px-4 py-3">Kategoriya</th>
                    <th className="px-4 py-3">Joriy narx (UZS)</th>
                    <th className="px-4 py-3">Trend</th>
                    <th className="px-4 py-3">O'zgarish (UZS)</th>
                    <th className="px-4 py-3">O'zgarish (%)</th>
                    <th className="px-4 py-3">Davr</th>
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.Date}</td>
                      <td className="px-4 py-3">{row.Category}</td>
                      <td className="px-4 py-3">{Number(row.Current_Price).toLocaleString()}</td>
                      <td className={`px-4 py-3 font-bold ${row.Trend === '▲' ? 'text-green-600' : row.Trend === '▼' ? 'text-red-600' : 'text-gray-400'}`}>{row.Trend}</td>
                      <td className="px-4 py-3">{Number(row.Price_Change).toLocaleString()}</td>
                      <td className="px-4 py-3">{row.Price_Change_Percent}%</td>
                      <td className="px-4 py-3 text-xs">{row.Period}</td>
                    </tr>
                  ))}
                  {rawData.length === 0 && (
                     <tr>
                       <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                         Ma'lumot topilmadi
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Supplier Marketplace */}
        <div className="w-full lg:w-96 flex flex-col bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden lg:shrink-0 max-h-[800px]">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">B2B Ta'minotchilar</h3>
            <button 
              onClick={() => {
                if (!session?.user) {
                  alert("Taklif kiritish uchun tizimga kiring.");
                  return;
                }
                setShowAddForm(!showAddForm);
              }}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Do'koningizni ro'yxatdan o'tkazish"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {showAddForm && (
              <form onSubmit={handleAddSupplier} className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Taklif Kiritish</h4>
                <input 
                  required
                  placeholder="Do'kon / Kompaniya nomi" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                />
                <input 
                  required
                  type="number"
                  placeholder="Sizning narxingiz (UZS)" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.price}
                  onChange={e => setNewSupplier({...newSupplier, price: e.target.value})}
                />
                <input 
                  required
                  placeholder="Aloqa uchun raqam (masalan: +998...)" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.contact}
                  onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
                />
                <textarea 
                  required
                  placeholder="Yetkazib berish shartlari, izoh..." 
                  className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  value={newSupplier.description}
                  onChange={e => setNewSupplier({...newSupplier, description: e.target.value})}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-2 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Taklifni E'lon Qilish"}
                </button>
              </form>
            )}

            {isLoadingSuppliers ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : suppliers.length === 0 && !showAddForm ? (
              <div className="text-center py-10 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm">Hozircha ta'minotchilar yo'q.</p>
                <p className="text-xs mt-1">Birinchi bo'lib taklifingizni qoldiring!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suppliers.map((sup: any) => (
                  <div key={sup.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{sup.companyName || sup.name}</h4>
                      <span className="font-semibold text-emerald-600">{Number(sup.price).toLocaleString()} UZS</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{sup.description}</p>
                    <a href={`tel:${sup.contact}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                      <Phone className="h-3 w-3 mr-1.5" />
                      {sup.contact}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
