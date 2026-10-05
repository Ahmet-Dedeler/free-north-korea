// Series we take straight from Our World in Data. They already clean and maintain these (UN, World Bank, FAO,
// Maddison, V-Dem, FAS...), so we only keep the countries we compare and credit OWID plus the original source.
// Full-history export: https://ourworldindata.org/grapher/<slug>.csv?csvType=full (the default export is latest-only).
import { fetchJson, fetchText, parseCsv, round, sortPoints, today, type Point, type Series, type SeriesSource } from './lib.ts';

const ENTITIES: Record<string, string> = { PRK: 'PRK', KOR: 'KOR', CHN: 'CHN', JPN: 'JPN', OWID_WRL: 'WLD' };

type Spec = {
  id: string;
  slug: string;
  title: string;
  unit: string;
  /** Multiply raw values (e.g. per-100 rates into %). */
  scale?: number;
  /** Drop years after this one (OWID mixes UN projections into some files). */
  maxYear?: number;
  minYear?: number;
  digits?: number;
};

const SPECS: Spec[] = [
  { id: 'life-expectancy', slug: 'life-expectancy', title: 'Life expectancy at birth', unit: 'years', minYear: 1900 },
  { id: 'child-mortality', slug: 'child-mortality-igme', title: 'Children who die before their fifth birthday', unit: '%' },
  { id: 'gdp-per-capita', slug: 'gdp-per-capita-maddison-project-database', title: 'GDP per person', unit: 'international $ (2011 prices)', minYear: 1900, digits: 3 },
  { id: 'height-men', slug: 'average-height-of-men', title: 'Average height of men, by year of birth', unit: 'cm' },
  { id: 'height-women', slug: 'average-height-of-women', title: 'Average height of women, by year of birth', unit: 'cm' },
  { id: 'electricity-per-person', slug: 'per-capita-electricity-generation', title: 'Electricity generated per person', unit: 'kWh', digits: 3 },
  { id: 'energy-per-person', slug: 'per-capita-energy-use', title: 'Energy used per person', unit: 'kWh', digits: 3 },
  { id: 'electricity-access', slug: 'share-of-the-population-with-access-to-electricity', title: 'People with access to electricity', unit: '%' },
  { id: 'mobile-phones', slug: 'mobile-cellular-subscriptions-per-100-people', title: 'Mobile phone subscriptions per 100 people', unit: 'per 100 people' },
  { id: 'fertility', slug: 'children-per-woman-un', title: 'Children per woman', unit: 'births per woman', maxYear: 2024 },
  { id: 'population', slug: 'population', title: 'Population', unit: 'people', minYear: 1900, maxYear: 2024, digits: 3 },
  { id: 'calories', slug: 'daily-per-capita-caloric-supply', title: 'Food available per person per day', unit: 'kcal' },
  { id: 'undernourishment', slug: 'prevalence-of-undernourishment', title: 'Share of people who are undernourished', unit: '%' },
  { id: 'cereal-yield', slug: 'cereal-yield', title: 'Cereal yield', unit: 'tonnes per hectare' },
  { id: 'co2-per-person', slug: 'co-emissions-per-capita', title: 'CO₂ emissions per person', unit: 'tonnes', minYear: 1950 },
  { id: 'armed-forces', slug: 'armed-forces-personnel', title: 'Armed forces personnel', unit: 'people', digits: 3 },
  { id: 'democracy', slug: 'electoral-democracy-index', title: 'Electoral democracy index (V-Dem)', unit: 'index, 0 to 1', minYear: 1900 },
  { id: 'civil-liberties', slug: 'human-rights-index-vdem', title: 'Civil liberties index (V-Dem)', unit: 'index, 0 to 1', minYear: 1900 },
  { id: 'nuclear-warheads', slug: 'nuclear-warhead-stockpiles', title: 'Estimated nuclear warheads', unit: 'warheads' },
];

type Meta = { chart: { title: string; citation: string }; columns: Record<string, { lastUpdated?: string; citationShort?: string }> };

async function one(s: Spec): Promise<Series> {
  const base = `https://ourworldindata.org/grapher/${s.slug}`;
  const rows = parseCsv(await fetchText(`${base}.csv?csvType=full&useColumnShortNames=true`, { headers: { accept: 'text/csv' } }));
  const meta = await fetchJson<Meta>(`${base}.metadata.json`);
  const header = rows[0];
  // first numeric value column after entity,code,year that isn't an annotation/original-year helper
  const col = header.findIndex((h, i) => i > 2 && !/(__original_year|__annotations|owid_region)$/.test(h) && h !== 'owid_region');
  const entities: Record<string, Point[]> = {};
  for (const r of rows.slice(1)) {
    const key = ENTITIES[r[1]];
    const year = +r[2];
    const raw = r[col];
    if (!key || raw === '' || raw === undefined) continue;
    if ((s.minYear && year < s.minYear) || (s.maxYear && year > s.maxYear)) continue;
    (entities[key] ??= []).push([year, round(+raw * (s.scale ?? 1), s.digits ?? 4)]);
  }
  if (!entities.PRK?.length) throw new Error(`${s.slug}: no North Korea rows`);
  for (const k in entities) sortPoints(entities[k]);
  const column = Object.values(meta.columns)[0] ?? {};
  return {
    id: s.id,
    title: s.title,
    unit: s.unit,
    frequency: 'annual',
    entities,
    source: { name: `${(column.citationShort ?? meta.chart.citation).replace(/\s*–\s*(with (major|minor) processing|processed) by Our World in Data/, '')}, via Our World in Data`, url: base, license: 'CC BY 4.0' },
    fetched: today(),
    updated: column.lastUpdated,
  };
}

export const owid: SeriesSource = {
  name: 'owid',
  maxAgeDays: 28, // OWID updates most of these once a year; a monthly look is plenty
  async build() {
    const out: Series[] = [];
    for (const s of SPECS) {
      try {
        out.push(await one(s));
      } catch (e) {
        // one broken slug shouldn't drop the rest; the runner keeps last month's copy of this series
        console.warn(`  owid ${s.id}: ${(e as Error).message}`);
      }
    }
    return out;
  },
};
