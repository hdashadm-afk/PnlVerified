-- Adds manpower cost and calibration adjustment as their own columns on
-- the historical import, pulled from the same source workbooks (the
-- "daily cost" sheet's Total payroll + Total benefits for manpower, and
-- each station's SSM-<code> sheet's Calibration Adjustment/savings row).
-- Backfill values are set via the accompanying update_block_*.sql files.

alter table public.historical_monthly_profitability
  add column manpower_cost numeric not null default 0,
  add column calibration numeric not null default 0;
