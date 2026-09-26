"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { User, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/MarketFeedback";
import { readJson } from "@/lib/market-ui";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!session?.user) return;
    const controller = new AbortController();
    readJson<{ name: string; profilePicture: string }>("/api/profile", {
      signal: controller.signal,
    })
      .then((data) => {
        setName(data.name || "");
        setProfilePicture(data.profilePicture || "");
        setLoaded(true);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailed(true);
          setMessage("Profilni yuklab bo‘lmadi. Sahifani yangilang.");
        }
      });
    return () => controller.abort();
  }, [session]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      await readJson("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          profilePicture: profilePicture.trim(),
        }),
      });
      setFailed(false);
      setMessage("Profil muvaffaqiyatli saqlandi!");
    } catch {
      setFailed(true);
      setMessage("Saqlashda xatolik yuz berdi. Qayta urinib ko‘ring.");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Link href="/marketplace" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md border border-white/70 shadow-2xs transition-all">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Marketplace-ga qaytish
      </Link>
      <div className="bg-white/75 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Profil Sozlamalari</h1>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 backdrop-blur-md border ${message.includes('xatolik') ? 'bg-rose-500/10 border-rose-500/20 text-rose-700' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-white/70 border border-white/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
              {profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profil rasmi</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      const data = await res.json();
                      if (data.success) {
                        setProfilePicture(data.url);
                      } else {
                        alert(data.error || "Rasm yuklashda xatolik");
                      }
                    } catch (err) {
                      alert("Rasm yuklashda xatolik");
                    }
                  }
                }} 
                className="w-full p-2 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 text-slate-900 transition-all shadow-2xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
              {profilePicture && <p className="text-xs text-slate-400 mt-2 font-medium">Rasm yuklandi: {profilePicture.split('/').pop()}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ism familiyangiz</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 text-slate-900 transition-all shadow-2xs" placeholder="To'liq ismingiz..." />
          </div>
          
          <button disabled={isSaving} type="submit" className="w-full bg-blue-600/90 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20 backdrop-blur-md disabled:opacity-50">
            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
