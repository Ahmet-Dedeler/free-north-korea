import type { MissileType, Outcome } from './data';

/** Missile classes, ordered roughly by range. Colours are tuned for a light basemap. */
export const TYPES: { id: MissileType; label: string; hint: string; color: string }[] = [
  { id: 'SRBM', label: 'SRBM', hint: 'Short range, under 1,000 km', color: '#3b82f6' },
  { id: 'MRBM', label: 'MRBM', hint: 'Medium range, 1,000–3,000 km', color: '#14b8a6' },
  { id: 'IRBM', label: 'IRBM', hint: 'Intermediate range, 3,000–5,500 km', color: '#f59e0b' },
  { id: 'ICBM', label: 'ICBM', hint: 'Intercontinental, over 5,500 km', color: '#e11d48' },
  { id: 'SLBM', label: 'SLBM', hint: 'Launched from a submarine', color: '#8b5cf6' },
  { id: 'HGV', label: 'HGV', hint: 'Hypersonic glide vehicle', color: '#ec4899' },
  { id: 'SLV', label: 'Space launch', hint: 'Satellite launch vehicle', color: '#0ea5e9' },
  { id: 'Unknown', label: 'Unidentified', hint: 'Missile type not publicly identified', color: '#94a3b8' },
];

export const TYPE_COLOR = Object.fromEntries(TYPES.map((t) => [t.id, t.color])) as Record<MissileType, string>;
export const TYPE_LABEL = Object.fromEntries(TYPES.map((t) => [t.id, t.label])) as Record<MissileType, string>;

export const OUTCOMES: { id: Outcome; label: string; color: string; icon: string }[] = [
  { id: 'success', label: 'Success', color: '#16a34a', icon: '✓' },
  { id: 'failure', label: 'Failure', color: '#dc2626', icon: '✕' },
  { id: 'unknown', label: 'Unknown', color: '#94a3b8', icon: '?' },
];

export const OUTCOME_COLOR = Object.fromEntries(OUTCOMES.map((o) => [o.id, o.color])) as Record<Outcome, string>;
export const OUTCOME_LABEL = Object.fromEntries(OUTCOMES.map((o) => [o.id, o.label])) as Record<Outcome, string>;

export type ColorBy = 'type' | 'outcome';

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });
}

export const km = (n: number | null) => (n === null ? '—' : `${n.toLocaleString('en-US')} km`);
