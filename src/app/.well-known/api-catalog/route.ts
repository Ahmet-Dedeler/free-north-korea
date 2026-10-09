import { REPO_URL } from '@/site/config';
import { absolute } from '@/site/seo';

export const dynamic = 'force-static';

/**
 * API catalog (RFC 9727): where the site's machine-readable data lives, so agents don't have to guess.
 * The people API is described by /openapi.json; the chart data is CSV in the repo.
 */
export function GET() {
  const linkset = [
    {
      anchor: absolute('/api/people'),
      'service-desc': [{ href: absolute('/openapi.json'), type: 'application/vnd.oai.openapi+json' }],
      'service-doc': [{ href: absolute('/llms.txt'), type: 'text/plain' }],
    },
    {
      anchor: absolute('/data'),
      'service-doc': [{ href: absolute('/data.md'), type: 'text/markdown' }],
      describedby: [{ href: `${REPO_URL}/tree/main/data/series`, type: 'text/html' }],
    },
  ];
  return new Response(JSON.stringify({ linkset }, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
