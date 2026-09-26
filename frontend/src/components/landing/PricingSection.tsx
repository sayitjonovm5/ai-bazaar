"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Boshlang'ich",
    tagline: "Birja narxlarini erkin kuzatish va tanishish uchun",
    price: "0",
    period: "doimiy bepul",
    popular: false,
    features: [
      "10,000+ UZEX tovarlarini qidirish",
      "Haftalik yangilanadigan joriy narxlar",
      "5 tagacha tovarlarni portfelga saqlash",
      "Asosiy bozor dinamikasi indeksi",
      "Mobil va kompyuterda qulay foydalanish",
    ],
    ctaText: "Hozir boshlash",
    ctaLink: "/dashboard",
    buttonStyle: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
  },
  {
    name: "Pro Treyder",
    tagline: "Xarid va savdo qiluvchi faol tadbirkorlar va treyderlar uchun",
    price: "95,000",
    period: "UZS / oyiga",
    popular: true,
    features: [
      "Barcha tovarlar uchun Chronos-T5 AI 7 kunlik prognozlari",
      "Kutilayotgan minimal, maksimal va mediana narx koridori",
      "Cheksiz miqdorda tovarlarni kuzatuvga olish",
      "AI Maslahatchi bilan cheksiz muloqot (Ollama RAG)",
      "Narx keskin o'zgarganda avtomatik signalizatsiya",
      "5 yillik to'liq narxlar tarixini CSV/Excel yuklab olish",
    ],
    ctaText: "14 kun bepul sinab ko'rish",
    ctaLink: "/dashboard",
    buttonStyle: "bg-slate-950 text-white hover:bg-slate-800 shadow-md",
  },
  {
    name: "Korporativ",
    tagline: "Yirik ishlab chiqaruvchilar, zavodlar va holdinglar uchun",
    price: "Maxsus",
    period: "yillik shartnoma",
    popular: false,
    features: [
      "To'liq REST API va 1C / ERP tizimlariga integratsiya",
      "Jamoaviy ko'p foydalanuvchili hisoblar (Multi-user)",
      "Maxsus tovarlar bo'yicha shaxsiy AI modelini o'qitish",
      "Birja tahlili bo'yicha haftalik PDF ekspert hisobotlari",
      "24/7 Shaxsiy hisob menejeri",
      "Barcha to'lovlar rasmiy shartnoma va hisob-faktura bilan",
    ],
    ctaText: "Biz bilan bog'lanish",
    ctaLink: "mailto:contact@narxnazar.uz",
    buttonStyle: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-4">
            Shaffof va qulay shartlar
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Har qanday miqyosdagi biznes uchun tariflar
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Oddiy treyderdan to yirik ishlab chiqarish majmualarigacha — to'g'ri narx qarorlari bilan xarajatlaringizni tejang.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-white border-2 border-blue-600 shadow-2xl ring-4 ring-blue-500/10 lg:-translate-y-2"
                  : "bg-white border border-slate-200/80 shadow-xs hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Eng ommabop tanlov
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-2 min-h-[32px]">{plan.tagline}</p>

                <div className="my-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== "Maxsus" && (
                      <span className="text-sm font-semibold text-slate-500 ml-1.5">
                        UZS
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium block mt-1">
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Tarif imkoniyatlari:
                  </span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start text-xs sm:text-sm text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mr-3 mt-0.5 border border-emerald-200">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.ctaLink}
                className={`w-full py-3 px-4 rounded-full text-sm font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer ${plan.buttonStyle}`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
