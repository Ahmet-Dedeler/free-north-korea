import { ARTICLES } from '@/content/articles';
import { fetchPageMarkdown } from '@/site/markdown';
import { SITE_NAME } from '@/site/config';

/**
 * /llms-full.txt: every English explainer in one Markdown file, for tools that want the whole thing in one request.
 * Built from the same pages as the `.md` versions, on the first request after a deploy, then cached by the CDN.
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const pages = await Promise.all(ARTICLES.map((a) => fetchPageMarkdown(origin, `/learn/${a.slug}`)));
  if (pages.some((p) => p === null)) return new Response('Could not build this file, try again later.\n', { status: 503 });
  const text = [`# ${SITE_NAME}: all explainers`, '', ...pages].join('\n\n');
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
