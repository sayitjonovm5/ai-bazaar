"use client";
import { useState, useEffect, useRef } from "react";
import ProductRow from "@/components/ProductRow";
import {
  Search,
  LayoutGrid,
  List,
  X,
  PackageSearch,
  ChevronDown,
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
];
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const inFlight = useRef(new Set<string>());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [view, changeView] = useProductView();
  const [visibleCount, setVisibleCount] = useState(60);
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

  async function handlePinToggle(id: string) {
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
  }
  const query = searchTerm.trim().toLocaleLowerCase();
  const matches = products.filter(
    (p) =>
      (p.name.toLocaleLowerCase().includes(query) ||
        (p.category || "").toLocaleLowerCase().includes(query)) &&
      (selectedCategory === "All" || p.category === selectedCategory),
  );
  const visible = matches.slice(0, visibleCount);
  return (
    <div className="page-shell">
      <header className="page-heading">
        <div className="eyebrow">UZEX · Tovar va xomashyo</div>
        <h1>Mahsulotlar qidiruvi</h1>
        <p>
          Bozor narxlarini solishtiring, o‘zgarishlarni kuzating va kerakli
          mahsulotlarni saqlang.
        </p>
      </header>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          aria-label="Mahsulot nomi yoki toifasi bo‘yicha qidirish"
          className="form-input h-[52px] pl-12 pr-12 shadow-sm [&::-webkit-search-cancel-button]:hidden"
          placeholder="Mahsulot nomi yoki toifasi bo‘yicha qidirish..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(60);
          }}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setVisibleCount(60);
            }}
            aria-label="Qidiruvni tozalash"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div
        className="mb-5 flex items-center gap-2 overflow-x-auto pb-3 pt-1"
        role="group"
        aria-label="Mahsulot toifasi"
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            aria-pressed={selectedCategory === cat.value}
            onClick={() => {
              setSelectedCategory(cat.value);
              setVisibleCount(60);
            }}
            className={
              "flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-medium " +
              (selectedCategory === cat.value
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-gray-50")
            }
          >
            {cat.value !== "All" && (
              <ProductIcon category={cat.value} size="xs" />
            )}
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-gray-500">
          {isLoading ? (
            "Mahsulotlar yuklanmoqda..."
          ) : (
            <>
              <span className="font-semibold text-gray-900">
                {matches.length.toLocaleString("uz-UZ")}
              </span>{" "}
              ta mahsulot{query && " topildi"}
            </>
          )}
        </p>
        <div
          role="group"
          aria-label="Mahsulotlar ko‘rinishi"
          className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1"
        >
          <button
            onClick={() => changeView("list")}
            aria-pressed={view === "list"}
            className={
              "flex min-h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium " +
              (view === "list"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:bg-gray-50")
            }
          >
            <List size={16} />
            Ro‘yxat
          </button>
          <button
            onClick={() => changeView("grid")}
            aria-pressed={view === "grid"}
            className={
              "flex min-h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium " +
              (view === "grid"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:bg-gray-50")
            }
          >
            <LayoutGrid size={16} />
            Kataklar
          </button>
        </div>
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
          role="status"
          aria-label="Mahsulotlar yuklanmoqda"
          className={view === "grid" ? "product-grid" : "space-y-2"}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={"surface p-5 " + (view === "grid" ? "h-64" : "h-20")}
            >
              <div className="skeleton mb-3 h-3 w-2/3" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="surface empty-state">
          <PackageSearch />
          <h2>Mahsulot topilmadi</h2>
          <p>Boshqa nom kiriting yoki toifa filtrini o‘zgartirib ko‘ring.</p>
          <button
            className="button-secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setVisibleCount(60);
            }}
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <>
          {view === "list" && (
            <div className="product-list-columns px-4 pb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              <span>Mahsulot</span>
              <span className="product-list-unit">O‘lchov</span>
              <span className="text-right">Joriy narx</span>
              <span className="product-list-change text-right">O‘zgarish</span>
              <span className="product-list-chart text-center">
                Narx tarixi
              </span>
            </div>
          )}
          <div
            className={view === "grid" ? "product-grid" : "space-y-2"}
            aria-label={
              view === "grid" ? "Mahsulotlar kataklari" : "Mahsulotlar ro‘yxati"
            }
          >
            {visible.map((product) => (
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
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500">
              {matches.length.toLocaleString("uz-UZ")} ta mahsulotdan{" "}
              {visible.length} tasi ko‘rsatilmoqda
            </p>
            {visible.length < matches.length && (
              <button
                onClick={() => setVisibleCount((c) => c + 60)}
                className="button-secondary"
              >
                Ko‘proq ko‘rsatish
                <ChevronDown size={15} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
