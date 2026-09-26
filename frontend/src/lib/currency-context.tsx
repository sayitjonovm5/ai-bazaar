"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type Currency = "UZS" | "USD";

export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (newCurrency: Currency) => void;
  rate: number; // UZS per 1 USD
  rateDate: string;
  rateSource: string;
  rateDiff?: string;
  isLoadingRate: boolean;
  convertPrice: (valueInUZS: number | null | undefined) => number | null;
  formatPrice: (
    valueInUZS: number | string | null | undefined,
    options?: {
      showCurrency?: boolean;
      maximumFractionDigits?: number;
    },
  ) => string;
  currencyCode: Currency;
  currencySymbol: string;
}

const DEFAULT_USD_RATE = 11825.4; // Initial Central Bank rate fallback
const STORAGE_KEY = "narxnazar-preferences";
const CURRENCY_CHANGE_EVENT = "narxnazar-currency-change";

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("UZS");
  const [rate, setRate] = useState<number>(DEFAULT_USD_RATE);
  const [rateDate, setRateDate] = useState<string>("");
  const [rateSource, setRateSource] = useState<string>(
    "O‘zbekiston Respublikasi Markaziy Banki (CBU)",
  );
  const [rateDiff, setRateDiff] = useState<string>("");
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);

  // Sync preference from localStorage
  const syncFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed.currency === "USD" || parsed.currency === "UZS") {
        setCurrencyState(parsed.currency);
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Currency>;
      if (customEvent.detail === "USD" || customEvent.detail === "UZS") {
        setCurrencyState(customEvent.detail);
      } else {
        syncFromStorage();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncFromStorage]);

  // Fetch real-time rate from Central Bank via /api/rates
  useEffect(() => {
    let isMounted = true;
    async function fetchRate() {
      try {
        const res = await fetch("/api/rates");
        if (!res.ok) throw new Error("Rates fetch error");
        const data = await res.json();
        if (isMounted && data.rate && Number.isFinite(data.rate) && data.rate > 0) {
          setRate(data.rate);
          if (data.date) setRateDate(data.date);
          if (data.source) setRateSource(data.source);
          if (data.diff) setRateDiff(data.diff);
        }
      } catch (err) {
        console.warn("Could not load real-time currency rates, using fallback:", err);
      } finally {
        if (isMounted) setIsLoadingRate(false);
      }
    }

    fetchRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed.currency = newCurrency;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      window.dispatchEvent(
        new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: newCurrency }),
      );
    } catch {
      // localStorage may fail in restricted mode
    }
  }, []);

  const convertPrice = useCallback(
    (valueInUZS: number | null | undefined): number | null => {
      if (valueInUZS == null || !Number.isFinite(valueInUZS)) return null;
      if (currency === "USD") {
        return valueInUZS / (rate || DEFAULT_USD_RATE);
      }
      return valueInUZS;
    },
    [currency, rate],
  );

  const formatPrice = useCallback(
    (
      valueInUZS: number | string | null | undefined,
      options?: {
        showCurrency?: boolean;
        maximumFractionDigits?: number;
      },
    ): string => {
      if (valueInUZS == null || valueInUZS === "") return "—";
      const num = Number(valueInUZS);
      if (!Number.isFinite(num)) return "—";

      if (currency === "USD") {
        const usdValue = num / (rate || DEFAULT_USD_RATE);
        const maxFraction =
          options?.maximumFractionDigits !== undefined
            ? options.maximumFractionDigits
            : usdValue < 1
              ? 3
              : 2;
        const formatted = usdValue.toLocaleString("en-US", {
          minimumFractionDigits: Math.min(2, maxFraction),
          maximumFractionDigits: maxFraction,
        });
        return options?.showCurrency ? `${formatted} USD` : formatted;
      }

      // Default UZS
      const formatted = num.toLocaleString("uz-UZ", {
        maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      });
      return options?.showCurrency ? `${formatted} UZS` : formatted;
    },
    [currency, rate],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rate,
      rateDate,
      rateSource,
      rateDiff,
      isLoadingRate,
      convertPrice,
      formatPrice,
      currencyCode: currency,
      currencySymbol: currency === "USD" ? "$" : "UZS",
    }),
    [
      currency,
      setCurrency,
      rate,
      rateDate,
      rateSource,
      rateDiff,
      isLoadingRate,
      convertPrice,
      formatPrice,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Provide safe fallback if used outside CurrencyProvider
    return {
      currency: "UZS",
      setCurrency: () => {},
      rate: DEFAULT_USD_RATE,
      rateDate: "",
      rateSource: "CBU",
      isLoadingRate: false,
      convertPrice: (v) => v ?? null,
      formatPrice: (v) =>
        v == null || v === "" || !Number.isFinite(Number(v))
          ? "—"
          : Number(v).toLocaleString("uz-UZ", { maximumFractionDigits: 2 }),
      currencyCode: "UZS",
      currencySymbol: "UZS",
    };
  }
  return context;
}
