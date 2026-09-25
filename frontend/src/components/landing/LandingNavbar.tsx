"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full transition-all backdrop-blur-md bg-white/75 border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo with Colorful Circle Mark like in the uploaded image */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-indigo-600 to-sky-400 p-[2px] shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-600 via-purple-500 to-rose-500" />
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                overflow<span className="text-indigo-600 font-black">.io</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 tracking-wide">
                by NarxNazar
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Matching Uploaded Screenshot: Product, Resources, Examples, Download, Pricing) */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-600">
            <Link 
              href="#mockup" 
              className="flex items-center hover:text-slate-900 transition-colors py-2"
            >
              Product
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </Link>
            <Link 
              href="#features" 
              className="flex items-center hover:text-slate-900 transition-colors py-2"
            >
              Resources
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </Link>
            <Link 
              href="#mockup" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Examples
            </Link>
            <Link 
              href="/dashboard" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Download
            </Link>
            <Link 
              href="#pricing" 
              className="hover:text-slate-900 transition-colors py-2"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            {session ? (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn("credentials")}
                className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Black Pill Button 'Start for free ->' exactly like the image */}
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-black hover:bg-slate-900 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
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
            href="#mockup"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Product
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Resources
          </Link>
          <Link
            href="#mockup"
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
              className="w-full text-center py-2.5 px-4 rounded-full text-sm font-semibold bg-black text-white"
            >
              Start for free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
