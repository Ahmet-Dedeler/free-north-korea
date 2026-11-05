import { getAllCamps } from './camps';
import type { County } from './counties';
import { getAllPlaces } from './places-data';

/**
 * Which county pages we ask search engines to index. All 179 stay on the site and on the map, and they all link to
 * each other, but most hold little beyond a census row and "0 documented abuses". In the month to November 2026 the
 * 716 county URLs earned 3 Google clicks against 220 for the whole site, and nearly half of all our URLs were these
 * pages, which is a poor thing to show a search engine that is deciding whether to index a new domain.
 *
 * A county earns a place in search when it has something a reader would come for: a camp or atlas place, or at least
 * 10 documented abuses (NKDB counts). All four language versions of a county share one answer, so hreflang stays whole.
 */
const MIN_INCIDENTS = 10;

let withPlaces: Set<string> | null = null;

export function countyIsIndexable(county: County): boolean {
  withPlaces ??= new Set([...getAllCamps(), ...getAllPlaces()].map((p) => p.countyCode).filter((c): c is string => !!c));
  return county.incidents >= MIN_INCIDENTS || withPlaces.has(county.pcode);
}
