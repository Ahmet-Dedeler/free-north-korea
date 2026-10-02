/**
 * Visual blocks used inside /learn articles, so explainers read like a field guide rather than a blog post.
 * Every number here also appears in the article text or its sources.
 */
import type { LucideIcon } from 'lucide-react';
import { Building2, Footprints, Home, Landmark, Megaphone, Radio, Route, Scale, Search, ShieldOff, Usb, Waves } from 'lucide-react';
import Avatar from './Avatar';
import CampCard from './CampCard';
import { person } from '@/entities';
import { CoverCard } from './Covers';
import { getAllCamps } from '@/content/camps';
import { SHELVES } from '@/content/library';
import { orgLogo } from '@/content/media';
import { ORGS } from '@/content/orgs';

/* ---------- generic ---------- */

/** Big number with a short label, floated in the text flow. */
export function Fact({ value, label, tone }: { value: string; label: string; tone?: 'danger' | 'ok' | 'warn' }) {
  return (
    <span className={`fact ${tone ?? ''}`}>
      <b>{value}</b>
      <span>{label}</span>
    </span>
  );
}

/** Row of icon steps (escape route, how-to). */
export function Steps({ steps }: { steps: { icon: LucideIcon; title: string; fact: string; href?: string }[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="step-icon">
            <s.icon size={22} />
            <small>{i + 1}</small>
          </span>
          <b>{s.href ? <a href={s.href}>{s.title}</a> : s.title}</b>
          <span>{s.fact}</span>
        </li>
      ))}
    </ol>
  );
}

