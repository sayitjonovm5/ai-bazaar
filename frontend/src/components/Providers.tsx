"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/lib/currency-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontSize: "13px",
              borderRadius: "12px",
              border: "1px solid #dfe5ee",
              padding: "14px 18px",
            },
          }}
        />
      </CurrencyProvider>
    </SessionProvider>
  );
}

