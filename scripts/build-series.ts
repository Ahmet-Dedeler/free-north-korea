// Builds the chart datasets behind /north-korea-vs-south-korea and /data.
//   node scripts/build-series.ts            refresh whatever is older than its source's maxAgeDays
//   node scripts/build-series.ts --force    refresh everything
//   node scripts/build-series.ts owid       refresh one source group
//
// Output (all committed, so the data lives on GitHub too):
//   data/series/series.json     every series in one file; the site imports this
//   data/series/csv/<id>.csv    one tidy CSV per series (entity,time,value)
//   data/series/README.md       generated catalogue with sources and dates
//
// A source that fails keeps its previous series, so a flaky government site never empties a chart.
// Runs weekly in .github/workflows/check-sources.yml. Needs `pdftotext` (poppler-utils) for the defector PDF.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dailynk } from './series/dailynk.ts';
import { government } from './series/government.ts';
import type { Series, SeriesSource } from './series/lib.ts';
import { local } from './series/local.ts';
import { owid } from './series/owid.ts';

const SOURCES: SeriesSource[] = [owid, dailynk, government, local];
const OUT = 'data/series';
const FILE = `${OUT}/series.json`;

type Store = { _doc: string; built: string; sources: Record<string, string>; series: Series[] };

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const prev: Store = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { _doc: '', built: '', sources: {}, series: [] };
const byId = new Map(prev.series.map((s) => [s.id, s]));
const ran: Record<string, string> = { ...prev.sources };
const ageDays = (d?: string) => (d ? (Date.now() - Date.parse(d)) / 864e5 : Infinity);

let changed = false;
for (const src of SOURCES) {
  if (only.length && !only.includes(src.name)) continue;
  if (!force && !only.length && ageDays(prev.sources[src.name]) < src.maxAgeDays) {
    console.log(`${src.name}: fresh (${prev.sources[src.name]}), skipped`);
    continue;
  }
  try {
    const got = await src.build();
    for (const s of got) byId.set(s.id, s);
    ran[src.name] = new Date().toISOString().slice(0, 10);
    changed = true;
    console.log(`${src.name}: ${got.length} series`);
  } catch (e) {
    console.warn(`${src.name}: FAILED, kept previous (${(e as Error).message})`);
  }
}

if (!changed) {
  console.log('nothing to rebuild');
  process.exit(0);
}

const series = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
const store: Store = {
  _doc: 'Built by scripts/build-series.ts. Do not edit by hand; hand-checked numbers go in data/series/curated/.',
  built: new Date().toISOString().slice(0, 10),
  sources: ran,
  series,
};

// Only rewrite files whose data changed, so the weekly commit shows real changes and not a date bump.
const strip = (s: Series) => JSON.stringify({ ...s, fetched: undefined });
const prevSorted = [...prev.series].sort((a, b) => a.id.localeCompare(b.id));
if (!force && prevSorted.map(strip).join() === series.map(strip).join()) {
  console.log('data unchanged');
  process.exit(0);
}

mkdirSync(`${OUT}/csv`, { recursive: true });
writeFileSync(FILE, JSON.stringify(store, null, 1) + '\n');
for (const s of series) {
  const lines = ['entity,time,value'];
  for (const [entity, pts] of Object.entries(s.entities)) for (const [t, v] of pts) lines.push(`${entity},${t},${v}`);
  writeFileSync(`${OUT}/csv/${s.id}.csv`, lines.join('\n') + '\n');
}

const latest = (s: Series) => {
  const all = Object.values(s.entities).flat();
  return all.reduce((m, [t]) => (String(t) > m ? String(t) : m), '');
};
const readme = [
  '# Chart datasets',
  '',
  'Clean, dated time series about North Korea, rebuilt every week by `scripts/build-series.ts` and shown on',
  '[liberatenorthkorea.org/data](https://liberatenorthkorea.org/data). Each CSV is tidy: `entity,time,value`.',
  'Country entities use ISO codes (PRK North Korea, KOR South Korea, CHN China, JPN Japan, WLD world).',
  '',
  'Please credit the original source listed for each series, plus this project if our processing helped.',
  '',
  '| Series | Unit | Latest | Source | Fetched |',
  '| --- | --- | --- | --- | --- |',
  ...series.map((s) => `| [${s.title}](csv/${s.id}.csv) | ${s.unit} | ${latest(s)} | [${s.source.name}](${s.source.url}) | ${s.fetched} |`),
  '',
].join('\n');
writeFileSync(`${OUT}/README.md`, readme);
console.log(`wrote ${series.length} series`);
