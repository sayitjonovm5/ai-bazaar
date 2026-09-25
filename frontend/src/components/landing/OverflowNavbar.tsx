"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X, Sparkles, Layers } from "lucide-react";

export default function OverflowNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo - Overflow Style with Rainbow Mark */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-indigo-600 to-sky-400 p-[2px] shadow-xs group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-600 via-purple-500 to-rose-500" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              overflow<span className="text-indigo-600 font-black">.io</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-600">
            <div className="relative group">
              <button 
                className="flex items-center hover:text-slate-900 transition-colors py-2 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("product")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Product
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
              </button>
            </div>

            <div className="relative group">
              <button 
                className="flex items-center hover:text-slate-900 transition-colors py-2 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Resources
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
              </button>
            </div>

            <Link href="#interactive-showcase" className="hover:text-slate-900 transition-colors py-2">
              Examples
            </Link>

            <Link href="#superpowers" className="hover:text-slate-900 transition-colors py-2">
              Superpowers
            </Link>

            <Link href="#pricing" className="hover:text-slate-900 transition-colors py-2">
              Pricing
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
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
            href="#interactive-showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Product
          </Link>
          <Link
            href="#superpowers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Superpowers
          </Link>
          <Link
            href="#interactive-showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Examples
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Pricing
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-full text-sm font-semibold bg-slate-950 text-white"
            >
              Start for free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
