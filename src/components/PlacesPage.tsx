import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MapPin } from 'lucide-react';
import Locator from '@/components/Locator';
import PlaceCard, { PLACE_ICON } from '@/components/PlaceCard';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_CATEGORIES, PLACE_COLOR } from '@/content/places';
import { PLACE_CATEGORY_TEXT, PLACES_TEXT, placeHref } from '@/content/placesI18n';
import type { Lang } from '@/site/seo';

const SHOWN = PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && c.id !== 'route');

/** The /places index, shared by /places, /ko/places, /ja/places and /zh/places. */
export default function PlacesPage({ lang }: { lang: Lang }) {
  const t = PLACES_TEXT[lang];
  const places = getAllPlaces();
  const cats = SHOWN.map((c) => ({
    id: c.id,
    color: c.color,
    label: lang === 'en' ? c.label : PLACE_CATEGORY_TEXT[lang][c.id].label,
    hint: lang === 'en' ? c.hint : PLACE_CATEGORY_TEXT[lang][c.id].hint,
  }));
  const pins = places.map((p) => ({
    lat: p.lat,
    lon: p.lon,
    title: p.name,
    href: placeHref(lang, `/places/${p.slug}`),
    color: PLACE_COLOR[p.category],
    r: 7,
  }));

  return (
    <div className="wide">
      <div className="index-hero">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p className="lede">{t.lede}</p>
          <ul className="cat-tiles">
            {cats.map((c) => {
              const Icon = PLACE_ICON[c.id];
              const n = places.filter((p) => p.category === c.id).length;
              return (
                <li key={c.id}>
                  <a href={`#${c.id}`} style={{ '--cat': c.color } as CSSProperties}>
                    <Icon size={20} />
                    <b>{n}</b>
                    <span>{c.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="dx-actions">
            <Link href="/map#sites=yongbyon" className="btn primary">
              <MapPin size={15} /> {t.openMap}
            </Link>
          </p>
        </div>
        <figure className="index-map">
          <Locator pins={pins} label={lang === 'en' ? 'strategic sites' : t.mapLabel} ariaLabel={lang === 'en' ? undefined : t.mapAria} />
          <figcaption className="key">
            {cats.map((c) => (
              <span key={c.id}>
                <i style={{ background: c.color }} /> {c.label}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>

      {cats.map((cat) => {
        const matching = places.filter((p) => p.category === cat.id);
        if (matching.length === 0) return null;
        const Icon = PLACE_ICON[cat.id];
        return (
          <section key={cat.id} id={cat.id} className="index-section">
            <h2>
              <Icon size={20} style={{ color: cat.color }} /> {cat.label} <small>{matching.length}</small>
            </h2>
            <p className="muted">{cat.hint}</p>
            <ul className="place-cards">
              {matching.map((p) => (
                <PlaceCard key={p.id} place={p} lang={lang} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
