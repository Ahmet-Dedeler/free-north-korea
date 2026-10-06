import MilitaryPage from '@/components/MilitaryPage';
import { MILITARY_PATHS, MILITARY_TEXT } from '@/content/military';
import { pageMeta } from '@/site/seo';

const t = MILITARY_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: MILITARY_PATHS.zh,
  lang: 'zh',
  languages: MILITARY_PATHS,
});

export default function Page() {
  return <MilitaryPage lang="zh" />;
}
