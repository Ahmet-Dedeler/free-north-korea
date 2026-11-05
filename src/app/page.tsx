import HomePage from '@/components/HomePage';
import { HUB_PATHS } from '@/content/translations';
import { mdPath } from '@/site/agents';
import { hreflang } from '@/site/seo';

// hreflang() turns `zh` into `zh-Hans`, the code every other page and the sitemap use
const HUB_PATHS_WITH_DEFAULT = { ...hreflang(HUB_PATHS), 'x-default': '/' };

// the root layout supplies title and description; this adds the canonical URL and the translated hubs
export const metadata = { alternates: { canonical: '/', languages: HUB_PATHS_WITH_DEFAULT, types: { 'text/markdown': mdPath('/') } } };

export default function Home() {
  return <HomePage lang="en" />;
}
