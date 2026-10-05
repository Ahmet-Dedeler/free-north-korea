/**
 * Server-side access to the chart datasets (data/series/series.json) and the step that trims one series down to
 * what a chart shows, so the browser only receives those points.
 */
import raw from '../../data/series/series.json';
import { CHART_UI, ENTITY_LABEL, SERIES_TEXT, UNIT_LABEL, dataPath } from '@/content/series';
import type { Lang } from '@/site/seo';

export type Point = [t: number | string, v: number];
export interface Series {
  id: string;
  title: string;
  unit: string;
  frequency: 'annual' | 'monthly' | 'irregular';
  entities: Record<string, Point[]>;
  source: { name: string; url: string; license?: string };
  fetched: string;
  updated?: string;
  note?: string;
  pointSources?: { t: number | string; url: string; note?: string }[];
}

const store = raw as unknown as { built: string; series: Series[] };
export const SERIES: Series[] = store.series;
export const SERIES_BUILT = store.built;
const byId = new Map(SERIES.map((s) => [s.id, s]));

export function getSeries(id: string): Series {
  const s = byId.get(id);
  if (!s) throw new Error(`unknown series ${id}`);
  return s;
}

/** Colour of each entity, as CSS custom properties from charts.css (fixed per entity, never by rank). */
const COLOR: Record<string, string> = {
  PRK: 'var(--e-prk)',
  KOR: 'var(--e-kor)',
  CHN: 'var(--e-chn)',
  JPN: 'var(--e-jpn)',
  WLD: 'var(--e-wld)',
};
const SLOTS = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];

export const LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP' };

/** Decimal year for plotting: 2024 → 2024, '2026-07-01' → 2026.5. */
export function toX(t: number | string): number {
  if (typeof t === 'number') return t;
  const d = new Date(t + 'T00:00:00Z');
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return d.getUTCFullYear() + (d.getTime() - start) / (365.25 * 864e5);
}

export type Band = { from: number; to: number; label: string };

/** Callout between two lines at their latest values: "26×" (ratio, hi / lo) or "10.7" (difference). */
export type Gap = { hi: string; lo: string; mode: 'ratio' | 'diff' };

export type ChartProps = {
  id: string;
  lang: Lang;
  title: string;
  sub: string;
  unit: string;
  kind: 'line' | 'bar' | 'stacked';
  log: boolean;
  dated: boolean;
  lines: { key: string; label: string; color: string; dashed: boolean; pts: [x: number, v: number, t: string][] }[];
  bands: Band[];
  gap?: Gap;
  source: { name: string; url: string; license?: string };
  fetched: string;
  updated?: string;
  note?: string;
  pointSources?: { t: string; url: string; note?: string }[];
  permalink: string;
  ui: Record<string, string>;
  locale: string;
  compact: boolean;
};

export type ChartOptions = {
  entities?: string[];
  kind?: ChartProps['kind'];
  from?: number;
  to?: number;
  log?: boolean;
  title?: string;
  sub?: string;
  bands?: Band[];
  gap?: Gap;
  /** Smaller frame for grids: no tabs or table, still interactive. */
  compact?: boolean;
};

/** Builds the props for <ChartView> from a series id and the page's choices. */
export function chartProps(id: string, lang: Lang, o: ChartOptions = {}): ChartProps {
  const s = getSeries(id);
  const text = SERIES_TEXT[id]?.[lang];
  const keys = (o.entities ?? Object.keys(s.entities)).filter((k) => s.entities[k]?.length);
  const countries = keys.every((k) => k in COLOR);
  return {
    id,
    lang,
    title: o.title ?? text?.title ?? s.title,
    sub: o.sub ?? text?.sub ?? '',
    unit: UNIT_LABEL[s.unit]?.[lang] ?? s.unit,
    kind: o.kind ?? 'line',
    log: !!o.log,
    dated: s.frequency !== 'annual',
    lines: keys.map((k, i) => ({
      key: k,
      label: ENTITY_LABEL[k]?.[lang] ?? k,
      color: countries ? COLOR[k] : SLOTS[i % SLOTS.length],
      dashed: k === 'WLD',
      pts: s.entities[k]
        .filter(([t]) => {
          const x = toX(t);
          return (o.from === undefined || x >= o.from) && (o.to === undefined || x < o.to + 1);
        })
        .map(([t, v]) => [toX(t), v, String(t)] as [number, number, string]),
    })),
    bands: o.bands ?? [],
    gap: o.gap,
    source: s.source,
    fetched: s.fetched,
    updated: s.updated,
    note: s.note,
    pointSources: s.pointSources?.map((p) => ({ ...p, t: String(p.t) })),
    permalink: dataPath(lang, id),
    ui: CHART_UI[lang],
    locale: LOCALE[lang],
    compact: !!o.compact,
  };
}

/** Latest value of one entity, for stat tiles and cards. */
export function latest(id: string, entity: string): { t: number | string; v: number } | undefined {
  const pts = getSeries(id).entities[entity];
  const p = pts?.[pts.length - 1];
  return p && { t: p[0], v: p[1] };
}

/** Value of one entity in a given year (annual series). */
export function valueAt(id: string, entity: string, year: number): number | undefined {
  return getSeries(id).entities[entity]?.find(([t]) => t === year)?.[1];
}
