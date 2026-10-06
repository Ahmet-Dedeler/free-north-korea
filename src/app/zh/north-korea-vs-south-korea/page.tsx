import TwoKoreasPage from '@/components/TwoKoreasPage';
import { TWO_KOREAS, TWO_KOREAS_PATHS } from '@/content/twoKoreas';
import { pageMeta } from '@/site/seo';

const t = TWO_KOREAS.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: TWO_KOREAS_PATHS.zh,
  lang: 'zh',
  languages: TWO_KOREAS_PATHS,
  image: `${TWO_KOREAS_PATHS.zh}/opengraph-image`,
});

export default function Page() {
  return <TwoKoreasPage lang="zh" />;
}
