"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-950 px-6 py-16 sm:px-12 sm:py-20 md:p-20 text-center overflow-hidden shadow-2xl">
          
          {/* Radial Ambient Glow inside CTA card */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 -z-0"
            style={{
              background: "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.3) 40%, rgba(15, 23, 42, 0) 75%)"
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
              Bugunoq boshlang • Karta kiritish talab qilinmaydi
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Bozor narxlarini taxmin qilmang. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Sun'iy intellekt bilan aniq hisoblang.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              O'zbekistonning yuzlab yetakchi korxonalari xarajatlarini allaqachon NarxNazar orqali optimallashtirmoqda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Platformaga kirish</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                24,000+ tovarlarni qidirish
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
