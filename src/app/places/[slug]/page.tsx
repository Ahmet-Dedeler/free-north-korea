import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPlaces, getAllPlaceSlugs, getPlaceBySlug } from '@/content/places-data';
import { getCountyBySlug } from '@/content/counties';
import { Activity, BookOpen, Building2, CalendarDays, MapPin } from 'lucide-react';
import Locator from '@/components/Locator';
import PlaceCard, { PLACE_ICON, placeZoom } from '@/components/PlaceCard';
import SatView from '@/components/SatView';
import { SourceCards, StatTile } from '@/components/Visual';
import { PLACE_COLOR } from '@/content/places';
import { media } from '@/content/media';
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
    image: `/places/${place.slug}/opengraph-image`,
  });
}

export default async function PlacePage({ params }: Params) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  const county = place.countyCode ? getCountyBySlug(place.countyCode) : null;
  const allPlaces = getAllPlaces();
  const sameKind = allPlaces.filter((p) => p.id !== place.id && p.category === place.category);
  const relatedPlaces = sameKind.slice(0, 4);
  const relatedPins = sameKind.map((p) => ({ lat: p.lat, lon: p.lon, title: p.name, href: `/places/${p.slug}`, color: PLACE_COLOR[p.category] }));

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

  const photo = media(`place:${place.id}`);
  const Icon = PLACE_ICON[place.category];
  const color = PLACE_COLOR[place.category];
  const sat = <SatView lat={place.lat} lon={place.lon} zoom={placeZoom(place)} label={place.name} approx={place.approx} height={photo ? 380 : 440} />;

  return (
    <article className="dossier-x">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <p className="eyebrow">
        <Link href="/places">Key sites</Link> · <Link href={`/places#${place.category}`}>{place.categoryLabel}</Link>
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className="kind-tag" style={{ '--tag': color } as React.CSSProperties}>
            <Icon size={14} /> {place.categoryLabel}
          </span>
          <h1>{place.name}</h1>
          <p className="dx-summary">{place.note}</p>
          <div className="tiles">
            {place.status && <StatTile icon={Activity} value={place.status.replace(/\s*\(.*\)/, '')} label="status" note={place.status.match(/\((.*)\)/)?.[1]} />}
            {county && <StatTile icon={Building2} value={county.name} label={`${county.province} province`} />}
            {place.published && <StatTile icon={CalendarDays} value={place.published.slice(0, 4)} label="CSIS report" />}
          </div>
        </div>
        <Locator lat={place.lat} lon={place.lon} county={place.countyCode} label={place.name} pins={relatedPins} />
      </header>

      {photo ? (
        <div className="media-pair">
          <figure className="photo">
            <img src={photo.src} alt={place.name} />
            <figcaption>
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">
                {photo.credit}
              </a>
            </figcaption>
          </figure>
          {sat}
        </div>
      ) : (
        sat
      )}

      <p className="dx-actions">
        <Link href={`/map#${mapHash}`} className="btn">
          <MapPin size={15} /> Open on the intel map
        </Link>
        {county && (
          <Link href={`/counties/${county.slug}`} className="btn">
            <Building2 size={15} /> {county.name} county
          </Link>
        )}
        {place.more && (
          <Link href={place.more} className="btn">
            <BookOpen size={15} /> {place.more === '/military' ? 'North Korea’s military' : 'Read more'}
          </Link>
        )}
      </p>

      {place.source && (
        <>
          <h2>Source</h2>
          <SourceCards sources={[{ name: place.source.label, url: place.source.url }]} />
        </>
      )}

      {relatedPlaces.length > 0 && (
        <>
          <h2>More {place.categoryLabel.toLowerCase()} sites</h2>
          <ul className="place-cards">
            {relatedPlaces.map((rp) => (
              <PlaceCard key={rp.id} place={rp} />
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
