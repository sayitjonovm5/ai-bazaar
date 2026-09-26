"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-1">
                <Image 
                  src="/logo.png" 
                  alt="NarxNazar Logo" 
                  width={36} 
                  height={36} 
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Narx<span className="text-orange-500">Nazar</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O'zbekiston tovar-xom ashyo birjasi (UZEX) haftalik byulletenlari tahlili, 
              Amazon Chronos-T5 neyron tarmog'i asosidagi time-series narxlar prognozi va B2B analitika platformasi.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Barcha tizimlar barqaror ishlamoqda (Online)</span>
            </div>
          </div>

          {/* Links Column 1: Platforma */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Boshqaruv paneli (Dashboard)
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  24,000+ Tovar qidiruvi
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  AI Savdo Maslahatchisi
                </Link>
              </li>
              <li>
                <Link href="#mockup" className="hover:text-white transition-colors">
                  Chronos AI Prognozlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Tovar Toifalari */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tovar toifalari
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Metallurgiya va po'lat
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Qurilish materiallari (Sement)
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Yoqilg'i va moylar
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Qishloq xo'jaligi (Paxta)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Texnologiya */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Texnologiyalar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300">Amazon Chronos-T5</span>
              </li>
              <li>
                <span className="text-slate-300">Ollama Deep Learning</span>
              </li>
              <li>
                <span className="text-slate-300">Next.js 16 & Turbopack</span>
              </li>
              <li>
                <span className="text-slate-300">Rasmiy UZEX Byulletenlari</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NarxNazar. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300 transition-colors">
              O'zbekiston Respublikasi
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors">
              UZEX Tovar Birjasi Ma'lumotlari
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
