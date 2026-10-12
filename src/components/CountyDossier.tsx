import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building, Building2, Lock, MapPin, Ruler, Satellite, ShieldAlert, Store, Table, Users } from 'lucide-react';
import CampCard from '@/components/CampCard';
import Locator from '@/components/Locator';
import PlaceCard from '@/components/PlaceCard';
import { SourceCards, StatTile } from '@/components/Visual';
import { getAllCamps } from '@/content/camps';
import { getAllCounties, getCountyBySlug } from '@/content/counties';
import { COUNTIES_PATHS, COUNTIES_TEXT, countyLanguages, decadeShort, decadeTitle, formatCount, provinceName, rightsLabel, sitePath } from '@/content/countiesI18n';
import { getAllPlaces } from '@/content/places-data';
import { absolute, jsonLd, pageMeta, type Lang } from '@/site/seo';
import { LIGHTS_STOPS } from '@/map/config';

type Lights = { years: number[]; source: { url: string; seam: number }; counties: Record<string, { litShare: (number | null)[] }> };
let lightsCache: Lights | null = null;
/** Yearly night lights per county, the same file the map's Night lights overlay reads (scripts/ee/night_lights.py). */
function lights(): Lights | null {
  if (lightsCache) return lightsCache;
  try {
    lightsCache = JSON.parse(readFileSync(path.join(process.cwd(), 'public/layers/lights-years.json'), 'utf8')) as Lights;
  } catch {
    return null;
  }
  return lightsCache;
}

/** The map's night-lights colour for a lit share: the LIGHTS_STOPS scale, interpolated in sqrt space like the map. */
function glow(share: number): string {
  const v = Math.sqrt(Math.max(0, share));
  const stops = LIGHTS_STOPS.map(([t, c]) => [Math.sqrt(t), c] as const);
  if (v >= stops.at(-1)![0]) return stops.at(-1)![1];
  const i = stops.findIndex(([t]) => t > v);
  const [t0, c0] = stops[i - 1];
  const [t1, c1] = stops[i];
  const k = (v - t0) / (t1 - t0);
  const rgb = (c: string) => [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16));
  const a = rgb(c0);
  const b = rgb(c1);
  return `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * k)).join(' ')})`;
}

const pct = (v: number) => `${(v * 100).toFixed(v < 0.01 ? 2 : 1)}%`;

/**
 * "Seen from space": the share of the county lit at night each year, as bars in the map's own glow colours on a night
 * background, with the latest year as the headline and the product change (seam) dashed.
 */
function SeenFromSpace({ pcode, lang }: { pcode: string; lang: Lang }) {
  const L = lights();
  const c = L?.counties[pcode];
  if (!L || !c) return null;
  const t = COUNTIES_TEXT[lang];
  const rows = L.years.map((y, i) => [y, c.litShare[i]] as const);
  const known = rows.filter((r): r is readonly [number, number] => r[1] != null);
  if (!known.length) return null;
  const [lastY, last] = known.at(-1)!;
  const [firstY, first] = known[0];
  const max = Math.max(...known.map((r) => r[1]), 0.02);
  const W = 300;
  const H = 96;
  const bw = W / rows.length;
  const seamAt = L.years.indexOf(L.source.seam);
  return (
    <section className="panel space-panel">
      <h2>{t.spaceHeading}</h2>
      <p className="space-big">
        <b>{pct(last)}</b> <span>{t.litLabel(lastY)}</span>
      </p>
      <p className="space-was">{t.litWas(pct(first), firstY)}</p>
      <svg className="space-bars" viewBox={`0 0 ${W} ${H + 14}`} role="img" aria-label={t.litChartAria(firstY, lastY)}>
        {rows.map(([y, v], i) => {
          const h = v == null ? 0 : Math.max(2, (v / max) * H);
          return <rect key={y} x={i * bw + 2} y={H - h} width={bw - 4} height={h} rx={2} style={{ fill: v == null ? 'none' : glow(v) }} />;
        })}
        {seamAt > 0 && <line x1={seamAt * bw} x2={seamAt * bw} y1={0} y2={H} className="space-seam" />}
        <text x={2} y={H + 12}>
          {L.years[0]}
        </text>
        <text x={W - 2} y={H + 12} textAnchor="end">
          {L.years.at(-1)}
        </text>
      </svg>
      <p className="muted small">
        {t.litSeam(L.source.seam)}{' '}
        <a href={L.source.url} target="_blank" rel="noopener noreferrer">
          {t.litSource}
        </a>
      </p>
    </section>
  );
}

