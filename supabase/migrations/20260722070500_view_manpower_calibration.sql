-- Wires the new manpower_cost/calibration columns into the profitability
-- view: historical rows now report their real manpower cost as
-- payroll_cost (instead of the hardcoded 0 placeholder from the original
-- union), and both live and historical rows expose a calibration column
-- (0 for live, since day-level data has no calibration concept yet).
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
    0::numeric as calibration,
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
    h.manpower_cost as payroll_cost,
    0::numeric as utilities_cost,
    h.opex_cost,
    h.calibration,
    h.net_profit
  from public.historical_monthly_profitability h
  join public.stations s on s.id = h.station_id
)
select * from live
union all
select * from historical
order by period desc, station_code;
