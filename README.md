# GEM eSIM Management Platform

**Live App:** https://e-sim-pulse.base44.app/  
**Admin Contact:** admin@gemcybersecurityassist.com  
**Support:** admin@gemcybersecurityassist.com  
**Company:** GEM Cybersecurity-Monitoring Assist

---

## Overview

GEM ESIM is a free eSIM management platform built on Base44. Customers can request, activate, and manage digital SIM cards with no payment required — they submit a request and the admin team handles fulfillment.

## Platform Features

- 🌍 **8 Global Plans** — USA, Europe, Asia, Middle East, Africa, South America, Global
- 📱 **Free eSIM Requests** — No payment required, admin approval workflow
- 🎫 **Support Ticket System** — Multi-category support (activation, billing, technical, account)
- 📊 **Admin Dashboard** — Order management, eSIM assignment, customer tracking
- 🔔 **Email Alerts** — Automated notifications for new orders

## Data Model

| Entity | Description |
|--------|-------------|
| `Plan` | eSIM plan catalog (8 active plans) |
| `Order` | Customer order requests |
| `Esim` | eSIM inventory and assignments |
| `Payment` | Payment records |
| `Activation` | eSIM activation logs |
| `SupportTicket` | Customer support tickets |
| `AuditLog` | Admin action audit trail |
| `Notification` | System notifications |
| `Commission` | Commission tracking |
| `SystemSetting` | App configuration (admin email, etc.) |

## Current Order Status

| Status | Count |
|--------|-------|
| pending_review | 5 (Victoria Eleanor - USA plans) |
| approved | 1 |
| completed | 4 |
| processing | 2 |
| pending | 3 |
| cancelled | 1 |

## eSIM Plans

| Plan | Region | Data | Price | Validity |
|------|--------|------|-------|---------|
| USA Starter | North America | 1GB | $4.99 | 7 days |
| USA Explorer | North America | 5GB | $14.99 | 15 days |
| Europe Traveler | Europe | 10GB | $24.99 | 30 days |
| Asia Connect | Asia | 3GB | $9.99 | 14 days |
| Global Unlimited | Global | Unlimited | $49.99 | 30 days |
| Middle East Basic | Middle East | 2GB | $7.99 | 10 days |
| Africa Explorer | Africa | 5GB | $19.99 | 30 days |
| South America Pack | South America | 8GB | $17.99 | 21 days |

## Automation Setup

The platform uses entity-trigger automations to notify the admin of new orders in real-time (no polling waste).

### Order Alert Automation
- **Trigger:** New Order created with `status: pending_review`
- **Action:** Email alert to admin@gemcybersecurityassist.com
- **Method:** Entity trigger (fires once per new order, not on a schedule)

## Production Deployment

- **Platform:** Base44  
- **App ID:** `6a199087e53dddf1be550b18`  
- **Status:** Live / Production  
- **Authentication:** Google OAuth + Email/Password  

## Admin Access

Log in at https://e-sim-pulse.base44.app/ using your registered admin account to:
1. Review and approve pending orders
2. Assign eSIMs from inventory
3. Send QR codes to customers
4. Manage support tickets
5. Update system settings

---

*Last updated: June 4, 2026*
