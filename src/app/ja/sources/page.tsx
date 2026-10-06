import SourcesPage from '@/components/SourcesPage';
import { SOURCES_PATHS, SOURCES_TEXT } from '@/content/sourcesI18n';
import { pageMeta } from '@/site/seo';

const t = SOURCES_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SOURCES_PATHS.ja,
  lang: 'ja',
  languages: SOURCES_PATHS,
});

export default function Page() {
  return <SourcesPage lang="ja" />;
}
