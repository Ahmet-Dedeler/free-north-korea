import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCountySlugs, getCountyBySlug } from '@/content/counties';
import { getAllCamps } from '@/content/camps';
import { getAllPlaces } from '@/content/places-data';
import { Ext } from '@/components/Ext';
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

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/counties">Counties & Cities</Link> · {county.province} · {county.pcode}
      </p>

      <header className="dossier-head" style={{ display: 'block' }}>
        <div>
          <h1>{county.name}</h1>
          <p className="dossier-role">{county.province} Province</p>
          <div className="d-stats" style={{ margin: '1.5rem 0' }}>
            <div>
              <b>{county.pop ? county.pop.toLocaleString() : '—'}</b>
              <span>population (2008)</span>
            </div>
            <div>
              <b>{county.density ? `${county.density}/km²` : '—'}</b>
              <span>density</span>
            </div>
            <div>
              <b>{pctUrban}</b>
              <span>urban</span>
            </div>
            <div>
              <b>{county.area.toLocaleString()}</b>
              <span>km² area</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <Link href={`/map#county=${county.pcode}`} className="chip on">
          Explore on Intel Map →
        </Link>
      </div>

      <section className="facts">
        <div>
          <dt>Administrative Code</dt>
          <dd>{county.pcode}</dd>
        </div>
        <div>
          <dt>Province</dt>
          <dd>{county.province}</dd>
        </div>
        <div>
          <dt>Documented Abuses</dt>
          <dd>{county.incidents} recorded by NKDB</dd>
        </div>
        <div>
          <dt>Known Detention Facilities</dt>
          <dd>{county.detention} facilities</dd>
        </div>
        <div>
          <dt>Official Markets (Jangmadang)</dt>
          <dd>{county.markets} verified</dd>
        </div>
        {county.male && county.female && (
          <div>
            <dt>Gender Distribution</dt>
            <dd>
              {county.male.toLocaleString()} male / {county.female.toLocaleString()} female
            </dd>
          </div>
        )}
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <h2>Documented Human Rights Violations</h2>
        <p className="muted">
          Data compiled by the Database Center for North Korean Human Rights (NKDB) through over 80,000 defector testimonies.
        </p>

        {county.rights.length > 0 ? (
          <Bars rows={county.rights.slice(0, 8)} color="#dc2626" />
        ) : (
          <p className="muted" style={{ margin: '1rem 0' }}>
            No specific incidents have been formally registered for this county yet. In human rights monitoring of closed societies,
            an absence of testimony typically reflects a lack of surviving witnesses or escapees from the area rather than an absence of violations.
          </p>
        )}

        {decadeRows.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Violations Timeline by Decade</h3>
            <p className="d-decades" style={{ marginTop: '0.5rem' }}>
              {decadeRows.map(([k, v]) => (
                <span key={k}>
                  {k.replace('The ', '')} <b>{v}</b>
                </span>
              ))}
            </p>
          </div>
        )}
      </section>

      {campsInCounty.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Prison Camps in {county.name}</h2>
          <div className="cards three" style={{ marginTop: '1rem' }}>
            {campsInCounty.map((camp) => (
              <div key={camp.id} className="card">
                <p className="kicker" style={{ color: camp.kind.includes('kwanliso') ? '#dc2626' : '#f97316' }}>
                  {camp.kind}
                </p>
                <h4>
                  <Link href={`/camps/${camp.slug}`}>{camp.name}</Link>
                </h4>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  {camp.status} {camp.prisoners ? `· ~${camp.prisoners.toLocaleString()} prisoners` : ''}
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <Link href={`/camps/${camp.slug}`}>Read camp dossier →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {placesInCounty.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Strategic Sites in {county.name}</h2>
          <div className="cards three" style={{ marginTop: '1rem' }}>
            {placesInCounty.map((place) => (
              <div key={place.id} className="card">
                <p className="kicker">{place.categoryLabel}</p>
                <h4>
                  <Link href={`/places/${place.slug}`}>{place.name}</Link>
                </h4>
                {place.status && (
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    {place.status}
                  </p>
                )}
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <Link href={`/places/${place.slug}`}>Read site details →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: '2.5rem' }}>
        <h2>Primary Data Sources</h2>
        <ul className="claims">
          <li>
            <Ext href="https://data.humdata.org/dataset/cod-ab-prk">UN OCHA COD-AB North Korea Administrative Boundaries</Ext>
          </li>
          <li>
            <Ext href="https://data.humdata.org/dataset/cod-ps-prk">2008 DPRK Population and Housing Census (UNFPA)</Ext>
          </li>
          <li>
            <Ext href="https://www.visualatlas.org">Database Center for North Korean Human Rights (NKDB Visual Atlas)</Ext>
          </li>
        </ul>
      </section>
    </article>
  );
}
