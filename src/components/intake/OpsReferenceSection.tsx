"use client";

import { useEffect, useState } from "react";
import type { Station, Product } from "@/types/db";
import { fetchOpsOuttakeRange, OPS_STATION_CODE, OpsOuttakeReference } from "@/lib/ops-reference";

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

// Phase 2 of the Ops integration (Phase 1 was manual-only entry, per
// SCOPE.md's original field spec). Controlled inputs so an applied Ops
// reference can fill them, while the surrounding <form action={...}>
// still submits through the same server action as every other section —
// same "suggestion only, never auto-submitted" pattern as StaffVerified's
// DTR Ops-suggestion chip.
export function OpsReferenceSection({
  stations,
  products,
  action,
}: {
  stations: Station[];
  products: Product[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [stationId, setStationId] = useState("");
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [liters, setLiters] = useState("");
  const [revenue, setRevenue] = useState("");
  const [reference, setReference] = useState<OpsOuttakeReference | null>(null);
  const [loading, setLoading] = useState(false);

  const station = stations.find((s) => s.id === stationId);
  const opsCode = station ? OPS_STATION_CODE[station.code] : undefined;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!opsCode || !reportDate) {
        setReference(null);
        return;
      }
      setLoading(true);
      const byDate = await fetchOpsOuttakeRange(opsCode, reportDate, reportDate);
      if (!cancelled) {
        setReference(byDate[reportDate] ?? null);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [opsCode, reportDate]);

  function applyReference() {
    if (!reference) return;
    if (reference.totalLiters != null) setLiters(String(reference.totalLiters));
    if (reference.totalRevenue != null) setRevenue(String(reference.totalRevenue));
  }

  const hasReference = !!reference && (reference.totalLiters != null || reference.totalRevenue != null);

  return (
    <form action={action} className="grid grid-cols-2 gap-3">
      <Field label="Station">
        <select
          name="station_id"
          required
          className={inputClass}
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
        >
          <option value="">Select station</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Product">
        <select name="product_id" required className={inputClass}>
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Report date">
        <input
          type="date"
          name="report_date"
          required
          className={inputClass}
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
        />
      </Field>
      <Field label="Liters dispensed">
        <input
          type="number"
          step="0.01"
          name="liters_dispensed"
          required
          className={inputClass}
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
        />
      </Field>
      <Field label="Revenue (₱)">
        <input
          type="number"
          step="0.01"
          name="revenue"
          required
          className={inputClass}
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
        />
      </Field>
      <div className="col-span-2 flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonClass}>
          Save
        </button>
        {opsCode && (
          <div className="flex items-center gap-2 text-xs">
            {loading ? (
              <span className="text-neutral-400">Checking Ops…</span>
            ) : hasReference ? (
              <>
                <span className="rounded-full border border-[color:var(--color-brand-yellow)] bg-[color:var(--color-brand-yellow)]/15 px-2.5 py-1 font-medium text-neutral-900">
                  Ops confirmed: {reference!.totalLiters ?? "—"} L · ₱
                  {reference!.totalRevenue?.toLocaleString() ?? "—"} (station total, all products)
                </span>
                <button
                  type="button"
                  onClick={applyReference}
                  className="rounded-md border border-neutral-300 px-2.5 py-1 font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Apply
                </button>
              </>
            ) : (
              <span className="text-neutral-400">No Ops-confirmed entry yet for this date</span>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
