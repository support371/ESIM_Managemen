# GEM eSIM Administrator Guide

## Access

1. Open https://e-sim-pulse.base44.app/login.
2. Sign in with an active `admin` or `super_admin` account.
3. Use the administrator navigation shown after login.

`super_admin` is required for user role and account-status changes. Standard administrators cannot promote users.

## Prepare inventory

Only add a profile issued by an authorized eSIM supplier.

1. Open **eSIM Inventory** and select **Add eSIM**.
2. Enter the exact ICCID and provider name.
3. Select the plan represented by the supplier profile.
4. Enter the provider-issued QR URL or LPA activation code. At least one is required.
5. Save the inventory item as available.

Never reuse an ICCID or assign the same provider profile to multiple customers.

## Review and fulfill a request

1. Open **eSIM Requests**.
2. Review a pending request and approve or reject it. Add a useful note when rejecting.
3. For an approved request, reopen **Review**, choose **eSIM Assigned**, and select matching available inventory.
4. Save the decision.

Assignment updates the order and inventory, creates an activation, creates an audit entry, and notifies the customer. Inventory that does not match the requested plan is rejected.

## Track activation

Open **Activations**, choose the activation, and record its state. Marking it active also marks the linked inventory and order active. Expired and deactivated states update the inventory accordingly.

## Support

- Administrators can review and reply to all support tickets.
- Agents can only use agent routes and should only handle their assigned customers/tickets.
- Customers can read only their own operational records.

## System settings

Confirm the business name, support email, phone, response hours, and service mode before launch. API credentials must never be stored as SystemSetting records; store them in Base44 secrets and use them only from backend functions.

## Release procedure

Run:

```bash
npm ci
npm run check
npm audit --omit=dev
```

Then merge the reviewed branch, verify the synchronized resources in the linked Base44 Builder, and select **Publish** from the authenticated owner account. Complete every launch gate in `docs/PRODUCTION_CHECKLIST.md` with a supplier-approved test profile before accepting public requests.
