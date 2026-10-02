/**
 * Lookups into media.json (written by scripts/fetch-media.ts): covers, posters, org logos and publisher icons.
 * Everything here is a local file under public/img/, so pages never hotlink third-party images.
 */
import raw from './media.json';
import { ORGS } from './orgs';

export interface Media {
  src: string;
  credit: string;
  sourceUrl: string;
}

const MEDIA = raw as Record<string, Media | undefined>;

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const media = (key: string) => MEDIA[key];
export const cover = (title: string) => MEDIA[`library:${slug(title)}`];
export const orgLogo = (id: string) => MEDIA[`org:${id}`];

const bare = (host: string) => host.replace(/^www\./, '');
/** Org logos by hostname, so a report from hrw.org gets the HRW mark. */
const ORG_BY_HOST = new Map(ORGS.filter((o) => orgLogo(o.id)).map((o) => [bare(new URL(o.url).hostname), orgLogo(o.id)!]));

/** Best available mark for a link: the org's logo if we list that org, otherwise the site's own icon. */
export function hostIcon(url: string): Media | undefined {
  const host = new URL(url).hostname;
  return ORG_BY_HOST.get(bare(host)) ?? MEDIA[`host:${host}`];
}

/** First letter of the main domain label ("en.wikipedia.org" → "W"), for letter tiles. */
export const hostInitial = (url: string) => {
  const parts = new URL(url).hostname.split('.');
  const sld = /^(co|or|ac|go|com|org)$/.test(parts.at(-2)!) && parts.length > 2 ? parts.at(-3)! : parts.at(-2) ?? parts[0];
  return sld[0].toUpperCase();
};

/** "www.hrw.org" → "hrw.org" for display. */
export const hostLabel = (url: string) => bare(new URL(url).hostname);
