// Data-age helpers, same thresholds and wording as the Varaha dashboard's
// telemetry freshness (Live <= 15 s, Stale <= 30 s, otherwise Offline).

export type DataFreshnessState = 'recent' | 'stale' | 'disconnected'

export interface DataFreshness {
  state: DataFreshnessState
  ageMs: number
  expectedIntervalMs: number
  label: string
}

export function formatAge(ageMs: number): string {
  if (!isFinite(ageMs) || ageMs < 0) return '--'
  if (ageMs < 1_000) return 'Live now'
  if (ageMs < 60_000) return `${Math.round(ageMs / 1_000)}s ago`
  if (ageMs < 3_600_000) return `${Math.round(ageMs / 60_000)}m ago`
  return `${Math.round(ageMs / 3_600_000)}h ago`
}

// Built from our backend's telemetry status + packet age (seconds).
export function freshnessFromStatus(status: string, ageSeconds: number | null | undefined): DataFreshness {
  const ageMs = typeof ageSeconds === 'number' ? ageSeconds * 1000 : Infinity
  const state: DataFreshnessState =
    status === 'live' ? 'recent' : status === 'stale' ? 'stale' : 'disconnected'
  return {
    state,
    ageMs,
    expectedIntervalMs: 2_000,
    label: state === 'recent' ? 'Live' : state === 'stale' ? 'Stale' : 'Offline',
  }
}
