import { getCountyShapes, getProvinceShapes, project, VIEW_H, VIEW_W } from '@/site/geo';

export interface Pin {
  lat: number;
  lon: number;
  title: string;
  /** Pins with a link become clickable. */
  href?: string;
  /** CSS colour for the dot (defaults to muted grey). */
  color?: string;
  r?: number;
}

/**
 * Small "where is this" map of North Korea: provinces, the place's county highlighted, and a pin.
 * Server-rendered SVG, so it works without JavaScript and costs a few KB.
 */
export default function Locator({
  lat,
  lon,
  county,
  label,
  pins,
  ariaLabel,
}: {
  lat?: number;
  lon?: number;
  /** County pcode to highlight, e.g. KP0721. */
  county?: string | null;
  label?: string;
  /** Extra dots, e.g. other facilities in the same province. */
  pins?: Pin[];
  /** Full aria sentence. When omitted, the English "Location of … in North Korea" line is used. */
  ariaLabel?: string;
}) {
  const provinces = getProvinceShapes();
  const c = county ? getCountyShapes().find((s) => s.pcode === county) : undefined;
  const at = lat != null && lon != null ? project(lon, lat) : c ? [c.cx, c.cy] : null;
  const province = c ? provinces.find((p) => p.pcode === c.pcode.slice(0, 4)) : undefined;
  return (
    <figure className="locator">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={ariaLabel ?? (label ? `Location of ${label} in North Korea` : 'Map of North Korea')}>
        {provinces.map((p) => (
          <path key={p.pcode} d={p.d} className={p.pcode === province?.pcode ? 'prov on' : 'prov'}>
            <title>{p.name}</title>
          </path>
        ))}
        {c && (
          <path d={c.d} className="county-hl">
            <title>{c.name}</title>
          </path>
        )}
        {pins?.map((p) => {
          const [x, y] = project(p.lon, p.lat);
          const dot = (
            <circle cx={x} cy={y} r={p.r ?? 5} className={p.color ? 'pin-dot' : 'pin-other'} style={p.color ? { fill: p.color } : undefined}>
              <title>{p.title}</title>
            </circle>
          );
          return p.href ? (
            <a key={p.title} href={p.href} className="pin-link">
              {dot}
            </a>
          ) : (
            <g key={p.title}>{dot}</g>
          );
        })}
        {at && (
          <g transform={`translate(${at[0]} ${at[1]})`} className="pin">
            <circle r={18} className="pin-pulse" />
            <circle r={7} />
          </g>
        )}
      </svg>
      {province && (
        <figcaption>
          {c?.name} · {province.name}
        </figcaption>
      )}
    </figure>
  );
}
