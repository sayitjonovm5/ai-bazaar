"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, Suspense, useTransition } from "react";
function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() =>
          router.push(
            query.trim()
              ? "/marketplace?q=" + encodeURIComponent(query.trim())
              : "/marketplace",
          ),
        );
      }}
      className="relative mt-6 flex w-full max-w-xl gap-2"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          aria-label="Marketplace takliflarini qidirish"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mahsulot yoki sotuvchi qidiring..."
          className="form-input h-11 pl-10"
        />
      </div>
      <button type="submit" disabled={pending} className="button-primary">
        {pending ? "Qidirilmoqda..." : "Qidirish"}
      </button>
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
