import CountiesPage from '@/components/CountiesPage';
import { COUNTIES_PATHS, COUNTIES_TEXT } from '@/content/countiesI18n';
import { pageMeta } from '@/site/seo';

const t = COUNTIES_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: COUNTIES_PATHS.ja,
  lang: 'ja',
  languages: COUNTIES_PATHS,
});

export default function Page() {
  return <CountiesPage lang="ja" />;
}
