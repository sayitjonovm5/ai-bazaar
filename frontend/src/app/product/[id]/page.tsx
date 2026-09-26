"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LineChart, Line, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Building2, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import ProductIcon from "@/components/ProductIcon";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const { data: session } = useSession();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", price: "", description: "", contact: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [productUnit, setProductUnit] = useState(unitParam || "tonna");
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product forecast & history
  useEffect(() => {
    if (!id) return;
    
    const url = unitParam ? `/api/product/${id}?unit=${encodeURIComponent(unitParam)}` : `/api/product/${id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.unit) {
          setProductUnit(data.unit);
        }
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
  }, [id, unitParam]);

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
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to post offer");
      }
      
      setSuppliers(prev => [...prev, data]);
      setNewSupplier({ name: "", price: "", description: "", contact: "", imageUrl: "" });
      setShowAddForm(false);
      setToastMessage("Taklifingiz muvaffaqiyatli qo'shildi va Marketplace bo'limiga yuborildi!");
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const decodedName = typeof id === "string" ? decodeURIComponent(id) : "";

  return (
    <div className="max-w-7xl mx-auto py-6 h-full flex flex-col relative">
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
          <div className="bg-white/20 p-1 rounded-full">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ProductIcon name={decodedName} size="xl" showCategoryHint={true} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{decodedName}</h1>
              {productUnit && (
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                  {productUnit}
                </span>
              )}
            </div>
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
                    <th className="px-4 py-3">O'lchov</th>
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
                      <td className="px-4 py-3 text-xs font-semibold text-blue-600">{row.Unit || productUnit}</td>
                      <td className="px-4 py-3">{Number(row.Current_Price).toLocaleString()}</td>
                      <td className={`px-4 py-3 font-bold ${row.Trend === '▲' ? 'text-green-600' : row.Trend === '▼' ? 'text-red-600' : 'text-gray-400'}`}>{row.Trend}</td>
                      <td className="px-4 py-3">{Number(row.Price_Change).toLocaleString()}</td>
                      <td className="px-4 py-3">{row.Price_Change_Percent}%</td>
                      <td className="px-4 py-3 text-xs">{row.Period}</td>
                    </tr>
                  ))}
                  {rawData.length === 0 && (
                     <tr>
                       <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                         Ma'lumot topilmadi
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        </div>
    </div>
  );
}
