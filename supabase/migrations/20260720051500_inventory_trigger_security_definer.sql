-- Fixes: inserting into ops_reference_entries / inventory_purchases fires a trigger
-- that writes to inventory_ledger, but inventory_ledger only has a SELECT policy
-- (it should never be written directly by users, only by these triggers). Without
-- SECURITY DEFINER the trigger runs as the calling (authenticated) user and gets
-- blocked by RLS with no matching INSERT policy. Mark both trigger functions
-- SECURITY DEFINER so they run with elevated privileges regardless of caller.

create or replace function public.fn_post_inventory_purchase()
returns trigger
language plpgsql
security definer
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

create or replace function public.fn_post_inventory_consumption()
returns trigger
language plpgsql
security definer
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
