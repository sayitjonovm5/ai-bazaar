"use client";

import { useState, useEffect } from "react";
import ProductRow from "@/components/ProductRow";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live products from CSV via our API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setIsLoading(false);
      });
  }, []);

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
    const product = products.find(p => p.id === id);
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

  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 50); // Show top 50 results to prevent massive DOM updates

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
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p>Loading real market data...</p>
          </div>
        ) : (
          <>
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
            
            {filteredProducts.length === 50 && (
              <div className="text-center py-4 text-sm text-gray-400">
                Showing top 50 results. Please narrow your search.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
