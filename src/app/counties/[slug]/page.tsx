import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCounties, getAllCountySlugs, getCountyBySlug } from '@/content/counties';
import { getAllCamps } from '@/content/camps';
import { getAllPlaces } from '@/content/places-data';
import { Building, Building2, Lock, MapPin, Ruler, ShieldAlert, Store, Table, Users } from 'lucide-react';
import CampCard from '@/components/CampCard';
import Locator from '@/components/Locator';
import PlaceCard from '@/components/PlaceCard';
import { SourceCards, StatTile } from '@/components/Visual';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCountySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) return {};

  return pageMeta({
    title: `${county.name} (${county.province}): North Korea County Demographics & Abuses`,
    description: `${county.name} in ${county.province}: population ${county.pop ? county.pop.toLocaleString() : 'unknown'}, ${county.incidents} documented human rights abuses, ${county.detention} detention facilities, and ${county.markets} official markets.`,
    path: `/counties/${county.slug}`,
  });
}

function Bars({ rows, color }: { rows: [string, number][]; color: string }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ul className="bars" style={{ margin: '1rem 0' }}>
      {rows.map(([label, v]) => (
        <li key={label}>
          <span className="bars-label">{label.replace(/^Rights? (to|of) (the )?/i, '').replace(/^./, (c) => c.toUpperCase())}</span>
          <span className="bars-track">
            <i style={{ width: `${(v / max) * 100}%`, background: color }} />
          </span>
          <b>{v}</b>
        </li>
      ))}
    </ul>
  );
}

export default async function CountyPage({ params }: Params) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const campsInCounty = getAllCamps().filter((c) => c.countyCode === county.pcode);
  const placesInCounty = getAllPlaces().filter((p) => p.countyCode === county.pcode);

  const pctUrban = county.pop && county.urban ? `${Math.round((county.urban / county.pop) * 100)}%` : '—';
  const decadeRows = Object.entries(county.decades).filter(([k]) => !/verification/i.test(k));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: county.name,
    description: `Administrative division in ${county.province}, DPRK. Population: ${county.pop ?? 'N/A'}.`,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: county.province,
    },
    url: absolute(`/counties/${county.slug}`),
  };

  const femalePct = county.male && county.female ? Math.round((county.female / (county.male + county.female)) * 100) : null;
  const neighbours = getAllCounties().filter((c) => c.province === county.province && c.pcode !== county.pcode);

  return (
    <article className="dossier-x">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/counties">Counties</Link> · {county.province} · {county.pcode}
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className="kind-tag">
            <Building2 size={14} /> {/city$/i.test(county.name) ? 'City' : 'County'} in {county.province}
          </span>
          <h1>{county.name}</h1>
          <div className="tiles">
            <StatTile icon={Users} value={county.pop ? county.pop.toLocaleString() : '—'} label="people" note="2008 census" />
            <StatTile
              icon={Ruler}
              value={county.area.toLocaleString()}
              label="km²"
              note={county.density ? `${county.density} people per km²` : undefined}
            />
            <StatTile icon={Building} value={pctUrban} label="live in towns" />
          </div>
          <div className="tiles">
            <StatTile
              icon={ShieldAlert}
              value={county.incidents}
              label="documented abuses"
              note="NKDB"
              tone={county.incidents ? 'danger' : undefined}
            />
            <StatTile icon={Lock} value={county.detention} label="detention sites" tone={county.detention ? 'warn' : undefined} />
            <StatTile icon={Store} value={county.markets} label="official markets" tone={county.markets ? 'ok' : undefined} />
          </div>
        </div>
        <Locator county={county.pcode} label={county.name} />
      </header>

      <p className="dx-actions">
        <Link href={`/map#county=${county.pcode}`} className="btn">
          <MapPin size={15} /> Open on the intel map
        </Link>
        <Link href="/counties" className="btn">
          <Table size={15} /> Compare all 179 counties
        </Link>
      </p>

      <div className="dx-grid">
        <section className="panel">
          <h2>Abuses by right violated</h2>
          {county.rights.length > 0 ? (
            <Bars rows={county.rights.slice(0, 8)} color="var(--danger)" />
          ) : (
            <p className="muted small">
              None recorded yet. In a closed country that usually means no witnesses from here have escaped, not that nothing happened.
            </p>
          )}
        </section>
        {decadeRows.length > 0 && (
          <section className="panel">
            <h2>When they happened</h2>
            <DecadeChart rows={decadeRows} />
          </section>
        )}
        {femalePct != null && (
          <section className="panel">
            <h2>Women and men</h2>
            <div className="split-bar" aria-label={`${femalePct}% women`}>
              <i style={{ width: `${femalePct}%` }} />
            </div>
            <p className="split-legend">
              <span>
                <b>{county.female!.toLocaleString()}</b> women ({femalePct}%)
              </span>
              <span>
                <b>{county.male!.toLocaleString()}</b> men
              </span>
            </p>
          </section>
        )}
      </div>

      {campsInCounty.length > 0 && (
        <>
          <h2>Prison camps here</h2>
          <ul className="place-cards">
            {campsInCounty.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </ul>
        </>
      )}

      {placesInCounty.length > 0 && (
        <>
          <h2>Key sites here</h2>
          <ul className="place-cards">
            {placesInCounty.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </ul>
        </>
      )}

      {neighbours.length > 0 && (
        <>
          <h2>Elsewhere in {county.province}</h2>
          <ul className="pill-links">
            {neighbours.map((n) => (
              <li key={n.pcode}>
                <Link href={`/counties/${n.slug}`}>
                  {n.name}
                  {n.incidents > 0 && <small>{n.incidents}</small>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Sources</h2>
      <SourceCards
        sources={[
          {
            name: 'UN OCHA administrative boundaries',
            url: 'https://data.humdata.org/dataset/cod-ab-prk',
          },
          {
            name: '2008 census (UNFPA)',
            url: 'https://data.humdata.org/dataset/cod-ps-prk',
          },
          { name: 'NKDB Visual Atlas', url: 'https://www.visualatlas.org' },
        ]}
      />
    </article>
  );
}

/** Vertical bars per decade. */
function DecadeChart({ rows }: { rows: [string, number][] }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ol className="decades">
      {[...rows]
        .sort((a, b) => parseInt(a[0].match(/\d{4}/)?.[0] ?? '0') - parseInt(b[0].match(/\d{4}/)?.[0] ?? '0'))
        .map(([k, v]) => (
          <li key={k} title={`${k}: ${v}`}>
            <b>{v}</b>
            <span className="decades-bar">
              <i style={{ height: `${(v / max) * 100}%` }} />
            </span>
            <small>{k.replace(/^The /, '').replace(/^(\d{4})s$/, (_, y: string) => `’${y.slice(2)}s`)}</small>
          </li>
        ))}
    </ol>
  );
}
