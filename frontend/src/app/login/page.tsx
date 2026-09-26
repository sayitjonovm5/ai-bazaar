"use client";

import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/AuthModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Bosh sahifaga qaytish
        </Link>
      </div>
      <AuthCard initialMode={initialMode} isModal={false} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-slate-400">Yuklanmoqda...</div>}>
      <LoginContent />
    </Suspense>
  );
}
