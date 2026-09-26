"use client";

import { useState, useEffect } from "react";
import ProductRow from "@/components/ProductRow";
import { Search as SearchIcon, Loader2, HelpCircle, List, LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";
import ProductIcon from "@/components/ProductIcon";
import { useProductView } from "@/lib/use-product-view";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showSpot, setShowSpot] = useState(true);
  const [showForvard, setShowForvard] = useState(true);
  const [displayCount, setDisplayCount] = useState(60);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);
  const [view, setView] = useProductView();
  
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

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(60);
  }, [searchTerm, selectedCategory, showSpot, showForvard]);

  const handlePinToggle = async (id: string) => {
    if (!session?.user) {
      alert("Mahsulotlarni qistirish uchun tizimga kiring.");
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
      const isContractAllowed = (p.contractType === 'Spot' && showSpot) || (p.contractType === 'Forvard' && showForvard);
      return matchesSearch && matchesCategory && isContractAllowed;
    }) : [];

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mahsulotlar Qidiruvi</h1>
          <p className="text-slate-500 text-sm mt-1">UZEX haftalik byulletenidagi barcha tovar va xomashyolar</p>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-white/70 rounded-2xl leading-5 bg-white/65 backdrop-blur-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 sm:text-sm shadow-2xs transition-all"
          placeholder="Nomi yoki toifasi bo'yicha qidirish (masalan: Avtobenzin, Sement, Armatura)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Pills with Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.value
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white/60 backdrop-blur-md text-slate-700 hover:bg-white/80 border border-white/60"
            }`}
          >
            {cat.value !== "All" && (
              <ProductIcon category={cat.value} size="xs" />
            )}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contract Type Toggles and View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={showSpot} onChange={() => setShowSpot(!showSpot)} />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 select-none">Spot tovarlarni ko'rsatish</span>
            <div className="relative flex items-center">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 outline-none" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                Spot - Darhol (shu zahoti) yetkazib beriladigan tovarlar. Odatdagi bozor narxlari.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={showForvard} onChange={() => setShowForvard(!showForvard)} />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 select-none">Forvard tovarlarni ko'rsatish</span>
            <div className="relative flex items-center">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 outline-none" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                Forvard - Kelajakda belgilangan muddatda yetkazib beriladigan tovarlar (narxi oldindan qulflanadi).
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </label>
        </div>

        {/* View Switcher: List vs Grid / Tiles */}
        <div
          role="group"
          aria-label="Mahsulotlar ko'rinishi"
          className="flex items-center gap-1 p-1 bg-white/75 backdrop-blur-md border border-white/60 rounded-xl shadow-2xs"
        >
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === "list"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Ro'yxat
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === "grid"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kataklar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Results counter */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
          <p>
            {isLoading ? (
              "Mahsulotlar yuklanmoqda..."
            ) : (
              <>
                <span className="font-bold text-slate-900">
                  {filteredProducts.length.toLocaleString("uz-UZ")}
                </span>{" "}
                ta mahsulot{searchTerm && " topildi"}
              </>
            )}
          </p>
          {!isLoading && filteredProducts.length > 0 && (
            <p>
              {Math.min(displayedProducts.length, filteredProducts.length)} / {filteredProducts.length.toLocaleString("uz-UZ")} ko'rsatilmoqda
            </p>
          )}
        </div>

        {/* List Header - only in list view */}
        {view === "list" && !isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <div className="flex-1">Mahsulot Nomi</div>
            <div className="w-24 shrink-0">O'lchov</div>
            <div className="w-32 shrink-0 text-right pr-4">Narx (Joriy)</div>
            <div className="w-24 shrink-0 flex justify-end pr-4">O'zgarish</div>
            <div className="w-32 shrink-0 text-center">Grafik</div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p>Bozor ma'lumotlari yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
              {displayedProducts.map((product) => (
                <ProductRow 
                  key={product.id}
                  {...product}
                  view={view}
                  isPinned={pinnedIds.includes(product.id)}
                  onPinToggle={handlePinToggle}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                "{searchTerm}" uchun mahsulot topilmadi
              </div>
            )}
            
            {filteredProducts.length > displayCount && (
              <div className="flex justify-center mt-8 mb-4">
                <button 
                  onClick={() => setDisplayCount(prev => prev + 60)}
                  className="px-6 py-2.5 bg-white/60 hover:bg-white/90 border border-white/70 text-slate-700 font-semibold rounded-xl shadow-2xs backdrop-blur-md transition-all cursor-pointer"
                >
                  Yana ko'rsatish ({filteredProducts.length - displayCount} ta qoldi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

