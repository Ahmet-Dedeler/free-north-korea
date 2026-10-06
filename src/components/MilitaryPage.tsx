import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Atom, Banknote, Bitcoin, Bomb, Crosshair, Factory, Fuel, Laptop, MapPin, Plane, Radiation, Rocket, Ship, Shield, Swords, Users, Wheat } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import { SourceCards, StatTile } from '@/components/Visual';
import { CITY_POINTS, MILITARY_SOURCE_URLS, MILITARY_TEXT, MISSILE_SPECS, NUKE_TEST_DATES, type MissileClassId } from '@/content/military';
import { getPlaceBySlug } from '@/content/places-data';
import { TYPE_COLOR, TYPES } from '@/missiles/meta';
import testsRaw from '../../public/data/test.en.json';
import missilesRaw from '../../public/data/missile.en.json';
import { REVIEWED } from '@/site/config';
import type { Lang } from '@/site/seo';

const ROOT: Record<Lang, string> = { en: '', ko: '/ko', ja: '/ja', zh: '/zh' };
const LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };
const ICONS: Record<MissileClassId, LucideIcon> = {
  'icbm-solid': Rocket,
  'icbm-liquid': Rocket,
  irbm: Plane,
  slbm: Ship,
  cruise: Crosshair,
  srbm: Bomb,
};

/** Cruise is not a class in the missile dataset, so it has no entry in TYPE_COLOR. */
const CRUISE_COLOR = '#64748b';

/** Great-circle distance from Pyongyang, so the range chart has real reference points. */
const PYONGYANG = [39.0392, 125.7625] as const;
function kmFrom([lat, lon]: readonly [number, number]) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat - PYONGYANG[0]) / 2) ** 2 + Math.cos(r(lat)) * Math.cos(r(PYONGYANG[0])) * Math.sin(r(lon - PYONGYANG[1]) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)));
}
const MAX_KM = 15000;
/** Square-root scale: short-range missiles stay visible next to ICBMs. */
const pos = (km: number) => `${(Math.sqrt(Math.min(km, MAX_KM)) / Math.sqrt(MAX_KM)) * 100}%`;

type RawTest = { date: string; missile: string };
const TESTS = (testsRaw as unknown as { timeBins: { data: RawTest[] }[] }).timeBins.flatMap((b) => b.data);
const MISSILE_TYPE = Object.fromEntries(Object.entries(missilesRaw as Record<string, { type: string }>).map(([k, v]) => [k, v.type]));

function classColor(type: (typeof MISSILE_SPECS)[number]['type']) {
  return type === 'Cruise' ? CRUISE_COLOR : TYPE_COLOR[type];
}

