"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Plus, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddOfferPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
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
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const cats = Array.from(new Set(data.map((p: any) => p.category))) as string[];
        setCategories(cats);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.companyName || !formData.price || !formData.phoneNumber) {
      setError("Iltimos barcha majburiy maydonlarni to'ldiring");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/product/${encodeURIComponent(formData.productName)}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Taklif qo'shishda xatolik yuz berdi");
      
      router.push("/marketplace");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/marketplace" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Orqaga qaytish
      </Link>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Yangi taklif qo'shish</h1>
        <p className="text-gray-500 mb-8">O'z mahsulotingizni B2B maydonchasiga joylang.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kompaniya nomi *</label>
            <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Masalan: MCHJ Agro" />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulotni tanlang *</label>
            <div 
              className="w-full p-3 border border-gray-200 rounded-xl bg-white cursor-pointer flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={formData.productName ? "text-gray-900" : "text-gray-400"}>
                {formData.productName || "Mahsulot qidiring yoki tanlang"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-80 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Qidirish..." 
                      className="w-full pl-10 p-2 bg-gray-50 rounded-lg outline-none"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex border-b border-gray-100 overflow-x-auto p-2 gap-2">
                  <button type="button" onClick={() => setSelectedCategory("")} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${!selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Barchasi</button>
                  {categories.map(c => (
                    <button key={c} type="button" onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${selectedCategory === c ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{c}</button>
                  ))}
                </div>
                <div className="overflow-y-auto p-2">
                  {filteredProducts.map(p => (
                    <div 
                      key={p.name} 
                      className="p-3 hover:bg-blue-50 rounded-lg cursor-pointer flex justify-between items-center"
                      onClick={() => { setFormData({...formData, productName: p.name}); setIsDropdownOpen(false); }}
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.category}</span>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">Topilmadi</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Narxi (UZS) *</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Masalan: 15000" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Mahsulot haqida qo'shimcha ma'lumot..."></textarea>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Aloqa ma'lumotlari</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqam *</label>
              <input type="text" required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="+998 90 123 45 67" />
            </div>

            {!showMoreContact ? (
              <button type="button" onClick={() => setShowMoreContact(true)} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Boshqa aloqa vositalarini qo'shish
              </button>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="Sizning email manzilingiz" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Telegram</label>
                  <input type="text" value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="@username" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
                  <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none" placeholder="@username" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
              {isSubmitting ? "Saqlanmoqda..." : "Taklifni joylash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
