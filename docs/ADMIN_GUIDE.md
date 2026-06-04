# GEM eSIM Admin Guide

## Accessing the Admin Panel

1. Go to https://e-sim-pulse.base44.app/
2. Click **Sign In** and log in with your admin account
3. Navigate to the **Admin** section from the dashboard

## Managing Orders

### Pending Review Orders
Orders with `status: pending_review` are free eSIM requests that need admin approval.

**Steps to approve:**
1. Go to Admin → Orders
2. Find orders with "Pending Review" status
3. Click an order to open it
4. Review customer details
5. Click **Approve** to move forward, or **Reject** with a reason

### Current Pending Orders (as of June 4, 2026)
All 5 from Victoria Eleanor (victoriaeleanor544@gmail.com):
- REQ-MPR8BNL6 — USA Starter (1GB, 7 days)
- REQ-MPR8BILN — USA Starter (1GB, 7 days)
- REQ-MPR8BBZ2 — USA Starter (1GB, 7 days)
- REQ-MPR78LSI — USA Explorer (5GB, 15 days)
- REQ-MPR78EM2 — USA Starter (1GB, 7 days)

## Support Tickets

### Open Tickets Requiring Attention
| Ticket | Priority | Issue |
|--------|----------|-------|
| TKT-001 | HIGH | eSIM not activating on iPhone 15 (Sarah Johnson) |
| TKT-007 | CRITICAL | Unable to login on new device (Mike Chen) |
| TKT-009 | HIGH | Duplicate charge on card (James Wilson) |
| TKT-005 | HIGH | Refund request for expired eSIM (Sarah Johnson) |
| TKT-003 | MEDIUM | Slow data speed in France (Emily Davis) |
| TKT-008 | MEDIUM | Hotspot not working (Emily Davis) |

## System Settings

Update these in the app's SystemSetting entity:
- `admin_email`: admin@gemcybersecurityassist.com
- `support_email`: admin@gemcybersecurityassist.com

## Order Alert Automation

The platform uses an entity-trigger automation:
- Fires when a new Order is created
- Sends immediate email to admin@gemcybersecurityassist.com
- No polling — only fires on real new orders

