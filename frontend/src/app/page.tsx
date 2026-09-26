"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TrendingUp, Package, Calendar, PinOff } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ProductIcon from "@/components/ProductIcon";
import { PriceChange } from "@/components/ProductRow";
import { ErrorState, LoadingState } from "@/components/MarketFeedback";
import {
  readJson,
  formatUnit,
  formatDate,
  chartForDisplay,
  type Product,
  type ChartPoint,
} from "@/lib/market-ui";
import { useCurrency } from "@/lib/currency-context";
import toast from "react-hot-toast";

type PinnedProduct = Product & { chartData: ChartPoint[] };
function marketIndex(products: PinnedProduct[]) {
  const dates = new Map<string, { history: number[]; forecast: number[] }>();
  for (const product of products) {
    const baseline =
      product.chartData.find((p) => p.historical !== undefined)?.historical ||
      1;
    for (const point of product.chartData) {
      const item = dates.get(point.date) || { history: [], forecast: [] };
      if (point.historical !== undefined)
        item.history.push((point.historical / baseline) * 100);
      if (point.forecastMedian !== undefined)
        item.forecast.push((point.forecastMedian / baseline) * 100);
      dates.set(point.date, item);
    }
  }
  const average = (values: number[]) =>
    values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : undefined;
  return [...dates.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date,
      historicalIndex: average(values.history),
      forecastIndex: average(values.forecast),
    }));
}
const shortDate = (date: string) => formatDate(date, true);
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #dfe5ee",
  fontSize: 12,
  boxShadow: "0 8px 24px #18243b10",
};
export default function Dashboard() {
  const { formatPrice, currencyCode } = useCurrency();
  const [products, setProducts] = useState<PinnedProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [period, setPeriod] = useState(90);
  const [pending, setPending] = useState<string[]>([]);
  const inFlight = useRef(new Set<string>());
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session?.user) return;
    const controller = new AbortController();
    async function load() {
      try {
        const [all, ids] = await Promise.all([
          readJson<Product[]>("/api/products", { signal: controller.signal }),
          readJson<string[]>("/api/user/pins", { signal: controller.signal }),
        ]);
        const pins = all.filter((p) => ids.includes(p.id));
        const details = await Promise.all(
          pins.map((p) =>
            readJson<{ chartData: ChartPoint[] }>(
              "/api/product/" + encodeURIComponent(p.id),
              { signal: controller.signal },
            ),
          ),
        );
        setProducts(
          pins.map((p, i) => ({
            ...p,
            chartData: chartForDisplay(details[i].chartData || []),
          })),
        );
        setLoaded(true);
      } catch {
        if (!controller.signal.aborted) {
          setError("Saqlangan mahsulotlarni yuklab bo‘lmadi.");
          setLoaded(true);
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [session, attempt]);
  const pinned = session ? products : [];
  const index = marketIndex(pinned);
  const latestDate = index.length
    ? new Date(index[index.length - 1].date).getTime()
    : 0;
  const filteredIndex = index.filter(
    (p) => new Date(p.date).getTime() >= latestDate - period * 86400000,
  );
  const avgGrowth = pinned.length
    ? pinned.reduce((sum, p) => sum + p.changePercent, 0) / pinned.length
    : 0;
  const first = filteredIndex.find(
    (p) => p.historicalIndex !== undefined,
  )?.historicalIndex;
  const last = filteredIndex.at(-1);
  const lastValue = last?.forecastIndex ?? last?.historicalIndex;
  const growth =
    first && lastValue !== undefined ? ((lastValue - first) / first) * 100 : 0;
  async function unpin(id: string) {
    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setPending((prev) => [...prev, id]);
    try {
      await readJson("/api/user/pins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: id }),
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Mahsulot paneldan olib tashlandi");
    } catch {
      toast.error("Mahsulotni olib tashlab bo‘lmadi.");
    } finally {
      inFlight.current.delete(id);
      setPending((prev) => prev.filter((p) => p !== id));
    }
  }
  return (
    <div className="page-shell">
      <header className="page-heading">
        <div className="eyebrow">Shaxsiy kuzatuv paneli</div>
        <h1>Bosh sahifa</h1>
        <p>Bozor dinamikasi, mahsulotlar va prognozlar — barchasi bir joyda.</p>
      </header>
      {status === "loading" || (session && !loaded) ? (
        <LoadingState />
      ) : error && session ? (
        <ErrorState
          message={error}
          retry={() => {
            setError("");
            setLoaded(false);
            setAttempt((a) => a + 1);
          }}
        />
      ) : pinned.length === 0 ? (
        <div className="surface empty-state">
          <Package />
          <h2>Hali mahsulot saqlanmagan</h2>
          <p>
            Kerakli mahsulotlarni qidiruv sahifasidan qistiring. Ularning narxi
            va prognozlari shu yerda ko‘rinadi.
          </p>
          <Link href="/search" className="button-primary">
            Mahsulot qidirish
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="surface flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Kuzatilayotgan mahsulotlar
                </p>
                <p className="text-3xl font-semibold tabular-nums">
                  {pinned.length}
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    ta mahsulot
                  </span>
                </p>
              </div>
            </div>
            <div className="surface flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500">O‘rtacha o‘zgarish</p>
                <p className="text-3xl font-semibold tabular-nums">
                  {avgGrowth > 0 ? "+" : ""}
                  {avgGrowth.toFixed(1)}%
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    so‘nggi kuzatuv
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="grid auto-rows-max grid-cols-1 items-start gap-5 md:grid-cols-2 lg:col-span-2">
              {pinned.map((p, i) => {
                const forecast = p.chartData.findLast(
                  (point) => point.forecastMedian !== undefined,
                )?.forecastMedian;
                const change =
                  forecast !== undefined && p.currentPrice
                    ? ((forecast - p.currentPrice) / p.currentPrice) * 100
                    : null;
                return (
                  <article
                    key={p.id}
                    className="surface min-w-0 p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-5 flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <ProductIcon
                          name={p.name}
                          category={p.category}
                          size="md"
                        />
                        <div className="min-w-0">
                          <Link
                            href={"/product/" + encodeURIComponent(p.id)}
                            className="block truncate text-sm font-semibold hover:text-blue-600"
                            title={p.name}
                          >
                            {p.name}
                          </Link>
                          <p className="mt-1 text-[11px] text-gray-500">
                            {formatUnit(p.unit)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => unpin(p.id)}
                        disabled={pending.includes(p.id)}
                        aria-label={p.name + ": qistirishni bekor qilish"}
                        title="Paneldan olib tashlash"
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <PinOff size={15} />
                      </button>
                    </div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="break-all text-2xl font-semibold tracking-tight tabular-nums">
                        {formatPrice(p.currentPrice)}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          {currencyCode}
                        </span>
                      </p>
                      <PriceChange value={p.changePercent} />
                    </div>
                    <div className="h-32 min-w-0">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                      >
                        <AreaChart
                          data={p.chartData}
                          margin={{ top: 6, right: 0, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id={"hist-" + i}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4276df"
                                stopOpacity={0.18}
                              />
                              <stop
                                offset="100%"
                                stopColor="#4276df"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis domain={[0, "auto"]} hide />
                          <Tooltip
                            contentStyle={tooltipStyle}
                            labelFormatter={(label) => shortDate(String(label))}
                            formatter={(value) => [
                              formatPrice(Number(value)) + " " + currencyCode,
                              "Narx",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="historical"
                            stroke="#4276df"
                            strokeWidth={2}
                            fill={"url(#hist-" + i + ")"}
                            connectNulls
                          />
                          <Area
                            type="monotone"
                            dataKey="forecastMedian"
                            stroke="#159875"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill="#15987510"
                            connectNulls
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-legend mt-3">
                      <span>
                        <i className="bg-blue-500" />
                        Tarixiy narx
                      </span>
                      <span>
                        <i className="bg-emerald-600" />
                        Prognoz
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar size={13} />7 kunlik prognoz
                      </span>
                      {change !== null ? (
                        <PriceChange value={change} />
                      ) : (
                        <span className="text-xs text-gray-400">
                          Mavjud emas
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="min-w-0 lg:col-span-1">
              <section className="surface sticky top-0 p-5">
                <h2 className="text-lg font-semibold">Bozor dinamikasi</h2>
                <p className="mb-5 mt-1 text-xs text-gray-500">
                  Siz kuzatayotgan mahsulotlar indeksi
                </p>
                <div
                  role="group"
                  aria-label="Grafik davri"
                  className="mb-5 flex gap-1 rounded-lg bg-gray-50 p-1"
                >
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      aria-pressed={period === days}
                      onClick={() => setPeriod(days)}
                      className={
                        "flex-1 rounded-md py-2 text-xs font-medium " +
                        (period === days
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-gray-500 hover:text-gray-900")
                      }
                    >
                      {days} kun
                    </button>
                  ))}
                </div>
                <div className="mb-4 h-60 min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart
                      data={filteredIndex}
                      margin={{ top: 10, right: 4, left: -26, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#edf0f5"
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={shortDate}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#7c879a" }}
                        minTickGap={25}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#7c879a" }}
                        domain={["dataMin - 5", "dataMax + 5"]}
                        tickFormatter={(v) => Number(v).toFixed(0)}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelFormatter={(label) => shortDate(String(label))}
                        formatter={(value) => [
                          Number(value).toFixed(2) + " ball",
                          "Indeks",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="historicalIndex"
                        stroke="#4276df"
                        strokeWidth={2}
                        fill="#4276df12"
                        connectNulls
                      />
                      <Area
                        type="monotone"
                        dataKey="forecastIndex"
                        stroke="#159875"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="#15987510"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend border-b border-gray-100 pb-5">
                  <span>
                    <i className="bg-blue-500" />
                    Tarixiy indeks
                  </span>
                  <span>
                    <i className="bg-emerald-600" />
                    Prognoz
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <TrendingUp className="h-10 w-10 rounded-xl bg-blue-50 p-2.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium">
                      Davr bo‘yicha o‘zgarish
                    </p>
                    <p
                      className={
                        "mt-1 text-xl font-semibold tabular-nums " +
                        (growth >= 0 ? "text-emerald-700" : "text-red-700")
                      }
                    >
                      {growth > 0 ? "+" : ""}
                      {growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
