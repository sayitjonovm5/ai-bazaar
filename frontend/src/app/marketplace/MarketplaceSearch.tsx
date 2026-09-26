"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, Suspense } from "react";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/marketplace');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-96 mt-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input 
        type="text" 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Mahsulot yoki sotuvchi qidiring..."
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
      />
      <button type="submit" className="hidden">Qidirish</button>
    </form>
  );
}

export default function MarketplaceSearch() {
  return (
    <Suspense fallback={<div className="h-12 w-96 bg-gray-100 animate-pulse rounded-xl mt-6"></div>}>
      <SearchInput />
    </Suspense>
  );
}
