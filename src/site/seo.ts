import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './config';

/** Languages the site is published in. English lives at the root, the others under /ko and /ja. */
export type Lang = 'en' | 'ko' | 'ja';
export const LANGS: Lang[] = ['en', 'ko', 'ja'];
const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ko: 'ko_KR', ja: 'ja_JP' };

/** The same page in each language it exists in, as paths: `{ en: '/sanctions', ko: '/ko/sanctions' }`. */
export type Languages = Partial<Record<Lang, string>>;

const OG_IMAGE = '/opengraph-image';

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards filled in consistently.
 * - `languages`: pass the page's translations (including itself) to emit hreflang links. Every translated page
 *   must list the same set, or search engines ignore the pairing.
 * - `image`: path of the page's own share card (an `opengraph-image.tsx` next to the page). Defaults to the site card.
 */
export function pageMeta({
  title,
  description,
  path,
  type = 'website',
  lang = 'en',
  languages,
  image = OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  lang?: Lang;
  languages?: Languages;
  image?: string;
}): Metadata {
  const og = { url: image, width: 1200, height: 630 };
  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(languages && { languages: { ...languages, 'x-default': languages.en ?? path } }),
    },
    // setting openGraph here replaces the root one, so the share card has to be named again
    openGraph: { title, description, url: path, siteName: SITE_NAME, type, locale: OG_LOCALE[lang], images: [og] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

/** Renders a JSON-LD block. Content is our own static data, never user input. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

export const absolute = (path: string) => SITE_URL + path;
