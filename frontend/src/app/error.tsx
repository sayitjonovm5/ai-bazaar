"use client";
import { ErrorState } from "@/components/MarketFeedback";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell">
      <ErrorState
        message="Sahifani yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
        retry={reset}
      />
    </div>
  );
}
