"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductRow from "@/components/ProductRow";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      setPinnedProducts([]);
      setIsLoading(false);
      return;
    }

    Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/user/pins").then(res => res.json())
    ])
    .then(([allProducts, pinnedIds]) => {
      if (Array.isArray(allProducts) && Array.isArray(pinnedIds)) {
        const pinned = allProducts.filter(p => pinnedIds.includes(p.id));
        setPinnedProducts(pinned);
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [session]);

  const handleUnpin = async (id: string) => {
    if (!session?.user) return;
    
    // Optimistic UI update
    setPinnedProducts(prev => prev.filter(p => p.id !== id));

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

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      
      {pinnedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">You don't have any saved products</h3>
          <p className="text-gray-500 mb-6 text-center max-w-sm">
            Keep track of the prices you care about. Pin products from the search page to view them here on your dashboard.
          </p>
          <Link 
            href="/search" 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Find Products
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between px-4 pb-2 text-sm font-medium text-gray-500">
            <div className="flex-1">Product Name</div>
            <div className="w-24 shrink-0">Unit</div>
            <div className="w-32 shrink-0 text-right pr-4">Price (Current)</div>
            <div className="w-24 shrink-0 flex justify-end pr-4">Change</div>
            <div className="w-32 shrink-0 text-center">Chart</div>
          </div>
          {pinnedProducts.map((product) => (
            <ProductRow 
              key={product.id}
              {...product}
              isPinned={true}
              onPinToggle={handleUnpin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
