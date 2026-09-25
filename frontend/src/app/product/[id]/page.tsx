"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Building2, Phone } from "lucide-react";

// Mock data matching the Python Streamlit logic:
// Historical data for past periods, plus one 'next week' forecast point with min, median, max.
const chartData = [
  { date: "2024-07-05", historical: 9100000 },
  { date: "2024-07-12", historical: 9150000 },
  { date: "2024-07-19", historical: 9120000 },
  { date: "2024-07-26", historical: 9200000 },
  { date: "2024-08-02", historical: 9250000 },
  { date: "2024-08-09", historical: 9280000 },
  { date: "2024-08-16", historical: 9270000 },
  { date: "2024-08-23", historical: 9300000 },
  { date: "2024-08-30", historical: 9350000 },
  { date: "2024-09-06", historical: 9354321, forecastMedian: 9354321, forecastRange: [9354321, 9354321] }, // Connects history to forecast
  { date: "2024-09-13", forecastMedian: 9450000, forecastRange: [9300000, 9600000] }, // Next week's forecast (Min-Max range)
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([
    // Initially empty per requirements, but let's allow them to add
  ]);
  const [newSupplier, setNewSupplier] = useState({ name: "", price: "", description: "", contact: "" });

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    setSuppliers([...suppliers, { ...newSupplier, id: Date.now() }]);
    setNewSupplier({ name: "", price: "", description: "", contact: "" });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Product Details (Mock {id})</h1>
        <p className="text-gray-500 mt-2">AI-powered forecast & supplier marketplace</p>
      </div>

      <div className="flex flex-1 gap-8 h-full min-h-0">
        {/* Left Side: Product Forecast & Analysis */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Prices & Next Week Forecast</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12}} 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any, name: string) => {
                      if (Array.isArray(value)) return [`${value[0].toLocaleString()} - ${value[1].toLocaleString()}`, 'Forecast Margin (Min-Max)'];
                      return [value.toLocaleString(), name === 'historical' ? 'Historical Price' : 'Average Forecast'];
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecastRange" 
                    fill="rgba(255, 0, 0, 0.15)" 
                    stroke="none" 
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
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-1">AI Analyst Insight</h4>
              <p className="text-blue-800 text-sm">
                Based on historical trends and recent supply indicators, the price for this product is expected to slightly increase over the next week. We recommend securing current offers if your margin allows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Supplier Marketplace */}
        <div className="w-96 flex flex-col bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">B2B Sources</h3>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="List your store"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {showAddForm && (
              <form onSubmit={handleAddSupplier} className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">List Your Offer</h4>
                <input 
                  required
                  placeholder="Store / Company Name" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                />
                <input 
                  required
                  type="number"
                  placeholder="Your Price (UZS)" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.price}
                  onChange={e => setNewSupplier({...newSupplier, price: e.target.value})}
                />
                <input 
                  required
                  placeholder="Contact Number (e.g. +998...)" 
                  className="w-full mb-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSupplier.contact}
                  onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
                />
                <textarea 
                  required
                  placeholder="Delivery terms, description..." 
                  className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  value={newSupplier.description}
                  onChange={e => setNewSupplier({...newSupplier, description: e.target.value})}
                />
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Publish Offer
                </button>
              </form>
            )}

            {suppliers.length === 0 && !showAddForm ? (
              <div className="text-center py-10 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm">No suppliers listed yet.</p>
                <p className="text-xs mt-1">Be the first to list your offer!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suppliers.map((sup: any) => (
                  <div key={sup.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{sup.name}</h4>
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
