-- Reconstructed from live schema introspection (2026-07-20) — see 20260720015715_core_tables.sql.

create table public.inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id),
  product_id uuid not null references public.products(id),
  entry_date date not null,
  entry_type text not null check (entry_type in ('purchase', 'consumption')),
  quantity_l numeric not null,
  unit_cost numeric not null,
  total_cost numeric not null,
  running_balance_l numeric not null,
  running_avg_cost numeric not null,
  source_purchase_id uuid references public.inventory_purchases(id),
  source_ops_entry_id uuid references public.ops_reference_entries(id),
  created_at timestamptz not null default now()
);
create index inventory_ledger_station_id_product_id_entry_date_created_a_idx
  on public.inventory_ledger (station_id, product_id, entry_date, created_at);

-- Moving-average FIFO cost engine: a purchase blends into the running average cost;
-- a dispensed-volume (ops) entry consumes inventory at the current running average cost.

create or replace function public.fn_post_inventory_purchase()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_prev_balance numeric;
  v_prev_avg_cost numeric;
  v_new_balance numeric;
  v_new_avg_cost numeric;
begin
  select running_balance_l, running_avg_cost
    into v_prev_balance, v_prev_avg_cost
    from inventory_ledger
   where station_id = new.station_id and product_id = new.product_id
   order by entry_date desc, created_at desc
   limit 1;

  v_prev_balance := coalesce(v_prev_balance, 0);
  v_prev_avg_cost := coalesce(v_prev_avg_cost, 0);
  v_new_balance := v_prev_balance + new.quantity_l;
  v_new_avg_cost := ((v_prev_balance * v_prev_avg_cost) + new.total_cost) / nullif(v_new_balance, 0);

  insert into inventory_ledger
    (station_id, product_id, entry_date, entry_type, quantity_l, unit_cost, total_cost,
     running_balance_l, running_avg_cost, source_purchase_id)
  values
    (new.station_id, new.product_id, new.purchase_date, 'purchase', new.quantity_l, new.price_per_l,
     new.total_cost, v_new_balance, coalesce(v_new_avg_cost, new.price_per_l), new.id);

  return new;
end;
$function$;

create trigger trg_post_inventory_purchase
  after insert on public.inventory_purchases
  for each row execute function public.fn_post_inventory_purchase();

create or replace function public.fn_post_inventory_consumption()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_prev_balance numeric;
  v_prev_avg_cost numeric;
  v_new_balance numeric;
  v_cogs numeric;
begin
  select running_balance_l, running_avg_cost
    into v_prev_balance, v_prev_avg_cost
    from inventory_ledger
   where station_id = new.station_id and product_id = new.product_id
   order by entry_date desc, created_at desc
   limit 1;

  v_prev_balance := coalesce(v_prev_balance, 0);
  v_prev_avg_cost := coalesce(v_prev_avg_cost, 0);
  v_new_balance := v_prev_balance - new.liters_dispensed;
  v_cogs := new.liters_dispensed * v_prev_avg_cost;

  insert into inventory_ledger
    (station_id, product_id, entry_date, entry_type, quantity_l, unit_cost, total_cost,
     running_balance_l, running_avg_cost, source_ops_entry_id)
  values
    (new.station_id, new.product_id, new.report_date, 'consumption', -new.liters_dispensed, v_prev_avg_cost,
     -v_cogs, v_new_balance, v_prev_avg_cost, new.id);

  return new;
end;
$function$;

create trigger trg_post_inventory_consumption
  after insert on public.ops_reference_entries
  for each row execute function public.fn_post_inventory_consumption();
