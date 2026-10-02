import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Atom, Factory, Fence, Landmark, MapPin, Rocket } from 'lucide-react';
import type { PlaceEntity } from '@/content/places-data';
import { PLACE_COLOR, type PlaceCategory } from '@/content/places';
import { media } from '@/content/media';
import SatView from './SatView';

export const PLACE_ICON: Record<PlaceCategory, LucideIcon> = {
  camp: MapPin,
  nuclear: Atom,
  missile: Rocket,
  regime: Landmark,
  border: Fence,
  economy: Factory,
  route: MapPin,
};

/** Default satellite zoom per kind of site: big complexes need a wider view. */
export const placeZoom = (p: PlaceEntity) => (p.approx ? 13 : p.category === 'border' ? 14 : 15);

/** Index card: Wikipedia photo when there is a free one, otherwise the satellite view. */
export default function PlaceCard({ place: p }: { place: PlaceEntity }) {
  const photo = media(`place:${p.id}`);
  const Icon = PLACE_ICON[p.category];
  return (
    <li>
      <Link href={`/places/${p.slug}`} className="place-card" style={{ '--cat': PLACE_COLOR[p.category] } as React.CSSProperties}>
        {photo ? (
          <span className="pc-photo">
            <img src={photo.src} alt={p.name} loading="lazy" />
          </span>
        ) : (
          <SatView lat={p.lat} lon={p.lon} zoom={placeZoom(p)} label={p.name} approx={p.approx} compact height={150} />
        )}
        <span className="pc-body">
          <span className="pc-cat">
            <Icon size={13} /> {p.categoryLabel}
          </span>
          <strong>{p.name}</strong>
          {p.status && (
            <span className="pc-tags">
              <span>{p.status.replace(/\s*\(CSIS Beyond Parallel\)/, '')}</span>
            </span>
          )}
          <p>{p.note.length > 170 ? `${p.note.slice(0, p.note.lastIndexOf(' ', 165))}…` : p.note}</p>
        </span>
      </Link>
    </li>
  );
}
