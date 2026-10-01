import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/content/articles';
import { REVIEWED } from '@/site/config';
import { absolute } from '@/site/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/act', '/atlas', '/military', '/missiles', '/organizations', '/library', '/learn'];
  return [
    ...pages.map((p) => ({ url: absolute(p === '/' ? '' : p), lastModified: REVIEWED, priority: p === '/' ? 1 : 0.8 })),
    ...ARTICLES.map((a) => ({ url: absolute(`/learn/${a.slug}`), lastModified: a.updated, priority: 0.9 })),
  ];
}
