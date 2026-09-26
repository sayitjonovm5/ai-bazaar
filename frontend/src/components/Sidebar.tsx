"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  LogIn,
  User,
  Store,
} from "lucide-react";
import Image from "next/image";
const navigation = [
  { name: "Bosh sahifa", href: "/", icon: LayoutDashboard },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Mahsulotlar qidiruvi", href: "/search", icon: Search },
  { name: "AI tahlilchi", href: "/chat", icon: MessageSquare },
  { name: "Sozlamalar", href: "/settings", icon: Settings },
];
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  return (
    <aside className="flex h-full w-[68px] shrink-0 flex-col border-r border-gray-200 bg-white md:w-64">
      <Link
        href="/"
        aria-label="NarxNazar — bosh sahifa"
        className="flex h-24 shrink-0 items-center justify-center gap-2.5 md:justify-start md:px-6"
      >
        <Image
          src="/logo.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
          priority
        />
        <span className="hidden text-[23px] font-bold tracking-tight text-[#f36523] md:block">
          NarxNazar
        </span>
      </Link>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-5 md:px-4">
        <p className="eyebrow hidden px-3 pb-3 pt-3 md:block">Bozor tahlili</p>
        <nav aria-label="Asosiy navigatsiya" className="space-y-1.5">
          {navigation.map(({ name, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/")) ||
              (href === "/search" && pathname.startsWith("/product/"));
            return (
              <Link
                key={href}
                href={href}
                aria-label={name}
                title={name}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-11 items-center justify-center gap-3 rounded-xl px-3 text-[13px] font-medium md:justify-start " +
                  (active
                    ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900")
                }
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0"
                  strokeWidth={active ? 2 : 1.7}
                  aria-hidden="true"
                />
                <span className="hidden md:block">{name}</span>
                {active && (
                  <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-blue-600 md:block" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-gray-100 pt-4">
          {status === "loading" ? (
            <div className="skeleton h-11" aria-label="Hisob yuklanmoqda" />
          ) : session ? (
            <>
              <Link
                href="/profile"
                title="Profil"
                aria-label="Profil"
                className="mb-2 flex items-center justify-center gap-3 rounded-xl px-2 py-3 hover:bg-gray-50 md:justify-start"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                  {(session.user?.name || session.user?.email || "N")
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="hidden min-w-0 md:block">
                  <span className="block truncate text-sm font-semibold">
                    {session.user?.name || "Mening profilim"}
                  </span>
                  <span className="block truncate text-[11px] text-gray-500">
                    {session.user?.email}
                  </span>
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                title="Tizimdan chiqish"
                aria-label="Tizimdan chiqish"
                className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-3 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-700 md:justify-start"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden md:block">Tizimdan chiqish</span>
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 hidden px-3 md:block">
                <User className="mb-2 h-5 w-5 text-gray-400" />
                <p className="text-xs text-gray-500">
                  Hisobingizga kiring va kerakli mahsulotlarni kuzatib boring.
                </p>
              </div>
              <button
                onClick={() => signIn()}
                title="Tizimga kirish"
                aria-label="Tizimga kirish"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-2 text-[13px] font-semibold text-white hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                <span className="hidden md:block">Tizimga kirish</span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
