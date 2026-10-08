import KimWatchPage from '@/components/KimWatchPage';
import { KIM_WATCH_PATHS, KIM_WATCH_TEXT } from '@/content/kimWatch';
import { pageMeta } from '@/site/seo';

const t = KIM_WATCH_TEXT.en;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: KIM_WATCH_PATHS.en,
  lang: 'en',
  languages: KIM_WATCH_PATHS,
  image: `${KIM_WATCH_PATHS.en}/opengraph-image`,
});

export default function Page() {
  return <KimWatchPage lang="en" />;
}
