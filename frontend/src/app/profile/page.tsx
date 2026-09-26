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
    <div className="mx-auto max-w-xl py-3">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={14} />
        Marketplace-ga qaytish
      </Link>
      <div className="surface p-5 sm:p-8">
        <header className="page-heading">
          <div className="eyebrow">Mening hisobim</div>
          <h1>Profil sozlamalari</h1>
          <p>Hamkorlaringizga qanday ko‘rinishingizni boshqaring.</p>
        </header>
        {message && (
          <div
            role="status"
            className={
              "mb-6 rounded-lg border p-3 text-sm " +
              (failed
                ? "border-red-100 bg-red-50 text-red-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-700")
            }
          >
            {message}
          </div>
        )}
        {status === "loading" ? (
          <LoadingState />
        ) : !session ? (
          <div className="empty-state">
            <User />
            <h2>Hisobingizga kiring</h2>
            <p>Profilingizni tahrirlash uchun tizimga kiring.</p>
            <button onClick={() => signIn()} className="button-primary">
              Tizimga kirish
            </button>
          </div>
        ) : !loaded ? (
          failed ? null : (
            <LoadingState />
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                {profilePicture && !imageFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePicture}
                    alt="Profil rasmi"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="avatar" className="field-label">
                  Profil rasmi (URL)
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={profilePicture}
                  onChange={(e) => {
                    setProfilePicture(e.target.value);
                    setImageFailed(false);
                  }}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="mt-2 text-[11px] text-gray-500">
                  Rasmingizga to‘g‘ridan-to‘g‘ri havolani kiriting.
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="profile-name" className="field-label">
                Ism familiyangiz
              </label>
              <input
                id="profile-name"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="To‘liq ismingiz"
              />
            </div>
            <button
              disabled={isSaving}
              type="submit"
              className="button-primary w-full"
            >
              <Save size={15} />
              {isSaving ? "Saqlanmoqda..." : "O‘zgarishlarni saqlash"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
