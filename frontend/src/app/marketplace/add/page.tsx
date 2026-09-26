"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Plus, ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/lib/currency-context";
import { MARKETPLACE_CATEGORIES, inferCategoryFromName } from "@/lib/product-categories";

interface LiteProduct {
  name: string;
  category: string;
}

export default function AddOfferPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { rate, currency } = useCurrency();

  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<LiteProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Yoqilg'i",
    "Metallurgiya",
    "Qurilish materiallari",
    "Qishloq xo'jaligi va oziq-ovqat",
    "Kimyoviy moddalar",
    "Polimerlar va plastmassa",
    "Boshqa",
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    productName: "",
    companyName: "",
    price: "",
    description: "",
    phoneNumber: "",
    email: "",
    whatsapp: "",
    instagram: "",
    telegram: "",
    imageUrl: "",
  });

  const [showMoreContact, setShowMoreContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch lightweight products list once (uses in-memory server cache)
  useEffect(() => {
    fetch("/api/products?lite=true")
      .then((res) => {
        if (!res.ok) throw new Error("Mahsulotlarni yuklab bo‘lmadi.");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Mahsulotlarni yuklab bo‘lmadi.");
        setProducts(data);
        setProductsLoading(false);

        // Extract distinct categories
        const cats = Array.from(
          new Set(data.map((p: LiteProduct) => p.category).filter(Boolean)),
        ) as string[];
        if (cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch(() => {
        setProductsLoading(false);
        setError("Mahsulotlarni yuklab bo‘lmadi. Sahifani yangilang.");
      });
  }, []);

  // Categories matching search query
  const matchedCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  // Fast memoized product filtering
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = !selectedCategory || p.category === selectedCategory;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // DOM virtualization slice (prevents rendering 15,000 DOM elements and browser freezing)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, 50);
  }, [filteredProducts]);

  // Calculate live USD price conversion
  const convertedUsdPrice = useMemo(() => {
    const num = parseFloat(formData.price);
    if (!num || isNaN(num) || !rate || rate <= 0) return null;
    return (num / rate).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [formData.price, rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.productName ||
      !formData.companyName ||
      !formData.price ||
      !formData.phoneNumber
    ) {
      setError("Iltimos barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/product/${encodeURIComponent(formData.productName)}/suppliers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, name: formData.companyName }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Taklif qo‘shishda xatolik yuz berdi");
      }

      router.push("/marketplace");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Taklifni saqlab bo‘lmadi.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link
        href="/marketplace"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md border border-white/70 shadow-2xs transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Orqaga qaytish
      </Link>

      <div className="bg-white/75 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Yangi taklif qo'shish</h1>
        <p className="text-slate-500 mb-8">
          O'z mahsulotingizni B2B maydonchasiga tez va oson joylang.
        </p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 p-4 rounded-xl mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kompaniya nomi *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs"
              placeholder="Masalan: MCHJ Agro Impex"
            />
          </div>

          {/* Product & Category Selector with Fast Instant Search */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mahsulotni tanlang *
            </label>
            <div
              className="w-full p-3 border border-white/70 rounded-xl bg-white/60 backdrop-blur-md cursor-pointer flex justify-between items-center transition-all shadow-2xs hover:bg-white/80"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={
                    formData.productName
                      ? "text-slate-900 font-medium"
                      : "text-slate-400"
                  }
                >
                  {formData.productName || "Mahsulot yoki kategoriyani qidiring..."}
                </span>
                {formData.productName && (
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    {inferCategoryFromName(formData.productName)}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-xl max-h-96 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Search Input for Category or Product */}
                <div className="p-3 border-b border-white/60 bg-white/50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Mahsulot yoki kategoriya nomi bilan qidiring..."
                      className="w-full pl-9 pr-4 p-2.5 bg-slate-100/70 border border-white/60 rounded-xl outline-none text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Matching category quick-jump chips if user typed category name */}
                  {searchQuery.trim() && matchedCategories.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[11px] font-medium text-slate-400">
                        Topilgan kategoriyalar:
                      </span>
                      {matchedCategories.slice(0, 3).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSearchQuery("");
                          }}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-all ${
                            selectedCategory === cat
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Selection Tabs */}
                <div className="flex border-b border-white/60 overflow-x-auto p-2 gap-1.5 bg-slate-50/50 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                      !selectedCategory
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white/70 text-slate-600 hover:bg-white border border-slate-200/50"
                    }`}
                  >
                    Barchasi ({products.length})
                  </button>
                  {categories.map((c) => {
                    const count = products.filter((p) => p.category === c).length;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedCategory(c === selectedCategory ? "" : c)}
                        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                          selectedCategory === c
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white/70 text-slate-600 hover:bg-white border border-slate-200/50"
                        }`}
                      >
                        <span>{c}</span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              selectedCategory === c
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Product List with Instant Render */}
                <div className="overflow-y-auto p-2 max-h-56 divide-y divide-slate-100/50">
                  {productsLoading ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      Mahsulotlar yuklanmoqda...
                    </div>
                  ) : (
                    <>
                      {/* Allow custom product name if query has no exact match */}
                      {searchQuery.trim() && (
                        <div
                          className="p-2.5 mb-1 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/60 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, productName: searchQuery.trim() });
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-xs text-blue-700">
                              "{searchQuery.trim()}" nomli mahsulot sifatida tanlash
                            </span>
                          </div>
                          <span className="text-[10px] bg-blue-200/60 text-blue-800 px-2 py-0.5 rounded-md font-medium">
                            Yangi mahsulot
                          </span>
                        </div>
                      )}

                      {displayedProducts.map((p) => {
                        const isSelected = formData.productName === p.name;
                        return (
                          <div
                            key={p.name}
                            className={`p-2.5 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                              isSelected
                                ? "bg-blue-50 text-blue-900 font-semibold"
                                : "hover:bg-slate-100/70 text-slate-800"
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, productName: p.name });
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="text-sm font-medium">{p.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 bg-white/80 border border-slate-200/60 px-2 py-0.5 rounded-md">
                                {p.category}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                          </div>
                        );
                      })}

                      {filteredProducts.length > 50 && (
                        <div className="p-2 text-center text-xs text-slate-400 font-medium">
                          Yana {filteredProducts.length - 50} ta mahsulot mavjud. Qidiruv orqali aniqlashtiring.
                        </div>
                      )}

                      {filteredProducts.length === 0 && !searchQuery.trim() && (
                        <div className="p-6 text-center text-slate-400 text-sm">
                          Ushbu kategoriyada mahsulot topilmadi
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price with Live Currency Conversion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Narxi (UZS) *
              </label>
              {convertedUsdPrice && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  ≈ ${convertedUsdPrice} USD (CBU kursi)
                </span>
              )}
            </div>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs font-mono"
              placeholder="Masalan: 9350000"
            />
            {rate && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                Markaziy Bank kursi: 1 USD = {rate.toLocaleString("uz-UZ")} UZS. Saytda valyutani USD ga o'zgartirganda narx avtomatik konvertatsiya qilinadi.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tavsif</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs"
              placeholder="Mahsulot hajmi, yetkazib berish shartlari va to'lov turi haqida ma'lumot..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mahsulot rasmi</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const data = new FormData();
                  data.append("file", file);
                  try {
                    const res = await fetch("/api/upload", { method: "POST", body: data });
                    const resData = await res.json();
                    if (resData.success) {
                      setFormData({ ...formData, imageUrl: resData.url });
                    } else {
                      alert(resData.error || "Rasm yuklashda xatolik");
                    }
                  } catch {
                    alert("Rasm yuklashda xatolik");
                  }
                }
              }}
              className="w-full p-2 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 text-slate-900 transition-all shadow-2xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.imageUrl && (
              <div className="mt-3 w-32 h-32 rounded-xl border border-slate-200 overflow-hidden relative shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="border-t border-white/60 pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Aloqa ma'lumotlari</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Telefon raqam *
              </label>
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs"
                placeholder="+998 90 123 45 67"
              />
            </div>

            {!showMoreContact ? (
              <button
                type="button"
                onClick={() => setShowMoreContact(true)}
                className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Boshqa aloqa vositalarini qo'shish
              </button>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800"
                    placeholder="Sizning email manzilingiz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800"
                    placeholder="@username"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-600/90 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20 backdrop-blur-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saqlanmoqda..." : "Taklifni joylash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
