"use client";

import { DownloadCloud, Sparkles, TrendingUp, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Ma'lumotlarni yig'ish & OCR",
    description: "UZEX birjasining har haftalik rasmiy byulletenlari PDF formatida avtomatik yuklanadi va jadvallar raqamlashtiriladi.",
    icon: DownloadCloud,
    badge: "Avtomatlashtirilgan",
    color: "from-blue-500 to-indigo-500",
  },
  {
    step: "02",
    title: "Chronos AI & Lingvistik Tahlil",
    description: "Cyrillic->Latin lingvistik normalizatsiya qilinadi, Amazon Chronos-T5 neyron tarmog'i kelgusi 7 kunlik narxlarni hisoblaydi.",
    icon: Sparkles,
    badge: "Chuqur o'rganish",
    color: "from-indigo-500 to-purple-500",
  },
  {
    step: "03",
    title: "Aqlli xarid & Maksimal tejash",
    description: "Tovarlar narxi qachon pasayishi yoki oshishini aniq bilgan holda xarid va savdo shartnomalarini eng optimal vaqtda tuzing.",
    icon: TrendingUp,
    badge: "Natija",
    color: "from-purple-500 to-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-4">
            Oddiy va shaffof jarayon
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Qanday qilib AI aniq prognoz beradi?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Xom PDF byulletenlardan tortib to tayyor xarid tavsiyalarigacha bo'lgan 3 bosqichli intellektual quvur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-black text-slate-200 group-hover:text-blue-500/20 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-md transition-transform group-hover:scale-105`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center text-xs font-medium text-emerald-600">
                  <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />
                  <span>To'liq avtomatlashtirilgan tahlil</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
