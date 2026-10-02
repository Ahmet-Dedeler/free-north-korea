import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface County {
  pcode: string;
  name: string;
  province: string;
  slug: string;
  aliases: string[];
  area: number;
  pop: number | null;
  urban: number | null;
  rural: number | null;
  male: number | null;
  female: number | null;
  density: number | null;
  markets: number;
  detention: number;
  incidents: number;
  rights: [string, number][];
  decades: Record<string, number>;
}

let cachedCounties: County[] | null = null;

export function getAllCounties(): County[] {
  if (cachedCounties) return cachedCounties;
  const filePath = path.join(process.cwd(), 'public/layers/counties.geojson');
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));

  cachedCounties = raw.features.map((f: any) => {
    const p = f.properties;
    let base = p.name.toLowerCase().replace(/\s+city$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (base === 'unsan') {
      base = p.province.toLowerCase().includes('north') ? 'unsan-north-pyongan' : 'unsan-south-pyongan';
    }

    const aliases: string[] = [p.pcode.toLowerCase(), p.pcode];
    const fullSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (fullSlug !== base && !aliases.includes(fullSlug)) {
      aliases.push(fullSlug);
    }

    let rights: [string, number][] = [];
    try {
      rights = typeof p.rights === 'string' ? JSON.parse(p.rights) : p.rights ?? [];
    } catch {
      rights = [];
    }

    let decades: Record<string, number> = {};
    try {
      decades = typeof p.decades === 'string' ? JSON.parse(p.decades) : p.decades ?? {};
    } catch {
      decades = {};
    }

    return {
      pcode: p.pcode,
      name: p.name,
      province: p.province,
      slug: base,
      aliases,
      area: p.area,
      pop: p.pop,
      urban: p.urban,
      rural: p.rural,
      male: p.male,
      female: p.female,
      density: p.density,
      markets: p.markets ?? 0,
      detention: p.detention ?? 0,
      incidents: p.incidents ?? 0,
      rights,
      decades,
    };
  });

  return cachedCounties!;
}

export function getCountyBySlug(slug: string): County | undefined {
  const counties = getAllCounties();
  const lower = slug.toLowerCase();
  return counties.find((c) => c.slug === lower || c.pcode.toLowerCase() === lower || c.aliases.map((a) => a.toLowerCase()).includes(lower));
}

export function getAllCountySlugs(): string[] {
  return getAllCounties().map((c) => c.slug);
}
