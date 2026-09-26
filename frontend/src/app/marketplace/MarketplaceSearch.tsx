"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, Suspense, useTransition } from "react";
function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [pending, startTransition] = useTransition();

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
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
      <input 
        type="text" 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Mahsulot yoki sotuvchi qidiring..."
        className="w-full pl-10 pr-4 py-2.5 bg-white/65 backdrop-blur-xl border border-white/70 rounded-full shadow-2xs outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 transition-all text-sm text-slate-800 placeholder-slate-400"
      />
      <button type="submit" className="hidden">Qidirish</button>
    </form>
  );
}
export default function MarketplaceSearch() {
  return (
    <Suspense fallback={<div className="skeleton mt-6 h-11 w-full max-w-xl" />}>
      <SearchInput />
    </Suspense>
  );
}
