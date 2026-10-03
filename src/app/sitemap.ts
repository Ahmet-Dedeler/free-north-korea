import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/content/articles';
import { PEOPLE } from '@/entities';
import { getAllCamps } from '@/content/camps';
import { getAllPlaces } from '@/content/places-data';
import { getAllCounties } from '@/content/counties';
import { KO_ARTICLES } from '@/content/translations/ko';
import { JA_ARTICLES } from '@/content/translations/ja';
import { REVIEWED } from '@/site/config';
import { absolute } from '@/site/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/',
    '/act',
    '/map',
    '/military',
    '/missiles',
    '/organizations',
    '/library',
    '/learn',
    '/people',
    '/kim-family-tree',
    '/sources',
    '/camps',
    '/places',
    '/counties',
    '/ko',
    '/ja',
  ];

  const camps = getAllCamps();
  const places = getAllPlaces();
  const counties = getAllCounties();

  return [
    ...pages.map((p) => ({ url: absolute(p === '/' ? '' : p), lastModified: REVIEWED, priority: p === '/' ? 1 : 0.8 })),
    ...ARTICLES.map((a) => ({ url: absolute(`/learn/${a.slug}`), lastModified: a.updated, priority: 0.9 })),
    ...PEOPLE.map((p) => ({ url: absolute(`/people/${p.id}`), lastModified: REVIEWED, priority: 0.6 })),
    ...camps.map((c) => ({ url: absolute(`/camps/${c.slug}`), lastModified: REVIEWED, priority: 0.85 })),
    ...places.map((p) => ({ url: absolute(`/places/${p.slug}`), lastModified: REVIEWED, priority: 0.75 })),
    ...counties.map((c) => ({ url: absolute(`/counties/${c.slug}`), lastModified: REVIEWED, priority: 0.7 })),
    ...KO_ARTICLES.map((a) => ({ url: absolute(`/ko/learn/${a.slug}`), lastModified: REVIEWED, priority: 0.85 })),
    ...JA_ARTICLES.map((a) => ({ url: absolute(`/ja/learn/${a.slug}`), lastModified: REVIEWED, priority: 0.85 })),
  ];
}
