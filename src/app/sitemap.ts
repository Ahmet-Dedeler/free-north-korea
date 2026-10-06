import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/content/articles';
import { PEOPLE } from '@/entities';
import { getAllCamps } from '@/content/camps';
import { getAllPlaces } from '@/content/places-data';
import { getAllCounties } from '@/content/counties';
import { SANCTIONS, SANCTIONS_PATHS } from '@/content/sanctions';
import { SERIES, SERIES_BUILT } from '@/charts/data';
import { DATA_PATHS, dataPath } from '@/content/series';
import { TWO_KOREAS_PATHS } from '@/content/twoKoreas';
import { HUB_PATHS, articleLanguages } from '@/content/translations';
import { KO_ARTICLES } from '@/content/translations/ko';
import { JA_ARTICLES } from '@/content/translations/ja';
import { ZH_ARTICLES } from '@/content/translations/zh';
import { REVIEWED } from '@/site/config';
import { LANGS, absolute, hreflang, type Languages } from '@/site/seo';

export const dynamic = 'force-static';

type Entry = MetadataRoute.Sitemap[number];

/** hreflang links for a page that exists in several languages (absolute URLs, as the sitemap spec wants). */
const alternates = (langs: Languages): Entry['alternates'] => ({
  languages: Object.fromEntries(Object.entries(hreflang(langs)).map(([l, p]) => [l, absolute(p === '/' ? '' : p)])),
});

export default function sitemap(): MetadataRoute.Sitemap {
  // English-only top-level pages. Translated ones (home, sanctions) are added below with their alternates.
  const pages = [
    '/act',
    '/map',
    '/military',
    '/missiles',
    '/missiles/list',
    '/organizations',
    '/library',
    '/learn',
    '/people',
    '/kim-family-tree',
    '/sources',
    '/camps',
    '/places',
    '/counties',
  ];

  const camps = getAllCamps();
  const places = getAllPlaces();
  const counties = getAllCounties();

  return [
    ...Object.values(HUB_PATHS).map((p) => ({ url: absolute(p === '/' ? '' : p), lastModified: REVIEWED, priority: p === '/' ? 1 : 0.8, alternates: alternates(HUB_PATHS) })),
    ...pages.map((p) => ({ url: absolute(p), lastModified: REVIEWED, priority: 0.8 })),
    ...Object.values(SANCTIONS_PATHS).map((p) => ({ url: absolute(p), lastModified: SANCTIONS.fetched, priority: 0.8, alternates: alternates(SANCTIONS_PATHS) })),
    ...Object.values(TWO_KOREAS_PATHS).map((p) => ({ url: absolute(p), lastModified: SERIES_BUILT, priority: 0.9, alternates: alternates(TWO_KOREAS_PATHS) })),
    ...Object.values(DATA_PATHS).map((p) => ({ url: absolute(p), lastModified: SERIES_BUILT, priority: 0.8, alternates: alternates(DATA_PATHS) })),
    ...SERIES.flatMap((s) => {
      const langs = Object.fromEntries(LANGS.map((l) => [l, dataPath(l, s.id)]));
      return LANGS.map((l) => ({ url: absolute(dataPath(l, s.id)), lastModified: s.fetched, priority: 0.6, alternates: alternates(langs) }));
    }),
    ...ARTICLES.map((a) => ({ url: absolute(`/learn/${a.slug}`), lastModified: a.updated, priority: 0.9, alternates: alternates(articleLanguages(a.slug)) })),
    ...KO_ARTICLES.map((a) => ({ url: absolute(`/ko/learn/${a.slug}`), lastModified: a.updated, priority: 0.85, alternates: alternates(articleLanguages(a.slug)) })),
    ...JA_ARTICLES.map((a) => ({ url: absolute(`/ja/learn/${a.slug}`), lastModified: a.updated, priority: 0.85, alternates: alternates(articleLanguages(a.slug)) })),
    ...ZH_ARTICLES.map((a) => ({ url: absolute(`/zh/learn/${a.slug}`), lastModified: a.updated, priority: 0.85, alternates: alternates(articleLanguages(a.slug)) })),
    ...PEOPLE.map((p) => ({ url: absolute(`/people/${p.id}`), lastModified: REVIEWED, priority: 0.6 })),
    ...camps.map((c) => ({ url: absolute(`/camps/${c.slug}`), lastModified: REVIEWED, priority: 0.85 })),
    ...places.map((p) => ({ url: absolute(`/places/${p.slug}`), lastModified: REVIEWED, priority: 0.75 })),
    ...counties.map((c) => ({ url: absolute(`/counties/${c.slug}`), lastModified: REVIEWED, priority: 0.7 })),
  ];
}
