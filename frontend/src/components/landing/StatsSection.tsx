"use client";

import { BarChart3, Database, Cpu, Zap } from "lucide-react";

const stats = [
  {
    icon: Database,
    value: "10,000+",
    label: "Tovar turlari",
    description: "UZEX ning barcha faol xom-ashyo va sanoat mahsulotlari",
    accent: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: BarChart3,
    value: "188,000+",
    label: "Qayta ishlangan ma'lumotlar",
    description: "5+ yillik arxiv haftalik byulletenlari tahlili",
    accent: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    icon: Cpu,
    value: "98.4%",
    label: "AI Ishonchliligi",
    description: "Amazon Chronos-T5 modeli sinov aniqligi",
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: Zap,
    value: "7 Kun",
    label: "Oldindan bashorat",
    description: "Keyingi haftaning minimal, maksimal va o'rtacha narxi",
    accent: "text-amber-600 bg-amber-50 border-amber-100",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Raqamlar bilan asoslangan
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            O'zbekiston birja bozorining eng to'liq sun'iy intellekt tahlili
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/80 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${stat.accent} transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-800 mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
