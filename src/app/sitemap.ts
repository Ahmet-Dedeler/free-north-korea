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
import { ACT_PATHS } from '@/content/act';
import { CAMPS_PATHS, campLanguages } from '@/content/campsI18n';
import { COUNTIES_PATHS, countyLanguages } from '@/content/countiesI18n';
import { KIM_FAMILY_PATHS } from '@/content/kimFamilyI18n';
import { KIM_WATCH, KIM_WATCH_PATHS } from '@/content/kimWatch';
import { WATCH_PATHS } from '@/content/watch';
import { LIBRARY_PATHS } from '@/content/libraryI18n';
import { MILITARY_PATHS } from '@/content/military';
import { MISSILE_LIST_PATHS } from '@/content/missileList';
import { ORG_PATHS } from '@/content/orgsI18n';
import { PEOPLE_PATHS, personLanguages } from '@/content/peopleI18n';
import { PLACES_PATHS, placeLanguages } from '@/content/placesI18n';
import { SOURCES_PATHS } from '@/content/sourcesI18n';
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
  // Still English-only. Translated pages are listed with their alternates below.
  const pages = ['/map', '/missiles', '/learn'];

  const translated: Languages[] = [
    ACT_PATHS,
    MILITARY_PATHS,
    MISSILE_LIST_PATHS,
    ORG_PATHS,
    LIBRARY_PATHS,
    PEOPLE_PATHS,
    KIM_FAMILY_PATHS,
    SOURCES_PATHS,
    CAMPS_PATHS,
    PLACES_PATHS,
    COUNTIES_PATHS,
  ];

  const camps = getAllCamps();
  const places = getAllPlaces();
  const counties = getAllCounties();

  return [
    ...Object.values(HUB_PATHS).map((p) => ({ url: absolute(p === '/' ? '' : p), lastModified: REVIEWED, priority: p === '/' ? 1 : 0.8, alternates: alternates(HUB_PATHS) })),
    ...pages.map((p) => ({ url: absolute(p), lastModified: REVIEWED, priority: 0.8 })),
    ...translated.flatMap((langs) =>
      Object.values(langs).map((p) => ({ url: absolute(p ?? ''), lastModified: REVIEWED, priority: 0.8, alternates: alternates(langs) })),
    ),
    ...Object.values(KIM_WATCH_PATHS).map((p) => ({ url: absolute(p), lastModified: KIM_WATCH.fetched, priority: 0.8, alternates: alternates(KIM_WATCH_PATHS) })),
    ...Object.values(WATCH_PATHS).map((p) => ({ url: absolute(p), lastModified: KIM_WATCH.fetched, priority: 0.8, alternates: alternates(WATCH_PATHS) })),
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
    ...PEOPLE.flatMap((p) => {
      const langs = personLanguages(p.id);
      return LANGS.map((l) => ({ url: absolute(langs[l]), lastModified: REVIEWED, priority: 0.6, alternates: alternates(langs) }));
    }),
    ...camps.flatMap((c) => {
      const langs = campLanguages(c.slug);
      return LANGS.map((l) => ({ url: absolute(langs[l]), lastModified: REVIEWED, priority: 0.85, alternates: alternates(langs) }));
    }),
    ...places.flatMap((p) => {
      const langs = placeLanguages(p.slug);
      return LANGS.map((l) => ({ url: absolute(langs[l] ?? ''), lastModified: REVIEWED, priority: 0.75, alternates: alternates(langs) }));
    }),
    ...counties.flatMap((c) => {
      const langs = countyLanguages(c.slug);
      return LANGS.map((l) => ({ url: absolute(langs[l]), lastModified: REVIEWED, priority: 0.7, alternates: alternates(langs) }));
    }),
  ];
}
