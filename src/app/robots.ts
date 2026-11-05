import type { MetadataRoute } from 'next';
import { absolute } from '@/site/seo';
import { CONTENT_SIGNAL } from '@/site/agents';

export const dynamic = 'force-static';

/**
 * Everyone may crawl everything. The Content-Signal line (https://contentsignals.org) says how the content may be used
 * after crawling: search, answers in AI assistants (ai-input) and AI training are all allowed, because the point of the
 * site is to spread these facts.
 *
 * The one exception: Googlebot stays off the Markdown copies of pages. They are for agents, and Search Console showed
 * Googlebot spending more requests on them than on the pages themselves. A crawler obeys only the most specific group
 * that names it, so this group does not affect any other crawler.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Googlebot', allow: '/', disallow: ['/*.md$', '/md/'] },
      { userAgent: '*', allow: '/', other: { 'Content-Signal': CONTENT_SIGNAL } },
    ],
    sitemap: absolute('/sitemap.xml'),
  };
}
