# Frontend polish

Based on Abrorjon commit 2c1e0e2. All implementation changes are in frontend UI files; API routes, Prisma schema, data pipelines, and ProductIcon artwork are unchanged.

## What's changed

- Consistent typography, spacing, surfaces, navigation states, responsive layouts and keyboard focus.
- Product search list/grid toggle; four grid columns on desktop, two on narrower content areas, one on mobile. The selected view persists in browser storage.
- Search retains its filters when switching views and can load more than the original 60 results.
- Loading, empty, failure and pin feedback; accessible controls; image fallbacks.
- Existing dashboard card/chart positions retained. Random display percentages replaced with calculated forecast changes; period buttons now filter the chart.
- Expired cached forecasts are not presented as future predictions.
- Marketplace search rendered and phone display aligned with the existing API schema.
- Settings preferences save locally; the UI identifies services that are not yet active.
- Geist is self-hosted through @fontsource-variable/geist, avoiding build-time Google Fonts downloads.

## Validation

- Browser checks: desktop four-column grid, mobile list/grid, filtering, empty results, saved view after reload, product details, marketplace search, chat failure handling, signed-in dashboard, pin persistence, profile save, and offer submission. The temporary preview database was restored byte-for-byte afterward.
- Focused presentation tests: node --test tests/market-ui.test.mjs.
- ESLint run against all changed UI TypeScript files.
- Production compilation succeeds, but the existing full-project TypeScript check fails in unchanged backend/configuration files:
  - prisma.config.ts imports prisma/config, which is not available in the installed Prisma 5 version.
  - src/app/api/chat/route.ts has an implicitly-any word parameter.
  - src/app/api/product/[id]/route.ts assigns forecast properties to an inferred historical-only object type.

The backend issues above must be resolved before a production build can complete. They were deliberately kept outside this frontend branch.
