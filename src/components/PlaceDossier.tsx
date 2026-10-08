import Link from 'next/link';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { Activity, BookOpen, Building2, CalendarDays, MapPin } from 'lucide-react';
import Locator from '@/components/Locator';
import PlaceCard, { PLACE_ICON, placeZoom } from '@/components/PlaceCard';
import SatView from '@/components/SatView';
import SatWatch from '@/components/SatWatch';
import { SourceCards, StatTile } from '@/components/Visual';
import { getCountyBySlug } from '@/content/counties';
import { media } from '@/content/media';
import { getAllPlaces, getPlaceBySlug } from '@/content/places-data';
import { PLACE_COLOR } from '@/content/places';
import { PLACES_TEXT, placeFields, placeHref } from '@/content/placesI18n';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

/** One strategic site, shared by /places/[slug] and the Korean, Japanese and Chinese routes. */
export default function PlaceDossier({ lang, slug }: { lang: Lang; slug: string }) {
  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  const t = PLACES_TEXT[lang];
  const fields = placeFields(lang, place);
  const en = lang === 'en';
  const note = en ? place.note : fields.note;
  const categoryLabel = en ? place.categoryLabel : fields.categoryLabel;
  const status = en ? place.status : fields.status;

  const county = place.countyCode ? getCountyBySlug(place.countyCode) : null;
  const allPlaces = getAllPlaces();
  const sameKind = allPlaces.filter((p) => p.id !== place.id && p.category === place.category);
  const relatedPlaces = sameKind.slice(0, 4);
  const relatedPins = sameKind.map((p) => ({
    lat: p.lat,
    lon: p.lon,
    title: p.name,
    href: placeHref(lang, `/places/${p.slug}`),
    color: PLACE_COLOR[p.category],
  }));

  const path = placeHref(lang, `/places/${place.slug}`);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    description: note,
    inLanguage: LANG_TAG[lang],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lon,
    },
    url: absolute(path),
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
        <Link href={placeHref(lang, '/places')}>{t.keySites}</Link> · <Link href={placeHref(lang, `/places#${place.category}`)}>{categoryLabel}</Link>
      </p>

      <header className="dx-hero">
        <div className="dx-main">
          <span className="kind-tag" style={{ '--tag': color } as CSSProperties}>
            <Icon size={14} /> {categoryLabel}
          </span>
          {en ? <h1>{place.name}</h1> : <h1 lang="en">{place.name}</h1>}
          <p className="dx-summary">{note}</p>
          <div className="tiles">
            {status && <StatTile icon={Activity} value={status.replace(/\s*\(.*\)/, '')} label={t.status} note={status.match(/\((.*)\)/)?.[1]} />}
            {county && <StatTile icon={Building2} value={county.name} label={t.province(county.province)} />}
            {place.published && <StatTile icon={CalendarDays} value={place.published.slice(0, 4)} label={t.csisReport} />}
          </div>
        </div>
        <Locator
          lat={place.lat}
          lon={place.lon}
          county={place.countyCode}
          label={place.name}
          pins={relatedPins}
          ariaLabel={en ? undefined : t.locationAria(place.name)}
        />
      </header>

      {photo ? (
        <div className="media-pair">
          <figure className="photo">
            <img src={photo.src} alt={place.name} />
            <figcaption lang={en ? undefined : 'en'}>
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
        <Link href={placeHref(lang, `/map#${mapHash}`)} className="btn">
          <MapPin size={15} /> {t.openOnMap}
        </Link>
        {county && (
          <Link href={placeHref(lang, `/counties/${county.slug}`)} className="btn">
            <Building2 size={15} /> {t.county(county.name)}
          </Link>
        )}
        {place.more && (
          <Link href={placeHref(lang, place.more)} className="btn">
            <BookOpen size={15} /> {place.more === '/military' ? t.military : t.readMore}
          </Link>
        )}
      </p>

      <SatWatch id={place.id} lang={lang} name={place.name} />

      {place.source && (
        <>
          <h2>{t.source}</h2>
          <div lang={en ? undefined : 'en'}>
            <SourceCards sources={[{ name: place.source.label, url: place.source.url }]} />
          </div>
        </>
      )}

      {relatedPlaces.length > 0 && (
        <>
          <h2>{t.moreSites(categoryLabel)}</h2>
          <ul className="place-cards">
            {relatedPlaces.map((rp) => (
              <PlaceCard key={rp.id} place={rp} lang={lang} />
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