export function countyMetadata(lang: Lang, slug: string) {
  const county = getCountyBySlug(slug);
  if (!county) return {};
  const t = COUNTIES_TEXT[lang];
  const province = provinceName(county.province, lang);
  return pageMeta({
    title: t.dossierTitle(county.name, province),
    description: t.dossierDescription(county.name, province, county.pop, county.incidents, county.detention, county.markets),
    path: countyLanguages(county.slug)[lang],
    lang,
    languages: countyLanguages(county.slug),
  });
}

function Bars({ rows, color, lang }: { rows: [string, number][]; color: string; lang: Lang }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ul className="bars" style={{ margin: '1rem 0' }}>
      {rows.map(([label, v]) => (
        <li key={label}>
          <span className="bars-label">{rightsLabel(label, lang)}</span>
          <span className="bars-track">
            <i style={{ width: `${(v / max) * 100}%`, background: color }} />
          </span>
          <b>{v}</b>
        </li>
      ))}
    </ul>
  );
}

/** Vertical bars per decade. */
function DecadeChart({ rows, lang }: { rows: [string, number][]; lang: Lang }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ol className="decades">
      {[...rows]
        .sort((a, b) => parseInt(a[0].match(/\d{4}/)?.[0] ?? '0') - parseInt(b[0].match(/\d{4}/)?.[0] ?? '0'))
        .map(([k, v]) => (
          <li key={k} title={decadeTitle(k, v, lang)}>
            <b>{v}</b>
            <span className="decades-bar">
              <i style={{ height: `${(v / max) * 100}%` }} />
            </span>
            <small>{decadeShort(k, lang)}</small>
          </li>
        ))}
    </ol>
  );
}

