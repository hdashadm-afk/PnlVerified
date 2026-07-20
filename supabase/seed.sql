-- Reference data pulled from the live project (2026-07-20). Feeds the station/product
-- dropdowns on the intake form. Not part of the schema migrations — apply separately
-- (e.g. `supabase db seed` locally, or run directly against a fresh environment).

insert into public.stations (code, name) values
  ('BANI', 'Bani'),
  ('HB', 'HB'),
  ('HBANI', 'HBANI'),
  ('HC', 'HC'),
  ('HD', 'HD'),
  ('HM', 'HM'),
  ('HQ', 'HQ'),
  ('HSJ', 'HSJ'),
  ('HT', 'HT')
on conflict (code) do nothing;

insert into public.products (code, name) values
  ('DSL', 'Diesel'),
  ('PRM', 'Premium'),
  ('ULG', 'Unleaded')
on conflict (code) do nothing;
