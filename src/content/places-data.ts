import { readFileSync } from 'node:fs';
import path from 'node:path';
import { baseName, baseSlug } from './mapSlugs';
import { PLACES, type PlaceCategory, PLACE_CATEGORIES } from './places';

export interface PlaceEntity {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  status?: string;
  lat: number;
  lon: number;
  approx?: boolean;
  note: string;
  countyCode?: string | null;
  source?: { label: string; url: string };
  more?: string;
  published?: string;
}

const CATEGORY_MAP = Object.fromEntries(PLACE_CATEGORIES.map((c) => [c.id, c.label])) as Record<PlaceCategory, string>;

let cachedPlaces: PlaceEntity[] | null = null;

export function getAllPlaces(): PlaceEntity[] {
  if (cachedPlaces) return cachedPlaces;

  // Curated strategic sites (excluding camps which have dedicated section)
  const curated: PlaceEntity[] = PLACES.filter((p) => p.category !== 'camp').map((p) => ({
    id: p.id,
    slug: p.id,
    name: p.name,
    category: p.category,
    categoryLabel: CATEGORY_MAP[p.category] ?? p.category,
    status: p.status,
    lat: p.lat,
    lon: p.lon,
    approx: p.approx,
    note: p.note,
    source: p.source,
    more: p.more,
  }));

  // Add CSIS undeclared missile bases
  try {
    const basesPath = path.join(process.cwd(), 'public/layers/missile-bases.geojson');
    const raw = JSON.parse(readFileSync(basesPath, 'utf8'));
    raw.features.forEach((f: any) => {
      const p = f.properties;
      const [lon, lat] = f.geometry.coordinates;
      const slug = baseSlug(p.id);

      curated.push({
        id: p.id,
        slug,
        name: baseName(p.url, p.name),
        category: 'missile',
        categoryLabel: 'Missile & space',
        status: 'Active (CSIS Beyond Parallel)',
        lat,
        lon,
        countyCode: p.county ?? null,
        note: (p.summary || '').replace(/&#039;/g, "'").replace(/&amp;/g, '&'),
        source: p.url ? { label: 'CSIS Beyond Parallel', url: p.url } : undefined,
        more: '/military',
        published: p.published,
      });
    });
  } catch {
    // fallback if file read fails
  }

  cachedPlaces = curated;
  return cachedPlaces;
}

export function getPlaceBySlug(slug: string): PlaceEntity | undefined {
  const places = getAllPlaces();
  const lower = slug.toLowerCase();
  return places.find((p) => p.slug === lower || p.id === lower);
}

export function getAllPlaceSlugs(): string[] {
  return getAllPlaces().map((p) => p.slug);
}
