"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard, Search, MessageSquare, Settings, LogOut, LogIn, User, Store } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Search Products", href: "/search", icon: Search },
  { name: "AI Analyst Chat", href: "/chat", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <div className="flex h-full w-64 sm:w-68 flex-col shrink-0 glass-dark-panel border-0 border-r border-white/10 text-white select-none relative z-20">
      {/* Brand Header */}
      <div className="flex h-20 shrink-0 items-center px-6 py-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/90 p-1.5 shadow-md flex items-center justify-center shrink-0 border border-white/80">
          <Image 
            src="/logo.png" 
            alt="NarxNazar Logo" 
            width={32} 
            height={32} 
            className="object-contain w-auto h-auto"
            priority
          />
        </div>
        <div className="flex flex-col ml-3">
          <span className="text-xl font-extrabold tracking-tight text-white leading-none">
            Narx<span className="text-amber-400">Nazar</span>
          </span>
          <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider mt-1">
            Enterprise Birja
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "glass-btn-blue text-white shadow-lg shadow-blue-500/30 border border-blue-400/40 translate-x-0.5"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.9)]" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom User Profile Section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {status === "loading" ? (
            <div className="px-3 py-2 text-xs text-slate-400">Tizimga kirilmoqda...</div>
          ) : session ? (
            <div className="p-3 glass-dark-card rounded-2xl border border-white/10">
              <div className="flex items-center text-xs font-semibold text-white mb-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mr-2.5 shrink-0 text-amber-300 font-bold">
                  {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-white font-medium text-xs leading-tight">
                    {session.user?.name || session.user?.email}
                  </p>
                  <span className="text-[10px] text-blue-300 font-normal">Administrator</span>
                </div>
              </div>
              <button 
                onClick={() => signOut()}
                className="group flex w-full items-center justify-center rounded-xl py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/25 border border-white/10 hover:border-rose-400/30 transition-all cursor-pointer"
              >
                <LogOut className="mr-2 h-3.5 w-3.5 text-slate-400 group-hover:text-rose-300" aria-hidden="true" />
                Tizimdan chiqish
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn("credentials")}
              className="group flex w-full items-center justify-center rounded-xl py-2.5 px-3 text-xs font-semibold text-white glass-btn-blue transition-all cursor-pointer shadow-md"
            >
              <LogIn className="mr-2 h-4 w-4 text-blue-200 group-hover:text-white" aria-hidden="true" />
              Tizimga kirish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
