"use client";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
export function LoadingState({
  label = "Ma’lumotlar yuklanmoqda...",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-20 text-sm text-gray-500"
    >
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      {label}
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div role="alert" className="surface empty-state">
      <AlertCircle />
      <h2>Ma’lumotlarni yuklab bo‘lmadi</h2>
      <p>{message}</p>
      {retry && (
        <button onClick={retry} className="button-secondary">
          <RefreshCw size={15} />
          Qayta urinish
        </button>
      )}
    </div>
  );
}
