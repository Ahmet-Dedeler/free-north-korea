/**
 * The "Latest" section of the intel map sidebar, built on the server (the map route passes it as a prop, so the
 * browser never loads the event files). Two parts:
 * - the newest Camp Watch images, as thumbnails that open the site on the map;
 * - the latest measured events from the event wire (USGS quakes, Japan MOD launch reports) within EVENT_DAYS.
 * Text comes ready-made in the reader's language from eventsI18n.ts, the same words as the event feed on /watch.
 * The page is rebuilt whenever the event wire or Camp Watch commits, so "latest" stays current.
 */
import { CAMP_SLUGS } from './mapSlugs';
import { TEST_SITE_RADIUS_KM, latestEvents } from './events';
import { EVENT_TEXT, areaText, formatWhen } from './eventsI18n';
import { latestSatSites } from './satWatch';
import { localize } from './chrome';
import type { Lang } from '@/site/seo';
import type { LayerId } from '@/map/config';

/** Events older than this stay off the map's Latest list (they are still on /watch and /military). */
const EVENT_DAYS = 120;

export interface MapLatest {
  /** Newest Camp Watch images: `date` of the newest one, and the sites imaged that day or close to it, newest first. */
  sat: { date: string; sites: { layer: LayerId; id: string; siteId: string; name: string; date: string }[] } | null;
  events: {
    id: string;
    kind: 'seismic' | 'launch';
    iso: string;
    when: string;
    title: string;
    sub: string;
    /** Quakes fly the map to where USGS located them. */
    lngLat?: [number, number];
    /** Launches have no point; they link to the launch reports on /missiles/list. */
    href?: string;
  }[];
}

const CAMP_IDS = Object.fromEntries(Object.entries(CAMP_SLUGS).map(([mapId, slug]) => [slug, mapId]));

export function mapLatest(lang: Lang): MapLatest {
  const t = EVENT_TEXT[lang];
  const sites = latestSatSites(10);
  const sat = sites.length
    ? {
        date: sites[0].latest!,
        sites: sites.map((s) => ({
          layer: (s.category === 'camp' ? 'camps' : 'sites') as LayerId,
          id: s.category === 'camp' ? (CAMP_IDS[s.id] ?? s.id) : s.id,
          siteId: s.id,
          name: s.name,
          date: s.latest!,
        })),
      }
    : null;

  const cutoff = Date.now() - EVENT_DAYS * 86_400_000;
  const events: MapLatest['events'] = latestEvents(6)
    .filter((item) => Date.parse(item.time) >= cutoff)
    .slice(0, 3)
    .map((item) => {
      if (item.kind === 'seismic') {
        const e = item.event;
        return {
          id: e.id,
          kind: 'seismic' as const,
          iso: item.time,
          when: formatWhen(item.time, lang, { time: false }),
          title: t.feed.quake(t.usgsTypes[e.type] ?? e.type, e.mag?.toFixed(1) ?? '?'),
          sub: `${e.kmFromTestSite <= TEST_SITE_RADIUS_KM ? t.seismic.fromSite(t.km(e.kmFromTestSite)) : e.place} · ${t.feed.by.usgs}`,
          lngLat: [e.lon, e.lat] as [number, number],
        };
      }
      const e = item.event;
      const range = e.rangeKm.length ? t.km(Math.max(...e.rangeKm)) : null;
      const area = areaText(e.areaJa, lang);
      return {
        id: e.id,
        kind: 'launch' as const,
        iso: item.time,
        when: formatWhen(item.time, lang, { time: false }),
        title: t.feed.launch(t.count(e.count, e.countNote), t.weapon[e.weapon], range && (e.rangeBound ? t.bound(range, e.rangeBound) : t.feed.about(range))),
        sub: [area, t.feed.by.mod].filter(Boolean).join(' · '),
        href: `${localize(lang, '/missiles/list')}#japan-mod-reports`,
      };
    });

  return { sat, events };
}
