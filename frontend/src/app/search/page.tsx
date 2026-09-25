"use client";

import { useState, useEffect } from "react";
import ProductRow from "@/components/ProductRow";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import ProductIcon from "@/components/ProductIcon";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { label: "Barchasi", value: "All" },
    { label: "Yoqilg'i", value: "Yoqilg'i" },
    { label: "Metallurgiya", value: "Metallurgiya" },
    { label: "Qurilish", value: "Qurilish materiallari" },
    { label: "Oziq-ovqat / Qishloq", value: "Qishloq xo'jaligi va oziq-ovqat" },
    { label: "Kimyoviy", value: "Kimyoviy moddalar" },
    { label: "Polimerlar", value: "Polimerlar va plastmassa" },
  ];
  
  const { data: session } = useSession();

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

  // Fetch pinned product IDs from DB
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/pins")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPinnedIds(data);
            const pinned = products.filter(p => data.includes(p.id));
            setPinnedProducts(pinned);
          }
        })
        .catch(console.error);
    } else {
      setPinnedIds([]);
      setPinnedProducts([]);
    }
  }, [session, products]);

  const handlePinToggle = async (id: string) => {
    if (!session?.user) {
      alert("Please sign in to pin products.");
      return;
    }

    const isCurrentlyPinned = pinnedIds.includes(id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    let updatedProducts;
    if (isCurrentlyPinned) {
      updatedProducts = pinnedProducts.filter(p => p.id !== id);
      setPinnedIds(prev => prev.filter(pId => pId !== id));
    } else {
      updatedProducts = [...pinnedProducts, product];
      setPinnedIds(prev => [...prev, id]);
    }

    setPinnedProducts(updatedProducts);

    try {
      if (isCurrentlyPinned) {
        await fetch("/api/user/pins", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: id })
        });
      } else {
        await fetch("/api/user/pins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: id })
        });
      }
    } catch (err) {
      console.error(err);
      // Revert optimistic update omitted for brevity
    }
  };

  const filteredProducts = Array.isArray(products) ? products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .slice(0, 60) : []; // Show top 60 results

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mahsulotlar Qidiruvi</h1>
          <p className="text-gray-500 text-sm mt-1">UZEX haftalik byulletenidagi barcha tovar va xomashyolar</p>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          placeholder="Nomi yoki toifasi bo'yicha qidirish (masalan: Avtobenzin, Sement, Armatura)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Pills with Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedCategory === cat.value
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {cat.value !== "All" && (
              <ProductIcon category={cat.value} size="xs" />
            )}
            {cat.label}
          </button>
        ))}
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
