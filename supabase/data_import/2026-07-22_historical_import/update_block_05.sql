create temp table tmp_extra (station_id uuid, period date, manpower_cost numeric, calibration numeric);
insert into tmp_extra (station_id, period, manpower_cost, calibration) values
  ((select id from public.stations where code='BANI'), '2026-07-01', 116195.10, 9913.00),
  ((select id from public.stations where code='HB'), '2026-07-01', 69590.07, -4518.74),
  ((select id from public.stations where code='HC'), '2026-07-01', 146495.10, -8141.16),
  ((select id from public.stations where code='HD'), '2026-07-01', 146495.10, 6943.45),
  ((select id from public.stations where code='HM'), '2026-07-01', 0.00, 0.00),
  ((select id from public.stations where code='HQ'), '2026-07-01', 99890.07, -8009.92),
  ((select id from public.stations where code='HSJ'), '2026-07-01', 66560.07, 1996.05),
  ((select id from public.stations where code='HT'), '2026-07-01', 33530.03, 8156.11),
  ((select id from public.stations where code='BANI'), '2026-08-01', 116195.10, 439.62),
  ((select id from public.stations where code='HB'), '2026-08-01', 69590.07, -3140.01),
  ((select id from public.stations where code='HC'), '2026-08-01', 146495.10, 304.36),
  ((select id from public.stations where code='HD'), '2026-08-01', 146495.10, 1345.58),
  ((select id from public.stations where code='HM'), '2026-08-01', 0.00, 0.00),
  ((select id from public.stations where code='HQ'), '2026-08-01', 99890.07, -2978.44),
  ((select id from public.stations where code='HSJ'), '2026-08-01', 66560.07, 1064.14),
  ((select id from public.stations where code='HT'), '2026-08-01', 33530.03, 1511.37);

update public.historical_monthly_profitability h
set manpower_cost = t.manpower_cost, calibration = t.calibration
from tmp_extra t
where h.station_id = t.station_id and h.period = t.period;

drop table tmp_extra;
