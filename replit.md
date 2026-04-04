# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## CardioWatch AI Clinician Portal (`artifacts/cardiowatch-portal`)

React + Vite SPA. Client-side auth only (in-memory React state — no localStorage persistence; direct `page.goto` resets auth).

### Playwright E2E Test Suite

- **Location**: `artifacts/cardiowatch-portal/e2e/` (14 spec files, 37 tests)
- **Config**: `artifacts/cardiowatch-portal/playwright.config.ts`
- **Coverage**: TC-01–TC-14 mapping to UR-01–UR-13

| File | TC | Description |
|------|----|-------------|
| `tc01-auth.spec.ts` | TC-01 | Login validation, redirect, logout |
| `tc02-dashboard.spec.ts` | TC-02 | KPI cards, patient table, sorting |
| `tc03-filtering.spec.ts` | TC-03 | Search, severity/status filters |
| `tc04-navigation.spec.ts` | TC-04 | Review button → patient detail |
| `tc05-events.spec.ts` | TC-05 | Confirm, dismiss, reclassify, undo, filter |
| `tc06-ecg-viewer.spec.ts` | TC-06 | Waveform render, speed/gain, annotations, zoom |
| `tc07-trends.spec.ts` | TC-07 | Trends charts |
| `tc08-history.spec.ts` | TC-08 | Audit log |
| `tc09-patient-settings.spec.ts` | TC-09 | Threshold controls |
| `tc10-report.spec.ts` | TC-10 | Report modal open, cancel, submit |
| `tc11-notifications.spec.ts` | TC-11 | Notification drawer open/close |
| `tc12-sidebar-nav.spec.ts` | TC-12 | Sidebar links |
| `tc13-analytics.spec.ts` | TC-13 | Analytics metrics + charts |
| `tc14-app-settings.spec.ts` | TC-14 | Settings profile section + toggles |

**Run command** (requires `$REPLIT_LD_LIBRARY_PATH` to be set — available in Replit shell):
```bash
cd artifacts/cardiowatch-portal && LD_LIBRARY_PATH="/nix/store/24w3s75aa2lrvvxsybficn8y3zxd27kp-mesa-libgbm-25.1.0/lib:$REPLIT_LD_LIBRARY_PATH" PORT=22997 pnpm playwright test
```

**Important navigation pattern**: Because auth is in-memory React state, always navigate to patient detail via the sidebar "Review" button (client-side nav) rather than `page.goto('/patients/:id')` (full reload resets auth).

**App source change**: `header.tsx` — wired `logout()` from auth context onto the "Sign Out" `DropdownMenuItem` (was previously missing).
