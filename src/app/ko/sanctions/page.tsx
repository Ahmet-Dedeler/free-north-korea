import SanctionsPage from '@/components/SanctionsPage';
import { SANCTIONS_PATHS, SANCTIONS_TEXT } from '@/content/sanctions';
import { pageMeta } from '@/site/seo';

const t = SANCTIONS_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SANCTIONS_PATHS.ko,
  lang: 'ko',
  languages: SANCTIONS_PATHS,
  image: `${SANCTIONS_PATHS.ko}/opengraph-image`,
});

export default function Page() {
  return <SanctionsPage lang="ko" />;
}
