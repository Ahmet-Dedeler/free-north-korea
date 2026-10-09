import type { NextConfig } from 'next';
import { BASE_SLUGS } from './src/content/mapSlugs';

const config: NextConfig = {
  reactStrictMode: true,
  // every page is static; keep URLs without trailing slashes (good for canonical URLs)
  trailingSlash: false,
  // a stray package-lock.json in ~/Code makes Turbopack guess the wrong workspace root
  turbopack: { root: process.cwd() },
  // the atlas grew into the intel map
  async redirects() {
    // the map used to link missile bases by their map id (/places/base-6)
    const bases = Object.entries(BASE_SLUGS).flatMap(([id, slug]) =>
      ['', '/ko', '/ja', '/zh'].map((pre) => ({ source: `${pre}/places/${id}`, destination: `${pre}/places/${slug}`, permanent: true })),
    );
    return [{ source: '/atlas', destination: '/map', permanent: true }, ...bases];
  },
  // Markdown for agents (src/site/agents.ts): `/x.md`, or `/x` asked for with `Accept: text/markdown`
  async rewrites() {
    const wantsMarkdown = [{ type: 'header' as const, key: 'accept', value: '(.*)text/markdown(.*)' }];
    return {
      beforeFiles: [
        { source: '/:path(.+)\\.md', destination: '/md/:path' },
        { source: '/', has: wantsMarkdown, destination: '/md/index' },
        // pages only: no files (anything with a dot), API, build assets or the Markdown route itself
        { source: '/:path((?!api/|_next/|md/|\\.well-known/)[^.]+)', has: wantsMarkdown, destination: '/md/:path' },
      ],
    };
  },
  // point agents at the reading list and the API catalog from every response (RFC 8288)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Link', value: '</llms.txt>; rel="describedby"; type="text/plain", </.well-known/api-catalog>; rel="api-catalog"' }],
      },
    ];
  },
};

export default config;
