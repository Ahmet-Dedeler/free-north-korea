/** How each series is drawn on its own page (/data/<id>) and on /data cards, unless a page chooses otherwise. */
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
};

export const defaultsFor = (id: string): ChartOptions => DEFAULTS[id] ?? {};
