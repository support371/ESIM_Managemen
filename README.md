# GEM eSIM

GEM eSIM is an approval-based eSIM request and inventory management portal built with React, Vite, and Base44.

## Current operating model

The supported release mode is a free, manually fulfilled service:

1. A verified customer selects a catalog plan and submits a request.
2. An administrator approves or rejects the request.
3. An administrator loads a genuine, unused eSIM issued by an authorized provider.
4. The administrator assigns matching inventory to the approved request.
5. The system creates an activation record and exposes the QR/activation code only to the assigned customer and administrators.
6. The administrator records activation state changes; the linked eSIM and order are updated together.

The application does not generate carrier profiles, ICCIDs, QR codes, telephone numbers, or mobile data by itself. Real service requires inventory or an API contract from an authorized eSIM supplier.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set the Base44 values for the target app in `.env.local`.

## Validation

```bash
npm run check
npm audit --omit=dev
```

`npm run check` runs linting, TypeScript validation for TypeScript sources, Base44 release-contract tests, and the production build.

## Deployment

The repository is linked to the Base44 app. Merge the reviewed release branch, open the linked app in Base44 Builder, verify the synchronized entity/function changes, and select **Publish** from the authenticated owner account. Do not publish until the launch gates in `docs/PRODUCTION_CHECKLIST.md` are satisfied.

## Live portal

- Portal: https://e-sim-pulse.base44.app/
- Base44 app: https://app.base44.com/apps/6a199087e53dddf1be550b18
