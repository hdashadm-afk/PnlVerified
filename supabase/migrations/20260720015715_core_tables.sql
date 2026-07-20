-- Reconstructed from live schema introspection (2026-07-20) — original file was applied
-- directly to the project and never committed. Reconstructs applied state, matching the
-- version/name already recorded in supabase_migrations.schema_migrations.

create table public.stations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('accounting_head', 'owner', 'admin')),
  created_at timestamptz not null default now()
);

create table public.ops_reference_entries (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  product_id uuid not null references public.products(id),
  report_date date not null,
  liters_dispensed numeric not null check (liters_dispensed >= 0),
  revenue numeric not null check (revenue >= 0),
  source text not null default 'manual' check (source in ('manual', 'ops_import')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index ops_reference_entries_station_id_product_id_report_date_idx
  on public.ops_reference_entries (station_id, product_id, report_date);

create table public.inventory_purchases (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  product_id uuid not null references public.products(id),
  purchase_date date not null,
  supplier text not null,
  quantity_l numeric not null check (quantity_l > 0),
  price_per_l numeric not null check (price_per_l > 0),
  total_cost numeric,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index inventory_purchases_station_id_product_id_purchase_date_idx
  on public.inventory_purchases (station_id, product_id, purchase_date);

create table public.payroll_costs (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  period_start date not null,
  period_end date not null,
  total_amount numeric not null check (total_amount >= 0),
  source text not null default 'staffverified_import' check (source in ('staffverified_import', 'manual')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);
create index payroll_costs_station_id_period_start_idx
  on public.payroll_costs (station_id, period_start);

create table public.utility_bills (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  period_start date not null,
  period_end date not null,
  category text not null check (category in ('electricity', 'water', 'internet', 'mobile_load')),
  kwh numeric,
  amount numeric not null check (amount >= 0),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);
create index utility_bills_station_id_period_start_idx
  on public.utility_bills (station_id, period_start);

create table public.admin_opex (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  period_start date not null,
  period_end date not null,
  category text not null check (category in ('rent', 'repairs', 'permit', 'real_property_tax', 'fire_insurance', 'other')),
  description text,
  amount numeric not null check (amount >= 0),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);
create index admin_opex_station_id_period_start_idx
  on public.admin_opex (station_id, period_start);

create table public.cash_position_entries (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  report_date date not null,
  bank_account text not null,
  beginning_balance numeric not null default 0,
  cash_sales numeric not null default 0,
  gcash_sales numeric not null default 0,
  po_coop_sales numeric not null default 0,
  other_proceeds numeric not null default 0,
  exception_notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index cash_position_entries_station_id_report_date_idx
  on public.cash_position_entries (station_id, report_date);
