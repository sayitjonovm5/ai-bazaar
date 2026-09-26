"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { type Product } from "@/lib/market-ui";
import { LoadingState } from "@/components/MarketFeedback";

export default function AddOfferPage() {
  const router = useRouter();
  const { status } = useSession();
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  });

  const [showMoreContact, setShowMoreContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Mahsulotlarni yuklab bo‘lmadi.");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data))
          throw new Error("Mahsulotlarni yuklab bo‘lmadi.");
        setProducts(data);
        setProductsLoading(false);
        const cats = Array.from(
          new Set((data as Product[]).map((p) => p.category).filter(Boolean)),
        ) as string[];
        setCategories(cats);
      })
      .catch(() => {
        setProductsLoading(false);
        setError("Mahsulotlarni yuklab bo‘lmadi. Sahifani yangilang.");
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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

      if (!res.ok) throw new Error("Taklif qo‘shishda xatolik yuz berdi");

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
      <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md border border-white/70 shadow-2xs transition-all">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Orqaga qaytish
      </Link>
      
      <div className="bg-white/75 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Yangi taklif qo'shish</h1>
        <p className="text-slate-500 mb-8">O'z mahsulotingizni B2B maydonchasiga joylang.</p>
        
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 p-4 rounded-xl mb-6 backdrop-blur-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kompaniya nomi *</label>
            <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs" placeholder="Masalan: MCHJ Agro" />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mahsulotni tanlang *</label>
            <div 
              className="w-full p-3 border border-white/70 rounded-xl bg-white/60 backdrop-blur-md cursor-pointer flex justify-between items-center transition-all shadow-2xs hover:bg-white/80"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={formData.productName ? "text-slate-900 font-medium" : "text-slate-400"}>
                {formData.productName || "Mahsulot qidiring yoki tanlang"}
              </span>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-xl max-h-80 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-white/60">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Qidirish..." 
                      className="w-full pl-9 p-2 bg-slate-100/70 border border-white/60 rounded-xl outline-none text-sm text-slate-800"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex border-b border-white/60 overflow-x-auto p-2 gap-2">
                  <button type="button" onClick={() => setSelectedCategory("")} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${!selectedCategory ? 'bg-slate-900 text-white shadow-xs' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}>Barchasi</button>
                  {categories.map(c => (
                    <button key={c} type="button" onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${selectedCategory === c ? 'bg-slate-900 text-white shadow-xs' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}>{c}</button>
                  ))}
                </div>
                <div className="overflow-y-auto p-2">
                  {filteredProducts.map(p => (
                    <div 
                      key={p.name} 
                      className="p-3 hover:bg-blue-50/70 rounded-xl cursor-pointer flex justify-between items-center transition-colors"
                      onClick={() => { setFormData({...formData, productName: p.name}); setIsDropdownOpen(false); }}
                    >
                      <span className="font-semibold text-sm text-slate-800">{p.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{p.category}</span>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">Topilmadi</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Narxi (UZS) *</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs" placeholder="Masalan: 15000" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tavsif</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs" placeholder="Mahsulot haqida qo'shimcha ma'lumot..."></textarea>
          </div>

          <div className="border-t border-white/60 pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Aloqa ma'lumotlari</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon raqam *</label>
              <input type="text" required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 outline-none text-slate-900 transition-all shadow-2xs" placeholder="+998 90 123 45 67" />
            </div>

            {!showMoreContact ? (
              <button type="button" onClick={() => setShowMoreContact(true)} className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Boshqa aloqa vositalarini qo'shish
              </button>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800" placeholder="Sizning email manzilingiz" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram</label>
                  <input type="text" value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800" placeholder="@username" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
                  <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full p-2.5 bg-white/70 border border-white/70 rounded-lg outline-none text-sm text-slate-800" placeholder="@username" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600/90 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20 backdrop-blur-md disabled:opacity-50">
              {isSubmitting ? "Saqlanmoqda..." : "Taklifni joylash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
