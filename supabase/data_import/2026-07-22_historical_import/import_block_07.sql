insert into public.historical_monthly_profitability
  (station_id, period, revenue, cogs, opex_cost, net_profit)
values
  ((select id from public.stations where code='BANI'), '2026-07-01', 1172020.25, 914939.70, 126260.80, 140732.75),
  ((select id from public.stations where code='HB'), '2026-07-01', 726098.98, 612057.65, 94007.55, 15515.03),
  ((select id from public.stations where code='HC'), '2026-07-01', 1746012.23, 1446708.54, 144139.35, 147023.18),
  ((select id from public.stations where code='HD'), '2026-07-01', 1624563.56, 1356135.71, 134853.80, 140517.50),
  ((select id from public.stations where code='HM'), '2026-07-01', 0.00, 0.00, 0.00, 0.00),
  ((select id from public.stations where code='HQ'), '2026-07-01', 2211172.68, 1863107.29, 130695.27, 209360.21),
  ((select id from public.stations where code='HSJ'), '2026-07-01', 715059.42, 595145.21, 86474.77, 35435.49),
  ((select id from public.stations where code='HT'), '2026-07-01', 750143.41, 626401.88, 53695.81, 78201.84),
  ((select id from public.stations where code='BANI'), '2026-08-01', 1186286.52, 945594.59, 126260.80, 114870.76),
  ((select id from public.stations where code='HB'), '2026-08-01', 750045.33, 646980.05, 94007.55, 5917.72),
  ((select id from public.stations where code='HC'), '2026-08-01', 1734361.68, 1460531.84, 144139.35, 129994.85),
  ((select id from public.stations where code='HD'), '2026-08-01', 1636458.13, 1375424.13, 134853.80, 127525.78),
  ((select id from public.stations where code='HM'), '2026-08-01', 0.00, 0.00, 0.00, 0.00),
  ((select id from public.stations where code='HQ'), '2026-08-01', 2077806.93, 1781180.04, 130695.27, 162953.17),
  ((select id from public.stations where code='HSJ'), '2026-08-01', 701260.52, 592526.43, 86474.77, 23323.46),
  ((select id from public.stations where code='HT'), '2026-08-01', 667730.23, 566890.79, 53695.81, 48655.01)
on conflict (station_id, period) do update set
  revenue = excluded.revenue,
  cogs = excluded.cogs,
  opex_cost = excluded.opex_cost,
  net_profit = excluded.net_profit;
