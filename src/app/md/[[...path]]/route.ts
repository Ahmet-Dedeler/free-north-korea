import { MD_HEADERS } from '@/site/agents';
import { fetchPageMarkdown } from '@/site/markdown';

/**
 * The Markdown version of any page. Reached through the rewrites in next.config.ts (`/x.md`, or `/x` with
 * `Accept: text/markdown`), so `/md/...` itself is never linked. The page's built HTML is converted on the first
 * request and then served from the CDN until the next deploy.
 */
export async function GET(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const parts = (await params).path ?? [];
  // `/index.md` is the home page
  const path = '/' + (parts.length === 1 && parts[0] === 'index' ? '' : parts.map(encodeURIComponent).join('/'));
  const md = await fetchPageMarkdown(new URL(req.url).origin, path);
  if (md === null) return new Response('# Not found\n', { status: 404, headers: { ...MD_HEADERS, 'Cache-Control': 'no-store' } });
  return new Response(md, { headers: MD_HEADERS });
}
