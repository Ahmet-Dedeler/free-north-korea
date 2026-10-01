import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './config';

const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630 };

/** Per-page metadata with canonical URL, Open Graph and Twitter cards filled in consistently. */
export function pageMeta({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // setting openGraph here replaces the root one, so point at the shared card (src/app/opengraph-image.tsx) again
    openGraph: { title, description, url: path, siteName: SITE_NAME, type, locale: 'en_US', images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
  };
}

/** Renders a JSON-LD block. Content is our own static data, never user input. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

export const absolute = (path: string) => SITE_URL + path;
