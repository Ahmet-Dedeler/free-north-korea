import LearnIndex from '@/components/LearnIndex';
import { LEARN_PATHS, LEARN_TEXT } from '@/content/about';
import { pageMeta } from '@/site/seo';

const t = LEARN_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: LEARN_PATHS.ja,
  lang: 'ja',
  languages: LEARN_PATHS,
});

export default function Page() {
  return <LearnIndex lang="ja" />;
}
