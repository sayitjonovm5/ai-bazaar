"use client";

import { useState, useEffect } from "react";
import ProductRow from "@/components/ProductRow";
import { Search as SearchIcon } from "lucide-react";

// Mock data based on your CSV
const mockProducts = [
  {
    id: "prod-1",
    name: "Avtobenzin A-80",
    category: "Yoqilg'i",
    unit: "litr",
    currentPrice: 9354321,
    changePercent: 0.7,
    historicalPrices: [9200000, 9250000, 9300000, 9354321, 9354321, 9300000, 9354321],
  },
  {
    id: "prod-2",
    name: "Avtobenzin A-91 K2-L",
    category: "Yoqilg'i",
    unit: "litr",
    currentPrice: 12306172,
    changePercent: -2.0,
    historicalPrices: [12600000, 12550000, 12500000, 12400000, 12350000, 12300000, 12306172],
  },
  {
    id: "prod-3",
    name: "Portlandsement PS M-500",
    category: "Qurilish materiallari",
    unit: "tonna",
    currentPrice: 997067,
    changePercent: 0.0,
    historicalPrices: [997067, 997067, 997067, 997067, 997067, 997067, 997067],
  },
  {
    id: "prod-4",
    name: "Ugolok stalnoy 50x50x4mm",
    category: "Metall prokat",
    unit: "metr",
    currentPrice: 9691161,
    changePercent: 5.2,
    historicalPrices: [9000000, 9100000, 9300000, 9500000, 9600000, 9650000, 9691161],
  },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pinnedProducts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPinnedProducts(parsed);
        setPinnedIds(parsed.map((p: any) => p.id));
      } catch (e) {}
    }
  }, []);

  const handlePinToggle = (id: string) => {
    const isCurrentlyPinned = pinnedIds.includes(id);
    const product = mockProducts.find(p => p.id === id);
    if (!product) return;

    let updatedProducts;
    if (isCurrentlyPinned) {
      updatedProducts = pinnedProducts.filter(p => p.id !== id);
    } else {
      updatedProducts = [...pinnedProducts, product];
    }

    setPinnedProducts(updatedProducts);
    setPinnedIds(updatedProducts.map(p => p.id));
    localStorage.setItem("pinnedProducts", JSON.stringify(updatedProducts));
  };

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Search</h1>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          placeholder="Search by product name or category (e.g., Avtobenzin, Sement)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between px-4 pb-2 text-sm font-medium text-gray-500">
          <div className="flex-1">Product Name</div>
          <div className="w-24 shrink-0">Unit</div>
          <div className="w-32 shrink-0 text-right pr-4">Price (Current)</div>
          <div className="w-24 shrink-0 flex justify-end pr-4">Change</div>
          <div className="w-32 shrink-0 text-center">Chart</div>
        </div>
        
        {filteredProducts.map((product) => (
          <ProductRow 
            key={product.id}
            {...product}
            isPinned={pinnedIds.includes(product.id)}
            onPinToggle={handlePinToggle}
          />
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
