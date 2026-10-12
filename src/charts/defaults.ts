/** How each series is drawn on its own page (/data/<id>) and on /data cards, unless a page chooses otherwise. */
import type { Lang } from '@/site/seo';
import type { ChartOptions } from './data';

const COUNTRIES = ['PRK', 'KOR', 'CHN', 'WLD'];
const SOUTH_X = { hi: 'KOR', lo: 'PRK', mode: 'ratio' } as const;

export const DEFAULTS: Record<string, ChartOptions> = {
  'life-expectancy': { entities: COUNTRIES, from: 1950, gap: { hi: 'KOR', lo: 'PRK', mode: 'diff' } },
  'child-mortality': { entities: COUNTRIES, from: 1960, gap: { hi: 'PRK', lo: 'KOR', mode: 'ratio' } },
  'gdp-per-capita': { entities: COUNTRIES, from: 1911, gap: SOUTH_X },
  'height-men': { entities: ['PRK', 'KOR', 'CHN'] },
  'height-women': { entities: ['PRK', 'KOR', 'CHN'] },
  'electricity-per-person': { entities: COUNTRIES, gap: SOUTH_X },
  'energy-per-person': { entities: COUNTRIES, from: 1965, gap: SOUTH_X },
  'electricity-access': { entities: COUNTRIES },
  'mobile-phones': { entities: COUNTRIES, from: 2000 },
  fertility: { entities: COUNTRIES },
  population: { entities: ['PRK', 'KOR'], from: 1945 },
  calories: { entities: COUNTRIES },
  undernourishment: { entities: ['PRK', 'KOR', 'CHN', 'WLD'] },
  'cereal-yield': { entities: COUNTRIES },
  'co2-per-person': { entities: COUNTRIES },
  'armed-forces': { entities: ['PRK', 'KOR'] },
  democracy: { entities: ['PRK', 'KOR', 'CHN'], from: 1945 },
  'civil-liberties': { entities: ['PRK', 'KOR', 'CHN'], from: 1945 },
  'nuclear-warheads': { entities: ['PRK'], from: 2000 },
  'won-per-dollar': { log: true },
  'rice-price': { log: true },
  'defector-arrivals': { kind: 'stacked' },
  'humanitarian-aid': { kind: 'bar' },
  'missile-launches': { kind: 'stacked', from: 1984 },
  'un-sanctions-listings': { kind: 'stacked' },
  'crop-greenness': { entities: ['PRK'] },
  'night-lights': { kind: 'stacked' },
};

/** Era bands with text, per language, added on top of DEFAULTS. */
const BANDS: Record<string, Record<Lang, ChartOptions['bands']>> = {
  // EOG's annual product went from V2.1 to V2.2 in 2022; the note on the series explains why the rise after it is real
  'night-lights': {
    en: [{ from: 2022, to: 2025, label: 'New satellite product' }],
    ko: [{ from: 2022, to: 2025, label: '새 위성 자료 버전' }],
    ja: [{ from: 2022, to: 2025, label: '衛星データの新版' }],
    zh: [{ from: 2022, to: 2025, label: '卫星数据新版本' }],
  },
};

export const defaultsFor = (id: string, lang: Lang = 'en'): ChartOptions => {
  const bands = BANDS[id]?.[lang];
  return bands ? { ...DEFAULTS[id], bands } : (DEFAULTS[id] ?? {});
};
