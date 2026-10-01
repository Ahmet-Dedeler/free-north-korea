import Link from 'next/link';
import { ARTICLES } from '@/content/articles';
import { Ext } from '@/components/Ext';
import { REPO_URL, SITE_NAME, SITE_URL } from '@/site/config';
import { jsonLd } from '@/site/seo';

export const metadata = { alternates: { canonical: '/' } };

const STATS = [
  { n: '26M', label: 'people living under the Kim regime', src: 'UN estimate' },
  { n: '80–120k', label: 'held in political prison camps', src: 'UN Commission of Inquiry, 2014' },
  { n: '224', label: 'escapees reached South Korea in 2025', src: 'Unification Ministry' },
  { n: '~60', label: 'assembled nuclear warheads', src: 'SIPRI, Jan 2026' },
];

const MODULES = [
  { href: '/map', title: 'Intel map', text: 'Camps, 190+ detention sites, missile bases, markets and 3,600 documented abuses by county.' },
  { href: '/people', title: 'People', text: 'The Kim family tree and the officials who run the country, with sources and sanctions.' },
  { href: '/military', title: 'Military capability', text: 'Troops, nukes, missiles, artillery, cyber theft, and the war in Ukraine.' },
  { href: '/missiles', title: 'Missile tests', text: 'Every missile and space launch since 1984 with flight paths and outcomes.' },
  { href: '/organizations', title: 'Organizations', text: 'Who is actually doing the work in 2026, what they do, and how to help each one.' },
  { href: '/library', title: 'Library', text: 'Escapee memoirs, documentaries, UN reports, regime sources and open data.' },
  { href: '/learn', title: 'Learn', text: 'Straight answers: can North Korea be freed, how people escape, what the camps are.' },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL })}
      />

      <section className="hero">
        <p className="eyebrow">Open source · No ads · No tracking</p>
        <h1>Understand North Korea. Help free its people.</h1>
        <p className="hero-sub">
          One place for the map, the military picture, the history, and the groups doing the work, plus clear things you can do today. The
          regime survives on keeping its people in the dark and everyone else uninterested. This site is for fixing both.
        </p>
        <div className="hero-cta">
          <Link className="btn primary" href="/act">
            What can I do?
          </Link>
          <Link className="btn" href="/learn/how-can-north-korea-be-freed">
            How could North Korea be freed?
          </Link>
        </div>
      </section>

      <section className="stat-row" aria-label="Key numbers">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <b>{s.n}</b>
            <span>{s.label}</span>
            <small>{s.src}</small>
          </div>
        ))}
      </section>

      <section className="band">
        <h2>Do something in the next 10 minutes</h2>
        <div className="cards three">
          <a className="card action" href="https://flashdrivesforfreedom.org" target="_blank" rel="noopener noreferrer">
            <span className="card-kicker">Free</span>
            <h3>Mail your old USB drives</h3>
            <p>They get wiped, loaded with films and news, and smuggled into North Korea. 140,000+ so far.</p>
          </a>
          <a className="card action" href="https://libertyinnorthkorea.org/donate" target="_blank" rel="noopener noreferrer">
            <span className="card-kicker">$3,000 = one person</span>
            <h3>Fund a rescue</h3>
            <p>Liberty in North Korea has brought 1,400+ people from China to safety. Any amount counts toward the next one.</p>
          </a>
          <Link className="card action" href="/learn/information-into-north-korea">
            <span className="card-kicker">Context</span>
            <h3>Know what changed in 2025</h3>
            <p>Radio Free Asia’s Korean service closed and many groups lost funding. The pipeline into the country is at its weakest in years.</p>
          </Link>
        </div>
      </section>

      <section className="band">
        <h2>Explore</h2>
        <div className="cards three">
          {MODULES.map((m) => (
            <a key={m.href} className="card" href={m.href}>
              <h3>{m.title} →</h3>
              <p>{m.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="band">
        <h2>Questions people ask</h2>
        <ul className="article-list">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <a href={`/learn/${a.slug}`}>
                <b>{a.h1}</b>
                <span>{a.teaser}</span>
              </a>
            </li>
          ))}
        </ul>
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
