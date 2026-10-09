/**
 * What the site offers AI agents and LLM tools, on top of the normal HTML:
 * - robots.txt carries a Content-Signal line (https://contentsignals.org) allowing search, AI answers and training.
 * - Every page has a Markdown version: `/learn/x.md`, or the page URL with `Accept: text/markdown`
 *   (rewrites in next.config.ts send both to `app/md/[[...path]]/route.ts`, which converts the built HTML).
 * - `/llms.txt` (llmstxt.org) is the reading list; `/llms-full.txt` holds every English article in one file.
 * - `/.well-known/api-catalog` (RFC 9727) lists the JSON API, described by `/openapi.json`.
 * - Every HTML response sends `Link` headers pointing at the last two, so agents find them without guessing.
 * Check the result with Cloudflare's scanner: POST https://isitagentready.com/api/scan {"url": "<site>"}.
 */

/** Same answer for every use: this content is meant to be found, quoted and learned from. */
export const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

/** Markdown URL of a page: `/learn/x` → `/learn/x.md`, `/` → `/index.md`. */
export const mdPath = (path: string) => (path === '/' || path === '' ? '/index.md' : `${path.replace(/\/$/, '')}.md`);

/** Headers on every Markdown response. `Vary: Accept` keeps CDNs from mixing the HTML and Markdown of one URL. */
export const MD_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept',
  'Content-Signal': CONTENT_SIGNAL,
  'Access-Control-Allow-Origin': '*',
  // content only changes with a deploy, and a deploy starts a fresh CDN cache
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
};
