import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Atom, Banknote, Bitcoin, Bomb, Crosshair, Factory, Fuel, Laptop, MapPin, Plane, Radiation, Rocket, Ship, Shield, Swords, Users, Wheat } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import { SourceCards, StatTile } from '@/components/Visual';
import { getPlaceBySlug } from '@/content/places-data';
import { TYPE_COLOR, TYPES } from '@/missiles/meta';
import testsRaw from '../../../public/data/test.en.json';
import missilesRaw from '../../../public/data/missile.en.json';
import { REVIEWED } from '@/site/config';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Military Strength 2026: Nukes, Missiles, Army',
  description:
    'North Korea’s military in 2026: about 1.28 million active troops, ~60 nuclear warheads, solid-fuel ICBMs, artillery aimed at Seoul, crypto theft and 20,000+ troops sent to Russia.',
  path: '/military',
});

/** The six nuclear tests, all at Punggye-ri (dates per CTBTO / Wikipedia). */
const NUKE_TESTS = [
  { date: '2006-10-09', note: 'First test' },
  { date: '2009-05-25', note: '' },
  { date: '2013-02-12', note: '' },
  { date: '2016-01-06', note: 'Claimed H-bomb' },
  { date: '2016-09-09', note: '' },
  { date: '2017-09-03', note: 'Likely thermonuclear' },
];

/** Missile classes. `range` in km: [shortest, longest]; null max = "reaches the whole US". */
const MISSILES: { cls: string; type: keyof typeof TYPE_COLOR | 'Cruise'; icon: LucideIcon; names: string[]; range: [number, number | null]; label: string; note: string }[] = [
  { cls: 'ICBM, solid fuel', type: 'ICBM', icon: Rocket, names: ['Hwasong-18', 'Hwasong-19'], range: [13000, null], label: 'All of the US', note: 'Minutes to launch instead of hours. Hwasong-19 first flew in October 2024.' },
  { cls: 'ICBM, liquid fuel', type: 'ICBM', icon: Rocket, names: ['Hwasong-15', 'Hwasong-17'], range: [13000, 13000], label: '13,000+ km', note: 'Hwasong-17 is one of the largest road-mobile missiles in the world.' },
  { cls: 'IRBM / hypersonic', type: 'HGV', icon: Plane, names: ['Hwasong-12', 'Hwasong-16B'], range: [4500, 4500], label: '~4,500 km', note: 'Hwasong-16B carries a hypersonic glide vehicle meant to dodge missile defenses.' },
  { cls: 'Submarine-launched', type: 'SLBM', icon: Ship, names: ['Pukguksong series'], range: [1000, 2000], label: '1,000–2,000+ km', note: 'Built and tested at the Sinpo shipyard. Few real submarines to carry them yet.' },
  { cls: 'Cruise', type: 'Cruise', icon: Crosshair, names: ['Hwasal-1', 'Hwasal-2'], range: [1500, 2000], label: '1,500–2,000 km', note: 'Low-altitude cruise missiles, claimed nuclear-capable.' },
  { cls: 'Short range', type: 'SRBM', icon: Bomb, names: ['Hwasong-11 (KN-23/24)', 'KN-25'], range: [300, 800], label: '300–800 km', note: 'Low-flying, maneuvering missiles aimed at South Korea and Japan. Fired at Ukraine by Russia.' },
];

/** Great-circle distance from Pyongyang, so the range chart has real reference points. */
const PYONGYANG = [39.0392, 125.7625] as const;
function kmFrom([lat, lon]: readonly [number, number]) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat - PYONGYANG[0]) / 2) ** 2 + Math.cos(r(lat)) * Math.cos(r(PYONGYANG[0])) * Math.sin(r(lon - PYONGYANG[1]) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)));
}
const CITIES = (
  [
    ['Seoul', [37.5665, 126.978]],
    ['Tokyo', [35.6762, 139.6503]],
    ['Guam', [13.4443, 144.7937]],
    ['Honolulu', [21.3069, -157.8583]],
    ['Los Angeles', [34.0522, -118.2437]],
    ['Washington', [38.9072, -77.0369]],
  ] as const
).map(([name, at]) => ({ name, km: kmFrom(at) }));
const MAX_KM = 15000;
/** Square-root scale: short-range missiles stay visible next to ICBMs. */
const pos = (km: number) => `${(Math.sqrt(Math.min(km, MAX_KM)) / Math.sqrt(MAX_KM)) * 100}%`;

