"use client";
import { ArrowUpRight, ArrowDownRight, Minus, Pin } from "lucide-react";
import Link from "next/link";
import ProductIcon from "./ProductIcon";
import { formatUnit, type Product } from "@/lib/market-ui";
import { useCurrency } from "@/lib/currency-context";

interface ProductRowProps extends Product {
  onPinToggle?: (id: string) => void;
  isPinned?: boolean;
  isPending?: boolean;
  view?: "list" | "grid";
}

export function PriceChange({ value }: { value: number }) {
  const change = Number.isFinite(value) ? value : 0;
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums " +
        (change > 0
          ? "bg-emerald-50 text-emerald-700"
          : change < 0
            ? "bg-red-50 text-red-700"
            : "bg-gray-100 text-gray-500")
      }
    >
      <Icon size={13} />
      {Math.abs(change).toLocaleString("uz-UZ", { maximumFractionDigits: 2 })}%
      <span className="sr-only">
        {change > 0 ? " o‘sish" : change < 0 ? " pasayish" : " o‘zgarishsiz"}
      </span>
    </span>
  );
}

export default function ProductRow({
  id,
  name,
  category,
  unit,
  currentPrice,
  changePercent,
  historicalPrices,
  onPinToggle,
  isPinned = false,
  isPending = false,
  view = "list",
}: ProductRowProps) {
  const { formatPrice, currencyCode } = useCurrency();
  const chart = (
    <Sparkline prices={historicalPrices || []} change={changePercent} />
  );
  const pin = onPinToggle && (
    <button
      type="button"
      onClick={() => onPinToggle(id)}
      disabled={isPending}
      aria-pressed={isPinned}
      aria-label={
        name + (isPinned ? ": qistirishni bekor qilish" : ": qistirish")
      }
      title={
        isPinned ? "Asosiy paneldan olib tashlash" : "Asosiy panelga qistirish"
      }
      className={
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer " +
        (isPinned
          ? "bg-blue-600/15 text-blue-700 border border-blue-500/20"
          : "text-slate-400 hover:bg-white/80 hover:text-slate-700")
      }
    >
      <Pin className="h-4 w-4" fill={isPinned ? "currentColor" : "none"} />
    </button>
  );

  if (view === "grid") {
    return (
      <article
        className="group flex min-w-0 flex-col justify-between p-5 bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xs hover:shadow-md hover:bg-white/90 rounded-2xl transition-all"
        data-product-card
      >
        <div>
          <div className="mb-3 flex items-center justify-between">
            <ProductIcon name={name} category={category} size="sm" />
            {pin}
          </div>
          <Link
            href={"/product/" + encodeURIComponent(id)}
            className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors"
            title={name}
          >
            {name}
          </Link>
          <p className="mt-1 truncate text-xs text-slate-500" title={category}>
            {category || "Boshqa mahsulotlar"}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100/80">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight tabular-nums">
              {formatPrice(currentPrice)} <span className="text-xs font-normal text-slate-500">{currencyCode}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {formatUnit(unit)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <PriceChange value={changePercent} />
            <span className="text-[11px] text-slate-400">So'nggi o'zgarish</span>
          </div>

          <div className="mt-3 h-8 w-full" aria-label="Narx tarixi">
            {chart}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="group flex items-center justify-between p-4 mb-2 bg-white/75 backdrop-blur-md border border-white/60 shadow-2xs hover:shadow-sm hover:bg-white/90 rounded-xl transition-all">
      <div className="flex-1 min-w-0 pr-4 flex items-center">
        {pin && <div className="mr-3">{pin}</div>}
        <Link href={`/product/${encodeURIComponent(id)}`} className="flex items-center min-w-0 group/link hover:text-blue-600">
          <ProductIcon name={name} category={category} size="sm" className="mr-3" />
          <span className="truncate font-semibold text-slate-900 group-hover/link:text-blue-600">
            {name}
          </span>
        </Link>
      </div>

      <div className="w-24 shrink-0 text-sm text-slate-500 font-medium">
        {formatUnit(unit)}
      </div>

      <div className="w-32 shrink-0 font-bold text-slate-900 text-right pr-4">
        {formatPrice(currentPrice)} <span className="text-xs font-normal text-gray-500">{currencyCode}</span>
      </div>

      <div className="w-24 shrink-0 flex justify-end pr-4">
        <PriceChange value={changePercent} />
      </div>

      <div className="w-32 shrink-0 h-8">
        {chart}
      </div>
    </div>
  );
}

function Sparkline({ prices, change }: { prices: number[]; change: number }) {
  const values = prices.filter(Number.isFinite);
  if (!values.length)
    return <span className="text-[10px] text-gray-400">Tarix mavjud emas</span>;
  const min = Math.min(...values),
    range = Math.max(...values) - min;
  const points = values
    .map(
      (value, i) =>
        (i / Math.max(values.length - 1, 1)) * 116 +
        2 +
        "," +
        (range ? 32 - ((value - min) / range) * 28 : 18),
    )
    .join(" ");
  const color = change > 0 ? "#159875" : change < 0 ? "#dc5862" : "#7c879a";
  return (
    <svg
      viewBox="0 0 120 36"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {values.length === 1 ? (
        <circle cx="60" cy="18" r="2" fill={color} />
      ) : (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
