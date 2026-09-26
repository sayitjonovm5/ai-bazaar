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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profil rasmi (URL)</label>
              <input type="url" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} className="w-full p-3 bg-white/60 backdrop-blur-md border border-white/70 rounded-xl outline-none focus:bg-white/95 focus:ring-2 focus:ring-blue-500/25 text-slate-900 transition-all shadow-2xs" placeholder="https://example.com/avatar.jpg" />
              <p className="text-xs text-slate-400 mt-2 font-medium">Iltimos, o'z rasmingizga havolani (URL) kiriting.</p>
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