type RawTest = { date: string; missile: string };
const TESTS = (testsRaw as unknown as { timeBins: { data: RawTest[] }[] }).timeBins.flatMap((b) => b.data);
const MISSILE_TYPE = Object.fromEntries(Object.entries(missilesRaw as Record<string, { type: string }>).map(([k, v]) => [k, v.type]));

export default function Military() {
  const nuclearSites = ['punggye-ri', 'yongbyon', 'kangson'].map((s) => getPlaceBySlug(s)).filter((p) => !!p);
  const years = Array.from({ length: new Date(REVIEWED).getFullYear() - 1984 + 1 }, (_, i) => 1984 + i);
  const byYear = years.map((y) => {
    const ts = TESTS.filter((t) => t.date.startsWith(String(y)));
    const types: Record<string, number> = {};
    for (const t of ts) types[MISSILE_TYPE[t.missile] ?? 'Unknown'] = (types[MISSILE_TYPE[t.missile] ?? 'Unknown'] ?? 0) + 1;
    return { y, n: ts.length, types };
  });
  const maxYear = Math.max(...byYear.map((b) => b.n), 1);

  return (
    <div className="wide mil">
      <p className="eyebrow">Military capability</p>
      <h1>North Korea’s military in 2026</h1>
      <p className="lede">
        A huge share of a tiny economy goes to the military, and since 2017 that has bought a real nuclear arsenal. All numbers are public
        estimates, and the sources often disagree.
      </p>
      <div className="tiles">
        <StatTile icon={Radiation} value="~60" label="nuclear warheads" note="SIPRI, Jan 2026" tone="danger" />
        <StatTile icon={Atom} value="~90" label="warheads’ worth of fissile material" note="SIPRI, Jan 2026" tone="warn" />
        <StatTile icon={Users} value="1.28M" label="active-duty troops" note="IISS Military Balance" />
        <StatTile icon={Swords} value="20,000+" label="troops sent to Russia since 2024" note="South Korean & Ukrainian intel" />
      </div>

      {/* ---------- nuclear ---------- */}
      <section className="mil-section">
        <h2>
          <Radiation size={22} className="h-icon danger" /> Nuclear weapons
        </h2>
        <div className="mil-two">
          <div>
            <p className="mil-p">
              Six tests between 2006 and 2017, all at Punggye-ri. Plutonium comes from the Yongbyon reactors, enriched uranium from Yongbyon
              and the covert Kangson site. Since 2023 nuclear status is written into the constitution, and Kim Jong Un has called for
              "exponential" growth.
            </p>
            <figure className="stockpile" aria-label="About 60 assembled warheads and material for about 90">
              <div>
                {Array.from({ length: 90 }, (_, i) => (
                  <i key={i} className={i < 60 ? 'on' : ''} />
                ))}
              </div>
              <figcaption>
                <span>
                  <i className="on" /> ~60 assembled warheads
                </span>
                <span>
                  <i /> material for ~30 more
                </span>
              </figcaption>
            </figure>
          </div>
          <ol className="test-line">
            {NUKE_TESTS.map((t, i) => (
              <li key={t.date} style={{ '--s': i === NUKE_TESTS.length - 1 ? 1 : 0.62 } as React.CSSProperties}>
                <span className="blast" />
                <b>{t.date.slice(0, 4)}</b>
                <small>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small>
                {t.note && <em>{t.note}</em>}
              </li>
            ))}
          </ol>
        </div>
        <ul className="place-cards">
          {nuclearSites.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </ul>
      </section>

      {/* ---------- missiles ---------- */}
      <section className="mil-section">
        <h2>
          <Rocket size={22} className="h-icon" /> Missiles
        </h2>
        <p className="mil-p">
          Every class from short range to intercontinental. The big shift is solid fuel: those missiles can be hidden and fired in minutes,
          so they are much harder to destroy before launch.
        </p>
        <div className="range-chart">
          <div className="range-axis">
            {CITIES.map((c) => (
              <span key={c.name} style={{ left: pos(c.km) }} className="city">
                <MapPin size={13} />
                <b>{c.name}</b>
                <small>{c.km.toLocaleString('en-US')} km</small>
              </span>
            ))}
          </div>
          {MISSILES.map((m) => {
            const color = m.type === 'Cruise' ? '#64748b' : TYPE_COLOR[m.type];
            const max = m.range[1] ?? MAX_KM;
            return (
              <div key={m.cls} className="range-row" style={{ '--c': color } as React.CSSProperties}>
                <span className="range-name">
                  <m.icon size={15} /> {m.cls}
                </span>
                <span className="range-track">
                  <i style={{ width: pos(max) }} className={m.range[1] == null ? 'open' : ''} />
                  <em style={{ left: pos(max) }}>{m.label}</em>
                </span>
              </div>
            );
          })}
          {CITIES.map((c) => (
            <span key={c.name} className="range-guide" style={{ left: `calc(var(--pad) + var(--name-w) + (100% - 2 * var(--pad) - var(--name-w)) * ${parseFloat(pos(c.km)) / 100})` }} />
          ))}
        </div>
        <p className="muted small">Distances are straight-line from Pyongyang. Square-root scale so short-range missiles stay visible.</p>

        <ul className="missile-cards">
          {MISSILES.map((m) => {
            const color = m.type === 'Cruise' ? '#64748b' : TYPE_COLOR[m.type];
            return (
              <li key={m.cls} style={{ '--c': color } as React.CSSProperties}>
                <span className="mc-icon">
                  <m.icon size={20} />
                </span>
                <strong>{m.cls}</strong>
                <span className="mc-range">{m.label}</span>
                <span className="mc-names">
                  {m.names.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
                <p>{m.note}</p>
              </li>
            );
          })}
        </ul>

        <div className="panel tests-panel">
          <div className="tests-head">
            <h3>
              {TESTS.length} missile tests since 1984 <small>CNS database</small>
            </h3>
            <Link href="/missiles" className="btn">
              <Rocket size={15} /> Explore every test
            </Link>
          </div>
          <ol className="year-bars">
            {byYear.map((b) => (
              <li key={b.y} title={`${b.y}: ${b.n} tests`}>
                <span className="yb-stack" style={{ height: `${(b.n / maxYear) * 100}%` }}>
                  {TYPES.filter((t) => b.types[t.id]).map((t) => (
                    <i key={t.id} style={{ flex: b.types[t.id], background: t.color }} />
                  ))}
                </span>
                {b.y % 10 === 0 || b.y === years.at(-1) ? <small>{b.y}</small> : null}
              </li>
            ))}
          </ol>
          <p className="key left">
            {TYPES.filter((t) => t.id !== 'Unknown').map((t) => (
              <span key={t.id}>
                <i style={{ background: t.color }} /> {t.label}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- conventional ---------- */}
      <section className="mil-section">
        <h2>
          <Shield size={22} className="h-icon" /> Conventional forces
        </h2>
        <div className="tiles">
          <StatTile icon={Users} value="1.28M" label="active troops" note="IISS" />
          <StatTile icon={Users} value="~600k" label="reserves" note="IISS" />
          <StatTile icon={Shield} value="~10 yrs" label="typical service for men" />
          <StatTile icon={Crosshair} value="~25M" label="people in Seoul’s metro, in artillery range" tone="danger" />
        </div>
        <div className="callout">
          <h2>Why there is no military option</h2>
          <p>
            Much of the equipment is Soviet-era, fuel and food are short, and soldiers often work as construction and farm labor. What matters
            is artillery: thousands of guns and rocket launchers in hardened positions near the DMZ, in range of Seoul. That threat, more than
            the nukes, is why invasion has never been on the table.
          </p>
        </div>
      </section>

      {/* ---------- Ukraine ---------- */}
      <section className="mil-section">
        <h2>
          <Swords size={22} className="h-icon danger" /> The war in Ukraine
        </h2>
        <p className="mil-p">
          Since late 2024 North Korea has sent more than 20,000 troops to Russia, mainly to the Kursk region. A 2024 mutual defense treaty
          formalized the alliance.
        </p>
        <div className="trade">
          <div className="panel">
            <h3>North Korea sends</h3>
            <ul className="trade-list">
              <li>
                <Users size={18} /> <b>20,000+ troops</b> <small>mostly to Kursk</small>
              </li>
              <li>
                <Bomb size={18} /> <b>Millions of artillery shells</b>
              </li>
              <li>
                <Rocket size={18} /> <b>Hwasong-11 missiles</b> <small>fired at Ukrainian cities</small>
              </li>
            </ul>
          </div>
          <span className="trade-arrow" aria-hidden="true">
            ⇄
          </span>
          <div className="panel">
            <h3>Russia gives back</h3>
            <ul className="trade-list">
              <li>
                <Banknote size={18} /> <b>Money</b>
              </li>
              <li>
                <Wheat size={18} /> <b>Food</b>
              </li>
              <li>
                <Fuel size={18} /> <b>Oil</b>
              </li>
              <li>
                <Factory size={18} /> <b>Possibly tech</b> <small>satellites, submarines, air defense</small>
              </li>
            </ul>
          </div>
        </div>
        <div className="tiles">
          <StatTile value="~6,000" label="killed or wounded by early 2026" note="South Korean intelligence" tone="danger" />
          <StatTile value="7,000+" label="casualties" note="Ukraine’s HUR" tone="danger" />
        </div>
        <p className="muted small">Its soldiers are also getting real combat experience with drones, which no other army in Asia has.</p>
      </section>

      {/* ---------- cyber ---------- */}
      <section className="mil-section">
        <h2>
          <Laptop size={22} className="h-icon" /> Cyber and crypto theft
        </h2>
        <div className="cyber">
          <div className="cyber-big">
            <Bitcoin size={28} />
            <b>$1.5B</b>
            <span>stolen from the Bybit exchange in February 2025, the largest crypto theft ever</span>
          </div>
          <div className="panel">
            <p>
              Hacking groups often called <b>Lazarus</b> steal crypto on a scale no one else does. Thousands of North Korean <b>IT workers</b>{' '}
              also hold remote jobs at foreign companies under fake identities. UN experts say the money funds the weapons programs.
            </p>
          </div>
        </div>
      </section>

      <section className="callout danger mil-why">
        <h2>Why this matters for freedom</h2>
        <p>
          The weapons are the regime’s insurance against outside pressure, and they cost money that could feed people. Every dollar from crypto
          theft or arms sales to Russia keeps the elite loyal without reform. Cutting that income is one of the realistic levers.
        </p>
        <Link href="/learn/how-can-north-korea-be-freed" className="btn primary">
          How North Korea could be freed →
        </Link>
      </section>

      <h2>Sources</h2>
      <SourceCards
        sources={[
          {
            name: 'SIPRI Yearbook 2026',
            url: 'https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now',
          },
          { name: 'IISS, The Military Balance', url: 'https://www.iiss.org/publications/the-military-balance/' },
          { name: 'North Korean troops in Kursk, 2026', url: 'https://kyivindependent.com/nearly-11-000-north-korean-troops-stationed-in-russias-kursk-oblast-at-start-of-2026-media-reports/' },
          { name: 'HUR casualty estimate', url: 'https://kyivindependent.com/north-korean-troops-took-over-7-000-casualties-in-russias-kursk-oblast-hur-claims/' },
          { name: 'CSIS Missile Threat: North Korea', url: 'https://missilethreat.csis.org/country/dprk/' },
          { name: 'CNS Missile Test Database', url: 'https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/' },
          { name: 'Nuclear tests of North Korea', url: 'https://en.wikipedia.org/wiki/List_of_nuclear_weapons_tests_of_North_Korea' },
        ]}
      />
      <p className="muted small">Last reviewed {REVIEWED}.</p>
    </div>
  );
}
