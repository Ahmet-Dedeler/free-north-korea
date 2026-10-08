import WatchPage from '@/components/WatchPage';
import { WATCH_PATHS, WATCH_TEXT } from '@/content/watch';
import { pageMeta } from '@/site/seo';

const t = WATCH_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: WATCH_PATHS.ko,
  lang: 'ko',
  languages: WATCH_PATHS,
});

export default function Page() {
  return <WatchPage lang="ko" />;
}
