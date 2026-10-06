import LibraryPage from '@/components/LibraryPage';
import { LIBRARY_PATHS, LIBRARY_TEXT } from '@/content/libraryI18n';
import { pageMeta } from '@/site/seo';

const t = LIBRARY_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: LIBRARY_PATHS.zh,
  lang: 'zh',
  languages: LIBRARY_PATHS,
});

export default function Page() {
  return <LibraryPage lang="zh" />;
}
