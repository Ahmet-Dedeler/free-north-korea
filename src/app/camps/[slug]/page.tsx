import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCamps, getAllCampSlugs, getCampBySlug } from '@/content/camps';
import { getCountyBySlug } from '@/content/counties';
import { Ext } from '@/components/Ext';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCampSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) return {};

  return pageMeta({
    title: `${camp.name}: North Korea Prison Camp Dossier`,
    description: `${camp.name} (${camp.kind}): ${camp.status}. Located in ${camp.province}. ${camp.note}`,
    path: `/camps/${camp.slug}`,
  });
}

export default async function CampPage({ params }: Params) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) notFound();

  const county = camp.countyCode ? getCountyBySlug(camp.countyCode) : null;
  const allCamps = getAllCamps();
  const nearbyCamps = allCamps.filter((c) => c.id !== camp.id && c.province === camp.province).slice(0, 3);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: camp.name,
    alternateName: camp.koreanName ? [camp.koreanName] : undefined,
    description: camp.overview ?? camp.note,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: camp.lat,
      longitude: camp.lon,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KP',
      addressRegion: camp.province,
    },
    url: absolute(`/camps/${camp.slug}`),
  };

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/camps">Prison Camps</Link> · {camp.province} · {camp.kind.includes('kwanliso') ? 'Kwanliso' : 'Kyohwaso'}
      </p>

      <header className="dossier-head" style={{ display: 'block' }}>
        <div>
          <h1>
            {camp.name} {camp.koreanName && <span className="ko" style={{ fontSize: '0.6em', opacity: 0.8 }}>({camp.koreanName})</span>}
          </h1>
          <p className="dossier-role" style={{ color: camp.kind.includes('kwanliso') ? '#dc2626' : '#f97316' }}>
            {camp.kind}
          </p>
          <p className="dossier-badges">
            <span className={`badge ${camp.status.toLowerCase().includes('operating') ? 'badge-dead' : 'badge-alive'}`}>
              {camp.status}
            </span>
            {camp.prisoners && (
              <span className="badge">
                ~{camp.prisoners.toLocaleString()} estimated prisoners
              </span>
            )}
            <span className="badge">Operated by: {camp.agency}</span>
          </p>
          <p className="dossier-summary" style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.6' }}>
            {camp.overview || camp.note}
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <Link href={`/map#camps=${camp.id}`} className="chip on">
          View on Intel Map (Coordinates {camp.lat.toFixed(4)}°N, {camp.lon.toFixed(4)}°E) →
        </Link>
        <Link href="/learn/north-korea-prison-camps" className="chip">
          Read Prison Camps Explainer →
        </Link>
      </div>

      <section className="facts">
        <div>
          <dt>Facility Type</dt>
          <dd>{camp.kind}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{camp.status}</dd>
        </div>
        <div>
          <dt>Province</dt>
          <dd>{camp.province}</dd>
        </div>
        {county && (
          <div>
            <dt>County</dt>
            <dd>
              <Link href={`/counties/${county.slug}`}>{county.name}</Link>
            </dd>
          </div>
        )}
        <div>
          <dt>Controlling Body</dt>
          <dd>{camp.agency}</dd>
        </div>
        <div>
          <dt>Estimated Prisoners</dt>
          <dd>{camp.prisoners ? `~${camp.prisoners.toLocaleString()} (HRNK estimate)` : 'Unconfirmed / Not published'}</dd>
        </div>
        <div>
          <dt>Coordinates</dt>
          <dd>
            {camp.lat.toFixed(4)}°N, {camp.lon.toFixed(4)}°E
          </dd>
        </div>
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <h2>System Context & Human Rights Documentation</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--ink-body)' }}>
          {camp.kind.includes('kwanliso') ? (
            <>
              Political penal colonies like {camp.name} form the foundation of North Korea&apos;s state terror apparatus.
              Under the principle of three generations of punishment (yeonjwa-je), the relatives of those suspected of political
              crimes, including small children and elderly parents, are incarcerated without judicial trial. The 2014 United Nations
              Commission of Inquiry found that the crimes committed inside these camps (extermination, murder, enslavement,
              torture, rape, and forced abortions) constitute crimes against humanity.
            </>
          ) : (
            <>
              Correctional re-education facilities (kyohwaso) like {camp.name} house individuals sentenced through the formal criminal
              system for offenses including illegal economic activity, cross-border smuggling, viewing foreign media, or attempting
              to escape into China. While sentences are nominally for a set number of years, severe malnutrition, physical beatings,
              and grueling manual labor result in high prisoner mortality rates.
            </>
          )}
        </p>
      </section>

      {camp.sources.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Sources & Verification</h2>
          <ul className="claims">
            {camp.sources.map((s, i) => (
              <li key={i}>
                <Ext href={s.url}>{s.name}</Ext>
              </li>
            ))}
            <li>
              <Ext href="https://www.ohchr.org/en/hr-bodies/hrc/co-idprk/commission-inquiry-on-h-rin-dprk">
                UN Commission of Inquiry on Human Rights in the DPRK (2014)
              </Ext>
            </li>
            <li>
              <Ext href="https://www.hrnk.org">
                Committee for Human Rights in North Korea (HRNK) Satellite Imagery Reports
              </Ext>
            </li>
          </ul>
        </section>
      )}

      {nearbyCamps.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Other Facilities in {camp.province}</h2>
          <div className="cards three" style={{ marginTop: '1rem' }}>
            {nearbyCamps.map((nc) => (
              <div key={nc.id} className="card">
                <h4>
                  <Link href={`/camps/${nc.slug}`}>{nc.name}</Link>
                </h4>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  {nc.kind} · {nc.status}
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <Link href={`/camps/${nc.slug}`}>View dossier →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
