"use client";

import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/components/AuthModal";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              color: "#18243b",
              fontWeight: 500,
              fontSize: "13px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            },
          }}
        />
      </AuthModalProvider>
    </SessionProvider>
  );
}

