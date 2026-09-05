# CLAUDE.md — AI Assistant Guide for GEM eSIM

## Project

GEM eSIM is a React/Vite/Base44 application for customer eSIM requests, administrator-controlled inventory assignment, activation tracking, and support. The default branch is `main`.

## Release boundary

- The supported mode is free and approval-based.
- Only genuine provider-issued inventory may be added or assigned.
- Never invent ICCIDs, activation codes, QR codes, coverage, phone numbers, subscriber counts, uptime, or provider status.
- Paid checkout and automatic provider provisioning are not implemented.
- A real provider API must run only in a backend function with credentials stored in Base44 secrets.

## Architecture

- `src/`: React frontend and Base44 SDK client.
- `base44/entities/`: entity schemas and access rules.
- `base44/functions/`: authenticated backend workflows.
- `tests/`: release-contract tests.
- `docs/`: operating and release instructions.

Critical state changes must go through backend functions. Frontend route checks improve UX, while entity RLS and backend authorization are the actual security boundary.

## Required checks

```bash
npm ci
npm run check
npm audit --omit=dev
```

## Working rules

- Read files before editing them.
- Never commit secrets or `.env.local`.
- Use a feature branch; do not push directly to `main`.
- Preserve server-side role checks and entity RLS.
- Keep order, eSIM, and activation states synchronized.
- Deploy only from the authenticated owner account in the linked Base44 Builder.
