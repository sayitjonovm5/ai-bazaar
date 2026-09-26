"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, BarChart3 } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";
import { ErrorState, LoadingState } from "@/components/MarketFeedback";
import {
  readJson,
  formatDate,
  chartForDisplay,
  type ChartPoint,
} from "@/lib/market-ui";
import { useCurrency } from "@/lib/currency-context";
interface HistoryRow {
  Date: string;
  Category: string;
  Current_Price: string;
  Trend: string;
  Price_Change: string;
  Price_Change_Percent: string;
  Period: string;
}
interface Detail {
  chartData: ChartPoint[];
  rawData: HistoryRow[];
}
export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { formatPrice, convertPrice, currencyCode } = useCurrency();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const displayChartData = useMemo(() => {
    if (!data?.chartData) return [];
    if (currencyCode !== "USD") return data.chartData;
    return data.chartData.map((p) => ({
      ...p,
      historical:
        p.historical !== undefined
          ? convertPrice(p.historical) ?? undefined
          : undefined,
      forecastMedian:
        p.forecastMedian !== undefined
          ? convertPrice(p.forecastMedian) ?? undefined
          : undefined,
      forecastRange: p.forecastRange
        ? ([
            convertPrice(p.forecastRange[0]) ?? 0,
            convertPrice(p.forecastRange[1]) ?? 0,
          ] as [number, number])
        : undefined,
    }));
  }, [data?.chartData, currencyCode, convertPrice]);

  useEffect(() => {
    const controller = new AbortController();
    readJson<Detail>("/api/product/" + encodeURIComponent(id), {
      signal: controller.signal,
    })
      .then((result) => {
        if (!Array.isArray(result.chartData) || !Array.isArray(result.rawData))
          throw new Error("Invalid product");
        setData({
          chartData: chartForDisplay(result.chartData),
          rawData: [...result.rawData].sort((a, b) =>
            b.Date.localeCompare(a.Date),
          ),
        });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Mahsulot tarixi va prognozini hozir yuklab bo‘lmadi.");
      });
    return () => controller.abort();
  }, [id, attempt]);
  let name = id;
  try {
    name = decodeURIComponent(id);
  } catch {
    /* Keep the original name for malformed escapes. */
  }
  return (
    <div className="page-shell">
      <header className="surface mb-6 flex flex-col justify-between gap-5 p-5 sm:p-6 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <ProductIcon name={name} size="xl" showCategoryHint={false} />
          <div className="min-w-0">
            <div className="eyebrow">Mahsulot tahlili</div>
            <h1 className="break-words text-xl font-semibold sm:text-2xl">
              {name}
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              Tarixiy narxlar va kelgusi hafta uchun AI prognozi
            </p>
          </div>
        </div>
        <Link href="/search" className="button-secondary shrink-0 self-start">
          <ArrowLeft size={15} />
          Barcha mahsulotlar
        </Link>
      </header>
      {error ? (
        <ErrorState
          message={error}
          retry={() => {
            setError("");
            setData(null);
            setAttempt((a) => a + 1);
          }}
        />
      ) : !data ? (
        <LoadingState />
      ) : (
        <div className="flex min-w-0 flex-col gap-6">
          <section className="surface min-w-0 p-4 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold sm:text-lg">
                  Tarixiy narxlar va kelgusi hafta prognozi
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Narxlar {currencyCode === "USD" ? "AQSh dollarida (USD)" : "O‘zbekiston so‘mida (UZS)"}
                </p>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="bg-blue-500" />
                  Tarixiy narx
                </span>
                <span>
                  <i className="bg-emerald-600" />
                  AI prognozi
                </span>
              </div>
            </div>
            {!data.chartData.some((p) => p.forecastMedian !== undefined) && (
              <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                Yangilangan haftalik prognoz hali mavjud emas.
              </p>
            )}
            {data.chartData.length ? (
              <div className="h-72 min-w-0 sm:h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart
                    data={displayChartData}
                    margin={{ top: 16, right: 8, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#edf0f5"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      minTickGap={35}
                      tick={{ fill: "#7c879a", fontSize: 10 }}
                      tickFormatter={(date) => formatDate(date, true)}
                    />
                    <YAxis
                      width={56}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#7c879a", fontSize: 10 }}
                      domain={[0, "auto"]}
                      tickFormatter={(v) =>
                        new Intl.NumberFormat("en", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(v))
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #dfe5ee",
                        fontSize: 12,
                      }}
                      formatter={(value, key) => [
                        Array.isArray(value)
                          ? value
                              .map((v) =>
                                currencyCode === "USD"
                                  ? Number(v).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : Number(v).toLocaleString("uz-UZ", {
                                      maximumFractionDigits: 2,
                                    }),
                              )
                              .join(" – ") +
                            " " +
                            currencyCode
                          : (currencyCode === "USD"
                              ? Number(value).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : Number(value).toLocaleString("uz-UZ", {
                                  maximumFractionDigits: 2,
                                })) +
                            " " +
                            currencyCode,
                        key === "historical"
                          ? "Tarixiy narx"
                          : key === "forecastRange"
                            ? "Prognoz oralig‘i"
                            : "O‘rtacha prognoz",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="forecastRange"
                      fill="#15987518"
                      stroke="none"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke="#4276df"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecastMedian"
                      stroke="#159875"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: "white" }}
                      connectNulls
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state">
                <BarChart3 />
                <p>Bu mahsulot uchun narx tarixi hali mavjud emas.</p>
              </div>
            )}
          </section>
          <section className="surface min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 p-5 sm:p-6">
              <h2 className="text-base font-semibold sm:text-lg">
                Tarixiy ma’lumotlar
              </h2>
              <span className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                {data.rawData.length} ta yozuv
              </span>
            </div>
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Tarixiy narxlar jadvali"
            >
              <table className="w-full text-left text-xs text-gray-600">
                <caption className="sr-only">
                  {name} — haftalik narxlar tarixi
                </caption>
                <thead className="border-y border-gray-200 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                  <tr>
                    {[
                      "Sana",
                      "Kategoriya",
                      `Joriy narx (${currencyCode})`,
                      "Trend",
                      `O‘zgarish (${currencyCode})`,
                      "O‘zgarish (%)",
                      "Davr",
                    ].map((label) => (
                      <th key={label} scope="col" className="px-5 py-3.5">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rawData.map((row, i) => (
                    <tr
                      key={row.Date + "-" + i}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                        {row.Date}
                      </td>
                      <td className="px-5 py-4">{row.Category}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                        {formatPrice(row.Current_Price)}
                      </td>
                      <td
                        className={
                          "px-5 py-4 " +
                          (row.Trend === "▲"
                            ? "text-emerald-700"
                            : row.Trend === "▼"
                              ? "text-red-700"
                              : "text-gray-400")
                        }
                      >
                        {row.Trend}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatPrice(row.Price_Change)}
                      </td>
                      <td className="px-5 py-4">
                        {Number.isFinite(Number(row.Price_Change_Percent))
                          ? Number(row.Price_Change_Percent).toLocaleString(
                              "uz-UZ",
                              { maximumFractionDigits: 2 },
                            )
                          : "—"}
                        %
                      </td>
                      <td className="min-w-44 px-5 py-4 text-[11px]">
                        {row.Period}
                      </td>
                    </tr>
                  ))}
                  {!data.rawData.length && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-500"
                      >
                        Ma’lumot topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
