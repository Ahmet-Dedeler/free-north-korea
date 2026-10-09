import LearnIndex from '@/components/LearnIndex';
import { LEARN_PATHS, LEARN_TEXT } from '@/content/about';
import { pageMeta } from '@/site/seo';

const t = LEARN_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: LEARN_PATHS.ko,
  lang: 'ko',
  languages: LEARN_PATHS,
});

export default function Page() {
  return <LearnIndex lang="ko" />;
}
