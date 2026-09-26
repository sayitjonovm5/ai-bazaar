export interface Product {
  id: string;
  name: string;
  category?: string;
  contractType?: string;
  unit: string;
  currentPrice: number;
  changePercent: number;
  historicalPrices: number[];
}
export interface ChartPoint {
  date: string;
  historical?: number;
  forecastMedian?: number;
  forecastRange?: [number, number];
}
export function formatPrice(value: number | string | null | undefined) {
  if (value == null || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("uz-UZ", { maximumFractionDigits: 2 })
    : "—";
}
export function formatUnit(unit?: string) {
  return !unit || unit === "unit" ? "birlik" : unit;
}
export async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok)
    throw new Error("Ma’lumotlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.");
  return response.json() as Promise<T>;
}

export function formatDate(value: string, short = false) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return day + "." + month + (short ? "" : "." + date.getUTCFullYear());
}
// A cached forecast older than the latest observation is not a future prediction.
export function chartForDisplay(points: ChartPoint[]): ChartPoint[] {
  const latestHistory = points
    .filter((p) => p.historical !== undefined)
    .map((p) => p.date)
    .sort()
    .at(-1);
  const hasFuture =
    latestHistory &&
    points.some(
      (p) => p.forecastMedian !== undefined && p.date > latestHistory,
    );
  return points
    .filter(
      (p) =>
        p.historical !== undefined || (hasFuture && p.date > latestHistory!),
    )
    .map((p) => {
      if (hasFuture) return p;
      return { date: p.date, historical: p.historical };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
