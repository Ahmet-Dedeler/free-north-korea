/**
 * The event wire: physically measured events, read from two built files.
 * - data/seismic.json: USGS catalog events in a box around North Korea (scripts/build-seismic.ts).
 * - data/launch-reports.json: Japan Ministry of Defense launch reports, read from its PDFs
 *   (scripts/build-launch-reports.ts).
 * Both are refreshed every few hours by .github/workflows/event-wire.yml. Labels and numbers are the measuring
 * agency's own; this file only groups and sorts them. Page text lives in eventsI18n.ts.
 */
import seismicRaw from '../../data/seismic.json';
import launchRaw from '../../data/launch-reports.json';
import testsRaw from '../../public/data/test.en.json';

export interface SeismicEvent {
  id: string;
  /** Origin time, ISO UTC. */
  time: string;
  mag: number | null;
  magType: string | null;
  /** USGS's own label, verbatim ("nuclear explosion", "collapse", "earthquake", ...). */
  type: string;
  /** USGS's place text, verbatim. */
  place: string;
  lat: number;
  lon: number;
  depthKm: number | null;
  status: string;
  url: string;
  kmFromTestSite: number;
}

export type Weapon = 'icbm-class' | 'ballistic' | 'possible-ballistic' | 'satellite' | 'other';
export type Landing = 'sea-of-japan' | 'yellow-sea' | 'pacific' | 'near-east-coast';
export type Eez = 'inside' | 'outside' | 'none-seen';
export type Bound = 'over' | 'at least' | null;
export type CountNote = 'at least' | 'total' | 'multiple' | 'exact';

/** One Japan MOD press release (one PDF). See scripts/build-launch-reports.ts for every field. */
export interface LaunchReport {
  id: string;
  url: string;
  htmlUrl: string;
  published: string;
  timesJst: string[];
  launchJst: string;
  launchUtc: string;
  precision: 'minute' | 'hour' | 'day';
  count: number | null;
  countNote: CountNote | null;
  weapon: Weapon;
  rangeKm: number[];
  /** MOD gave a lower bound: 'over' (を超えて) or 'at least' (少なくとも / 以上). */
  rangeBound: Bound;
  apogeeKm: number[];
  apogeeBound: Bound;
  flightMinutes: number | null;
  landing: Landing | null;
  eez: Eez | null;
  areaJa: string | null;
  landingJa: string | null;
  directionJa: string | null;
  textJa: string;
  fetched: string;
}

export const SEISMIC = seismicRaw as unknown as {
  fetched: string;
  source: { name: string; publisher: string; url: string; query: string };
  box: { minlatitude: number; maxlatitude: number; minlongitude: number; maxlongitude: number };
  testSite: { name: string; lat: number; lon: number };
  events: SeismicEvent[];
};

export const LAUNCH_REPORTS = launchRaw as unknown as {
  fetched: string;
  source: { name: string; publisher: string; url: string };
  reports: LaunchReport[];
};

/** Events this close to Punggye-ri are shown with the nuclear tests on /military. USGS's locations of the six tests
 *  fall within 8 km of the site's coordinates; 25 km leaves room for location error without reaching other valleys. */
export const TEST_SITE_RADIUS_KM = 25;

export const seismicNearTestSite = () => SEISMIC.events.filter((e) => e.kmFromTestSite <= TEST_SITE_RADIUS_KM);

/** Events whose USGS place is in North Korea or which sit at the test site: what the event feed shows. */
export const seismicInNorthKorea = () =>
  SEISMIC.events.filter((e) => e.kmFromTestSite <= TEST_SITE_RADIUS_KM || /North Korea$/.test(e.place));

/** Earliest year in the seismic file, for "since 19xx" lines. */
export const seismicSince = () => Math.min(...SEISMIC.events.map((e) => +e.time.slice(0, 4)));

/** How much a release says: used to pick the fullest one when MOD put out several for the same launch. */
const detail = (r: LaunchReport) =>
  r.rangeKm.length + r.apogeeKm.length + (r.count != null ? 1 : 0) + (r.precision === 'minute' ? 1 : 0) + (r.landing ? 1 : 0);

/**
 * One entry per launch event: MOD sometimes publishes a first release and a follow-up for the same launch
 * (2022 and earlier). Releases on the same day whose first launch times are within an hour are the same event;
 * the fullest release is kept, the others are listed in `also`. Newest first.
 */
export function launchEvents(): (LaunchReport & { also: string[] })[] {
  const out: (LaunchReport & { also: string[] })[] = [];
  const sorted = [...LAUNCH_REPORTS.reports].sort((a, b) => a.launchUtc.localeCompare(b.launchUtc));
  for (const r of sorted) {
    const prev = out.at(-1);
    const sameEvent = prev && prev.published === r.published && Math.abs(Date.parse(r.launchUtc) - Date.parse(prev.launchUtc)) <= 3_600_000;
    if (!sameEvent) {
      out.push({ ...r, also: [] });
      continue;
    }
    const best = detail(r) >= detail(prev) ? r : prev;
    const other = best === r ? prev.url : r.url;
    out[out.length - 1] = { ...best, also: [...prev.also.filter((u) => u !== best.url), other] };
  }
  return out.reverse();
}

type RawTest = { date: string; time: string };
const TESTS = (testsRaw as unknown as { timeBins: { data: RawTest[] }[] }).timeBins.flatMap((b) => b.data);

/** Launch time of the newest test in the CNS dataset (public/data/test.en.json). Its times are "HH:MM (UTC)";
 *  a test without a time counts as the end of its day. */
export const LAST_DATASET_TEST_UTC = TESTS.reduce((max, t) => {
  const hm = t.time.match(/(\d{2}):(\d{2})/);
  const at = Date.parse(`${t.date}T${hm ? `${hm[1]}:${hm[2]}` : '23:59'}:00Z`);
  return Number.isNaN(at) ? max : Math.max(max, at);
}, 0);

/** MOD launches newer than the dataset's last test (more than an hour after it, so the same launch timed a few
 *  minutes apart doesn't count twice). */
export const launchesNotInDataset = () => launchEvents().filter((e) => Date.parse(e.launchUtc) > LAST_DATASET_TEST_UTC + 3_600_000);

export type FeedItem =
  | { kind: 'seismic'; time: string; event: SeismicEvent }
  | { kind: 'launch'; time: string; event: LaunchReport & { also: string[] } };

/** Latest events across both sources, newest first. */
export function latestEvents(limit: number): FeedItem[] {
  const items: FeedItem[] = [
    ...seismicInNorthKorea().map((event) => ({ kind: 'seismic' as const, time: event.time, event })),
    ...launchEvents().map((event) => ({ kind: 'launch' as const, time: event.launchUtc, event })),
  ];
  return items.sort((a, b) => b.time.localeCompare(a.time)).slice(0, limit);
}
