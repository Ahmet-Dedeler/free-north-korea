import TwoKoreasPage from '@/components/TwoKoreasPage';
import { TWO_KOREAS, TWO_KOREAS_PATHS } from '@/content/twoKoreas';
import { pageMeta } from '@/site/seo';

const t = TWO_KOREAS.en;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: TWO_KOREAS_PATHS.en,
  lang: 'en',
  languages: TWO_KOREAS_PATHS,
  image: `${TWO_KOREAS_PATHS.en}/opengraph-image`,
});

export default function Page() {
  return <TwoKoreasPage lang="en" />;
}
