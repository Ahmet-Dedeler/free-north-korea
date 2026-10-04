import SanctionsPage from '@/components/SanctionsPage';
import { SANCTIONS_PATHS, SANCTIONS_TEXT } from '@/content/sanctions';
import { pageMeta } from '@/site/seo';

const t = SANCTIONS_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SANCTIONS_PATHS.ja,
  lang: 'ja',
  languages: SANCTIONS_PATHS,
  image: `${SANCTIONS_PATHS.ja}/opengraph-image`,
});

export default function Page() {
  return <SanctionsPage lang="ja" />;
}
