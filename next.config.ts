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
};

export default config;
