import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Footprints, Languages, Map, Rocket, Satellite, Shield, Usb, Users } from 'lucide-react';
import ArticleCards from '@/components/ArticleCards';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import { GithubIcon } from '@/components/SocialIcon';
import Locator from '@/components/Locator';
import HomeMapTour, { type TourStop } from '@/components/HomeMapTour';
import WatchTeaser from '@/components/WatchTeaser';
import { ARTICLES } from '@/content/articles';
import { getAllCamps } from '@/content/camps';
import { SHELVES } from '@/content/library';
import { cover, media, orgLogo } from '@/content/media';
import { ORGS } from '@/content/orgs';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_CATEGORIES, PLACE_COLOR } from '@/content/places';
import { person } from '@/entities';
import testsRaw from '../../public/data/test.en.json';
import { REPO_URL, SITE_NAME, SITE_URL } from '@/site/config';
import { jsonLd } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';
import { mdPath } from '@/site/agents';
import { latest } from '@/charts/data';
import { dayLabel, getSatSite, imgSrc, latestSatSites, satCredit, type SatSite } from '@/content/satWatch';

const HUB_PATHS_WITH_DEFAULT = { ...HUB_PATHS, 'x-default': '/' };

// the root layout supplies title and description; this adds the canonical URL and the translated hubs
export const metadata = { alternates: { canonical: '/', languages: HUB_PATHS_WITH_DEFAULT, types: { 'text/markdown': mdPath('/') } } };

const TESTS = (testsRaw as unknown as { timeBins: { data: { date: string }[] }[] }).timeBins.flatMap((b) => b.data);

/** Size of the tour card's picture (matches .tour-tiles in visual.css). */
const TOUR_IMG_W = 280;
const TOUR_IMG_H = 140;

/** Esri aerial tiles laid out so (lat, lon) sits in the middle of the tour card's picture. */
function esriTiles(lat: number, lon: number, z: number) {
  const world = 256 * 2 ** z;
  const px = ((lon + 180) / 360) * world;
  const s = Math.sin((lat * Math.PI) / 180);
  const py = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * world;
  const left = Math.round(px - TOUR_IMG_W / 2);
  const top = Math.round(py - TOUR_IMG_H / 2);
  const out: { src: string; x: number; y: number }[] = [];
  for (let ty = Math.floor(top / 256); ty <= Math.floor((top + TOUR_IMG_H) / 256); ty++)
    for (let tx = Math.floor(left / 256); tx <= Math.floor((left + TOUR_IMG_W) / 256); tx++)
      out.push({ src: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${ty}/${tx}`, x: tx * 256 - left, y: ty * 256 - top });
  return out;
}

/** How close the aerial starts, by kind of place: camps and ranges are big, palaces small. */
const ESRI_ZOOM: Record<string, number> = { camp: 13, nuclear: 14, missile: 14, regime: 16, border: 14, economy: 14, route: 11 };

/** First sentence of a note, kept short enough for the card. */
const firstLine = (note: string) => {
  const t = note.replace(/\s+/g, ' ').trim();
  const s = t.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? t;
  return s.length > 120 ? `${s.slice(0, 117).replace(/\s+\S*$/, '')}…` : s;
};

/** Our newest Sentinel-2 chip of a site, if it is on Camp Watch. */
function satFor(id: string): TourStop['sat'] {
  const site = getSatSite(id);
  if (!site?.latest) return undefined;
  return { src: imgSrc(site.id, site.latest), date: dayLabel('en', site.latest), credit: satCredit(site.latest.slice(0, 4)) };
}

/**
 * The hero map: every camp and key site as a dot. It tours the dots by itself (HomeMapTour), each with a picture;
 * hovering a dot shows that one, clicking it opens that point on /map, clicking anywhere else opens /map.
 */
function MapPreview() {
  const cat = Object.fromEntries(PLACE_CATEGORIES.map((c) => [c.id, c.label]));
  const camps = getAllCamps().map((c) => ({
    pin: { lat: c.lat, lon: c.lon, title: c.name, color: '#dc2626', r: 7, href: `/map#camps=${c.id}`, tip: `${c.name}|${c.kind}` },
    stop: {
      name: c.name,
      kind: c.kind.startsWith('Political') ? 'Political prison camp' : 'Prison',
      line: firstLine(c.facts.summary || c.note) || c.status,
      color: '#dc2626',
      href: `/map#camps=${c.id}`,
      group: 'camp',
      sat: satFor(c.slug),
      esri: esriTiles(c.lat, c.lon, ESRI_ZOOM.camp),
    },
  }));
  const places = getAllPlaces().map((p) => {
    const layer = p.id.startsWith('base-') ? 'missile-bases' : 'sites';
    const href = `/map#${layer}=${p.id}`;
    return {
      pin: { lat: p.lat, lon: p.lon, title: p.name, color: PLACE_COLOR[p.category], r: 6, href, tip: `${p.name}|${cat[p.category]}${p.status ? ` · ${p.status}` : ''}` },
      stop: {
        name: p.name,
        kind: p.status ? `${cat[p.category]} · ${p.status}` : cat[p.category],
        line: firstLine(p.note),
        color: PLACE_COLOR[p.category],
        href,
        group: p.category as string,
        sat: satFor(p.id),
        esri: esriTiles(p.lat, p.lon, ESRI_ZOOM[p.category] ?? 14),
      },
    };
  });
  const all = [...camps, ...places];
  // Tour order: our own dated images first, then the rest, taking one kind of place at a time so it never shows
  // five camps in a row.
  const interleave = (idx: number[]) => {
    const groups = new globalThis.Map<string, number[]>();
    for (const i of idx) groups.set(all[i].stop.group, [...(groups.get(all[i].stop.group) ?? []), i]);
    const lists = [...groups.values()];
    const out: number[] = [];
    for (let k = 0; out.length < idx.length; k++) for (const l of lists) if (l[k] != null) out.push(l[k]);
    return out;
  };
  const ids = all.map((_, i) => i);
  const order = [...interleave(ids.filter((i) => all[i].stop.sat)), ...interleave(ids.filter((i) => !all[i].stop.sat))];
  const stops: TourStop[] = all.map(({ stop: { group: _g, ...s } }) => (s.sat ? { ...s, esri: undefined } : s));
  return (
    <HomeMapTour stops={stops} order={order}>
      <Locator pins={all.map((a) => a.pin)} label="camps and key sites" ariaLabel="Map of North Korea's prison camps and key sites" />
    </HomeMapTour>
  );
}

