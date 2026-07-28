// Reads fuel-ops's (OpsVerified) confirmed Daily Outtake data directly from
// its own Supabase project — read-only reference, matching the same
// "surface signals, don't remote-control" principle StaffVerified's
// lib/ops-outtake.ts already applies to the same smp_daily_outtake table
// (that one reads attendance_json; this reads total_revenue/total_liters).
// Used by the intake form's Revenue/Volume section to suggest a
// station-level total that Accounting explicitly applies — never
// auto-submitted.
//
// The anon key below is already public — it's shipped as-is in fuel-ops's
// own client-side bundle (index.html), and is the same key StaffVerified's
// ops-outtake.ts already uses. RLS on smp_daily_outtake is permissive-read
// for anon, so this isn't exposing anything that isn't already exposed.
const OPS_SUPABASE_URL = 'https://wtwgsygwofyqmxgckmjc.supabase.co'
const OPS_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0d2dzeWd3b2Z5cW14Z2NrbWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDYyOTYsImV4cCI6MjA4ODc4MjI5Nn0.HZw75DHBHTdXe-nWcvq3hiYQdaQq9iKuxOis7YCU75o'

// PNLVerified station code -> fuel-ops station code. Spelled out
// explicitly rather than assumed equal — StaffVerified's ops-outtake.ts
// already found fuel-ops's actual code for Camaley is "HCU", not "HC"
// (PNLVerified's own stations.code for the same station). "BANI" and "HM"
// (PNLVerified station codes with no confirmed fuel-ops counterpart) are
// deliberately left unmapped rather than guessed — a station with no entry
// here just shows no Ops reference, same "fails quiet" behavior as an
// unreachable Ops project.
export const OPS_STATION_CODE: Record<string, string> = {
  HSJ: 'HSJ',
  HB: 'HB',
  HT: 'HT',
  HC: 'HCU',
  HQ: 'HQ',
  HD: 'HD',
  HBANI: 'HBANI',
}

export interface OpsOuttakeReference {
  totalRevenue: number | null
  totalLiters: number | null
  confirmedBy: string | null
  confirmedAt: string | null
}

interface OpsOuttakeRow {
  date: string
  total_revenue: number | null
  total_liters: number | null
  confirmed_by: string | null
  confirmed_at: string | null
}

// One request per station covering the visible date range — callers key
// the result by date. Ops being unreachable, or no confirmed entry existing
// yet for a date, shouldn't block intake entry, so this fails quiet (empty
// result) rather than throwing.
export async function fetchOpsOuttakeRange(
  stationCode: string,
  startDate: string,
  endDate: string
): Promise<Record<string, OpsOuttakeReference>> {
  const url = `${OPS_SUPABASE_URL}/rest/v1/smp_daily_outtake`
    + `?station=eq.${encodeURIComponent(stationCode)}&date=gte.${startDate}&date=lte.${endDate}`
    + `&select=date,total_revenue,total_liters,confirmed_by,confirmed_at`
  try {
    const res = await fetch(url, {
      headers: { apikey: OPS_ANON_KEY, Authorization: `Bearer ${OPS_ANON_KEY}` },
    })
    if (!res.ok) return {}
    const rows = (await res.json()) as OpsOuttakeRow[]
    const byDate: Record<string, OpsOuttakeReference> = {}
    for (const row of rows) {
      byDate[row.date] = {
        totalRevenue: row.total_revenue,
        totalLiters: row.total_liters,
        confirmedBy: row.confirmed_by,
        confirmedAt: row.confirmed_at,
      }
    }
    return byDate
  } catch {
    return {}
  }
}
