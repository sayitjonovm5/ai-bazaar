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
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-20 shrink-0 items-center px-6 py-2">
        <Image 
          src="/logo.png" 
          alt="NarxNazar Logo" 
          width={40} 
          height={40} 
          className="object-contain w-auto h-10"
          priority
        />
        <span className="text-2xl font-bold ml-2 tracking-tight" style={{ color: '#f36523' }}>
          NarxNazar
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-blue-600"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto border-t border-gray-100 pt-4">
          {status === "loading" ? (
            <div className="px-2 py-2 text-sm text-gray-500">Tizimga kirilmoqda...</div>
          ) : session ? (
            <>
              <div className="px-2 py-2 mb-2 flex items-center text-sm font-medium text-gray-900">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                {session.user?.name || session.user?.email}
              </div>
              <button 
                onClick={() => signOut()}
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
                Tizimdan chiqish
              </button>
            </>
          ) : (
            <button 
              onClick={() => signIn("credentials")}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <LogIn className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" aria-hidden="true" />
              Tizimga kirish / Ro'yxatdan o'tish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
