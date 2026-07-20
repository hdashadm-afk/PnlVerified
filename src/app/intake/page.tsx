import { createClient } from "@/lib/supabase/server";
import type { Station, Product } from "@/types/db";
import {
  submitOpsReference,
  submitInventoryPurchase,
  submitPayrollCost,
  submitUtilityBill,
  submitAdminOpex,
  submitCashPosition,
} from "./actions";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";
const buttonClass =
  "rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function StationSelect({ stations }: { stations: Station[] }) {
  return (
    <select name="station_id" required className={inputClass}>
      <option value="">Select station</option>
      {stations.map((s) => (
        <option key={s.id} value={s.id}>
          {s.code}
        </option>
      ))}
    </select>
  );
}

function ProductSelect({ products }: { products: Product[] }) {
  return (
    <select name="product_id" required className={inputClass}>
      <option value="">Select product</option>
      {products.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-900">
        {number}. {title}
      </h2>
      <p className="mb-4 text-xs text-neutral-500">{subtitle}</p>
      {children}
    </section>
  );
}

export default async function IntakePage() {
  const supabase = await createClient();
  const [{ data: stations }, { data: products }] = await Promise.all([
    supabase.from("stations").select("id, code, name").order("code"),
    supabase.from("products").select("id, code, name").order("code"),
  ]);

  const stationList = (stations ?? []) as Station[];
  const productList = (products ?? []) as Product[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Daily Intake — Accounting</h1>
        <p className="text-sm text-neutral-500">
          Submitted by the Accounting department head, per station, per period. Matches the
          Simple P&L Rule: clerk-usable, not a heavy accounting suite.
        </p>
      </div>

      <Section
        number="1"
        title="Revenue / Volume (Ops reference)"
        subtitle="Reference from OpsVerified. Manual entry until the live OpsVerified integration is built — not re-computed here."
      >
        <form action={submitOpsReference} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <Field label="Product"><ProductSelect products={productList} /></Field>
          <Field label="Report date">
            <input type="date" name="report_date" required className={inputClass} />
          </Field>
          <Field label="Liters dispensed">
            <input type="number" step="0.01" name="liters_dispensed" required className={inputClass} />
          </Field>
          <Field label="Revenue (₱)">
            <input type="number" step="0.01" name="revenue" required className={inputClass} />
          </Field>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>

      <Section
        number="2"
        title="COGS / Inventory Purchase"
        subtitle="Feeds the moving-average FIFO cost ledger. System computes running cost automatically."
      >
        <form action={submitInventoryPurchase} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <Field label="Product"><ProductSelect products={productList} /></Field>
          <Field label="Purchase date">
            <input type="date" name="purchase_date" required className={inputClass} />
          </Field>
          <Field label="Supplier">
            <input type="text" name="supplier" required className={inputClass} />
          </Field>
          <Field label="Quantity (L)">
            <input type="number" step="0.01" name="quantity_l" required className={inputClass} />
          </Field>
          <Field label="Price per liter (₱)">
            <input type="number" step="0.01" name="price_per_l" required className={inputClass} />
          </Field>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>

      <Section
        number="3"
        title="Payroll Cost"
        subtitle="Single number imported from StaffVerified per period — not broken into SSS/PhilHealth/Pag-IBIG here."
      >
        <form action={submitPayrollCost} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <div />
          <Field label="Period start">
            <input type="date" name="period_start" required className={inputClass} />
          </Field>
          <Field label="Period end">
            <input type="date" name="period_end" required className={inputClass} />
          </Field>
          <Field label="Total payroll cost (₱)">
            <input type="number" step="0.01" name="total_amount" required className={inputClass} />
          </Field>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>

      <Section number="4" title="Utilities" subtitle="Electricity, water, internet, mobile load.">
        <form action={submitUtilityBill} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <Field label="Category">
            <select name="category" required className={inputClass}>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="internet">Internet</option>
              <option value="mobile_load">Mobile load</option>
            </select>
          </Field>
          <Field label="Period start">
            <input type="date" name="period_start" required className={inputClass} />
          </Field>
          <Field label="Period end">
            <input type="date" name="period_end" required className={inputClass} />
          </Field>
          <Field label="KWH (electricity only)">
            <input type="number" step="0.01" name="kwh" className={inputClass} />
          </Field>
          <Field label="Bill amount (₱)">
            <input type="number" step="0.01" name="amount" required className={inputClass} />
          </Field>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>

      <Section
        number="5"
        title="Admin / Other Opex"
        subtitle="Rent, repairs, permits, real property tax, fire insurance, other."
      >
        <form action={submitAdminOpex} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <Field label="Category">
            <select name="category" required className={inputClass}>
              <option value="rent">Rent</option>
              <option value="repairs">Repairs</option>
              <option value="permit">Permit</option>
              <option value="real_property_tax">Real property tax</option>
              <option value="fire_insurance">Fire insurance</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Period start">
            <input type="date" name="period_start" required className={inputClass} />
          </Field>
          <Field label="Period end">
            <input type="date" name="period_end" required className={inputClass} />
          </Field>
          <Field label="Amount (₱)">
            <input type="number" step="0.01" name="amount" required className={inputClass} />
          </Field>
          <Field label="Description (optional)">
            <input type="text" name="description" className={inputClass} />
          </Field>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>

      <Section
        number="6"
        title="Cash Position"
        subtitle="Bank-level reconciliation across accounts and sales channels — distinct from Ops's shift-level cash count."
      >
        <form action={submitCashPosition} className="grid grid-cols-2 gap-3">
          <Field label="Station"><StationSelect stations={stationList} /></Field>
          <Field label="Report date">
            <input type="date" name="report_date" required className={inputClass} />
          </Field>
          <Field label="Bank account">
            <input type="text" name="bank_account" required className={inputClass} />
          </Field>
          <Field label="Beginning balance (₱)">
            <input type="number" step="0.01" name="beginning_balance" className={inputClass} />
          </Field>
          <Field label="Cash sales (₱)">
            <input type="number" step="0.01" name="cash_sales" className={inputClass} />
          </Field>
          <Field label="Gcash sales (₱)">
            <input type="number" step="0.01" name="gcash_sales" className={inputClass} />
          </Field>
          <Field label="PO / coop sales (₱)">
            <input type="number" step="0.01" name="po_coop_sales" className={inputClass} />
          </Field>
          <Field label="Other cash proceeds (₱)">
            <input type="number" step="0.01" name="other_proceeds" className={inputClass} />
          </Field>
          <div className="col-span-2">
            <Field label="Exception notes">
              <textarea name="exception_notes" rows={2} className={inputClass} />
            </Field>
          </div>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>Save</button>
          </div>
        </form>
      </Section>
    </div>
  );
}
