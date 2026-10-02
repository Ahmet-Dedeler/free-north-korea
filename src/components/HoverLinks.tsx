/**
 * Links with Wikipedia-style hover previews for orgs, camps and sites, matching PersonLink.
 * Pure CSS (hover / focus-within), so the preview is in the prerendered HTML and works without JS.
 */
import Link from 'next/link';
import { getAllCamps } from '@/content/camps';
import { orgLogo } from '@/content/media';
import { media } from '@/content/media';
import { ORGS, STATUS_LABEL } from '@/content/orgs';
import { getPlaceBySlug } from '@/content/places-data';
import SatView from './SatView';

export function OrgLink({ id, children }: { id: string; children?: React.ReactNode }) {
  const o = ORGS.find((x) => x.id === id);
  if (!o) return <>{children}</>;
  const logo = orgLogo(o.id);
  return (
    <span className="plink hl">
      <Link href={`/organizations#${o.id}`}>{children ?? o.name}</Link>
      <span className="plink-card hl-card" role="tooltip">
        <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
        <span className="plink-body">
          <b>{o.name}</b>
          <span className="muted">
            {o.based}
            {o.founded ? ` · since ${o.founded}` : ''} · {STATUS_LABEL[o.status]}
          </span>
          <span className="hl-text">{o.summary}</span>
        </span>
      </span>
    </span>
  );
}

/** Link to a camp (`camp:slug`) or site (`slug`) with a satellite or photo preview. */
export function PlaceLink({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const camp = slug.startsWith('camp:') ? getAllCamps().find((c) => c.slug === slug.slice(5)) : undefined;
  const place = camp ? undefined : getPlaceBySlug(slug);
  const it = camp ?? place;
  if (!it) return <>{children}</>;
  const href = camp ? `/camps/${camp.slug}` : `/places/${place!.slug}`;
  const photo = place ? media(`place:${place.id}`) : undefined;
  const kwanliso = camp?.kind.includes('kwanliso');
  return (
    <span className="plink hl">
      <Link href={href}>{children ?? it.name}</Link>
      <span className="plink-card hl-card hl-place" role="tooltip">
        {photo ? (
          <span className="pc-photo">
            <img src={photo.src} alt="" loading="lazy" />
          </span>
        ) : (
          <SatView lat={it.lat} lon={it.lon} zoom={camp ? (kwanliso ? 12 : 15) : 15} label={it.name} compact height={130} />
        )}
        <span className="plink-body">
          <b>{it.name}</b>
          {it.status && <span className="muted">{it.status}</span>}
          <span className="hl-text">{camp ? camp.facts.summary || camp.kind : place!.note}</span>
        </span>
      </span>
    </span>
  );
}
