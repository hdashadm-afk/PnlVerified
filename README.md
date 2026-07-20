# PNLVerified

**Simple P&L** — part of the Katiwala product family.

## Status

Scope finalized (see [`SCOPE.md`](./SCOPE.md)) — no app code yet, build comes next. This repo exists so the module has its own home per the Katiwala architecture rule ("every page has their own repo"), matching the pattern already used by [`staffverified-app`](https://github.com/hdashadm-afk/staffverified-app) (StaffVerified) and [`fuel-ops`](https://github.com/hdashadm-afk/fuel-ops) (OpsVerified/StationVerified).

## Context

- PNLVerified is the new brand name for what the Katiwala Founder OS currently calls "P&L (Simple)" — the existing Accounting department type inside [`katiwala-owner-os-`](https://github.com/hdashadm-afk/katiwala-owner-os-), one of KOS's four connected modules (CEO's Space, HR & Pay, P&L (Simple), Ops).
- Reference logic already built there (to port or reimplement here once scope is defined): `supabase/migrations/031_pnl_pulse_margin.sql`, `035_cost_price_margin.sql`, `036_daily_capex_pnl.sql`, `042_generic_accounting.sql`, `043_capex_to_opex.sql`.
- The **Simple P&L Rule** (documented in `katiwala-owner-os-`'s master direction docs): P&L (Simple) must stay clerk-usable, not become a heavy accounting suite.

## Brand family

Part of the shared Katiwala ecosystem — same logo logic, color system, typography, spacing, and component style as Katiwala AI App, CEOs Space, StaffVerified, StationVerified, CafeVerified, and HotelVerified. See `katiwala-owner-os-`'s `docs/BRAND_GUIDE.md` for the shared design system this repo should follow once UI work starts.
