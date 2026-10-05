import TwoKoreasPage from '@/components/TwoKoreasPage';
import { TWO_KOREAS, TWO_KOREAS_PATHS } from '@/content/twoKoreas';
import { pageMeta } from '@/site/seo';

const t = TWO_KOREAS.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: TWO_KOREAS_PATHS.ko,
  lang: 'ko',
  languages: TWO_KOREAS_PATHS,
  image: `${TWO_KOREAS_PATHS.ko}/opengraph-image`,
});

export default function Page() {
  return <TwoKoreasPage lang="ko" />;
}
