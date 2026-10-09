import type { MetadataRoute } from 'next';
import { absolute } from '@/site/seo';
import { CONTENT_SIGNAL } from '@/site/agents';

export const dynamic = 'force-static';

/**
 * Everyone may crawl everything. The Content-Signal line (https://contentsignals.org) says how the content may be used
 * after crawling: search, answers in AI assistants (ai-input) and AI training are all allowed, because the point of the
 * site is to spread these facts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', other: { 'Content-Signal': CONTENT_SIGNAL } }],
    sitemap: absolute('/sitemap.xml'),
  };
}
