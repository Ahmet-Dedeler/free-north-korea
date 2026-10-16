import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Footprints,
  Languages,
  Map,
  Rocket,
  Satellite,
  Shield,
  Usb,
  Users,
} from 'lucide-react';
import ArticleCards from '@/components/ArticleCards';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import { GithubIcon } from '@/components/SocialIcon';
import Locator from '@/components/Locator';
import HomeMapTour, { type TourStop } from '@/components/HomeMapTour';
import WatchTeaser from '@/components/WatchTeaser';
import { ARTICLES } from '@/content/articles';
import { KO_ARTICLES } from '@/content/translations/ko';
import { JA_ARTICLES } from '@/content/translations/ja';
import { ZH_ARTICLES } from '@/content/translations/zh';
import { getAllCamps } from '@/content/camps';
import { campFields } from '@/content/campsI18n';
import { SHELVES } from '@/content/library';
import { cover, media, orgLogo } from '@/content/media';
import { ORGS } from '@/content/orgs';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_CATEGORIES, PLACE_COLOR } from '@/content/places';
import { PLACE_CATEGORY_TEXT, placeFields } from '@/content/placesI18n';
import { person } from '@/entities';
import testsRaw from '../../public/data/test.en.json';
import { REPO_URL, SITE_NAME, SITE_URL } from '@/site/config';
import { jsonLd, type Lang } from '@/site/seo';
import { latest } from '@/charts/data';
import { dayLabel, getSatSite, imgSrc, latestSatSites, satCredit, type SatSite } from '@/content/satWatch';
import { HOME_TEXT } from '@/content/home';
import { localize } from '@/content/chrome';

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
      out.push({
        src: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${ty}/${tx}`,
        x: tx * 256 - left,
        y: ty * 256 - top,
      });
  return out;
}

/** How close the aerial starts, by kind of place: camps and ranges are big, palaces small. */
const ESRI_ZOOM: Record<string, number> = {
  camp: 13,
  nuclear: 14,
  missile: 14,
  regime: 16,
  border: 14,
  economy: 14,
  route: 11,
};

/** First sentence of a note, kept short enough for the card. */
const firstLine = (note: string) => {
  const t = note.replace(/\s+/g, ' ').trim();
  const s = t.match(/^.+?[.!?。！？](?=\s|$)/)?.[0] ?? t.split(/[。！？]/)[0] ?? t;
  return s.length > 120 ? `${s.slice(0, 117).replace(/\s+\S*$/, '')}…` : s;
};

/** Our newest Sentinel-2 chip of a site, if it is on Camp Watch. */
function satFor(lang: Lang, id: string): TourStop['sat'] {
  const site = getSatSite(id);
  if (!site?.latest) return undefined;
  return { src: imgSrc(site.id, site.latest), date: dayLabel(lang, site.latest), credit: satCredit(site.latest.slice(0, 4)) };
}

/**
 * The hero map: every camp and key site as a dot. It tours the dots by itself (HomeMapTour), each with a picture;
 * hovering a dot shows that one, clicking it opens that point on /map, clicking anywhere else opens /map.
 */
function MapPreview({ lang }: { lang: Lang }) {
  const t = HOME_TEXT[lang];
  const catText = PLACE_CATEGORY_TEXT[lang];
  const mapPath = localize(lang, '/map');

  const camps = getAllCamps().map((c) => {
    const f = campFields(lang, c);
    const href = `${mapPath}#camps=${c.id}`;
    return {
      pin: { lat: c.lat, lon: c.lon, title: c.name, color: '#dc2626', r: 7, href, tip: `${c.name}|${f.kindShort}` },
      stop: {
        name: c.name,
        kind: f.kindShort,
        line: firstLine(f.summary || f.note) || f.status,
        color: '#dc2626',
        href,
        group: 'camp',
        sat: satFor(lang, c.slug),
        esri: esriTiles(c.lat, c.lon, ESRI_ZOOM.camp),
      },
    };
  });

  const places = getAllPlaces().map((p) => {
    const f = placeFields(lang, p);
    const layer = p.id.startsWith('base-') ? 'missile-bases' : 'sites';
    const href = `${mapPath}#${layer}=${p.id}`;
    const categoryLabel = catText[p.category].label;
    return {
      pin: {
        lat: p.lat,
        lon: p.lon,
        title: p.name,
        color: PLACE_COLOR[p.category],
        r: 6,
        href,
        tip: `${p.name}|${categoryLabel}${f.status ? ` · ${f.status}` : ''}`,
      },
      stop: {
        name: p.name,
        kind: f.status ? `${categoryLabel} · ${f.status}` : categoryLabel,
        line: firstLine(f.note),
        color: PLACE_COLOR[p.category],
        href,
        group: p.category as string,
        sat: satFor(lang, p.id),
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
      <Locator pins={all.map((a) => a.pin)} label={t.mapLabel} ariaLabel={t.mapAriaLabel} />
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

const ARTICLES_BY_LANG = {
  en: ARTICLES,
  ko: KO_ARTICLES,
  ja: JA_ARTICLES,
  zh: ZH_ARTICLES,
};

export default function HomePage({ lang }: { lang: Lang }) {
  const t = HOME_TEXT[lang];
  const catText = PLACE_CATEGORY_TEXT[lang];
  const watched = latestSatSites(100);
  const newest = watched[0];
  const night = media('page:korea-at-night');
  const people = media('page:north-koreans');
  const fields = media('article:north-korea-songbun-caste-system');
  const placeCount = (c: string) => getAllPlaces().filter((p) => p.category === c).length;

  const legend = [
    { label: t.legendCamps, color: '#dc2626', n: getAllCamps().length },
    ...PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && placeCount(c.id) > 0).map((c) => ({
      label: catText[c.id].label,
      color: c.color,
      n: placeCount(c.id),
    })),
  ];

  const ticker: { icon: typeof Map; text: string }[] = [
    { icon: Shield, text: t.ticker.campsMapped(getAllCamps().length) },
    { icon: Rocket, text: t.ticker.launchesSince1984(TESTS.length) },
    { icon: Satellite, text: t.ticker.watchedFromSpace(watched.length) },
    { icon: Building2, text: t.ticker.orgsDoingWork(ORGS.length) },
    { icon: BookOpen, text: t.ticker.booksAndFilms(SHELVES.reduce((n, s) => n + s.items.length, 0)) },
    { icon: Languages, text: t.ticker.languages },
  ];

  const modules: { href: string; title: string; text: string; icon: typeof Map; preview: React.ReactNode }[] = [
    { href: localize(lang, '/people'), title: t.modules[0].title, text: t.modules[0].text, icon: Users, preview: <PeoplePreview /> },
    { href: '/missiles', title: t.modules[1].title, text: t.modules[1].text(TESTS.length), icon: Rocket, preview: <TestsPreview /> },
    { href: localize(lang, '/military'), title: t.modules[2].title, text: t.modules[2].text, icon: Shield, preview: <MilitaryPreview /> },
    { href: localize(lang, '/organizations'), title: t.modules[3].title, text: t.modules[3].text, icon: Building2, preview: <OrgsPreview /> },
    { href: localize(lang, '/library'), title: t.modules[4].title, text: t.modules[4].text, icon: BookOpen, preview: <LibraryPreview /> },
  ];

  const flash = orgLogo('flash-drives-for-freedom');
  const link = orgLogo('liberty-in-north-korea');
  const articles = ARTICLES_BY_LANG[lang].slice(0, 7);

  const homeUrl = lang === 'en' ? SITE_URL : `${SITE_URL}/${lang}`;
  const mapPath = localize(lang, '/map');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: homeUrl,
          inLanguage: lang === 'zh' ? 'zh-Hans' : lang,
        })}
      />

      <section className="hx bleed">
        <div className="hx-orbs" aria-hidden />
        <div className="hx-in">
          <div className="hx-copy">
            <h1>
              <span className="h1-line">{t.headline.line1}</span> <span className="h1-line">{t.headline.line2}</span>{' '}
              <span className="h1-line">
                {t.headline.beforePill}{' '}
                <span className="nowrap">
                  {people && (
                    <span className="h1-pill crowd" aria-hidden title={people.credit}>
                      <img src={people.src} alt="" />
                    </span>
                  )}{' '}
                  {t.headline.afterPill}
                </span>
              </span>
            </h1>
            <p className="hx-sub">{t.heroSub}</p>
            <div className="hx-cta">
              <Link className="btn primary" href={localize(lang, '/act')}>
                {t.heroCtaPrimary} <ArrowRight size={16} aria-hidden />
              </Link>
              <Link className="btn ghost" href={localize(lang, '/learn/how-can-north-korea-be-freed')}>
                {t.heroCtaSecondary} <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            {newest?.latest && (
              <Link href={localize(lang, '/watch')} className="hx-proof">
                <SatStack sites={watched.slice(0, 4)} />
                <span>
                  <b>{t.heroProof(watched.length)}</b>
                  {t.heroProofNewest(newest.name, dayLabel(lang, newest.latest))}
                </span>
              </Link>
            )}
          </div>
          <div className="home-map">
            {/* the whole picture opens the map; the dots sit above this link and open their own point */}
            <Link href={mapPath} className="home-map-bg" aria-label={t.mapOpenAria} />
            <MapPreview lang={lang} />
            {/* key and button in their own row under the map: the tour card stays inside the map, so it never covers them */}
            <div className="home-map-foot">
              <ul className="home-map-legend" aria-label={t.mapLegendKey}>
                {legend.map((l) => (
                  <li key={l.label}>
                    <i style={{ background: l.color }} /> {l.label} <span>{l.n}</span>
                  </li>
                ))}
              </ul>
              <Link href={mapPath} className="home-map-cta">
                <Map size={15} /> {t.mapOpen}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* the list twice, so the loop is seamless; the copy is hidden from screen readers */}
      <div className="ticker bleed">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1 || undefined}>
            {ticker.map((item) => (
              <li key={item.text}>
                <item.icon size={18} aria-hidden /> {item.text}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <section className="band">
        <div className="band-head">
          <h2>{t.quickActsHeading}</h2>
          <Link href={localize(lang, '/act')} className="btn small-btn">
            {t.quickActsAll} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <div className="quick-acts">
          <a className="quick-act" href="https://flashdrivesforfreedom.org" target="_blank" rel="noopener noreferrer">
            <span className="hl-logo">{flash ? <img src={flash.src} alt="" /> : <Usb />}</span>
            <span className="qa-kicker ok">{t.quickActs[0].kicker}</span>
            <b>{t.quickActs[0].title}</b>
            <span>{t.quickActs[0].desc}</span>
            <em>
              {t.quickActs[0].cta} <ArrowRight size={14} />
            </em>
          </a>
          <a className="quick-act" href="https://libertyinnorthkorea.org/donate" target="_blank" rel="noopener noreferrer">
            <span className="hl-logo">{link ? <img src={link.src} alt="" /> : <Footprints />}</span>
            <span className="qa-kicker">{t.quickActs[1].kicker}</span>
            <b>{t.quickActs[1].title}</b>
            <span>{t.quickActs[1].desc}</span>
            <em>
              {t.quickActs[1].cta} <ArrowRight size={14} />
            </em>
          </a>
          <Link className="quick-act" href={localize(lang, '/learn/information-into-north-korea')}>
            <span className="hl-logo icon">
              <Usb size={22} />
            </span>
            <span className="qa-kicker warn">{t.quickActs[2].kicker}</span>
            <b>{t.quickActs[2].title}</b>
            <span>{t.quickActs[2].desc}</span>
            <em>
              {t.quickActs[2].cta} <ArrowRight size={14} />
            </em>
          </Link>
        </div>
      </section>

      <section className="scale night bleed">
        <div className="scale-in">
          <div className="scale-copy">
            <p className="kicker">{t.scaleKicker}</p>
            <p className="scale-big">
              <b>
                80<span className="dash">–</span>120k
              </b>
              <span>{t.scaleBigLabel}</span>
              <small>{t.scaleBigNote}</small>
            </p>
            <dl className="scale-grid">
              <div>
                <dt>26M</dt>
                <dd>{t.scaleStats.population.label}</dd>
                <small>{t.scaleStats.population.source}</small>
              </div>
              <div>
                <dt>{arrivals.total}</dt>
                <dd>{t.scaleStats.arrivals(arrivals.year).label}</dd>
                <small>{t.scaleStats.arrivals(arrivals.year).source}</small>
              </div>
              <div>
                <dt>~60</dt>
                <dd>{t.scaleStats.nukes.label}</dd>
                <small>{t.scaleStats.nukes.source}</small>
              </div>
              <div>
                <dt>{TESTS.length}</dt>
                <dd>{t.scaleStats.missiles.label}</dd>
                <small>{t.scaleStats.missiles.source}</small>
              </div>
            </dl>
          </div>
          {night && (
            <figure className="scale-photo">
              <img src={night.src} alt={t.scalePhotoCaption} />
              <figcaption>
                {t.scalePhotoCaption} <span>{night.credit}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <WatchTeaser lang={lang} />

      <section className="band">
        <div className="band-head">
          <h2>{t.exploreHeading}</h2>
        </div>
        <ul className="explore">
          {modules.map((m) => (
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
          <h2>{t.questionsHeading}</h2>
          <Link href={localize(lang, '/learn')} className="btn small-btn">
            {t.questionsAll} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        {/* the lead plus two full rows of three; the rest are one click away on /learn */}
        <ArticleCards articles={articles} lead />
      </section>

      <section className="wall-cta" style={fields ? { ['--photo' as string]: `url(${fields.src})` } : undefined}>
        <div>
          <h2>{t.wallHeading}</h2>
          <p>{t.wallBody}</p>
          <div className="hx-cta">
            <Link className="btn primary" href={localize(lang, '/act')}>
              {t.wallCtaPrimary} <ArrowRight size={16} aria-hidden />
            </Link>
            <Link className="btn on-night" href={localize(lang, '/organizations')}>
              {t.wallCtaSecondary} <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        {fields && <small className="wall-credit">{t.wallCredit} {fields.credit}</small>}
      </section>

      <p className="home-build">
        <b>{t.buildBold}</b> {t.buildText}{' '}
        <Ext href={REPO_URL}>
          <GithubIcon />
          {t.buildCta}
        </Ext>
      </p>
    </>
  );
}
