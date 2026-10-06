import ActPage from '@/components/ActPage';
import { ACT_PATHS, ACT_TEXT } from '@/content/act';
import { pageMeta } from '@/site/seo';

const t = ACT_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ACT_PATHS.ja,
  lang: 'ja',
  languages: ACT_PATHS,
});

export default function Page() {
  return <ActPage lang="ja" />;
}
