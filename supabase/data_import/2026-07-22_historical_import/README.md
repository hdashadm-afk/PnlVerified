# Historical monthly profitability import (2026-07-22)

Source: founder's real Helium Fuels operational Excel workbooks, Jan 2024–Aug 2026 (32 months × 8 stations = 256 rows).

- `extract.py` — parses the source `.xlsx` files (not committed here, they contain raw financials) into `extracted.json`.
- `extracted.json` — the 256 extracted rows.
- `import_block_01.sql` … `import_block_07.sql` — the same data as `INSERT ... ON CONFLICT` statements, split into ~40-row blocks so they paste cleanly into the Supabase SQL Editor. Run in order, after migration `20260722060000_historical_monthly_profitability.sql`.

Net income is the calibration-adjusted figure (`Est. Inc. Full Month w/ Calib` for Feb2024–Aug2026; the equivalent calibration-inclusive `Net income` for Jan2024's differently-structured sheet), per the founder's explicit choice.

One known data-quality fix applied during extraction: Jan 2024's HC calibration savings was corrupted in the source workbook (a cell reference pointed at the wrong row, inflating net income ~100x); recomputed from the correct row in HC's own sheet instead of trusting the broken cross-sheet formula. See the comment in `extract.py`'s `extract_old_format()`.
