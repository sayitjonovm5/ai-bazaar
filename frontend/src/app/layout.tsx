import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "NarxNazar",
  description:
    "AI-Powered Market Intelligence, Pricing, and B2B Procurement Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="flex h-dvh overflow-hidden">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3"
          >
            Asosiy tarkibga o‘tish
          </a>
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="app-main min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:p-8 xl:px-10"
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
