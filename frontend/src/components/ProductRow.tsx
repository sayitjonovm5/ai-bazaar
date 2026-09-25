"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { ArrowUp, ArrowDown, Pin } from "lucide-react";
import Link from "next/link";
import ProductIcon from "./ProductIcon";

interface ProductRowProps {
  id: string;
  name: string;
  category?: string;
  unit: string;
  currentPrice: number;
  changePercent: number;
  historicalPrices: number[];
  onPinToggle?: (id: string) => void;
  isPinned?: boolean;
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
}: ProductRowProps) {
  const chartData = historicalPrices.map((price, index) => ({
    name: `Day ${index}`,
    price: price,
  }));

  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  return (
    <div className="group flex items-center justify-between p-4 mb-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0 pr-4 flex items-center">
        {onPinToggle && (
          <button
            onClick={() => onPinToggle(id)}
            className={`mr-3 p-1.5 rounded-full transition-colors ${
              isPinned ? "bg-blue-100 text-blue-600" : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
            }`}
            title={isPinned ? "Asosiy paneldan olib tashlash" : "Asosiy panelga qistirish"}
          >
            <Pin className="h-4 w-4" />
          </button>
        )}
        <Link href={`/product/${id}`} className="flex items-center min-w-0 group/link hover:text-blue-600">
          <ProductIcon name={name} category={category} size="sm" className="mr-3" />
          <span className="truncate font-medium text-gray-900 group-hover/link:text-blue-600">
            {name}
          </span>
        </Link>
      </div>

      <div className="w-24 shrink-0 text-sm text-gray-500">
        {unit}
      </div>

      <div className="w-32 shrink-0 font-medium text-gray-900 text-right pr-4">
        {currentPrice != null ? currentPrice.toLocaleString("uz-UZ") : "0"} UZS
      </div>

      <div className="w-24 shrink-0 flex justify-end pr-4">
        {isPositive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
            <ArrowUp className="h-3 w-3" />
            {changePercent}%
          </span>
        ) : isNegative ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
            <ArrowDown className="h-3 w-3" />
            {Math.abs(changePercent)}%
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
            {changePercent}%
          </span>
        )}
      </div>

      <div className="w-32 h-10 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : isNegative ? "#ef4444" : "#6b7280"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