/** Missile designations stay in English inside translated sentences. */
function WithNames({ text }: { text: string }) {
  const parts = text.split(/(Hwasong-\d+[A-Za-z]?|Hwasal-\d+|Pukguksong(?: series)?|KN-\d+(?:\/\d+)?)/);
  return parts.map((part, i) =>
    /^(?:Hwasong-|Hwasal-|Pukguksong|KN-)/.test(part) ? (
      <span key={i} lang="en">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** The military page, shared by /military, /ko/military, /ja/military and /zh/military. Only the text changes per language. */
export default function MilitaryPage({ lang }: { lang: Lang }) {
  const t = MILITARY_TEXT[lang];
  const nuclearSites = ['punggye-ri', 'yongbyon', 'kangson'].map((s) => getPlaceBySlug(s)).filter((p) => !!p);
  const nukeTests = NUKE_TEST_DATES.map((date, i) => ({ date, note: t.nuclear.notes[i] }));
  const cities = CITY_POINTS.map((c) => ({ id: c.id, name: t.cities[c.id], km: kmFrom(c.at) }));
  const years = Array.from({ length: new Date(REVIEWED).getFullYear() - 1984 + 1 }, (_, i) => 1984 + i);
  const byYear = years.map((y) => {
    const ts = TESTS.filter((test) => test.date.startsWith(String(y)));
    const types: Record<string, number> = {};
    for (const test of ts) types[MISSILE_TYPE[test.missile] ?? 'Unknown'] = (types[MISSILE_TYPE[test.missile] ?? 'Unknown'] ?? 0) + 1;
    return { y, n: ts.length, types };
  });
  const maxYear = Math.max(...byYear.map((b) => b.n), 1);

  return (
    <div className="wide mil">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>
      <div className="tiles">
        <StatTile icon={Radiation} value={t.values.warheads} label={t.tiles.warheads} note={t.tiles.warheadsNote} tone="danger" />
        <StatTile icon={Atom} value={t.values.fissile} label={t.tiles.fissile} note={t.tiles.fissileNote} tone="warn" />
        <StatTile icon={Users} value={t.values.active} label={t.tiles.activeDuty} note={t.tiles.activeDutyNote} />
        <StatTile icon={Swords} value={t.values.toRussia} label={t.tiles.toRussia} note={t.tiles.toRussiaNote} />
      </div>

      <section className="mil-section">
        <h2>
          <Radiation size={22} className="h-icon danger" /> {t.nuclear.title}
        </h2>
        <div className="mil-two">
          <div>
            <p className="mil-p">{t.nuclear.body}</p>
            <figure className="stockpile" aria-label={t.nuclear.aria}>
              <div>
                {Array.from({ length: 90 }, (_, i) => (
                  <i key={i} className={i < 60 ? 'on' : ''} />
                ))}
              </div>
              <figcaption>
                <span>
                  <i className="on" /> {t.nuclear.assembled}
                </span>
                <span>
                  <i /> {t.nuclear.more}
                </span>
              </figcaption>
            </figure>
          </div>
          <ol className="test-line">
            {nukeTests.map((test, i) => (
              <li key={test.date} style={{ '--s': i === nukeTests.length - 1 ? 1 : 0.62 } as React.CSSProperties}>
                <span className="blast" />
                <b>{test.date.slice(0, 4)}</b>
                <small>{new Date(test.date).toLocaleDateString(LOCALE[lang], { month: 'short', day: 'numeric' })}</small>
                {test.note && <em>{test.note}</em>}
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

      <section className="mil-section">
        <h2>
          <Rocket size={22} className="h-icon" /> {t.missiles.title}
        </h2>
        <p className="mil-p">{t.missiles.body}</p>
        <div className="range-chart">
          <div className="range-axis">
            {cities.map((c) => (
              <span key={c.id} style={{ left: pos(c.km) }} className="city">
                <MapPin size={13} />
                <b>{c.name}</b>
                <small>
                  {c.km.toLocaleString(LOCALE[lang])}
                  {t.missiles.km}
                </small>
              </span>
            ))}
          </div>
          {MISSILE_SPECS.map((m) => {
            const text = t.missiles.classes[m.id];
            const Icon = ICONS[m.id];
            const max = m.range[1] ?? MAX_KM;
            return (
              <div key={m.id} className="range-row" style={{ '--c': classColor(m.type) } as React.CSSProperties}>
                <span className="range-name">
                  <Icon size={15} /> {text.cls}
                </span>
                <span className="range-track">
                  <i style={{ width: pos(max) }} className={m.range[1] == null ? 'open' : ''} />
                  <em style={{ left: pos(max) }}>{text.label}</em>
                </span>
              </div>
            );
          })}
          {cities.map((c) => (
            <span key={c.id} className="range-guide" style={{ left: `calc(var(--pad) + var(--name-w) + (100% - 2 * var(--pad) - var(--name-w)) * ${parseFloat(pos(c.km)) / 100})` }} />
          ))}
        </div>
        <p className="muted small">{t.missiles.caption}</p>

        <ul className="missile-cards">
          {MISSILE_SPECS.map((m) => {
            const text = t.missiles.classes[m.id];
            const Icon = ICONS[m.id];
            return (
              <li key={m.id} style={{ '--c': classColor(m.type) } as React.CSSProperties}>
                <span className="mc-icon">
                  <Icon size={20} />
                </span>
                <strong>{text.cls}</strong>
                <span className="mc-range">{text.label}</span>
                <span className="mc-names">
                  {m.names.map((n) => (
                    <span key={n} lang="en">
                      {n}
                    </span>
                  ))}
                </span>
                <p>
                  <WithNames text={text.note} />
                </p>
              </li>
            );
          })}
        </ul>

        <div className="panel tests-panel">
          <div className="tests-head">
            <h3>
              {t.missiles.testsSince(TESTS.length)} <small>{t.missiles.testsSource}</small>
            </h3>
            <Link href="/missiles" className="btn">
              <Rocket size={15} /> {t.missiles.explore}
            </Link>
          </div>
          <ol className="year-bars">
            {byYear.map((b) => (
              <li key={b.y} title={t.missiles.yearTitle(b.y, b.n)}>
                <span className="yb-stack" style={{ height: `${(b.n / maxYear) * 100}%` }}>
                  {TYPES.filter((ty) => b.types[ty.id]).map((ty) => (
                    <i key={ty.id} style={{ flex: b.types[ty.id], background: ty.color }} />
                  ))}
                </span>
                {b.y % 10 === 0 || b.y === years.at(-1) ? <small>{b.y}</small> : null}
              </li>
            ))}
          </ol>
          <p className="key left">
            {TYPES.filter((ty) => ty.id !== 'Unknown').map((ty) => (
              <span key={ty.id} lang={ty.id === 'SLV' ? undefined : 'en'}>
                <i style={{ background: ty.color }} /> {t.missiles.types[ty.id]}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="mil-section">
        <h2>
          <Shield size={22} className="h-icon" /> {t.conventional.title}
        </h2>
        <div className="tiles">
          <StatTile icon={Users} value={t.values.active} label={t.conventional.active} note={t.conventional.activeNote} />
          <StatTile icon={Users} value={t.values.reserves} label={t.conventional.reserves} note={t.conventional.reservesNote} />
          <StatTile icon={Shield} value={t.values.service} label={t.conventional.service} />
          <StatTile icon={Crosshair} value={t.values.seoul} label={t.conventional.seoul} tone="danger" />
        </div>
        <div className="callout">
          <h2>{t.conventional.whyTitle}</h2>
          <p>{t.conventional.whyBody}</p>
        </div>
      </section>

      <section className="mil-section">
        <h2>
          <Swords size={22} className="h-icon danger" /> {t.ukraine.title}
        </h2>
        <p className="mil-p">{t.ukraine.body}</p>
        <div className="trade">
          <div className="panel">
            <h3>{t.ukraine.sends}</h3>
            <ul className="trade-list">
              <li>
                <Users size={18} /> <b>{t.ukraine.troops}</b> <small>{t.ukraine.troopsNote}</small>
              </li>
              <li>
                <Bomb size={18} /> <b>{t.ukraine.shells}</b>
              </li>
              <li>
                <Rocket size={18} />{' '}
                <b>
                  <WithNames text={t.ukraine.missiles} />
                </b>{' '}
                <small>{t.ukraine.missilesNote}</small>
              </li>
            </ul>
          </div>
          <span className="trade-arrow" aria-hidden="true">
            ⇄
          </span>
          <div className="panel">
            <h3>{t.ukraine.receives}</h3>
            <ul className="trade-list">
              <li>
                <Banknote size={18} /> <b>{t.ukraine.money}</b>
              </li>
              <li>
                <Wheat size={18} /> <b>{t.ukraine.food}</b>
              </li>
              <li>
                <Fuel size={18} /> <b>{t.ukraine.oil}</b>
              </li>
              <li>
                <Factory size={18} /> <b>{t.ukraine.tech}</b> <small>{t.ukraine.techNote}</small>
              </li>
            </ul>
          </div>
        </div>
        <div className="tiles">
          <StatTile value={t.values.killed} label={t.ukraine.killed} note={t.ukraine.killedNote} tone="danger" />
          <StatTile value={t.values.casualties} label={t.ukraine.casualties} note={t.ukraine.casualtiesNote} tone="danger" />
        </div>
        <p className="muted small">{t.ukraine.drones}</p>
      </section>

      <section className="mil-section">
        <h2>
          <Laptop size={22} className="h-icon" /> {t.cyber.title}
        </h2>
        <div className="cyber">
          <div className="cyber-big">
            <Bitcoin size={28} />
            <b>{t.values.stolen}</b>
            <span>
              {t.cyber.stolenBefore}
              <span lang="en">Bybit</span>
              {t.cyber.stolenAfter}
            </span>
          </div>
          <div className="panel">
            <p>
              {t.cyber.beforeLazarus}
              <b lang="en">Lazarus</b>
              {t.cyber.afterLazarus}
              <b>{t.cyber.itWorkers}</b>
              {t.cyber.afterIt}
            </p>
          </div>
        </div>
      </section>

      <section className="callout danger mil-why">
        <h2>{t.why.title}</h2>
        <p>{t.why.body}</p>
        <Link href={`${ROOT[lang]}/learn/how-can-north-korea-be-freed`} className="btn primary">
          {t.why.cta}
        </Link>
      </section>

      <h2>{t.sourcesTitle}</h2>
      <SourceCards sources={t.sourceNames.map((name, i) => ({ name, url: MILITARY_SOURCE_URLS[i] }))} />
      <p className="muted small">{t.reviewed(REVIEWED)}</p>
    </div>
  );
}
