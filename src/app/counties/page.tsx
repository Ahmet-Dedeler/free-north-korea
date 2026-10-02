import Link from 'next/link';
import { getAllCounties } from '@/content/counties';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'All 179 North Korea Counties: Demographics, Abuses & Facilities',
  description:
    'County-by-county atlas of North Korea: 2008 census demographics, documented human rights violations (NKDB), detention facilities, and markets across all 179 counties and cities.',
  path: '/counties',
});

export default function CountiesIndex() {
  const counties = getAllCounties();

  // Group counties by province
  const provinces = Array.from(new Set(counties.map((c) => c.province))).sort();

  const totalPop = counties.reduce((acc, c) => acc + (c.pop ?? 0), 0);
  const totalIncidents = counties.reduce((acc, c) => acc + c.incidents, 0);
  const totalDetention = counties.reduce((acc, c) => acc + c.detention, 0);
  const totalMarkets = counties.reduce((acc, c) => acc + c.markets, 0);

  return (
    <div className="wide">
      <p className="eyebrow">Demographics & Local Intel</p>
      <h1>North Korea Counties & Cities</h1>
      <p className="lede">
        Detailed profiles for all 179 administrative divisions in the DPRK: census populations, population density,
        documented human rights violations recorded by the NKDB, known detention facilities, and official markets.
      </p>

      <div className="d-stats" style={{ margin: '2rem 0' }}>
        <div>
          <b>{counties.length}</b>
          <span>counties & cities</span>
        </div>
        <div>
          <b>{totalPop.toLocaleString()}</b>
          <span>population (2008 census)</span>
        </div>
        <div>
          <b>{totalIncidents.toLocaleString()}</b>
          <span>documented abuses</span>
        </div>
        <div>
          <b>{totalDetention}</b>
          <span>detention facilities</span>
        </div>
        <div>
          <b>{totalMarkets}</b>
          <span>official markets</span>
        </div>
      </div>

      <p>
        <Link href="/map" className="chip on">
          Explore all counties on the Intel Map →
        </Link>
      </p>

      {provinces.map((prov) => {
        const inProv = counties.filter((c) => c.province === prov);
        return (
          <section key={prov} style={{ marginTop: '3.5rem' }}>
            <h2>
              {prov} <small className="muted" style={{ fontSize: '0.6em', fontWeight: 'normal' }}>({inProv.length} counties/cities)</small>
            </h2>

            <div className="cards three" style={{ marginTop: '1.5rem' }}>
              {inProv.map((c) => (
                <article key={c.pcode} className="card">
                  <p className="kicker">{c.pcode}</p>
                  <h3>
                    <Link href={`/counties/${c.slug}`}>{c.name}</Link>
                  </h3>
                  <div style={{ fontSize: '0.88rem', margin: '0.6rem 0', color: 'var(--ink-2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <b>{c.pop ? c.pop.toLocaleString() : '—'}</b> people
                    </div>
                    <div>
                      <b>{c.density ? `${c.density}/km²` : '—'}</b> density
                    </div>
                    <div>
                      <b style={{ color: c.incidents > 0 ? '#dc2626' : 'inherit' }}>{c.incidents}</b> abuses
                    </div>
                    <div>
                      <b>{c.detention}</b> detention fac.
                    </div>
                  </div>
                  <p style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>
                    <Link href={`/counties/${c.slug}`}>View county dossier →</Link>
                    {' · '}
                    <Link href={`/map#county=${c.pcode}`} className="muted">
                      Map
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
