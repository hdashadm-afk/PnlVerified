-- Reconstructed from live schema introspection (2026-07-20) — see 20260720015715_core_tables.sql.

create view public.station_profitability as
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
)
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
order by p.period desc, s.code;
