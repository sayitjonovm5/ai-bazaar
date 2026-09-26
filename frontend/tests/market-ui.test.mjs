import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/market-ui.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { chartForDisplay, formatPrice, formatDate } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

test("stale forecasts cannot appear as future price predictions", () => {
  const result = chartForDisplay([
    {
      date: "2025-12-12",
      historical: 110,
      forecastMedian: 110,
      forecastRange: [110, 110],
    },
    { date: "2025-06-20", forecastMedian: 90, forecastRange: [80, 100] },
    { date: "2025-12-05", historical: 105 },
  ]);
  assert.deepEqual(result, [
    { date: "2025-12-05", historical: 105 },
    { date: "2025-12-12", historical: 110 },
  ]);
});
test("a valid next-week forecast retains its range and connection", () => {
  const points = [
    {
      date: "2025-12-12",
      historical: 110,
      forecastMedian: 110,
      forecastRange: [110, 110],
    },
    { date: "2025-12-19", forecastMedian: 115, forecastRange: [100, 125] },
  ];
  assert.deepEqual(chartForDisplay(points), points);
  assert.deepEqual(chartForDisplay([]), []);
});
test("missing and invalid prices never display as zero or NaN", () => {
  for (const value of [null, undefined, "", NaN, "not-a-number"])
    assert.equal(formatPrice(value), "—");
  assert.equal(formatPrice(0), "0");
});
test("dates stay readable without locale-specific month placeholders", () => {
  assert.equal(formatDate("2025-12-12", true), "12.12");
  assert.equal(formatDate("2025-12-12"), "12.12.2025");
  assert.equal(formatDate("invalid"), "—");
});
