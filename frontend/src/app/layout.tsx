import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "NarxNazar • UZEX Birja Tahlili va AI Narxlar Prognozi",
  description: "O'zbekiston tovar-xom ashyo birjasi narxlari tahlili, Chronos-T5 AI prognozi va B2B savdo platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="h-full">
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}

