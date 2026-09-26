"use client";
import { useState, useEffect, useRef } from "react";
import ProductRow from "@/components/ProductRow";
import {
  Search as SearchIcon,
  Loader2,
  HelpCircle,
  X,
  List,
  LayoutGrid,
  PackageSearch,
} from "lucide-react";
import { useSession } from "next-auth/react";
import ProductIcon from "@/components/ProductIcon";
import { ErrorState } from "@/components/MarketFeedback";
import { readJson, type Product } from "@/lib/market-ui";
import toast from "react-hot-toast";
import { useProductView } from "@/lib/use-product-view";

const categories = [
  { label: "Barchasi", value: "All" },
  { label: "Yoqilg‘i", value: "Yoqilg'i" },
  { label: "Metallurgiya", value: "Metallurgiya" },
  { label: "Qurilish", value: "Qurilish materiallari" },
  { label: "Oziq-ovqat / Qishloq", value: "Qishloq xo'jaligi va oziq-ovqat" },
  { label: "Kimyoviy", value: "Kimyoviy moddalar" },
  { label: "Polimerlar", value: "Polimerlar va plastmassa" },
  { label: "Boshqa", value: "Boshqa" },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showSpot, setShowSpot] = useState(true);
  const [showForvard, setShowForvard] = useState(true);
  const [displayCount, setDisplayCount] = useState(60);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const inFlight = useRef(new Set<string>());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useProductView();

  const { data: session } = useSession();

  useEffect(() => {
    const controller = new AbortController();
    readJson<Product[]>("/api/products", { signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid products");
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(
            "Bozor ma’lumotlarini hozir yuklab bo‘lmadi. Qayta urinib ko‘ring.",
          );
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!session?.user) return;
    const controller = new AbortController();
    readJson<string[]>("/api/user/pins", { signal: controller.signal })
      .then((data) => {
        if (Array.isArray(data)) setPinnedIds(data);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          toast.error("Saqlangan mahsulotlarni yuklab bo‘lmadi.");
      });
    return () => controller.abort();
  }, [session]);

  // Reset display count when filters change
  const filterKey = `${searchTerm}|${selectedCategory}|${showSpot}|${showForvard}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setDisplayCount(60);
  }

  const handlePinToggle = async (id: string) => {
    if (!session?.user) {
      toast.error("Mahsulotni saqlash uchun tizimga kiring.");
      return;
    }
    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    const wasPinned = pinnedIds.includes(id);
    setPendingIds((prev) => [...prev, id]);
    setPinnedIds((prev) =>
      wasPinned ? prev.filter((p) => p !== id) : [...prev, id],
    );
    try {
      await readJson("/api/user/pins", {
        method: wasPinned ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: id }),
      });
      toast.success(
        wasPinned
          ? "Mahsulot paneldan olib tashlandi"
          : "Mahsulot asosiy panelga saqlandi",
      );
    } catch {
      setPinnedIds((prev) =>
        wasPinned ? [...prev, id] : prev.filter((p) => p !== id),
      );
      toast.error("O‘zgarish saqlanmadi. Qayta urinib ko‘ring.");
    } finally {
      inFlight.current.delete(id);
      setPendingIds((prev) => prev.filter((p) => p !== id));
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || p.category === selectedCategory;
        const isContractAllowed =
          !p.contractType ||
          (p.contractType === "Spot" && showSpot) ||
          (p.contractType === "Forvard" && showForvard);
        return matchesSearch && matchesCategory && isContractAllowed;
      })
    : [];

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
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            aria-label="Qidiruvni tozalash"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
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
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showSpot}
                onChange={() => setShowSpot(!showSpot)}
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 select-none">
              Spot tovarlarni ko'rsatish
            </span>
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
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showForvard}
                onChange={() => setShowForvard(!showForvard)}
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 select-none">
              Forvard tovarlarni ko'rsatish
            </span>
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

      {/* Results counter */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-500 font-medium">
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

      {error ? (
        <ErrorState
          message={error}
          retry={() => {
            setError("");
            setIsLoading(true);
            setAttempt((a) => a + 1);
          }}
        />
      ) : isLoading ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "space-y-2"
          }
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={
                "animate-pulse bg-white/60 border border-white/70 rounded-2xl p-4 " +
                (view === "grid" ? "h-64" : "h-16")
              }
            >
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-white/60">
          <PackageSearch className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">Mahsulot topilmadi</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            {searchTerm
              ? `"${searchTerm}" bo'yicha hech qanday tovar topilmadi.`
              : "Tanlangan filtrlar bo'yicha mahsulot topilmadi."}{" "}
            Boshqa so'z kiriting yoki filtrlarni tozalang.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setShowSpot(true);
              setShowForvard(true);
              setDisplayCount(60);
            }}
            className="mt-4 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <>
          {view === "list" && (
            <div className="flex items-center justify-between px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div className="flex-1">Mahsulot Nomi</div>
              <div className="w-24 shrink-0">O'lchov</div>
              <div className="w-32 shrink-0 text-right pr-4">Narx (Joriy)</div>
              <div className="w-24 shrink-0 flex justify-end pr-4">O'zgarish</div>
              <div className="w-32 shrink-0 text-center">Grafik</div>
            </div>
          )}

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-2"
            }
          >
            {displayedProducts.map((product) => (
              <ProductRow
                key={product.id}
                {...product}
                view={view}
                isPinned={!!session && pinnedIds.includes(product.id)}
                isPending={pendingIds.includes(product.id)}
                onPinToggle={handlePinToggle}
              />
            ))}
          </div>

          {filteredProducts.length > displayCount && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={() => setDisplayCount((prev) => prev + 60)}
                className="px-6 py-2.5 bg-white/60 hover:bg-white/90 border border-white/70 text-slate-700 font-semibold rounded-xl shadow-2xs backdrop-blur-md transition-all cursor-pointer"
              >
                Yana ko'rsatish ({filteredProducts.length - displayCount} ta qoldi)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
