"use client";

import React, { createContext, useContext, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
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

export function AuthCard({
  initialMode = "signin",
  onSuccess,
  isModal = false,
}: {
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [tab, setTab] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = (newTab: "signin" | "signup") => {
    setTab(newTab);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Elektron pochta manzilini kiriting.");
      return;
    }
    if (!password) {
      setError("Parolni kiriting.");
      return;
    }

    setIsLoading(true);

    try {
      if (tab === "signup") {
        // --- REGISTRATION FLOW ---
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data.error || "Ro'yxatdan o'tishda xatolik yuz berdi.";
          setError(errMsg);
          toast.error(errMsg);
          setIsLoading(false);
          return;
        }

        // Successfully registered -> sign in immediately
        toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        const loginRes = await signIn("credentials", {
          email: cleanEmail,
          password,
          redirect: false,
        });

        if (loginRes?.ok) {
          if (onSuccess) onSuccess();
          router.push(callbackUrl);
          router.refresh();
        } else {
          setSuccess("Akkaunt yaratildi. Endi tizimga kirishingiz mumkin.");
          setTab("signin");
        }
      } else {
        // --- LOGIN FLOW ---
        // 1. Validate credentials with custom error messages
        const valRes = await fetch("/api/auth/validate-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const valData = await valRes.json();

        if (!valRes.ok) {
          const errMsg = valData.error || "Kiritilgan ma'lumotlar noto'g'ri.";
          setError(errMsg);
          toast.error(errMsg);
          setIsLoading(false);
          return;
        }

        // 2. Perform NextAuth sign-in
        const res = await signIn("credentials", {
          email: cleanEmail,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }

        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        if (onSuccess) onSuccess();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError("Tarmoq bilan aloqa uzildi. Qayta urinib ko'ring.");
      toast.error("Tarmoq bilan aloqa uzildi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md bg-white/85 backdrop-blur-2xl border border-white/70 shadow-2xl rounded-3xl p-6 sm:p-8 text-slate-800 transition-all ${
        isModal ? "" : "shadow-slate-200/50"
      }`}
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 relative mb-2 flex items-center justify-center rounded-2xl overflow-hidden shadow-xs">
          <Image src="/logo.png" alt="NarxNazar" width={48} height={48} priority />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Narx<span className="text-orange-500">Nazar</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {tab === "signin"
            ? "Tizimga kirish uchun elektron pochta va parolingizni kiriting"
            : "Yangi akkaunt ochish uchun elektron pochta va parol kiriting"}
        </p>
      </div>

      {/* Tabs Switcher: Login / Register */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 mb-6 bg-slate-100/80 rounded-2xl">
        <button
          type="button"
          onClick={() => resetForm("signin")}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === "signin"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <LogIn size={15} />
          Kirish
        </button>
        <button
          type="button"
          onClick={() => resetForm("signup")}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === "signup"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserPlus size={15} />
          Ro‘yxatdan o‘tish
        </button>
      </div>

      {/* Error / Success Alerts */}
      {error && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-rose-50/90 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-emerald-50/90 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Elektron pochta
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elektron@pochta.uz"
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 focus:border-blue-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Parol
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 bg-white/70 border border-slate-200 focus:border-blue-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {tab === "signup" && (
            <p className="text-[11px] text-slate-500 mt-1">
              Parol kamida 6 ta belgidan iborat bo‘lishi kerak.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-4 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Iltimos, kuting...</span>
            </>
          ) : tab === "signin" ? (
            <>
              <LogIn size={16} />
              <span>Tizimga kirish</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Ro‘yxatdan o‘tish</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        {tab === "signin" ? (
          <p className="text-xs text-slate-500">
            Hisobingiz yo‘qmi?{" "}
            <button
              type="button"
              onClick={() => resetForm("signup")}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ro‘yxatdan o‘ting
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Allaqachon hisobingiz bormi?{" "}
            <button
              type="button"
              onClick={() => resetForm("signin")}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Tizimga kiring
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card Container */}
      <div className="relative z-10 w-full max-w-md animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-900 shadow-md flex items-center justify-center transition-transform hover:scale-105"
        >
          <X size={16} />
        </button>
        <AuthCard initialMode={initialMode} isModal={true} onSuccess={onClose} />
      </div>
    </div>
  );
}
