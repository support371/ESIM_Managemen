# GEM eSIM Production Checklist

## Application readiness

- [x] Public landing, plan catalog, registration, and login pages
- [x] Customer request, order, eSIM, activation, profile, and support views
- [x] Agent and administrator workspaces
- [x] Server-validated, duplicate-resistant request creation
- [x] Server-authorized approval and rejection
- [x] Matching inventory assignment creates an activation and notification
- [x] Activation changes synchronize linked eSIM and order states
- [x] Customer, agent, admin, and super-admin route gates
- [x] Row-level access controls for operational entities
- [x] Field-level protection for QR and activation codes
- [x] Audit entries for request, assignment, and activation changes
- [x] Production build, lint, contract tests, and dependency audit

## Required before public fulfillment

- [ ] Log in to the intended Base44 owner/admin account
- [ ] Merge the reviewed branch and publish the synchronized resources from the linked Base44 Builder
- [ ] Confirm the intended admin is `super_admin`
- [ ] Load genuine, unused eSIM inventory from an authorized supplier
- [ ] Verify each inventory item has the correct plan, ICCID, provider, and QR or activation code
- [ ] Replace or archive catalog plans that are not covered by real inventory/provider capability
- [ ] Confirm support email, phone, and response hours in System Settings
- [ ] Run one end-to-end test using a non-production provider test profile or a supplier-approved test eSIM
- [ ] Confirm customer accounts cannot open `/agent/*` or `/admin/*`
- [ ] Confirm customers can only read their own orders, eSIMs, activations, payments, and tickets
- [ ] Confirm agents cannot read customer QR or activation codes
- [ ] Remove demo orders, payments, tickets, and claims from the production database or clearly label them as test data

## Launch decision

The software is ready for deployment as a controlled, manual-inventory service. It is not ready to promise active mobile connectivity until the supplier/inventory gates above are complete.

## Access

- Live portal: https://e-sim-pulse.base44.app/
- Base44 app: https://app.base44.com/apps/6a199087e53dddf1be550b18
- Intended admin email: admin@gemcybersecurityassist.com
