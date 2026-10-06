import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building, Building2, Lock, MapPin, Ruler, ShieldAlert, Store, Table, Users } from 'lucide-react';
import CampCard from '@/components/CampCard';
import Locator from '@/components/Locator';
import PlaceCard from '@/components/PlaceCard';
import { SourceCards, StatTile } from '@/components/Visual';
import { getAllCamps } from '@/content/camps';
import { getAllCounties, getCountyBySlug } from '@/content/counties';
import { COUNTIES_PATHS, COUNTIES_TEXT, countyLanguages, decadeShort, decadeTitle, formatCount, provinceName, rightsLabel, sitePath } from '@/content/countiesI18n';
import { getAllPlaces } from '@/content/places-data';
import { absolute, jsonLd, pageMeta, type Lang } from '@/site/seo';

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
        <Locator county={county.pcode} label={county.name} />
      </header>

      <p className="dx-actions">
        <Link href={sitePath(lang, `/map#county=${county.pcode}`)} className="btn">
          <MapPin size={15} /> {t.openMap}
        </Link>
        <Link href={sitePath(lang, '/counties')} className="btn">
          <Table size={15} /> {t.compare}
        </Link>
      </p>

      <div className="dx-grid">
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
          <ul className="place-cards" lang={nameLang}>
            {campsInCounty.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </ul>
        </>
      )}

      {placesInCounty.length > 0 && (
        <>
          <h2>{t.placesHeading}</h2>
          <ul className="place-cards" lang={nameLang}>
            {placesInCounty.map((place) => (
              <PlaceCard key={place.id} place={place} />
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
