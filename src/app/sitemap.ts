import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/content/articles';
import { PEOPLE } from '@/entities';
import { REVIEWED } from '@/site/config';
import { absolute } from '@/site/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/act', '/map', '/military', '/missiles', '/organizations', '/library', '/learn', '/people', '/sources'];
  return [
    ...pages.map((p) => ({ url: absolute(p === '/' ? '' : p), lastModified: REVIEWED, priority: p === '/' ? 1 : 0.8 })),
    ...ARTICLES.map((a) => ({ url: absolute(`/learn/${a.slug}`), lastModified: a.updated, priority: 0.9 })),
    ...PEOPLE.map((p) => ({ url: absolute(`/people/${p.id}`), lastModified: REVIEWED, priority: 0.6 })),
  ];
}
