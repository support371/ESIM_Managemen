---
name: testing-esim-app
description: Test the e-sim-pulse eSIM management app locally. Use when verifying UI rendering, build integrity, or routing after code changes.
---

# Testing the eSIM Management App

## Prerequisites

- Node.js 18+
- npm

## Devin Secrets Needed

- `VITE_BASE44_APP_ID` — Base44 app ID (needed for authenticated page testing only)
- `VITE_BASE44_APP_BASE_URL` — Base44 API base URL (needed for authenticated page testing only)

Public pages (landing, explore-plans, contact, login, register) can be tested WITHOUT any credentials.

## Setup

```bash
cd ~/repos/ESIM_Managemen
npm install
```

## Running the Dev Server

```bash
npm run dev -- --host 0.0.0.0 --port 3000
```

The app will be available at http://localhost:3000

Note: You'll see `[base44] Proxy not enabled (VITE_BASE44_APP_BASE_URL not set)` — this is expected without credentials.

## Build Verification

```bash
npm run build
```

Expected: Exit code 0, `dist/` directory created with `index.html` and `assets/`.

## Lint

```bash
npm run lint
```

Use `npm run lint:fix` to auto-fix unused import errors.

## Testing Strategy

### Without Base44 Credentials (Public Pages)

These routes work without authentication:
- `/` — Landing page ("eSIM Pro" branding, hero, stats)
- `/explore-plans` — Plans page ("Free eSIM Plans" heading)
- `/contact` — Contact page
- `/login` — Login form (email/password + Google OAuth)
- `/register` — Registration form

### With Base44 Credentials (Authenticated Pages)

Set `.env` with `VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL`, then test:
- `/dashboard` — Role-based dashboard
- `/admin/*` — Admin portal (customers, agents, eSIMs, plans, orders, etc.)
- `/agent/*` — Agent portal (customers, orders, eSIMs, tickets, commissions)
- Customer pages (my-esims, my-orders, etc.)

## Key Architecture Notes

- **Framework:** React 18 + Vite 6 + Tailwind CSS 3
- **Routing:** React Router v6 with client-side navigation
- **State:** TanStack Query for server state, React Context for auth
- **UI:** Radix UI primitives with shadcn/ui patterns
- **Backend:** Base44 SDK (`@base44/sdk`) — all data operations go through Base44
- **Package type:** ESM (`"type": "module"` in package.json) — config files must use `export default` not `module.exports`

## Common Issues

- **Build fails with `module is not defined`**: Config files (tailwind.config.js, postcss.config.js) must use ESM syntax since package.json has `"type": "module"`
- **Lint errors about unused imports**: Run `npm run lint:fix` to auto-remove
- **Blank page after login**: Likely missing Base44 credentials in .env
