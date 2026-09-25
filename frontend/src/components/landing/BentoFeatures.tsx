"use client";

import { Sparkles, MessageSquare, BookmarkCheck, FileText, ArrowRight, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BentoFeatures() {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            Eng ilg'or imkoniyatlar
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            An'anaviy Excel jadvallaridan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sun'iy Intellekt davriga
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            NarxNazar birja treyderlari, ta'minotchilar va korxona rahbarlariga har qanday xaridda millionlab so'mni tejash imkonini beradi.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Chronos-T5 AI (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            
            {/* Background ambient gradient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl -z-0 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Zero-Shot Time-Series
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-4 tracking-tight">
                Amazon Chronos-T5 AI Modeli
              </h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
                Transformer arxitekturasi asosida yaratilgan universal time-series modeli har qanday tovarning narxlar tarixini tahlil qilib, 
                kelgusi 7 kun uchun minimal, maksimal va eng ehtimolli narx koridorini hisoblab chiqadi.
              </p>
            </div>

            {/* Visual Forecast Mock Element */}
            <div className="relative z-10 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/70 mt-2">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-slate-700 flex items-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1.5" />
                  Prognoz ishonchliligi: 98.4%
                </span>
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold text-[11px]">
                  +7 Kunlik koridor
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full w-[85%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Hozirgi narx: 18,500 UZS</span>
                  <span className="font-semibold text-emerald-600">Kutilayotgan: 19,200 - 19,800 UZS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 2: AI Savdo Maslahatchisi */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Ollama RAG AI
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-3 tracking-tight">
                AI Savdo Maslahatchisi
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Birja bo'yicha tabiiy tilda so'rang: "Hozir sement sotib olish uchun to'g'ri vaqtmi?" AI darhol to'liq byulleten ma'lumotlariga tayanib tahliliy xulosa beradi.
              </p>
            </div>

            <div className="bg-indigo-50/70 rounded-xl p-3.5 border border-indigo-100 text-xs text-indigo-900 italic">
              "💬 Sement PST narxi o'tgan haftaga nisbatan 4.2% ga ko'tarildi. AI prognoziga ko'ra keyingi hafta yana 2% o'sishi kutilmoqda."
            </div>
          </div>

          {/* Card 3: Rasmiy Byulletenlar & OCR */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                100% Rasmiy Manba
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-3 tracking-tight">
                Haftalik UZEX Byulletenlari
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                UZEX ning har haftalik rasmiy PDF byulletenlarini avtomatlashtirilgan scraper va OCR orqali yuklab olamiz va toza, qulay ko'rinishga keltiramiz.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Haftalik 24M+ bayt ma'lumotlar sinxronizatsiyasi</span>
            </div>
          </div>

          {/* Card 4: Shaxsiy Portfel & Dinamika (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-105 transition-transform">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Monitoring & Alerts
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-4 tracking-tight">
                Shaxsiy Portfel va Narxlar Signalizatsiyasi
              </h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
                Korxonangiz uchun muhim tovarlarni pinning qilib, bitta oynada ularning umumiy o'rtacha o'sish sur'atlarini, 
                bozor indeksini va kutilayotgan xatarlarni real-vaqtda kuzatib boring.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center font-semibold text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
                  Hozirgi narx
                </span>
                <span className="flex items-center font-semibold text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                  AI Prognoz (7 kun)
                </span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Dashboardga o'tish
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
