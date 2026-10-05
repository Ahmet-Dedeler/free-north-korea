// Shared types and helpers for the chart datasets in data/series/ (see scripts/build-series.ts).
// Only Node built-ins, so the weekly GitHub Action can run this without `npm ci`.

/** One observation: a year (2024) or an ISO date ('2026-09-27'), and its value. */
export type Point = [t: number | string, v: number];

/** A source behind one point, for hand-checked numbers (press releases, reports). */
export type PointSource = { t: number | string; url: string; note?: string };

export interface Series {
  id: string;
  /** English title; the site translates it from src/content/series.ts. */
  title: string;
  unit: string;
  frequency: 'annual' | 'monthly' | 'irregular';
  /** Values per entity. Countries use ISO3 codes (PRK, KOR, CHN, JPN) plus WLD for the world; other keys are labelled in the site. */
  entities: Record<string, Point[]>;
  source: { name: string; url: string; license?: string };
  /** Day we downloaded or rebuilt it. */
  fetched: string;
  /** The publisher's own last-update date, when they state one. */
  updated?: string;
  /** How we processed the raw numbers, in one or two plain sentences. */
  note?: string;
  pointSources?: PointSource[];
}

/** A group of series that is fetched together and refreshed at most every `maxAgeDays`. */
export interface SeriesSource {
  name: string;
  maxAgeDays: number;
  build(): Promise<Series[]>;
}

export const UA = 'free-north-korea data builder (+https://github.com/Ahmet-Dedeler/free-north-korea)';
export const today = () => new Date().toISOString().slice(0, 10);

export async function fetchText(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { 'user-agent': UA, ...(init.headers as Record<string, string>) },
    signal: AbortSignal.timeout(120_000),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
  return JSON.parse(await fetchText(url)) as T;
}

/** RFC 4180 CSV parser (quotes, doubled quotes, CRLF). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cur += '"'), i++;
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') row.push(cur), (cur = '');
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur), rows.push(row), (row = []), (cur = '');
    } else cur += c;
  }
  if (cur || row.length) row.push(cur), rows.push(row);
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

/** Rounds to a sensible number of significant digits so the JSON stays small and diffs stay quiet. */
export const round = (v: number, digits = 4) => (v === 0 ? 0 : +v.toPrecision(Math.max(digits, Math.ceil(Math.log10(Math.abs(v))))));

/** Sorts points by time; years before dates is fine because a series never mixes them. */
export const sortPoints = (pts: Point[]) => pts.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
