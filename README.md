# CardioWatch AI Clinician Portal

A production-quality functional mock-up of a cardiac monitoring web portal designed for cardiologists and cardiac care teams. Built with React, Vite, and Tailwind CSS — all data is hardcoded/dummy, no real backend or authentication required.

---

## Overview

CardioWatch AI is a simulated clinician-facing dashboard for reviewing AI-detected cardiac events from wearable monitors (e.g., Apple Watch, Holter patches). The portal showcases 7 fully implemented screens with realistic dummy data covering 30+ patients.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/` | Auth page with email/password form, authorized-use disclaimer |
| Dashboard | `/dashboard` | Patient list, risk stratification, unreviewed event count |
| Patient Detail | `/patients/:id` | Tabbed view (Events, ECG Viewer, Trends, History, Settings) |
| Events Tab | within Patient Detail | AI-flagged event queue with confirm/dismiss/reclassify actions |
| ECG Viewer | within Patient Detail | ECG strip viewer with rhythm annotations |
| Trends Tab | within Patient Detail | Heart rate, HRV, SpO2 trend charts with date range selector |
| History Tab | within Patient Detail | Chronological audit log of clinician and system actions |
| Settings Tab | within Patient Detail | Device settings, alert thresholds |
| Notifications | global drawer | In-app notification center |
| Report Modal | overlay | PDF report generation with section and recipient selection |
| Analytics | `/analytics` | Practice-wide utilization and event classification stats |
| User Settings | `/settings` | Profile, notification preferences, role-based practice admin |

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (dev server and build tooling)
- **Tailwind CSS v4** + **shadcn/ui** component library
- **Wouter** (client-side routing)
- **Recharts** (trend charts and analytics visualizations)
- **Vitest** + **React Testing Library** (unit + integration tests)

---

## Project Structure

```
src/
├── components/
│   ├── layout/           # Header, Sidebar, NotificationDrawer
│   ├── patient/          # EventsTab, ECGViewer, TrendsTab, HistoryTab, SettingsTab
│   ├── ui/               # shadcn/ui primitives (button, badge, card, dialog, etc.)
│   └── ReportModal.tsx   # Report generation modal
├── data/
│   ├── patients.ts       # 30+ dummy patients with risk scores, device info
│   ├── events.ts         # AI-detected cardiac events per patient
│   ├── history.ts        # Audit log entries
│   ├── notifications.ts  # In-app notifications
│   └── analytics.ts      # Practice-wide analytics data
├── lib/
│   ├── auth-context.tsx  # Role-based auth context (Clinician / Admin)
│   └── utils.ts          # Tailwind class merge utility
├── pages/
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── patient-detail.tsx
│   ├── analytics.tsx
│   └── settings.tsx
└── test/                 # 389 unit/integration tests across 15 test files
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
# From monorepo root
pnpm --filter @workspace/cardiowatch-portal run dev

# Or from the artifact directory
cd artifacts/cardiowatch-portal
pnpm run dev
```

### Run tests

```bash
pnpm --filter @workspace/cardiowatch-portal run test
```

This runs all 389 tests and outputs a JUnit XML report at:

```
artifacts/cardiowatch-portal/test-results/junit.xml
```

The XML report is compatible with **Xray for Jira** and any standard CI/CD JUnit consumer.

### Build for production

```bash
pnpm --filter @workspace/cardiowatch-portal run build
```

---

## Test Coverage

389 tests across 15 test files:

| Test File | Coverage Area |
|---|---|
| `auth.test.tsx` | Login screen rendering, form validation, navigation |
| `dashboard.test.tsx` | Patient list, risk badges, search/filter, unreviewed count |
| `patient-detail.test.tsx` | Patient header, device info, tab navigation |
| `events.test.tsx` | Event queue, confirm/dismiss/reclassify, filtering |
| `ecg-viewer.test.tsx` | ECG strip display, annotation panel, controls |
| `trends.test.tsx` | Heart rate/HRV/SpO2 charts, date range selector |
| `history.test.tsx` | Audit log entries, actor filtering, sort order |
| `settings.test.tsx` | Device settings, alert thresholds |
| `report-generation.test.tsx` | Report modal, section/recipient selection, generation flow |
| `analytics.test.tsx` | Practice-wide stats, chart data, utilization metrics |
| `notifications.test.tsx` | Notification drawer, unread count, mark-as-read |
| `navigation.test.tsx` | Sidebar links, header, role switcher |
| `accessibility.test.tsx` | ARIA attributes, landmark structure, accessible names |
| `user-settings.test.tsx` | Profile, notification prefs, admin section, invite modal |
| `data-integrity.test.ts` | Data shape validation for all dummy data files |

JUnit XML output is written automatically on every test run to `test-results/junit.xml`.

---

## Dummy Data

All data is hardcoded — no backend or API calls. Highlights:

- **30+ patients** across low/medium/high cardiac risk tiers
- **AF, VT, pause, bradycardia, SVT** event classifications per patient
- **Confidence scores**, heart rate, AI source (Cloud AI vs On-Device) on every event
- **Audit history** with System, Clinician, and Patient actor types
- **In-app notifications** for critical alerts, report ready, sync errors
- **Analytics** with event volume by day, classification breakdown, compliance by patient

---

## Role-Based Access

The portal supports two roles controlled via `AuthContext`:

- **Clinician** — default role; can review events, generate reports, view trends
- **Admin** — reveals the Practice Administration section in Settings (user management, EHR integration status, invite user)

Role switching is available in the user menu in the header.

---

## Notes

- This is a **functional mock-up** — no data is persisted, no real authentication is performed, and no external API calls are made.
- The login form accepts any non-empty email/password combination.
- Designed to simulate a realistic clinical workflow for demonstration and testing purposes.
