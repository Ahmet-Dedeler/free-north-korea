/**
 * Client-safe Camp Watch helpers (no fs), shared by the dossier block (SatWatch) and the intel map's place photo.
 * satWatch.ts re-exports them, so server code can keep importing from there.
 */
import type { Lang } from '@/site/seo';

export const imgSrc = (siteId: string, date: string) => `/img/sentinel/${siteId}/${date}.jpg`;

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-06" as a day in each language. Done by hand so server and browser print the same string. */
export function dayLabel(lang: Lang, date: string) {
  const [y, m, d] = date.split('-').map(Number);
  if (lang === 'en') return `${d} ${MONTHS_EN[m - 1]} ${y}`;
  if (lang === 'ko') return `${y}년 ${m}월 ${d}일`;
  return `${y}年${m}月${d}日`;
}

/** "2026-10" as a short month label for the month strip. */
export function monthLabel(lang: Lang, month: string) {
  const [y, m] = month.split('-').map(Number);
  if (lang === 'en') return `${MONTHS_EN[m - 1]} ${String(y).slice(2)}`;
  if (lang === 'ko') return `${String(y).slice(2)}.${m}월`;
  return `${String(y).slice(2)}年${m}月`;
}


/** Required attribution for Copernicus Sentinel data. Kept in English in every language. */
export const satCredit = (years: string) => `Contains modified Copernicus Sentinel data ${years}`;

/** One imaged site as the intel map sees it: the capture dates, oldest first, and the dossier path. */
export interface MapSatSite {
  /** Ground width of the image in metres. */
  sizeM: number;
  latest: string;
  /** `month` is set when the image is the clearest of its month; the latest image may have none. */
  frames: { date: string; month: string | null }[];
  path: string;
}
