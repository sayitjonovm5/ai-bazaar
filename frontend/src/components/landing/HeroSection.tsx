"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import MacbookMockup from "@/components/landing/MacbookMockup";

export default function HeroSection() {
  const scrollToMockup = () => {
    const el = document.getElementById("mockup");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle 620px at 50% 30%, #3b62ee 0%, #4f46e5 28%, #6366f1 48%, rgba(99, 102, 241, 0) 75%),
          radial-gradient(circle 500px at 10% 55%, #ff5e4d 0%, #ff7a59 28%, #ff9d79 48%, rgba(255, 157, 121, 0) 72%),
          radial-gradient(circle 560px at 90% 38%, #38bdf8 0%, #60a5fa 32%, rgba(96, 165, 250, 0) 70%),
          radial-gradient(circle 520px at 18% 18%, #9333ea 0%, #a855f7 32%, #c084fc 48%, rgba(192, 132, 252, 0) 72%),
          linear-gradient(180deg, #f8faff 0%, #e8edff 20%, #dbe4fe 42%, #eaf2fe 75%, #ffffff 100%)
        `,
      }}
    >
      
      {/* Additional ambient overlay to give the silky, glowing depth from the reference image */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-85 -z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 32%, rgba(59, 130, 246, 0.5) 0%, rgba(99, 102, 241, 0.4) 35%, transparent 70%),
            radial-gradient(ellipse 45% 45% at 8% 60%, rgba(255, 94, 77, 0.45) 0%, rgba(254, 215, 170, 0.2) 50%, transparent 70%)
          `,
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Content Container */}
        <div className="text-center max-w-4xl mx-auto">

          {/* Exact Headline from Uploaded Reference Image in Pure Solid White */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.06] mb-6 drop-shadow-[0_2px_12px_rgba(30,58,138,0.25)]">
            Every journey <br className="hidden sm:inline" />
            deserves a great story.
          </h1>

          {/* Exact Subtitle from Uploaded Reference Image in Crisp Soft White */}
          <p className="text-lg sm:text-xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-[0_1px_6px_rgba(30,58,138,0.2)]">
            Create beautiful user flows and design presentations <br className="hidden sm:inline" />
            to narrate your design story like never before.
          </p>

          {/* Dual Pill CTA Buttons (matching reference image) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20">
            
            {/* Primary Pure Black Pill Button */}
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-black hover:bg-slate-900 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Start free trial</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Crisp White Pill Button */}
            <button
              onClick={scrollToMockup}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-900 bg-white hover:bg-slate-50 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>See Examples</span>
            </button>

          </div>

        </div>

        {/* MacBook Window Centerpiece */}
        <div className="relative mt-4">
          <MacbookMockup />
        </div>

      </div>

    </section>
  );
}
