import CountiesPage from '@/components/CountiesPage';
import { COUNTIES_PATHS, COUNTIES_TEXT } from '@/content/countiesI18n';
import { pageMeta } from '@/site/seo';

const t = COUNTIES_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: COUNTIES_PATHS.zh,
  lang: 'zh',
  languages: COUNTIES_PATHS,
});

export default function Page() {
  return <CountiesPage lang="zh" />;
}
