"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/components/AuthModal";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();

  return (
    <header className="sticky top-0 z-50 w-full transition-all backdrop-blur-md bg-white/75 border-b border-slate-200/50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-xs transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="NarxNazar Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Narx<span className="text-orange-500">Nazar</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700 tracking-wide uppercase">
                  AI Birja
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                UZEX Analytics & Forecasting
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link 
              href="#mockup" 
              className="flex items-center hover:text-slate-900 transition-colors py-2"
            >
              Mahsulotlar
              <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-60" />
            </Link>
            <Link 
              href="/marketplace" 
              className="hover:text-slate-900 transition-colors py-2 font-medium"
            >
              Marketplace
            </Link>
            <Link 
              href="#features" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Imkoniyatlar
            </Link>
            <Link 
              href="#mockup" 
              className="flex items-center hover:text-slate-900 transition-colors py-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Chronos AI
            </Link>
            <Link 
              href="#how-it-works" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Qanday ishlaydi?
            </Link>
            <Link 
              href="#pricing" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Tariflar
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-2 cursor-pointer"
              >
                Kirish
              </button>
            )}

            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-black hover:bg-slate-900 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <span>Bepul boshlash</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#mockup"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Mahsulotlar
          </Link>
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Marketplace
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Imkoniyatlar
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Qanday ishlaydi?
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Tariflar
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-full text-sm font-medium bg-black text-white"
            >
              Bepul boshlash →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