function PeoplePreview() {
  const ids = ['kim-il-sung', 'kim-jong-il', 'kim-jong-un', 'kim-yo-jong', 'kim-ju-ae'];
  return (
    <span className="face-stack">
      {ids.map((id) => {
        const p = person(id);
        return p ? <Avatar key={id} person={p} size={52} /> : null;
      })}
    </span>
  );
}

function TestsPreview() {
  const years = Array.from({ length: 2026 - 1984 + 1 }, (_, i) => 1984 + i);
  const counts = years.map((y) => TESTS.filter((t) => t.date.startsWith(String(y))).length);
  const max = Math.max(...counts, 1);
  return (
    <span className="tests-spark">
      {counts.map((n, i) => (
        <i key={years[i]} style={{ height: `${Math.max(2, (n / max) * 100)}%` }} />
      ))}
    </span>
  );
}

function OrgsPreview() {
  return (
    <span className="logo-grid">
      {ORGS.filter((o) => orgLogo(o.id))
        .slice(0, 8)
        .map((o) => (
          <span key={o.id} className="hl-logo">
            <img src={orgLogo(o.id)!.src} alt="" loading="lazy" />
          </span>
        ))}
    </span>
  );
}

function LibraryPreview() {
  const books = SHELVES.flatMap((s) => s.items)
    .filter((i) => cover(i.title))
    .slice(0, 5);
  return (
    <span className="cover-fan">
      {books.map((b) => (
        <img key={b.title} src={cover(b.title)!.src} alt="" loading="lazy" />
      ))}
    </span>
  );
}

