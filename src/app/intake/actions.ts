"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function currentUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function submitOpsReference(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const { error } = await supabase.from("ops_reference_entries").insert({
    station_id: formData.get("station_id"),
    product_id: formData.get("product_id"),
    report_date: formData.get("report_date"),
    liters_dispensed: Number(formData.get("liters_dispensed")),
    revenue: Number(formData.get("revenue")),
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}

export async function submitInventoryPurchase(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const { error } = await supabase.from("inventory_purchases").insert({
    station_id: formData.get("station_id"),
    product_id: formData.get("product_id"),
    purchase_date: formData.get("purchase_date"),
    supplier: formData.get("supplier"),
    quantity_l: Number(formData.get("quantity_l")),
    price_per_l: Number(formData.get("price_per_l")),
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}

export async function submitPayrollCost(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const { error } = await supabase.from("payroll_costs").insert({
    station_id: formData.get("station_id"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    total_amount: Number(formData.get("total_amount")),
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}

export async function submitUtilityBill(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const kwh = formData.get("kwh");

  const { error } = await supabase.from("utility_bills").insert({
    station_id: formData.get("station_id"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    category: formData.get("category"),
    kwh: kwh ? Number(kwh) : null,
    amount: Number(formData.get("amount")),
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}

export async function submitAdminOpex(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const { error } = await supabase.from("admin_opex").insert({
    station_id: formData.get("station_id"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    category: formData.get("category"),
    description: formData.get("description") || null,
    amount: Number(formData.get("amount")),
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}

export async function submitCashPosition(formData: FormData) {
  const supabase = await createClient();
  const created_by = await currentUserId(supabase);

  const { error } = await supabase.from("cash_position_entries").insert({
    station_id: formData.get("station_id"),
    report_date: formData.get("report_date"),
    bank_account: formData.get("bank_account"),
    beginning_balance: Number(formData.get("beginning_balance") || 0),
    cash_sales: Number(formData.get("cash_sales") || 0),
    gcash_sales: Number(formData.get("gcash_sales") || 0),
    po_coop_sales: Number(formData.get("po_coop_sales") || 0),
    other_proceeds: Number(formData.get("other_proceeds") || 0),
    exception_notes: formData.get("exception_notes") || null,
    created_by,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/intake");
  revalidatePath("/");
}
