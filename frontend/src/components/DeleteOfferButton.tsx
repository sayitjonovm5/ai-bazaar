"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Check, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteOfferButtonProps {
  offerId: string;
  productName: string;
  onDeleted?: (offerId: string) => void;
}

export default function DeleteOfferButton({
  offerId,
  productName,
  onDeleted,
}: DeleteOfferButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/marketplace/offers/${encodeURIComponent(offerId)}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Taklifni o'chirishda xatolik yuz berdi");
      }

      toast.success(`"${productName}" taklifi muvaffaqiyatli o'chirildi`);
      setIsConfirming(false);

      if (onDeleted) {
        onDeleted(offerId);
      }

      // Refresh the page data from server
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Taklifni o'chirib bo'lmadi";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(false);
  };

  const handleOpenConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(true);
  };

  if (isConfirming) {
    return (
      <div
        className="flex items-center gap-1.5 bg-rose-50/95 border border-rose-200/90 rounded-xl px-2 py-1 shadow-sm animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
          O'chirasizmi?
        </span>
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          title="O'chirishni tasdiqlash"
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Ha
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleCancel}
          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          title="Bekor qilish"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpenConfirm}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50/70 hover:bg-rose-600 border border-rose-200/60 rounded-xl transition-all duration-200 shadow-2xs cursor-pointer group/btn"
      title="Taklifni o'chirish"
    >
      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
      <span>O'chirish</span>
    </button>
  );
}
