import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { StationProfitability } from "@/types/db";

function peso(n: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
}

function monthLabel(period: string) {
  return new Date(period).toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}

export default async function ProfitabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dipstify-app-icon.png" alt="Dipstify" width={40} height={40} className="mx-auto mb-2" />
        <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Dipstify</span>
        <h1 className="-mt-0.5 mb-2 text-lg font-semibold text-neutral-900">PNLVerified</h1>
        <p className="mb-6 text-sm text-neutral-500">Simple P&L — part of the Dipstify product family.</p>
        <Link href="/login" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Sign in
        </Link>
      </div>
    );
  }

  const { data: rows } = await supabase
    .from("station_profitability")
    .select("*")
    .order("period", { ascending: false })
    .order("station_code");

  const profitRows = (rows ?? []) as StationProfitability[];
  const periods = Array.from(new Set(profitRows.map((r) => r.period)));

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Profitability</h1>
        <p className="text-sm text-neutral-500">
          Revenue (Ops reference) − COGS (moving-average) − Opex (payroll + utilities + admin) = station profit.
        </p>
      </div>

      {periods.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          No data yet. Submit entries via{" "}
          <Link href="/intake" className="underline">Daily Intake</Link> to see profitability here.
        </p>
      )}

      {periods.map((period) => {
        const stationsForPeriod = profitRows.filter((r) => r.period === period);
        return (
          <div key={period} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2">
              <h2 className="text-sm font-semibold text-neutral-900">{monthLabel(period)}</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                  <th className="px-4 py-2 font-medium">Station</th>
                  <th className="px-4 py-2 font-medium">Revenue</th>
                  <th className="px-4 py-2 font-medium">COGS</th>
                  <th className="px-4 py-2 font-medium">Payroll</th>
                  <th className="px-4 py-2 font-medium">Utilities</th>
                  <th className="px-4 py-2 font-medium">Admin/Opex</th>
                  <th className="px-4 py-2 font-medium">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {stationsForPeriod.map((r) => (
                  <tr key={r.station_id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-2 font-medium text-neutral-900">{r.station_code}</td>
                    <td className="px-4 py-2 text-neutral-700">{peso(r.revenue)}</td>
                    <td className="px-4 py-2 text-neutral-700">{peso(r.cogs)}</td>
                    <td className="px-4 py-2 text-neutral-700">{peso(r.payroll_cost)}</td>
                    <td className="px-4 py-2 text-neutral-700">{peso(r.utilities_cost)}</td>
                    <td className="px-4 py-2 text-neutral-700">{peso(r.opex_cost)}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        r.net_profit >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {peso(r.net_profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
