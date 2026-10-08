import WatchPage from '@/components/WatchPage';
import { WATCH_PATHS, WATCH_TEXT } from '@/content/watch';
import { pageMeta } from '@/site/seo';

const t = WATCH_TEXT.en;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: WATCH_PATHS.en,
  lang: 'en',
  languages: WATCH_PATHS,
});

export default function Page() {
  return <WatchPage lang="en" />;
}
