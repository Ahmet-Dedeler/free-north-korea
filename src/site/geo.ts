/**
 * Server-side SVG geometry for North Korea: province and county outlines projected to a fixed viewBox.
 * Used for locator maps on dossiers and the county choropleth, so those render as plain HTML (good for SEO,
 * no MapLibre on content pages). Reads the same GeoJSON the intel map uses.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

/** Bounding box of the country, padded a little. */
const W_LON = 124.1;
const E_LON = 130.8;
const N_LAT = 43.05;
const S_LAT = 37.6;
const K = Math.cos((40 * Math.PI) / 180); // shrink longitude so shapes aren't stretched

export const VIEW_W = 600;
const SCALE = VIEW_W / ((E_LON - W_LON) * K);
export const VIEW_H = Math.round((N_LAT - S_LAT) * SCALE);

export function project(lon: number, lat: number): [number, number] {
  return [(lon - W_LON) * K * SCALE, (N_LAT - lat) * SCALE];
}

type Ring = number[][];
type Geom = { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] };

/** Rings to an SVG path, rounded to whole units (one unit is about 1 km) and skipping points that collapse onto the previous one. */
function toPath(g: Geom) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let d = '';
  for (const poly of polys)
    for (const ring of poly) {
      let last = '';
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        const pt = `${Math.round(x)} ${Math.round(y)}`;
        if (pt === last) return;
        d += (i === 0 ? 'M' : 'L') + pt;
        last = pt;
      });
      d += 'Z';
    }
  return d;
}

export interface Shape {
  pcode: string;
  name: string;
  province?: string;
  d: string;
  /** Label anchor: centre of the shape's bounding box. */
  cx: number;
  cy: number;
}

function load(file: string): Shape[] {
  const raw = JSON.parse(readFileSync(path.join(process.cwd(), 'public/layers', file), 'utf8'));
  return raw.features.map((f: { properties: { pcode: string; name: string; province?: string }; geometry: Geom }) => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const pts = polys.flatMap((p) => p[0]).map(([lon, lat]) => project(lon, lat));
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      pcode: f.properties.pcode,
      name: f.properties.name,
      province: f.properties.province,
      d: toPath(f.geometry),
      cx: (Math.min(...xs) + Math.max(...xs)) / 2,
      cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    };
  });
}

let provinces: Shape[] | null = null;
let counties: Shape[] | null = null;
export const getProvinceShapes = () => (provinces ??= load('provinces.geojson'));
export const getCountyShapes = () => (counties ??= load('counties.geojson'));
