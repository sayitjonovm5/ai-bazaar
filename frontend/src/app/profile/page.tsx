"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      fetch("/api/profile").then(res => res.json()).then(data => {
        if (data.profilePicture) setProfilePicture(data.profilePicture);
        if (data.name) setName(data.name);
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profilePicture }),
      });
      if (!res.ok) throw new Error("Saqlashda xatolik yuz berdi");
      setMessage("Profil muvaffaqiyatli saqlandi!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Link href="/marketplace" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-slate-900 mb-6 glass-pill hover:bg-white/80 px-4 py-2 rounded-full transition-all">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Marketplace-ga qaytish
      </Link>
      <div className="glass-panel p-8 sm:p-10 rounded-3xl">
        <h1 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Profil Sozlamalari</h1>
        <p className="text-slate-500 mb-6 text-sm">Shaxsiy ma'lumotlaringiz va B2B sotuvchi profilingizni yangilang.</p>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 backdrop-blur-md border text-sm font-medium ${message.includes('xatolik') ? 'bg-rose-500/10 border-rose-500/20 text-rose-700' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-white/70 border border-white/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
              {profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profil rasmi (URL)</label>
              <input type="url" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} className="w-full p-3.5 glass-input rounded-xl outline-none text-slate-900 text-sm" placeholder="https://example.com/avatar.jpg" />
              <p className="text-xs text-slate-400 mt-2 font-medium">Iltimos, o'z rasmingizga havolani (URL) kiriting.</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ism familiyangiz</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 glass-input rounded-xl outline-none text-slate-900 text-sm" placeholder="To'liq ismingiz..." />
          </div>
          
          <button disabled={isSaving} type="submit" className="w-full glass-btn-blue text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer">
            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