/** Org cards with logos and the direct way to help, for "how to help" sections. */
export function OrgActions({ ids }: { ids: string[] }) {
  return (
    <ul className="org-actions-row">
      {ids.map((id) => {
        const o = ORGS.find((x) => x.id === id);
        if (!o) return null;
        const logo = orgLogo(o.id);
        const help = o.help[0];
        return (
          <li key={id}>
            <a href={help?.url ?? o.url} target="_blank" rel="noopener noreferrer">
              <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
              <span>
                <strong>{o.name.replace(/\s*\(.*\)/, '')}</strong>
                <small>{help?.label ?? 'Website'} ↗</small>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- how can North Korea be freed ---------- */

const PATHS: { n: number; icon: LucideIcon; title: string; anchor: string; push: 'yes' | 'some' | 'no'; pushText: string }[] = [
  { n: 1, icon: Usb, title: 'Information gets in', anchor: 'information', push: 'yes', pushText: 'Outsiders can push directly' },
  { n: 2, icon: Landmark, title: 'A split at the top', anchor: 'split', push: 'no', pushText: 'Happens inside the elite' },
  { n: 3, icon: Building2, title: 'Reform from inside', anchor: 'reform', push: 'some', pushText: 'Depends on a future leader' },
  { n: 4, icon: ShieldOff, title: 'Collapse', anchor: 'collapse', push: 'some', pushText: 'Outsiders can prepare evidence' },
  { n: 5, icon: Scale, title: 'Outside pressure', anchor: 'pressure', push: 'yes', pushText: 'Through governments and China' },
];

export function FivePaths() {
  return (
    <ol className="paths">
      {PATHS.map((p) => (
        <li key={p.n}>
          <a href={`#${p.anchor}`}>
            <span className="path-n">{p.n}</span>
            <p.icon size={22} className="path-icon" />
            <b>{p.title}</b>
            <span className={`push ${p.push}`}>
              <i />
              {p.pushText}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/* ---------- how North Koreans escape ---------- */

export function EscapeRoute() {
  return (
    <Steps
      steps={[
        { icon: Waves, title: 'Cross the river', fact: 'Tumen or Yalu into China, usually with a broker who pays off guards.', href: '#border' },
        { icon: Search, title: 'Hide in China', fact: 'No legal status. Caught means sent back: ~500–600 in one operation in Oct 2023.', href: '#china' },
        { icon: Route, title: '~3,000 miles south', fact: 'Safe houses, buses and jungle crossings into Laos and Thailand. ~$3,000 per rescue.', href: '#route' },
        { icon: Home, title: 'South Korea', fact: 'Questioning, then about three months at Hanawon before starting over.', href: '#south-korea' },
      ]}
    />
  );
}

/**
 * Arrivals in South Korea per year. 2002–2023 from the Ministry of Unification table (via Wikipedia), split by sex;
 * 2024 and 2025 from news reports of the ministry's annual figures (2025: 198 of 224 were women).
 */
const ARRIVALS: [number, number | null, number | null, number][] = [
  // year, women, men, total
  [2002, 632, 510, 1142],
  [2003, 811, 474, 1285],
  [2004, 1272, 626, 1898],
  [2005, 960, 424, 1384],
  [2006, 1513, 515, 2028],
  [2007, 1981, 573, 2554],
  [2008, 2195, 608, 2803],
  [2009, 2252, 662, 2914],
  [2010, 1811, 591, 2402],
  [2011, 1911, 795, 2706],
  [2012, 1098, 404, 1502],
  [2013, 1145, 369, 1514],
  [2014, 1092, 305, 1397],
  [2015, 1024, 251, 1275],
  [2016, 1119, 299, 1418],
  [2017, 939, 188, 1127],
  [2018, 969, 168, 1137],
  [2019, 845, 202, 1047],
  [2020, 157, 72, 229],
  [2021, 23, 40, 63],
  [2022, 32, 35, 67],
  [2023, 164, 32, 196],
  [2024, null, null, 236],
  [2025, 198, 26, 224],
];

export function ArrivalsChart() {
  const max = 3000;
  return (
    <figure className="arrivals">
      <div className="arrivals-plot">
        {[1000, 2000, 3000].map((g) => (
          <span key={g} className="grid-line" style={{ bottom: `${(g / max) * 100}%` }}>
            {g.toLocaleString('en-US')}
          </span>
        ))}
        <ol>
          {ARRIVALS.map(([y, w, m, t]) => (
            <li key={y} className={y >= 2020 ? 'after' : ''}>
              <span className="arr-tip">
                <b>{y}</b> {t.toLocaleString('en-US')} people
                {w != null && (
                  <>
                    <br />
                    {w.toLocaleString('en-US')} women · {m!.toLocaleString('en-US')} men
                  </>
                )}
              </span>
              <span className="arr-bar" style={{ height: `${(t / max) * 100}%` }}>
                {w != null ? (
                  <>
                    <i className="w" style={{ flex: w }} />
                    <i className="m" style={{ flex: m! }} />
                  </>
                ) : (
                  <i className="t" style={{ flex: 1 }} />
                )}
              </span>
              <small>{y % 5 === 0 || y === 2025 ? `’${String(y).slice(2)}` : ''}</small>
            </li>
          ))}
        </ol>
        <span className="arr-note" style={{ left: `${(18 / ARRIVALS.length) * 100}%` }}>
          Border sealed for COVID, 2020
        </span>
      </div>
      <figcaption className="key left">
        <span>
          <i style={{ background: '#db2777' }} /> Women
        </span>
        <span>
          <i style={{ background: '#0ea5e9' }} /> Men
        </span>
        <span className="muted">North Koreans arriving in South Korea per year. 34,538 in total by the end of 2025.</span>
      </figcaption>
    </figure>
  );
}

/* ---------- information into North Korea ---------- */

const CHANNELS: { icon: LucideIcon; title: string; status: string; tone: 'ok' | 'warn' | 'danger'; text: string; anchor: string }[] = [
  { icon: Usb, title: 'USB drives & microSD', status: 'Main channel', tone: 'ok', text: 'Copied hand to hand and played on cheap "notel" players. 140,000+ drives donated or pledged to Flash Drives for Freedom.', anchor: 'usb' },
  { icon: Radio, title: 'Radio', status: 'Hit hardest in 2025', tone: 'danger', text: 'RFA Korean shut down July 2025, VOA gutted, South Korea ended its broadcasts in June 2025.', anchor: 'radio' },
  { icon: Megaphone, title: 'Balloons', status: 'Mostly paused', tone: 'warn', text: 'South Korea began enforcing a launch ban in 2025. Always the most visible method, not the most effective.', anchor: 'balloons' },
];

export function Channels() {
  return (
    <ul className="channels">
      {CHANNELS.map((c) => (
        <li key={c.title} className={c.tone}>
          <a href={`#${c.anchor}`}>
            <span className="ch-icon">
              <c.icon size={24} />
            </span>
            <span className={`ch-status ${c.tone}`}>{c.status}</span>
            <b>{c.title}</b>
            <span>{c.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ---------- how to help ---------- */

export function HelpMenu() {
  const items: { icon: LucideIcon; title: string; cost: string; anchor: string }[] = [
    { icon: Footprints, title: 'Fund a rescue', cost: '~$3,000 per person', anchor: 'rescue' },
    { icon: Usb, title: 'Send information in', cost: 'Mail an old USB drive', anchor: 'information' },
    { icon: Home, title: 'Help escapees', cost: 'An hour a week of tutoring', anchor: 'escapees' },
    { icon: Search, title: 'Keep the evidence', cost: 'Fund documentation groups', anchor: 'evidence' },
    { icon: Megaphone, title: 'Use your voice', cost: 'Call your representatives', anchor: 'voice' },
  ];
  return (
    <ul className="help-menu">
      {items.map((it) => (
        <li key={it.title}>
          <a href={`#${it.anchor}`}>
            <it.icon size={22} />
            <b>{it.title}</b>
            <span>{it.cost}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}


/* ---------- prison camps ---------- */

export function CampGrid({ slugs }: { slugs: string[] }) {
  const all = getAllCamps();
  return (
    <ul className="place-cards wide-block">
      {slugs.map((s) => {
        const c = all.find((x) => x.slug === s);
        return c ? <CampCard key={s} camp={c} /> : null;
      })}
    </ul>
  );
}

/** Side-by-side comparison of two things, each a titled card. */
export function Compare({ items }: { items: { icon: LucideIcon; title: string; tone?: string; children: React.ReactNode }[] }) {
  return (
    <div className="compare">
      {items.map((it) => (
        <section key={it.title} className={`compare-card ${it.tone ?? ''}`}>
          <h3>
            <it.icon size={18} /> {it.title}
          </h3>
          {it.children}
        </section>
      ))}
    </div>
  );
}

/** Orgs with their logo and a sentence about what they do, as a list of cards. */
export function OrgNotes({ items }: { items: { id: string; note: React.ReactNode }[] }) {
  return (
    <ul className="org-notes">
      {items.map(({ id, note }) => {
        const o = ORGS.find((x) => x.id === id);
        if (!o) return null;
        const logo = orgLogo(o.id);
        return (
          <li key={id}>
            <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
            <span>
              <a href={`/organizations#${o.id}`}>
                <strong>{o.name.replace(/\s*\(.*\)/, '')}</strong>
              </a>{' '}
              {note}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** A few library covers inline. */
export function Books({ titles }: { titles: string[] }) {
  const items = SHELVES.flatMap((s) => s.items);
  return (
    <ul className="cover-grid inline-books">
      {titles.map((t) => {
        const it = items.find((i) => i.title === t);
        return it ? <CoverCard key={t} item={it} kind="book" /> : null;
      })}
    </ul>
  );
}

/** Grid of icon cards: a title and a sentence or two each. */
export function IconCards({ items }: { items: { icon: LucideIcon; title: string; children: React.ReactNode }[] }) {
  return (
    <ul className="icon-cards">
      {items.map((it) => (
        <li key={it.title}>
          <span className="ic-icon">
            <it.icon size={20} />
          </span>
          <b>{it.title}</b>
          <p>{it.children}</p>
        </li>
      ))}
    </ul>
  );
}

/** The three Kims as a timeline with portraits. */
export function Dynasty() {
  const rows = [
    { id: 'kim-il-sung', from: 1948, to: 1994 },
    { id: 'kim-jong-il', from: 1994, to: 2011 },
    { id: 'kim-jong-un', from: 2011, to: null },
  ];
  const end = 2026;
  return (
    <ol className="dynasty">
      {rows.map((r) => {
        const p = person(r.id);
        if (!p) return null;
        return (
          <li key={r.id} style={{ flex: (r.to ?? end) - r.from }}>
            <a href={`/people/${p.id}`}>
              <Avatar person={p} size={52} />
              <b>{p.name_en}</b>
              <span>
                {r.from}–{r.to ?? 'now'}
              </span>
            </a>
            <i className="dyn-bar" />
          </li>
        );
      })}
    </ol>
  );
}
