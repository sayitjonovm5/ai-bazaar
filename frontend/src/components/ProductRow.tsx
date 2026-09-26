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
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
        (isPinned
          ? "bg-blue-50 text-blue-600"
          : "text-gray-400 hover:bg-gray-100 hover:text-blue-600")
      }
    >
      <Pin className="h-4 w-4" fill={isPinned ? "currentColor" : "none"} />
    </button>
  );
  if (view === "grid")
    return (
      <article
        className="surface flex min-w-0 flex-col p-4 transition-shadow hover:shadow-md"
        data-product-card
      >
        <div className="mb-4 flex items-center justify-between">
          <ProductIcon name={name} category={category} size="sm" />
          {pin}
        </div>
        <Link
          href={"/product/" + encodeURIComponent(id)}
          className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 hover:text-blue-600"
          title={name}
        >
          {name}
        </Link>
        <p className="mt-1 truncate text-[11px] text-gray-500" title={category}>
          {category || "Boshqa mahsulotlar"}
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="break-all text-xl font-semibold tracking-tight tabular-nums">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-[10px] font-medium text-gray-500">
            {currencyCode} / {formatUnit(unit)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <PriceChange value={changePercent} />
          <span className="text-[10px] text-gray-500">So‘nggi o‘zgarish</span>
        </div>
        <div className="mt-4 h-12 w-full" aria-label="Narx tarixi">
          {chart}
        </div>
      </article>
    );
  return (
    <article
      className="surface product-list-columns px-3 py-3.5 sm:px-4 transition-shadow hover:shadow-md"
      data-product-row
    >
      <div className="flex min-w-0 items-center gap-2">
        {pin}
        <Link
          href={"/product/" + encodeURIComponent(id)}
          className="flex min-w-0 items-center gap-3 hover:text-blue-600"
        >
          <ProductIcon name={name} category={category} size="sm" />
          <span className="min-w-0">
            <span
              className="block truncate text-[13px] font-semibold"
              title={name}
            >
              {name}
            </span>
            <span className="mt-1 block truncate text-[11px] text-gray-500">
              {category}
            </span>
          </span>
        </Link>
      </div>
      <span className="product-list-unit text-xs text-gray-500">
        {formatUnit(unit)}
      </span>
      <div className="text-right">
        <span className="block text-[13px] font-semibold tabular-nums">
          {formatPrice(currentPrice)}
        </span>
        <span className="text-[10px] font-medium text-gray-500">{currencyCode}</span>
      </div>
      <div className="product-list-change text-right">
        <PriceChange value={changePercent} />
      </div>
      <div className="product-list-chart h-9 min-w-0" aria-label="Narx tarixi">
        {chart}
      </div>
    </article>
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
