"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import MacbookMockup from "@/components/landing/MacbookMockup";

export default function HeroSection() {
  const scrollToMockup = () => {
    const el = document.getElementById("mockup");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
      
      {/* 
        Aurora Mesh Gradient Glow Background (matching Overflow reference image) 
        Multi-layered soft pastel radial and conic gradient mesh
      */}
      <div 
        className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="relative mx-auto aspect-[1155/678] w-[72rem] max-w-none opacity-90 sm:w-[90rem]"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 50% 30%, rgba(99, 102, 241, 0.42) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(236, 72, 153, 0.18) 55%, rgba(255, 255, 255, 0) 75%),
              radial-gradient(circle 35% at 20% 25%, rgba(59, 130, 246, 0.38) 0%, rgba(147, 197, 253, 0) 65%),
              radial-gradient(circle 40% at 80% 28%, rgba(244, 114, 182, 0.32) 0%, rgba(254, 215, 170, 0.25) 45%, rgba(255, 255, 255, 0) 70%),
              radial-gradient(ellipse 80% 45% at 50% 60%, rgba(168, 85, 247, 0.22) 0%, rgba(255, 255, 255, 0) 75%)
            `,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Content Container */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Subtle Annoucement Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs mb-8 hover:border-slate-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 -ml-3" />
            <span className="text-xs font-semibold text-slate-800 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Chronos-T5 AI 7 kunlik narx prognozlari tizimi ishga tushirildi
            </span>
          </div>

          {/* Main Headline (Overflow inspired bold, crisp typography) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
            Bozor tebranishlarini <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              oldindan ko'ring.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            UZEX tovar-xom ashyo birjasidagi 24,000+ mahsulot bo'yicha real-vaqt tahlili, 
            haftalik dinamika va Amazon Chronos sun'iy intellekt narx prognozlari bitta qulay platformada.
          </p>

          {/* Dual Pill CTA Buttons (matching reference image) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20">
            
            {/* Primary Dark Pill Button */}
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Bepul boshlash</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Frosted Pill Button */}
            <button
              onClick={scrollToMockup}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-800 bg-white/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              <span>Namoyishni ko'rish</span>
            </button>

          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 mb-14">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Rasmiy UZEX byulletenlari
            </span>
            <span className="flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-1.5" />
              Amazon Chronos AI Modeli
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Karta talab qilinmaydi
            </span>
          </div>

        </div>

        {/* MacBook Window Centerpiece */}
        <div className="relative mt-2">
          <MacbookMockup />
        </div>

      </div>

    </section>
  );
}
