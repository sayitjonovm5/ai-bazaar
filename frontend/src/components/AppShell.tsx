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

      {/* Frosted Glass Bezel (Glassmorphic Outer Chassis) matching BullBird reference */}
      <div className="relative z-10 w-full max-w-[1780px] mx-auto p-0 sm:p-3 lg:p-4.5 rounded-none sm:rounded-[36px] bg-white/[0.08] backdrop-blur-2xl border-0 sm:border sm:border-white/25 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.65),0_0_50px_rgba(37,99,235,0.15)] ring-0 sm:ring-1 sm:ring-white/10 flex items-center justify-center">
        {/* Inner Console Chassis */}
        <div className="w-full h-screen sm:h-[calc(100vh-3.5rem)] bg-[#F8FAFD]/85 backdrop-blur-3xl rounded-none sm:rounded-[24px] border-0 sm:border sm:border-white/30 shadow-xl flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
