import ActPage from '@/components/ActPage';
import { ACT_PATHS, ACT_TEXT } from '@/content/act';
import { pageMeta } from '@/site/seo';

const t = ACT_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ACT_PATHS.zh,
  lang: 'zh',
  languages: ACT_PATHS,
});

export default function Page() {
  return <ActPage lang="zh" />;
}