export default async function CountyDossier({ lang, slug }: { lang: Lang; slug: string }) {
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const t = COUNTIES_TEXT[lang];
  const province = provinceName(county.province, lang);
  const nameLang = lang === 'en' ? undefined : 'en';
  const campsInCounty = getAllCamps().filter((c) => c.countyCode === county.pcode);
  const placesInCounty = getAllPlaces().filter((p) => p.countyCode === county.pcode);

  const pctUrban = county.pop && county.urban ? `${Math.round((county.urban / county.pop) * 100)}%` : '—';
  const decadeRows = Object.entries(county.decades).filter(([k]) => !/verification/i.test(k));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: county.name,
    description: t.jsonLdDescription(province, county.pop),
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: province,
    },
    url: absolute(countyLanguages(county.slug)[lang]),
  };

  const femalePct = county.male && county.female ? Math.round((county.female / (county.male + county.female)) * 100) : null;
  const neighbours = getAllCounties().filter((c) => c.province === county.province && c.pcode !== county.pcode);

  return (
    <article className="dossier-x">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href={COUNTIES_PATHS[lang]}>{t.crumb}</Link> · {province} · {county.pcode}
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className="kind-tag">
            <Building2 size={14} /> {t.kind(/city$/i.test(county.name), province)}
          </span>
          <h1 lang={nameLang}>{county.name}</h1>
          <div className="tiles">
            <StatTile icon={Users} value={county.pop ? formatCount(county.pop, lang) : '—'} label={t.people} note={t.censusNote} />
            <StatTile icon={Ruler} value={formatCount(county.area, lang)} label={t.km2} note={county.density ? t.densityNote(county.density) : undefined} />
            <StatTile icon={Building} value={pctUrban} label={t.urban} />
          </div>
          <div className="tiles">
            <StatTile icon={ShieldAlert} value={county.incidents} label={t.documentedAbuses} note={t.nkdb} tone={county.incidents ? 'danger' : undefined} />
            <StatTile icon={Lock} value={county.detention} label={t.detentionSites} tone={county.detention ? 'warn' : undefined} />
            <StatTile icon={Store} value={county.markets} label={t.officialMarkets} tone={county.markets ? 'ok' : undefined} />
          </div>
        </div>
        <Locator county={county.pcode} label={county.name} ariaLabel={lang === 'en' ? undefined : t.locationAria(county.name)} />
      </header>

      <p className="dx-actions">
        <Link href={sitePath(lang, `/map#county=${county.pcode}`)} className="btn">
          <MapPin size={15} /> {t.openMap}
        </Link>
        <Link href={sitePath(lang, `/map#county=${county.pcode}&b=sat`)} className="btn">
          <Satellite size={15} /> {t.satView}
        </Link>
        <Link href={sitePath(lang, '/counties')} className="btn">
          <Table size={15} /> {t.compare}
        </Link>
      </p>

      <div className="dx-grid">
        <SeenFromSpace pcode={county.pcode} lang={lang} />
        <section className="panel">
          <h2>{t.rightsHeading}</h2>
          {county.rights.length > 0 ? (
            <Bars rows={county.rights.slice(0, 8)} color="var(--danger)" lang={lang} />
          ) : (
            <p className="muted small">{t.rightsEmpty}</p>
          )}
        </section>
        {decadeRows.length > 0 && (
          <section className="panel">
            <h2>{t.whenHeading}</h2>
            <DecadeChart rows={decadeRows} lang={lang} />
          </section>
        )}
        {femalePct != null && (
          <section className="panel">
            <h2>{t.sexHeading}</h2>
            <div className="split-bar" aria-label={t.womenAria(femalePct)}>
              <i style={{ width: `${femalePct}%` }} />
            </div>
            <p className="split-legend">
              <span>
                <b>{formatCount(county.female!, lang)}</b>{t.womenRest(femalePct)}
              </span>
              <span>
                <b>{formatCount(county.male!, lang)}</b>{t.menRest}
              </span>
            </p>
          </section>
        )}
      </div>

      {campsInCounty.length > 0 && (
        <>
          <h2>{t.campsHeading}</h2>
          <ul className="place-cards">
            {campsInCounty.map((camp) => (
              <CampCard key={camp.id} camp={camp} lang={lang} />
            ))}
          </ul>
        </>
      )}

      {placesInCounty.length > 0 && (
        <>
          <h2>{t.placesHeading}</h2>
          <ul className="place-cards">
            {placesInCounty.map((place) => (
              <PlaceCard key={place.id} place={place} lang={lang} />
            ))}
          </ul>
        </>
      )}

      {neighbours.length > 0 && (
        <>
          <h2>{t.elsewhere(province)}</h2>
          <ul className="pill-links">
            {neighbours.map((n) => (
              <li key={n.pcode}>
                <Link href={sitePath(lang, `/counties/${n.slug}`)}>
                  <span lang={nameLang}>{n.name}</span>
                  {n.incidents > 0 && <small>{n.incidents}</small>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>{t.sourcesHeading}</h2>
      <SourceCards
        sources={[
          { name: t.ochaLong, url: 'https://data.humdata.org/dataset/cod-ab-prk' },
          { name: t.censusSource, url: 'https://data.humdata.org/dataset/cod-ps-prk' },
          { name: t.nkdbSource, url: 'https://www.visualatlas.org' },
        ]}
      />
    </article>
  );
}
