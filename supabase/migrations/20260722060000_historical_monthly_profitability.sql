-- Historical monthly profitability import (2026-07-22)
-- ------------------------------------------------------------
-- The founder's real 2024-2026 P&L Excel data (34 monthly workbooks,
-- 22 sheets each) is a monthly-aggregate rollup, not the day-level
-- purchase/dispensing transactions this schema's moving-average COGS
-- engine (inventory_ledger + its triggers, see
-- 20260720015738_inventory_ledger_moving_average.sql) is designed
-- for. Forcing monthly totals through that trigger-driven engine
-- would require synthesizing fake daily transactions and risks
-- producing COGS figures that don't match the founder's own computed
-- numbers — unacceptable for data feeding a YC application.
--
-- Instead: a dedicated table for the historical bulk import, storing
-- the founder's own already-computed monthly totals directly (pulled
-- from each month's "Profitability" sheet for Nov 2023-Jan 2024, or
-- each station's own SSM-<code> sheet's Total Sales/Total margin/
-- Total Opex+Admin/Est. Inc. Full Month w/ Calib rows for Feb
-- 2024-Aug 2026 — see the extraction script, not committed here).
-- net_profit is the calibration-adjusted figure per founder's
-- explicit choice (2026-07-22).
--
-- Does not touch the live granular tables/triggers at all — this is
-- purely additive. Going forward, real day-level data (once
-- OpsVerified/StaffVerified feeds are wired) flows through the
-- existing tables exactly as before; this table is backfill only.

create table public.historical_monthly_profitability (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  period date not null,
  revenue numeric not null default 0,
  cogs numeric not null default 0,
  opex_cost numeric not null default 0,
  net_profit numeric not null default 0,
  source text not null default 'excel_import_2026-07-22',
  created_at timestamptz not null default now(),
  unique (station_id, period)
);

alter table public.historical_monthly_profitability enable row level security;

create policy "authenticated can read historical_monthly_profitability"
  on public.historical_monthly_profitability for select to authenticated using (true);
create policy "authenticated can manage historical_monthly_profitability"
  on public.historical_monthly_profitability for all to authenticated using (true);

-- Extend the existing profitability view to include historical
-- months alongside live granular data. No overlap expected in
-- practice (historical covers Jan 2024-Aug 2026 backfill; live data
-- accrues from whenever real day-level entries start), but a union
-- handles either case without needing to special-case it.
create or replace view public.station_profitability as
with revenue as (
  select station_id,
    date_trunc('month', report_date::timestamptz)::date as period,
    sum(revenue) as revenue
  from public.ops_reference_entries
  group by station_id, date_trunc('month', report_date::timestamptz)
), cogs as (
  select station_id,
    date_trunc('month', entry_date::timestamptz)::date as period,
    sum(-total_cost) as cogs
  from public.inventory_ledger
  where entry_type = 'consumption'
  group by station_id, date_trunc('month', entry_date::timestamptz)
), payroll as (
  select station_id,
    date_trunc('month', period_start::timestamptz)::date as period,
    sum(total_amount) as payroll_cost
  from public.payroll_costs
  group by station_id, date_trunc('month', period_start::timestamptz)
), utilities as (
  select station_id,
    date_trunc('month', period_start::timestamptz)::date as period,
    sum(amount) as utilities_cost
  from public.utility_bills
  group by station_id, date_trunc('month', period_start::timestamptz)
), opex as (
  select station_id,
    date_trunc('month', period_start::timestamptz)::date as period,
    sum(amount) as opex_cost
  from public.admin_opex
  group by station_id, date_trunc('month', period_start::timestamptz)
), live as (
  select
    s.id as station_id,
    s.code as station_code,
    s.name as station_name,
    p.period,
    coalesce(r.revenue, 0) as revenue,
    coalesce(c.cogs, 0) as cogs,
    coalesce(pr.payroll_cost, 0) as payroll_cost,
    coalesce(u.utilities_cost, 0) as utilities_cost,
    coalesce(o.opex_cost, 0) as opex_cost,
    coalesce(r.revenue, 0) - coalesce(c.cogs, 0) - coalesce(pr.payroll_cost, 0)
      - coalesce(u.utilities_cost, 0) - coalesce(o.opex_cost, 0) as net_profit
  from public.stations s
  cross join (
    select distinct period from revenue
    union select distinct period from cogs
    union select distinct period from payroll
    union select distinct period from utilities
    union select distinct period from opex
  ) p
  left join revenue r on r.station_id = s.id and r.period = p.period
  left join cogs c on c.station_id = s.id and c.period = p.period
  left join payroll pr on pr.station_id = s.id and pr.period = p.period
  left join utilities u on u.station_id = s.id and u.period = p.period
  left join opex o on o.station_id = s.id and o.period = p.period
), historical as (
  select
    h.station_id,
    s.code as station_code,
    s.name as station_name,
    h.period,
    h.revenue,
    h.cogs,
    0::numeric as payroll_cost,
    0::numeric as utilities_cost,
    h.opex_cost,
    h.net_profit
  from public.historical_monthly_profitability h
  join public.stations s on s.id = h.station_id
)
select * from live
union all
select * from historical
order by period desc, station_code;
