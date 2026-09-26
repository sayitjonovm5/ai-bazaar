"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, DollarSign, Coins, RefreshCw } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useCurrency, type Currency } from "@/lib/currency-context";
import { MARKETPLACE_CATEGORIES } from "@/lib/product-categories";
import CurrencyToggle from "@/components/CurrencyToggle";

function FilterBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency, setCurrency, rate, isLoadingRate } = useCurrency();

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "All";

  const [searchVal, setSearchVal] = useState(currentQ);

  useEffect(() => {
    setSearchVal(currentQ);
  }, [currentQ]);

  const updateFilters = (newQ?: string, newCat?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const q = newQ !== undefined ? newQ : searchVal;
    const cat = newCat !== undefined ? newCat : currentCategory;

    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }

    if (cat && cat !== "All") {
      params.set("category", cat);
    } else {
      params.delete("category");
    }

    const queryStr = params.toString();
    router.push(queryStr ? `/marketplace?${queryStr}` : "/marketplace");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchVal);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    updateFilters("");
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Top search & Currency toggle row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Mahsulot, kategoriya yoki yetkazib beruvchini qidiring..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/25 transition-all text-sm text-slate-800 placeholder-slate-400"
          />
          {searchVal && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Currency Switcher Pill for Marketplace */}
        <CurrencyToggle />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const isSelected = currentCategory === cat;
          const label = cat === "All" ? "Barchasi" : cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => updateFilters(undefined, cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white shadow-sm scale-[1.02]"
                  : "bg-white/60 text-slate-600 hover:bg-white/90 hover:text-slate-900 border border-white/70 shadow-2xs"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MarketplaceFilterBar() {
  return (
    <Suspense fallback={<div className="h-20 w-full animate-pulse bg-white/40 rounded-2xl mt-6" />}>
      <FilterBarContent />
    </Suspense>
  );
}
