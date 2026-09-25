"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const scrollToDemo = () => {
    const el = document.getElementById("interactive-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      
      {/* 
        Signature Multi-Stop Radial Mesh Gradient (matching Overflow.io reference image)
        Cobalt blue, indigo, violet, and warm peach fading into pure crisp white
      */}
      <div 
        className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="relative mx-auto aspect-[1155/678] w-[75rem] max-w-none opacity-90 sm:w-[96rem]"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 50% 28%, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.35) 30%, rgba(244, 114, 182, 0.22) 55%, rgba(255, 255, 255, 0) 75%),
              radial-gradient(circle 35% at 20% 25%, rgba(59, 130, 246, 0.42) 0%, rgba(147, 197, 253, 0) 65%),
              radial-gradient(circle 40% at 80% 28%, rgba(244, 114, 182, 0.35) 0%, rgba(254, 215, 170, 0.28) 45%, rgba(255, 255, 255, 0) 72%),
              radial-gradient(ellipse 80% 45% at 50% 65%, rgba(168, 85, 247, 0.22) 0%, rgba(255, 255, 255, 0) 78%)
            `,
            filter: "blur(55px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Typography (Overflow Exact Design) */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs mb-8 hover:border-slate-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-blue-600 -ml-3" />
            <span className="text-xs font-semibold text-slate-800 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Introducing Interactive Canvas & AI-Powered Presentation Stories
            </span>
          </div>

          {/* Heading - Exact Overflow Reference Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
            Every journey <br className="hidden sm:inline" />
            deserves a great story.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            Create beautiful user flows, live commodity forecasts, and design presentations 
            to narrate your product story like never before.
          </p>

          {/* Dual Pill CTA Buttons (matching reference image) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            
            {/* Primary Dark Pill Button */}
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Start free trial</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Frosted Pill Button */}
            <button
              onClick={scrollToDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-800 bg-white/95 hover:bg-white border border-slate-200/90 hover:border-slate-300 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <span>See Examples</span>
            </button>

          </div>

          <p className="text-xs text-slate-400 font-medium">
            No credit card required • Free 14-day trial • Unlimited collaborators
          </p>

        </div>

      </div>

    </section>
  );
}