function MilitaryPreview() {
  return (
    <span className="mil-preview">
      {Array.from({ length: 60 }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

const MODULES: { href: string; title: string; text: string; icon: typeof Map; preview: React.ReactNode }[] = [
  { href: '/people', title: 'People', text: 'The Kim family tree and the officials who run the country, with sources and sanctions.', icon: Users, preview: <PeoplePreview /> },
  { href: '/missiles', title: 'Missile tests', text: `All ${TESTS.length} missile and space launches since 1984, with flight paths.`, icon: Rocket, preview: <TestsPreview /> },
  { href: '/military', title: 'Military', text: 'Nukes, missiles, artillery, cyber theft, and the war in Ukraine.', icon: Shield, preview: <MilitaryPreview /> },
  { href: '/organizations', title: 'Organizations', text: 'Who is doing the work in 2026 and how to help each one.', icon: Building2, preview: <OrgsPreview /> },
  { href: '/library', title: 'Library', text: 'Escapee memoirs, documentaries, UN reports and open data.', icon: BookOpen, preview: <LibraryPreview /> },
];

// Latest full year of arrivals, from the weekly chart datasets (data/series), so the tile never goes stale.
const arrivals = (() => {
  const w = latest('defector-arrivals', 'women')!;
  const m = latest('defector-arrivals', 'men')!;
  return { total: w.v + m.v, year: w.t };
})();

/** Thumbnails of the newest Camp Watch images, for the hero's "watched from space" row. */
function SatStack({ sites }: { sites: SatSite[] }) {
  return (
    <span className="sat-stack" aria-hidden>
      {sites.map((s) => (
        <img key={s.id} src={imgSrc(s.id, s.latest!)} alt="" />
      ))}
    </span>
  );
}

export default function Home() {
  const watched = latestSatSites(100);
  const newest = watched[0];
  const night = media('page:korea-at-night');
  const fields = media('article:north-korea-songbun-caste-system');
  const placeCount = (c: string) => getAllPlaces().filter((p) => p.category === c).length;
  const legend = [
    { label: 'Prison camps', color: '#dc2626', n: getAllCamps().length },
    ...PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && placeCount(c.id) > 0).map((c) => ({ label: c.label, color: c.color, n: placeCount(c.id) })),
  ];
  // the band under the hero: what this site counts, each number from the data
  const ticker: { icon: typeof Map; text: string }[] = [
    { icon: Shield, text: `${getAllCamps().length} prison camps and prisons mapped` },
    { icon: Rocket, text: `${TESTS.length} missile launches since 1984` },
    { icon: Satellite, text: `${watched.length} sites watched from space` },
    { icon: Building2, text: `${ORGS.length} organizations doing the work` },
    { icon: BookOpen, text: `${SHELVES.reduce((n, s) => n + s.items.length, 0)} books, films and reports` },
    { icon: Languages, text: 'English, 한국어, 日本語, 中文' },
  ];
  const flash = orgLogo('flash-drives-for-freedom');
  const link = orgLogo('liberty-in-north-korea');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL })}
      />

      <section className="hx night bleed">
        <div className="hx-orbs" aria-hidden />
        <div className="hx-in">
          <div className="hx-copy">
            <h1>
              <span className="h1-line">Understand</span> <span className="h1-line">North Korea.</span>{' '}
              <span className="h1-line">
                Help free its{' '}
                {/* the picture never wraps away from the word it stands before */}
                <span className="nowrap">
                  {night && (
                    <span className="h1-pill night" aria-hidden title={night.credit}>
                      <img src={night.src} alt="" />
                    </span>
                  )}{' '}
                  people.
                </span>
              </span>
            </h1>
            <p className="hx-sub">
              The map, the military picture, the history and the groups doing the work, plus clear things you can do today. The regime survives on
              keeping its people in the dark and everyone else uninterested. This site is for fixing both.
            </p>
            <div className="hx-cta">
              <Link className="btn primary" href="/act">
                What can I do? <ArrowRight size={16} aria-hidden />
              </Link>
              <Link className="btn on-night" href="/learn/how-can-north-korea-be-freed">
                How could North Korea be freed? <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            {newest?.latest && (
              <Link href="/watch" className="hx-proof">
                <SatStack sites={watched.slice(0, 4)} />
                <span>
                  <b>{watched.length} camps and weapons sites watched from space</b>
                  Newest image: {newest.name}, {dayLabel('en', newest.latest)}
                </span>
              </Link>
            )}
          </div>
          <div className="home-map">
            {/* the whole picture opens the map; the dots sit above this link and open their own point */}
            <Link href="/map" className="home-map-bg" aria-label="Open the intel map" />
            <MapPreview />
            <ul className="home-map-legend" aria-label="Map key">
              {legend.map((l) => (
                <li key={l.label}>
                  <i style={{ background: l.color }} /> {l.label} <span>{l.n}</span>
                </li>
              ))}
            </ul>
            <Link href="/map" className="home-map-cta">
              <Map size={15} /> Open the intel map
            </Link>
          </div>
        </div>
      </section>

      {/* the list twice, so the loop is seamless; the copy is hidden from screen readers */}
      <div className="ticker bleed">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1 || undefined}>
            {ticker.map((t) => (
              <li key={t.text}>
                <t.icon size={18} aria-hidden /> {t.text}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <section className="band">
        <div className="band-head">
          <h2>Do something in the next 10 minutes</h2>
          <Link href="/act" className="btn small-btn">
            All the ways to help <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <div className="quick-acts">
          <a className="quick-act" href="https://flashdrivesforfreedom.org" target="_blank" rel="noopener noreferrer">
            <span className="hl-logo">{flash ? <img src={flash.src} alt="" /> : <Usb />}</span>
            <span className="qa-kicker ok">Free</span>
            <b>Mail your old USB drives</b>
            <span>They get wiped, loaded with films and news, and smuggled into North Korea. 140,000+ so far.</span>
            <em>
              Flash Drives for Freedom <ArrowRight size={14} />
            </em>
          </a>
          <a className="quick-act" href="https://libertyinnorthkorea.org/donate" target="_blank" rel="noopener noreferrer">
            <span className="hl-logo">{link ? <img src={link.src} alt="" /> : <Footprints />}</span>
            <span className="qa-kicker">$3,000 = one person</span>
            <b>Fund a rescue</b>
            <span>Liberty in North Korea has brought 1,400+ people from China to safety. Any amount counts toward the next one.</span>
            <em>
              Donate to LiNK <ArrowRight size={14} />
            </em>
          </a>
          <Link className="quick-act" href="/learn/information-into-north-korea">
            <span className="hl-logo icon">
              <Usb size={22} />
            </span>
            <span className="qa-kicker warn">Context</span>
            <b>Know what changed in 2025</b>
            <span>Radio Free Asia’s Korean service closed and many groups lost funding. The pipeline into the country is at its weakest in years.</span>
            <em>
              Read the explainer <ArrowRight size={14} />
            </em>
          </Link>
        </div>
      </section>

      <section className="scale night bleed">
        <div className="scale-in">
          <div className="scale-copy">
            <p className="kicker">The scale of it</p>
            <p className="scale-big">
              <b>80–120k</b>
              <span>people held in political prison camps</span>
              <small>UN inquiry, 2014. Still the most-cited estimate</small>
            </p>
            <dl className="scale-grid">
              <div>
                <dt>26M</dt>
                <dd>people living under the Kim regime</dd>
                <small>UN estimate</small>
              </div>
              <div>
                <dt>{arrivals.total}</dt>
                <dd>escapees reached South Korea in {arrivals.year}</dd>
                <small>Unification Ministry</small>
              </div>
              <div>
                <dt>~60</dt>
                <dd>assembled nuclear warheads</dd>
                <small>SIPRI, Jan 2026</small>
              </div>
              <div>
                <dt>{TESTS.length}</dt>
                <dd>missile and space launches since 1984</dd>
                <small>CNS missile test database</small>
              </div>
            </dl>
          </div>
          {night && (
            <figure className="scale-photo">
              <img src={night.src} alt="The Korean peninsula at night from space: South Korea is covered in lights, North Korea is almost completely dark" />
              <figcaption>
                The peninsula at night. North Korea is the dark half. <span>{night.credit}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <WatchTeaser lang="en" />

      <section className="band">
        <div className="band-head">
          <h2>Explore</h2>
        </div>
        <ul className="explore">
          {MODULES.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="explore-tile">
                <span className="ex-preview">{m.preview}</span>
                <span className="ex-body">
                  <b>
                    <m.icon size={17} /> {m.title}
                  </b>
                  <span>{m.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="band">
        <div className="band-head">
          <h2>Questions people ask</h2>
          <Link href="/learn" className="btn small-btn">
            All explainers <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <ArticleCards articles={ARTICLES} lead />
      </section>

      <section className="wall-cta" style={fields ? { ['--photo' as string]: `url(${fields.src})` } : undefined}>
        <div>
          <h2>Ten minutes is enough to start.</h2>
          <p>Mail a USB drive, fund a rescue, write to your representative. Every way to help, what it costs and who does the work.</p>
          <div className="hx-cta">
            <Link className="btn primary" href="/act">
              What can I do? <ArrowRight size={16} aria-hidden />
            </Link>
            <Link className="btn on-night" href="/organizations">
              Groups doing the work <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        {fields && <small className="wall-credit">North Korean farmers, 2009. {fields.credit}</small>}
      </section>

      <p className="home-build">
        <b>Build this with us.</b> Everything here is open source. If you can code, map, translate Korean or spot a wrong fact, you can help.{' '}
        <Ext href={REPO_URL}>
          <GithubIcon />
          Contribute on GitHub
        </Ext>
      </p>
    </>
  );
}
