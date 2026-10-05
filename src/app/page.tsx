import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Footprints, Map, Radiation, Rocket, Shield, Usb, Users } from 'lucide-react';
import ArticleCards from '@/components/ArticleCards';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import Locator from '@/components/Locator';
import { StatTile } from '@/components/Visual';
import { ARTICLES } from '@/content/articles';
import { getAllCamps } from '@/content/camps';
import { SHELVES } from '@/content/library';
import { cover, orgLogo } from '@/content/media';
import { ORGS } from '@/content/orgs';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_COLOR } from '@/content/places';
import { person } from '@/entities';
import testsRaw from '../../public/data/test.en.json';
import { REPO_URL, SITE_NAME, SITE_URL } from '@/site/config';
import { jsonLd } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';
import { latest } from '@/charts/data';

const HUB_PATHS_WITH_DEFAULT = { ...HUB_PATHS, 'x-default': '/' };

// the root layout supplies title and description; this adds the canonical URL and the translated hubs
export const metadata = { alternates: { canonical: '/', languages: HUB_PATHS_WITH_DEFAULT } };

const TESTS = (testsRaw as unknown as { timeBins: { data: { date: string }[] }[] }).timeBins.flatMap((b) => b.data);

/** Tiny previews for the Explore tiles, so each one shows what is behind it. */
function MapPreview() {
  const pins = [
    ...getAllCamps().map((c) => ({ lat: c.lat, lon: c.lon, title: c.name, color: '#dc2626', r: 7 })),
    ...getAllPlaces().map((p) => ({ lat: p.lat, lon: p.lon, title: p.name, color: PLACE_COLOR[p.category], r: 6 })),
  ];
  return <Locator pins={pins} label="camps and key sites" />;
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
    <span className="spark">
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

export default function Home() {
  const flash = orgLogo('flash-drives-for-freedom');
  const link = orgLogo('liberty-in-north-korea');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL })}
      />

      <section className="home-hero">
        <div>
          <p className="eyebrow">Open source · No ads · No tracking</p>
          <h1>Understand North Korea. Help free its people.</h1>
          <p className="hero-sub">
            The map, the military picture, the history and the groups doing the work, plus clear things you can do today. The regime survives on
            keeping its people in the dark and everyone else uninterested. This site is for fixing both.
          </p>
          <div className="hero-cta">
            <Link className="btn primary" href="/act">
              What can I do?
            </Link>
            <Link className="btn" href="/learn/how-can-north-korea-be-freed">
              How could North Korea be freed?
            </Link>
          </div>
        </div>
        <Link href="/map" className="home-map" aria-label="Open the intel map">
          <MapPreview />
          <span className="home-map-cta">
            <Map size={15} /> Open the intel map
          </span>
        </Link>
      </section>

      <div className="tiles home-stats">
        <StatTile icon={Users} value="26M" label="people living under the Kim regime" note="UN estimate" />
        <StatTile icon={Shield} value="80–120k" label="held in political prison camps" note="UN Commission of Inquiry, 2014" tone="danger" />
        <StatTile icon={Footprints} value={arrivals.total} label={`escapees reached South Korea in ${arrivals.year}`} note="Unification Ministry" tone="ok" />
        <StatTile icon={Radiation} value="~60" label="assembled nuclear warheads" note="SIPRI, Jan 2026" tone="warn" />
      </div>

      <section className="band">
        <h2>Do something in the next 10 minutes</h2>
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

      <section className="band">
        <h2>Explore</h2>
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
        <h2>Questions people ask</h2>
        <ArticleCards articles={ARTICLES} lead />
      </section>

      <section className="band callout">
        <h2>Build this with us</h2>
        <p>
          Everything here is open source. If you can code, map, translate Korean, or just spot a wrong fact, you can help make this the
          reference people find when they search for North Korea.
        </p>
        <Ext className="btn" href={REPO_URL}>
          Contribute on GitHub
        </Ext>
      </section>
    </>
  );
}
