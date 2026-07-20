# PNLVerified — Scope
Finalized 2026-07-20. Not yet built — this is the scope decision, build comes later.

## Architecture

- **Standalone product.** Own auth, own database, own deploy — not a Station Control add-on. A customer may buy PNLVerified without ever running Station Control, StaffVerified, or OpsVerified, matching how StaffVerified (`staffverified-app`) and OpsVerified (`fuel-ops`) already work. Station Control is the optional hub that gets richer when connected; it is not a dependency for any of the other three.
- **Data entry model:** department-head intake form (Accounting), not spreadsheet upload — matches the existing `department_reports` pattern in `katiwala-owner-os-` and keeps the module clerk-usable per the Simple P&L Rule (a disciplined daily reporting system a CPA can later review/reconcile/audit, not a heavy accounting suite).

## Data boundary vs. OpsVerified

Confirmed by comparing PNLVerified's reference spreadsheets (`Helium_Profitability.xlsx`, `DipstickMonitoring.xlsx`, `CASH_COUNT_NEW.xlsx`) against `fuel-ops`'s actual built app (Smart Station Pro / V100SSP):

**OpsVerified already owns (built, not duplicated here):**
- Dipstick readings → volume (Dipstick tab, "dipstick is the source of truth")
- Delivery Variance, Transfer Variance
- Shift-level cash variance (DSR + AM sales vs. actual cash count)
- Revenue computed from dipstick data
- Variance alert webhooks (dipstick vs. pump)

**PNLVerified owns:**
- **COGS / inventory costing** — FIFO cost-per-liter tracking by product and supplier (Ops tracks volume, not cost)
- **Payroll cost** — received as a **single imported number from StaffVerified** per period; PNLVerified does not compute SSS/PhilHealth/Pag-IBIG/13th-month/attendance itself
- **Utilities** — electricity (KWH + bill), water, internet, mobile load
- **Admin / other opex** — rent, repairs, permits, real property tax, fire insurance, other
- **Cash position** — bank-level reconciliation across accounts and sales channels (cash, Gcash, PO/coop sales), distinct from Ops's shift-level cash count
- **Profitability roll-up** — Revenue (referenced from OpsVerified) − COGS − Opex (payroll + utilities + admin) = station profit

Revenue and volume are referenced from OpsVerified as read-only input, not re-entered — this is the Accounting/Ops Bridge Rule already documented in `katiwala-owner-os-`: Ops detects/records operational reality, Accounting (P&L Simple) validates/records/classifies the resulting transaction.

## Reorder trigger (cross-module — Ops + PNLVerified + Station Control)

Confirmed reference: `Helium_Profitability.xlsx`'s `Stock-reorderPoint` sheet already computes this today — reorder point = **DIOH (Days Inventory On Hand) × daily average dispense**, tracked per station per product, with a flat DIOH constant (currently 3) in the current spreadsheet. This is the "Purchasing Bridge" workflow `katiwala-owner-os-`'s docs already name as deferred ("Ops-triggered, Accounting-validated... until there's a concrete reason to promote it to its own pillar") — this is that concrete reason.

Ownership split:
- **OpsVerified owns:** current stock balance and daily average dispense (both volume metrics, dipstick-derived) and the reorder trigger/alert itself — it already has the underlying stock+usage data.
- **Lead time is defined per station/product** (not a single global constant, and not per-supplier) — confirmed 2026-07-20. Reorder point = (lead time × daily avg dispense) + safety stock, computed per station per product.
- **PNLVerified owns:** recording the resulting purchase as a COGS transaction once an order is placed (feeds the existing FIFO inventory costing above) — it does not decide when to reorder, only accounts for the purchase after the fact.
- **Station Control displays** the reorder status/alert as a hub view, sourced from Ops, tagged per the existing KPI Source Label Rule (not owned/computed by Station Control itself).

**Inter-station transfer before supplier purchase.** Confirmed: when a station hits its reorder point, check other stations for surplus stock before triggering a new supplier purchase order. This is an existing operational SOP, not just a data field — `fuel-ops` already has a live **Transfer Variance** tab (role-gated: Acctg Audit, Supervisor, CPU Collector) doing "Transfer Out vs Transfer In · Volume reconciliation per route," and `SSM-Conso` already tracks "Stock Transfer -in/-out" per station/product. This stays fully inside Ops's ownership (same as the trigger decision itself) — the transfer SOP itself does not need to be built, only connected to the reorder-trigger decision. PNLVerified's role for a transfer differs from a purchase: no new COGS is created since no external cost is incurred, but the transfer still needs to move inventory value between stations at existing cost basis for station-level FIFO accuracy — one open item below.

Not yet decided: where the per-station/product lead time values are configured/stored, the actual purchase-order-creation workflow (who places it, what happens on trigger), whether the reorder logic always prefers transfer-if-available or needs a threshold/cost comparison (transfer cost vs. purchase cost) before choosing, and how a transfer's inventory value moves between stations' FIFO cost basis in PNLVerified. All build-phase questions, not scope questions.

## Intake form (draft field spec)

Submitted by the Accounting department head, per station, per period.

**1. Revenue** — read-only reference block from OpsVerified (station, product, liters, revenue); not re-keyed.

**2. COGS / Inventory**
- Supplier, product, purchase quantity (L), purchase price/L
- System computes: total purchase cost, running FIFO average cost, period COGS

**3. Payroll cost**
- Total payroll cost for the period (single number, imported from StaffVerified)

**4. Utilities**
- Electricity (KWH + bill amount), water, internet, mobile load

**5. Admin / other opex**
- Rent, repairs, permits, real property tax, fire insurance, other (free text + amount)

**6. Cash position**
- Bank account + beginning balance
- Sales by channel: cash, Gcash, PO/coop
- Other cash proceeds / inter-station transfers
- Exception notes

**Output (system-computed):** Revenue (Ops) − COGS (FIFO) − Opex (payroll + utilities + admin) = station profit.

## Open items for the build phase

- Exact mechanism for pulling revenue/volume from OpsVerified and payroll cost from StaffVerified (live integration vs. manual entry until those connections are wired) — not decided yet.
- Tech stack / hosting (likely matching StaffVerified's Next.js + TypeScript + Supabase pattern, not yet confirmed).
