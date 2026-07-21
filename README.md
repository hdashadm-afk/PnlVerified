# PNLVerified

**Simple P&L** — part of the Dipstify product family.

## Status

In development. Scope is finalized (see [`SCOPE.md`](./SCOPE.md)); this repo now has a working Next.js + Supabase scaffold with the core schema applied, and base Dipstify branding applied (logo, product-family label) as of 2026-07-21. This repo exists so the module has its own home per the Dipstify architecture rule ("every page has their own repo"), matching the pattern already used by [`staffverified-app`](https://github.com/hdashadm-afk/staffverified-app) (StaffVerified) and [`fuel-ops`](https://github.com/hdashadm-afk/fuel-ops) (OpsVerified/StationVerified).

## Context

- PNLVerified is the new brand name for what the Founder OS currently calls "P&L (Simple)" — the existing Accounting department type inside [`katiwala-owner-os-`](https://github.com/hdashadm-afk/katiwala-owner-os-), one of KOS's four connected modules (CEO's Space, HR & Pay, P&L (Simple), Ops).
- Reference logic already built there: `supabase/migrations/031_pnl_pulse_margin.sql`, `035_cost_price_margin.sql`, `036_daily_capex_pnl.sql`, `042_generic_accounting.sql`, `043_capex_to_opex.sql`.
- The **Simple P&L Rule** (documented in `katiwala-owner-os-`'s master direction docs): P&L (Simple) must stay clerk-usable, not become a heavy accounting suite.

## Brand family

Part of the shared Dipstify ecosystem — same logo logic, color system, typography, spacing, and component style as Dipstify, CEOs Space, StaffVerified, and StationVerified. See `katiwala-owner-os-`'s `docs/DIPSTIFY_BRAND_GUIDE.md` for the shared design system (black/white/steel-gray + safety-yellow accent, Inter Tight/Inter/JetBrains Mono).

## Stack

Next.js (App Router) + TypeScript + Tailwind + Supabase (own project, own auth — standalone per `SCOPE.md`).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + publishable key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Schema lives in `supabase/migrations/` (reconstructed 2026-07-20 via schema introspection — the originally-applied files were never committed) and `supabase/seed.sql` for reference data. See `SCOPE.md` for the data model rationale: `stations`, `products`, `profiles`, `inventory_purchases`, `ops_reference_entries` (revenue/volume reference from OpsVerified), `payroll_costs` (single number from StaffVerified), `utility_bills`, `admin_opex`, `cash_position_entries`, `inventory_ledger` (moving-average COGS, trigger-populated), and the `station_profitability` view (Revenue − COGS − Opex, rolled up monthly per station).

To apply against a fresh Supabase project: `supabase link --project-ref <ref>` then `supabase db push`.
