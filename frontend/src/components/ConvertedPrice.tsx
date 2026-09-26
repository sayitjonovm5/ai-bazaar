"use client";

import React from "react";
import { useCurrency } from "@/lib/currency-context";
import { formatUnit } from "@/lib/market-ui";

interface ConvertedPriceProps {
  price: number | string | null | undefined;
  className?: string;
  showCode?: boolean;
  unit?: string;
  maximumFractionDigits?: number;
}

export default function ConvertedPrice({
  price,
  className = "",
  showCode = true,
  unit,
  maximumFractionDigits,
}: ConvertedPriceProps) {
  const { formatPrice, currencyCode } = useCurrency();

  const formatted = formatPrice(price, { maximumFractionDigits });

  return (
    <span className={className}>
      <span>{formatted}</span>
      {showCode && (
        <span className="text-xs font-normal text-gray-500 ml-1">
          {currencyCode}
          {unit ? ` / ${formatUnit(unit)}` : ""}
        </span>
      )}
    </span>
  );
}
