import SourcesPage from '@/components/SourcesPage';
import { SOURCES_PATHS, SOURCES_TEXT } from '@/content/sourcesI18n';
import { pageMeta } from '@/site/seo';

const t = SOURCES_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SOURCES_PATHS.zh,
  lang: 'zh',
  languages: SOURCES_PATHS,
});

export default function Page() {
  return <SourcesPage lang="zh" />;
}
