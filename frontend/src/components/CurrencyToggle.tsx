"use client";

import { useCurrency } from "@/lib/currency-context";
import { Coins, DollarSign } from "lucide-react";

interface CurrencyToggleProps {
  className?: string;
  showRateBadge?: boolean;
  size?: "sm" | "md";
}

export default function CurrencyToggle({
  className = "",
  showRateBadge = true,
  size = "md",
}: CurrencyToggleProps) {
  const { currency, setCurrency, rate } = useCurrency();

  const isSmall = size === "sm";

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-xl border border-white/80 p-1 rounded-2xl shadow-2xs ${className}`}
    >
      <span
        className={`${
          isSmall ? "text-[11px] px-1.5" : "text-xs px-2"
        } font-semibold text-slate-500 flex items-center gap-1`}
      >
        <Coins className={`${isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} text-blue-600`} />
        Valyuta:
      </span>
      <button
        type="button"
        onClick={() => setCurrency("UZS")}
        className={`${
          isSmall ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        } rounded-xl font-bold transition-all cursor-pointer ${
          currency === "UZS"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
        }`}
      >
        UZS (so'm)
      </button>
      <button
        type="button"
        onClick={() => setCurrency("USD")}
        className={`${
          isSmall ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        } rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
          currency === "USD"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
        }`}
      >
        <DollarSign className={isSmall ? "w-2.5 h-2.5" : "w-3 h-3"} />
        USD ($)
      </button>
      {showRateBadge && rate && (
        <span className="text-[11px] text-slate-400 border-l border-slate-200/80 pl-2 pr-2 hidden sm:inline font-medium">
          1 USD = {rate.toLocaleString("uz-UZ")} UZS
        </span>
      )}
    </div>
  );
}
