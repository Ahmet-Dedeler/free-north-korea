'use client';

import { useState } from 'react';

/**
 * Satellite view of a point, built from Esri World Imagery tiles laid out in plain <img> tags.
 * No map library: the server renders the first zoom level, the buttons swap the zoom.
 * The tile grid is drawn larger than any card and centred, so the point stays in the middle at every width.
 */
const TILE = 256;
const GRID_W = 1536;
const GRID_H = 768;
const TILE_URL = (z: number, x: number, y: number) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

function tiles(lat: number, lon: number, z: number, w: number, h: number) {
  const world = TILE * 2 ** z;
  const px = ((lon + 180) / 360) * world;
  const s = Math.sin((lat * Math.PI) / 180);
  const py = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * world;
  // Round so server and browser agree exactly (Math.log can differ in the last bit between engines).
  const left = Math.round(px - w / 2);
  const top = Math.round(py - h / 2);
  const out: { key: string; src: string; x: number; y: number }[] = [];
  for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + h) / TILE); ty++)
    for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + w) / TILE); tx++)
      out.push({ key: `${z}/${tx}/${ty}`, src: TILE_URL(z, tx, ty), x: tx * TILE - left, y: ty * TILE - top });
  return out;
}

export default function SatView({
  lat,
  lon,
  zoom = 15,
  label,
  approx,
  height = 360,
  compact,
}: {
  lat: number;
  lon: number;
  zoom?: number;
  label: string;
  approx?: boolean;
  height?: number;
  /** Thumbnail mode for index cards: no controls, no caption, smaller grid. */
  compact?: boolean;
}) {
  const [z, setZ] = useState(zoom);
  // Compact views are usually small cards; a tall one (article hero) needs the full grid to fill its width.
  const big = !compact || height > 300;
  const gw = big ? GRID_W : 768;
  const gh = big ? GRID_H : 512;
  // Compact views also appear inside hover cards in running text, so they must be phrasing content (spans only).
  const Root = compact ? 'span' : 'figure';
  return (
    <Root className={`sat ${compact ? 'compact' : ''}`} style={{ height }}>
      <span className="sat-grid" style={{ width: gw, height: gh }}>
        {tiles(lat, lon, z, gw, gh).map((t) => (
          <img key={t.key} src={t.src} alt="" loading="lazy" draggable={false} style={{ left: t.x, top: t.y }} />
        ))}
      </span>
      <span className={`sat-pin ${approx ? 'approx' : ''}`} aria-hidden="true" />
      {!compact && (
        <>
          <div className="sat-zoom">
            <button type="button" onClick={() => setZ((v) => Math.min(18, v + 1))} aria-label="Zoom in" disabled={z >= 18}>
              +
            </button>
            <button type="button" onClick={() => setZ((v) => Math.max(6, v - 1))} aria-label="Zoom out" disabled={z <= 6}>
              −
            </button>
          </div>
          <figcaption>
            <span>
              {label} · {lat.toFixed(4)}°N, {lon.toFixed(4)}°E{approx ? ' (approximate)' : ''}
            </span>
            <span>
              <a href={`https://www.google.com/maps/@${lat},${lon},${Math.max(12, z)}z/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer">
                Google Maps ↗
              </a>{' '}
              · Imagery © Esri, Maxar, Earthstar Geographics
            </span>
          </figcaption>
        </>
      )}
      {compact && <span className="sat-credit">© Esri, Maxar</span>}
    </Root>
  );
}
