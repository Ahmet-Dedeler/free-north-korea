/**
 * Map points keep their map ids (`camp-0`, `base-6`) so map deep links and translations stay stable, but their
 * dossier pages live at readable slugs (`/camps/kwanliso-14`, `/places/sangnam-ni`). Client-safe (no fs), so the
 * map and the server pages share one table. Never link a map id straight into /camps or /places: `camp-14` on the
 * map is the I-gol facility, while /camps/camp-14 is Camp 14 at Kaechon.
 */
export const CAMP_SLUGS: Record<string, string> = {
  'camp-0': 'kwanliso-14',
  'camp-1': 'kwanliso-25',
  'camp-2': 'kwanliso-15',
  'camp-3': 'kwanliso-16',
  'camp-4': 'kwanliso-22',
  'camp-5': 'kwanliso-18',
  'camp-6': 'kyohwaso-8-yongdam',
  'camp-7': 'kyohwaso-11-chungsan',
  'camp-8': 'kyohwaso-7-kanggye',
  'camp-9': 'kyohwaso-2-dongrim',
  'camp-10': 'kyohwaso-88-wonsan',
  'camp-11': 'kyohwaso-9-hamhung',
  'camp-12': 'sunchon-kyohwaso',
  'camp-13': 'kyohwaso-8-sunghori',
  'camp-14': 'facility-at-i-gol',
  'camp-15': 'facility-at-udan',
  'camp-16': 'choma-bong-restricted-area',
  'camp-17': 'kyohwaso-3-sinuiju',
  'camp-18': 'kyohwaso-1-kaechon',
  'camp-19': 'kyohwaso-4-kangdong',
  'camp-20': 'kyohwaso-12-chongori',
  'camp-21': 'kyohwaso-6-sariwon',
  'camp-22': 'kyohwaso-22-oro',
  'camp-23': 'kyohwaso-77-danchon',
};

export const campSlug = (id: string): string => CAMP_SLUGS[id] ?? id;

/**
 * The CSIS undeclared missile bases keep their map ids (`base-0`…) so map deep links and translations stay stable,
 * but their dossier pages live at readable slugs (`/places/sangnam-ni`). Shared by the map and the place pages.
 */
export const BASE_SLUGS: Record<string, string> = {
  'base-0': 'sinpung',
  'base-1': 'yongnim',
  'base-2': 'hoejung-ni',
  'base-3': 'yusang-ni',
  'base-4': 'kal-gol',
  'base-5': 'kumchon-ni',
  'base-6': 'sangnam-ni',
  'base-7': 'sino-ri',
  'base-8': 'sakkanmol',
};

export const baseSlug = (id: string): string => BASE_SLUGS[id] ?? id;

/**
 * Full base name from the CSIS report URL. The scraped titles were cut at the first hyphen ("The Sangnam"),
 * the URL keeps the whole name: undeclared-north-korea-the-sangnam-ni-missile-operating-base → Sangnam-ni.
 */
export function baseName(url: string | undefined, fallback: string): string {
  const m = url?.match(/undeclared-north-korea-(?:the-)?(.+?)-missile-operating-base/);
  const place = m
    ? m[1].replace(/^[a-z]/, (c) => c.toUpperCase())
    : fallback.replace(/^The\s+/i, '').replace(/\s+Missile Operating Base$/i, '');
  return `${place} Missile Operating Base`;
}
