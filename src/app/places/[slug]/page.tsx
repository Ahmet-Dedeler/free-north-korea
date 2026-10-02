import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPlaces, getAllPlaceSlugs, getPlaceBySlug } from '@/content/places-data';
import { getCountyBySlug } from '@/content/counties';
import { Ext } from '@/components/Ext';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPlaceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return {};

  return pageMeta({
    title: `${place.name}: North Korea Strategic Site Dossier`,
    description: `${place.name} (${place.categoryLabel}): ${place.note}`,
    path: `/places/${place.slug}`,
  });
}

export default async function PlacePage({ params }: Params) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  const county = place.countyCode ? getCountyBySlug(place.countyCode) : null;
  const allPlaces = getAllPlaces();
  const relatedPlaces = allPlaces.filter((p) => p.id !== place.id && p.category === place.category).slice(0, 3);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    description: place.note,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lon,
    },
    url: absolute(`/places/${place.slug}`),
  };

  const mapHash = place.category === 'missile' && place.id.startsWith('base-') ? `missile-bases=${place.id}` : `sites=${place.id}`;

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/places">Strategic Sites</Link> · {place.categoryLabel}
      </p>

      <header className="dossier-head" style={{ display: 'block' }}>
        <div>
          <h1>{place.name}</h1>
          <p className="dossier-role">{place.categoryLabel}</p>
          <p className="dossier-badges">
            {place.status && <span className="badge badge-alive">{place.status}</span>}
            <span className="badge">
              {place.lat.toFixed(4)}°N, {place.lon.toFixed(4)}°E {place.approx ? '(Approx)' : ''}
            </span>
          </p>
          <p className="dossier-summary" style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.6' }}>
            {place.note}
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <Link href={`/map#${mapHash}`} className="chip on">
          View on Intel Map →
        </Link>
        {place.more && (
          <Link href={place.more} className="chip">
            Read Related Section →
          </Link>
        )}
      </div>

      <section className="facts">
        <div>
          <dt>Category</dt>
          <dd>{place.categoryLabel}</dd>
        </div>
        {place.status && (
          <div>
            <dt>Status</dt>
            <dd>{place.status}</dd>
          </div>
        )}
        {county && (
          <div>
            <dt>County</dt>
            <dd>
              <Link href={`/counties/${county.slug}`}>{county.name}</Link> ({county.province})
            </dd>
          </div>
        )}
        <div>
          <dt>Coordinates</dt>
          <dd>
            {place.lat.toFixed(4)}°N, {place.lon.toFixed(4)}°E {place.approx ? '(Approximate)' : ''}
          </dd>
        </div>
        {place.source && (
          <div>
            <dt>Primary Source</dt>
            <dd>
              <Ext href={place.source.url}>{place.source.label}</Ext>
            </dd>
          </div>
        )}
      </section>

      {relatedPlaces.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Related {place.categoryLabel} Sites</h2>
          <div className="cards three" style={{ marginTop: '1rem' }}>
            {relatedPlaces.map((rp) => (
              <div key={rp.id} className="card">
                <h4>
                  <Link href={`/places/${rp.slug}`}>{rp.name}</Link>
                </h4>
                {rp.status && (
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    {rp.status}
                  </p>
                )}
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <Link href={`/places/${rp.slug}`}>View details →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
