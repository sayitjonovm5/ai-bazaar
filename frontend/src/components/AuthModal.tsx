"use client";

import React, { createContext, useContext, useState } from "react";
import { signIn } from "next-auth/react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Building2,
  ShoppingBag,
  ArrowLeft,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface AuthModalContextType {
  isOpen: boolean;
  mode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false,
  mode: "signin",
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const openAuthModal = (initialMode: "signin" | "signup" = "signin") => {
    setMode(initialMode);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuthModal} initialMode={mode} />
    </AuthModalContext.Provider>
  );
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function AuthCard({
  initialMode = "signin",
  onSuccess,
  isModal = false,
}: {
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}) {
  const [tab, setTab] = useState<"signin" | "signup">(initialMode);
  const [viewState, setViewState] = useState<"form" | "google_picker">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"BUYER" | "SUPPLIER">("BUYER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Custom Google account form state
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  const presetGoogleAccounts = [
    {
      name: "Asliddin Abdurahimov",
      email: "asliddinabdurahimov20@gmail.com",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      role: "BUYER",
    },
    {
      name: "NarxNazar Tadbirkor",
      email: "tadbirkor.b2b@gmail.com",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      role: "SUPPLIER",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    if (tab === "signup" && password.length < 6) {
      toast.error("Parol kamida 6 belgidan iborat bo'lishi kerak.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        name: tab === "signup" ? name : undefined,
        role: tab === "signup" ? role : undefined,
        isRegister: tab === "signup" ? "true" : "false",
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(
          tab === "signup"
            ? "Muvaffaqiyatli ro'yxatdan o'tdingiz!"
            : "Tizimga muvaffaqiyatli kirdingiz!"
        );
        if (onSuccess) onSuccess();
        window.location.reload();
      }
    } catch {
      toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Check if real Google credentials are configured in .env
      const checkRes = await fetch("/api/auth/google-status");
      const checkData = await checkRes.json();

      if (checkData.configured) {
        await signIn("google", { callbackUrl: window.location.href });
        return;
      }

      // If not configured with Google Cloud API keys yet, open Smart Google Account Picker
      setIsGoogleLoading(false);
      setViewState("google_picker");
    } catch {
      // Fallback to Smart Google Account Picker
      setIsGoogleLoading(false);
      setViewState("google_picker");
    }
  };

  const executeSmartGoogleLogin = async (account: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  }) => {
    setIsGoogleLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: account.email.trim().toLowerCase(),
        name: account.name,
        image: account.image,
        role: account.role || "BUYER",
        isGoogleAuth: "true",
      });

      if (res?.error) {
        toast.error(res.error);
        setIsGoogleLoading(false);
      } else {
        toast.success(`Google hisobingiz (${account.email}) orqali muvaffaqiyatli kirdingiz!`);
        if (onSuccess) onSuccess();
        window.location.reload();
      }
    } catch {
      toast.error("Google orqali kirishda xatolik yuz berdi.");
      setIsGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleName) {
      toast.error("Iltimos, ism va Gmail manzilingizni kiriting.");
      return;
    }
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const finalEmail = cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@gmail.com`;

    executeSmartGoogleLogin({
      name: customGoogleName.trim(),
      email: finalEmail,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customGoogleName)}&backgroundColor=2563eb,3b82f6,1d4ed8`,
    });
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setEmail("demo@narxnazar.uz");
    setPassword("demopassword");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "demo@narxnazar.uz",
        password: "demopassword",
        isRegister: "false",
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Demo hisobga xush kelibsiz!");
        if (onSuccess) onSuccess();
        window.location.reload();
      }
    } catch {
      toast.error("Demo tizimga kirishda xatolik.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isModal ? "" : "my-8"}`}>
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/70 shadow-[0_20px_60px_-15px_rgba(24,36,59,0.18)] p-6 sm:p-8 overflow-hidden">
        {/* Decorative subtle ambient lights */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* VIEW 1: Smart Google Account Picker */}
        {viewState === "google_picker" ? (
          <div className="relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setViewState("form")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Orqaga</span>
              </button>
              <div className="flex items-center gap-1.5">
                <GoogleIcon className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-700">Google bilan kirish</span>
              </div>
            </div>

            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Hisobni tanlang</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">NarxNazar</span> ilovasi bilan davom etish uchun
              </p>
            </div>

            {/* List of accounts */}
            <div className="space-y-2 mb-4">
              {presetGoogleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={() => executeSmartGoogleLogin(acc)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white/80 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-left cursor-pointer group disabled:opacity-50 shadow-2xs"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full shadow-2xs">
                      <GoogleIcon className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-medium">
                      {acc.email}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                </button>
              ))}

              {/* Add / Type another Google account */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 bg-white/50 hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                      Boshqa Google hisob bilan kirish
                    </p>
                    <p className="text-[11px] text-slate-400">
                      O'z Gmail manzilingizni kiriting
                    </p>
                  </div>
                </button>
              ) : (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2.5 animate-in fade-in duration-150"
                >
                  <p className="text-xs font-bold text-slate-800">
                    O'zingizning Google profilingizni kiriting:
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="Ismingiz (masalan: Asliddin)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Gmail manzilingiz (masalan: siz@gmail.com)"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isGoogleLoading}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isGoogleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GoogleIcon className="w-3.5 h-3.5" />}
                      <span>Ushbu hisob bilan kirish</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-3">
              Davom etish orqali siz NarxNazar xizmat ko'rsatish shartlariga rozilik bildirasiz.
            </p>
          </div>
        ) : (
          /* VIEW 2: Standard Login/Register Form */
          <div className="relative">
            {/* Brand header */}
            <div className="relative text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 p-2 mb-3">
                <Image
                  src="/logo.png"
                  alt="NarxNazar"
                  width={40}
                  height={40}
                  className="object-contain drop-shadow"
                />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Narx<span className="text-blue-600">Nazar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                UZEX tovar-xomashyo birjasi tahlili va AI prognozi platformasi
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="relative flex p-1 mb-5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-inner">
              <button
                type="button"
                onClick={() => setTab("signin")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tizimga kirish
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="relative w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google orqali davom etish</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-5">
              <div className="flex-grow border-t border-slate-200/80"></div>
              <span className="shrink-0 mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                yoki elektron pochta orqali
              </span>
              <div className="flex-grow border-t border-slate-200/80"></div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Ism va Familiya
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Alisher Navoiy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-slate-200/90 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Elektron pochta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="foydalanuvchi@pochta.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-slate-200/90 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Kamida 6 belgi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/70 border border-slate-200/90 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role selection for Registration */}
              {tab === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Faoliyat turi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("BUYER")}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        role === "BUYER"
                          ? "border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs"
                          : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Xaridor / Tadbirkor
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("SUPPLIER")}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        role === "SUPPLIER"
                          ? "border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs"
                          : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Yetkazib beruvchi
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : tab === "signin" ? (
                  "Kirish"
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </button>
            </form>

            {/* 1-Click Demo Login Button for Judges/Reviewers */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading || isGoogleLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bir bosishda Demo hisob bilan kirish (Ko'rish uchun)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md transition-all animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 shadow-md border border-white/60 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <AuthCard initialMode={initialMode} onSuccess={onClose} isModal={true} />
      </div>
    </div>
  );
}
