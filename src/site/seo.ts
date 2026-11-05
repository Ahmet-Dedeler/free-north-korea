import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './config';
import { mdPath } from './agents';

/** Languages the site is published in. English lives at the root, the others under /ko, /ja and /zh. */
export type Lang = 'en' | 'ko' | 'ja' | 'zh';
export const LANGS: Lang[] = ['en', 'ko', 'ja', 'zh'];
const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ko: 'ko_KR', ja: 'ja_JP', zh: 'zh_CN' };
/** hreflang / html lang code per language. Chinese is published in Simplified characters. */
export const LANG_TAG: Record<Lang, string> = { en: 'en', ko: 'ko', ja: 'ja', zh: 'zh-Hans' };
/** `{ zh: '/zh/x' }` → `{ 'zh-Hans': '/zh/x' }`, the keys search engines expect in hreflang. */
export const hreflang = (langs: Languages) =>
  Object.fromEntries(Object.entries(langs).map(([l, p]) => [LANG_TAG[l as Lang] ?? l, p]));

/** The same page in each language it exists in, as paths: `{ en: '/sanctions', ko: '/ko/sanctions' }`. */
export type Languages = Partial<Record<Lang, string>>;

const OG_IMAGE = '/opengraph-image';

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards filled in consistently.
 * - `languages`: pass the page's translations (including itself) to emit hreflang links. Every translated page
 *   must list the same set, or search engines ignore the pairing.
 * - `image`: path of the page's own share card (an `opengraph-image.tsx` next to the page). Defaults to the site card.
 * - `noindex`: keep the page for readers but out of search. Its links still count. Also leave it out of `sitemap.ts`.
 */
export function pageMeta({
  title,
  description,
  path,
  type = 'website',
  lang = 'en',
  languages,
  image = OG_IMAGE,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  lang?: Lang;
  languages?: Languages;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const og = { url: image, width: 1200, height: 630 };
  return {
    title,
    description,
    ...(noindex && { robots: { index: false, follow: true } }),
    alternates: {
      canonical: path,
      // the Markdown version, for agents (see site/agents.ts)
      types: { 'text/markdown': mdPath(path) },
      ...(languages && { languages: { ...hreflang(languages), 'x-default': languages.en ?? path } }),
    },
    // setting openGraph here replaces the root one, so the share card has to be named again
    openGraph: { title, description, url: path, siteName: SITE_NAME, type, locale: OG_LOCALE[lang], images: [og] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

/**
 * Shortens text for a meta description without cutting a word in half: ends at the last sentence that fits, or else
 * at the last space. Korean has spaces and full stops; Japanese and Chinese have 。 and no spaces, so they end at a
 * sentence or, failing that, a clean character limit.
 */
export function clip(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('。'), cut.lastIndexOf('다. '));
  if (sentence >= max * 0.5) return cut.slice(0, sentence + 1).trim();
  const space = cut.lastIndexOf(' ');
  return (space >= max * 0.5 ? cut.slice(0, space) : cut).trim();
}

/** BreadcrumbList JSON-LD from `[name, path]` pairs. The last one is the page itself. */
export const breadcrumbLd = (items: [name: string, path: string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absolute(path) })),
});

/** Renders a JSON-LD block. Content is our own static data, never user input. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

export const absolute = (path: string) => SITE_URL + path;
