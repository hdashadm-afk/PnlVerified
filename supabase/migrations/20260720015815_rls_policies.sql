-- Reconstructed from live schema introspection (2026-07-20) — see 20260720015715_core_tables.sql.
-- Model: any authenticated user can read; a row can only be inserted as its own author
-- (created_by = auth.uid()). No per-role restriction yet (owner/admin/accounting_head
-- distinction exists on profiles.role but is not enforced by policy).

alter table public.stations enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.ops_reference_entries enable row level security;
alter table public.inventory_purchases enable row level security;
alter table public.inventory_ledger enable row level security;
alter table public.payroll_costs enable row level security;
alter table public.utility_bills enable row level security;
alter table public.admin_opex enable row level security;
alter table public.cash_position_entries enable row level security;

create policy stations_select on public.stations for select to authenticated using (true);
create policy products_select on public.products for select to authenticated using (true);

create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid());

create policy ops_reference_entries_select on public.ops_reference_entries for select to authenticated using (true);
create policy ops_reference_entries_insert on public.ops_reference_entries for insert to authenticated with check (created_by = auth.uid());

create policy inventory_purchases_select on public.inventory_purchases for select to authenticated using (true);
create policy inventory_purchases_insert on public.inventory_purchases for insert to authenticated with check (created_by = auth.uid());

create policy inventory_ledger_select on public.inventory_ledger for select to authenticated using (true);

create policy payroll_costs_select on public.payroll_costs for select to authenticated using (true);
create policy payroll_costs_insert on public.payroll_costs for insert to authenticated with check (created_by = auth.uid());

create policy utility_bills_select on public.utility_bills for select to authenticated using (true);
create policy utility_bills_insert on public.utility_bills for insert to authenticated with check (created_by = auth.uid());

create policy admin_opex_select on public.admin_opex for select to authenticated using (true);
create policy admin_opex_insert on public.admin_opex for insert to authenticated with check (created_by = auth.uid());

create policy cash_position_entries_select on public.cash_position_entries for select to authenticated using (true);
create policy cash_position_entries_insert on public.cash_position_entries for insert to authenticated with check (created_by = auth.uid());
