"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080C16] overflow-x-hidden flex items-center justify-center p-0 sm:p-3 lg:p-4 selection:bg-blue-600 selection:text-white">
      {/* Ambient Aurora Radial Mesh Glows matching reference design */}
      <div 
        className="fixed inset-0 pointer-events-none -z-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle 850px at 15% 15%, rgba(37, 99, 235, 0.18) 0%, transparent 70%),
            radial-gradient(circle 750px at 85% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 68%),
            radial-gradient(circle 600px at 70% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 65%),
            radial-gradient(circle 650px at 30% 90%, rgba(244, 63, 94, 0.08) 0%, transparent 65%)
          `,
        }}
      />

      {/* Floating Enterprise Console Chassis */}
      <div className="relative z-10 w-full max-w-[1760px] mx-auto h-screen sm:h-[calc(100vh-1.5rem)] bg-[#F8FAFD] sm:rounded-[26px] border-0 sm:border sm:border-white/20 shadow-2xl shadow-blue-950/60 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFD] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
