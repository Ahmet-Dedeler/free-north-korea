import Link from 'next/link';
import { getAllPlaces } from '@/content/places-data';
import { PLACE_CATEGORIES, PLACE_COLOR } from '@/content/places';
import { MapPin } from 'lucide-react';
import Locator from '@/components/Locator';
import PlaceCard, { PLACE_ICON } from '@/components/PlaceCard';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Key Sites & Strategic Facilities in North Korea',
  description:
    'Comprehensive directory of North Korea’s strategic installations: nuclear complexes, undeclared missile operating bases, border crossing points, regime monuments, and economic zones.',
  path: '/places',
});

const CATS = PLACE_CATEGORIES.filter((c) => c.id !== 'camp' && c.id !== 'route');

export default function PlacesIndex() {
  const places = getAllPlaces();
  const pins = places.map((p) => ({ lat: p.lat, lon: p.lon, title: p.name, href: `/places/${p.slug}`, color: PLACE_COLOR[p.category], r: 7 }));

  return (
    <div className="wide">
      <div className="index-hero">
        <div>
          <p className="eyebrow">Strategic geography</p>
          <h1>Key sites in North Korea</h1>
          <p className="lede">Where the bombs are made, where the missiles launch from, where power sits and where people cross the border.</p>
          <ul className="cat-tiles">
            {CATS.map((c) => {
              const Icon = PLACE_ICON[c.id];
              const n = places.filter((p) => p.category === c.id).length;
              return (
                <li key={c.id}>
                  <a href={`#${c.id}`} style={{ '--cat': c.color } as React.CSSProperties}>
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
              <MapPin size={15} /> Open the intel map
            </Link>
          </p>
        </div>
        <figure className="index-map">
          <Locator pins={pins} label="strategic sites" />
          <figcaption className="key">
            {CATS.map((c) => (
              <span key={c.id}>
                <i style={{ background: c.color }} /> {c.label}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>

      {CATS.map((cat) => {
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
                <PlaceCard key={p.id} place={p} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
