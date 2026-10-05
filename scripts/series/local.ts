// Series counted from data this repo already keeps fresh: the missile test list (public/data, from
// nagix/nk-missile-tests) and the UN 1718 sanctions list (data/sanctions.json, rebuilt weekly).
import { readFileSync } from 'node:fs';
import { today, type Point, type Series, type SeriesSource } from './lib.ts';

const read = <T>(p: string) => JSON.parse(readFileSync(p, 'utf8')) as T;

/** Fills every year from `from` to `to` so bar charts show the zero years too. */
function yearly(counts: Map<number, number>, from: number, to: number): Point[] {
  return Array.from({ length: to - from + 1 }, (_, i) => [from + i, counts.get(from + i) ?? 0] as Point);
}

function missiles(): Series {
  const tests = read<{ timeBins: { data: { date: string; missile: string }[] }[] }>('public/data/test.en.json').timeBins.flatMap((b) => b.data);
  const types = read<Record<string, { type: string }>>('public/data/missile.en.json');
  const group = (t: string) => (t === 'SRBM' ? 'short' : t === 'MRBM' || t === 'IRBM' || t === 'HGV' ? 'medium' : t === 'ICBM' ? 'icbm' : 'other');
  const by: Record<string, Map<number, number>> = { short: new Map(), medium: new Map(), icbm: new Map(), other: new Map() };
  let last = '';
  for (const t of tests) {
    const y = +t.date.slice(0, 4);
    const g = group(types[t.missile]?.type ?? 'Unknown');
    by[g].set(y, (by[g].get(y) ?? 0) + 1);
    if (t.date > last) last = t.date;
  }
  const to = +last.slice(0, 4);
  return {
    id: 'missile-launches',
    title: 'Missiles launched by North Korea each year',
    unit: 'missiles',
    frequency: 'annual',
    entities: Object.fromEntries(Object.entries(by).map(([k, m]) => [k, yearly(m, 1984, to)])),
    source: { name: 'CNS North Korea Missile Test Database, via nagix/nk-missile-tests', url: 'https://github.com/nagix/nk-missile-tests', license: 'MIT' },
    fetched: today(),
    updated: last,
    note: `Each missile counts once, so a salvo of four is four. Medium range includes intermediate-range and hypersonic glide missiles; "other" is submarine-launched missiles, satellite launches and unknown types. ${to} runs to ${last}.`,
  };
}

function sanctions(): Series {
  const s = read<{ fetched: string; un: { individuals: { listed: string }[]; entities: { listed: string }[] } }>('data/sanctions.json');
  const count = (rows: { listed: string }[]) => {
    const m = new Map<number, number>();
    for (const r of rows) if (r.listed) m.set(+r.listed.slice(0, 4), (m.get(+r.listed.slice(0, 4)) ?? 0) + 1);
    return m;
  };
  const to = +s.fetched.slice(0, 4);
  return {
    id: 'un-sanctions-listings',
    title: 'People and organisations added to the UN sanctions list on North Korea',
    unit: 'listings',
    frequency: 'annual',
    entities: { people: yearly(count(s.un.individuals), 2006, to), entities: yearly(count(s.un.entities), 2006, to) },
    source: { name: 'UN Security Council 1718 Committee consolidated list', url: 'https://www.un.org/securitycouncil/sanctions/1718', license: 'public' },
    fetched: s.fetched,
    note: 'By the date each name was added. Russia and China have blocked new listings since 2018.',
  };
}

export const local: SeriesSource = {
  name: 'local',
  maxAgeDays: 0, // cheap, always rebuilt
  async build() {
    return [missiles(), sanctions()];
  },
};
