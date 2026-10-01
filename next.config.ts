import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // every page is static; keep URLs without trailing slashes (good for canonical URLs)
  trailingSlash: false,
  // a stray package-lock.json in ~/Code makes Turbopack guess the wrong workspace root
  turbopack: { root: process.cwd() },
  // the atlas grew into the intel map
  async redirects() {
    return [{ source: '/atlas', destination: '/map', permanent: true }];
  },
};

export default config;
