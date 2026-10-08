import KimWatchPage from '@/components/KimWatchPage';
import { KIM_WATCH_PATHS, KIM_WATCH_TEXT } from '@/content/kimWatch';
import { pageMeta } from '@/site/seo';

const t = KIM_WATCH_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: KIM_WATCH_PATHS.ja,
  lang: 'ja',
  languages: KIM_WATCH_PATHS,
  image: `${KIM_WATCH_PATHS.ja}/opengraph-image`,
});

export default function Page() {
  return <KimWatchPage lang="ja" />;
}
