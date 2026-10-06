import SanctionsPage from '@/components/SanctionsPage';
import { SANCTIONS_PATHS, SANCTIONS_TEXT } from '@/content/sanctions';
import { pageMeta } from '@/site/seo';

const t = SANCTIONS_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SANCTIONS_PATHS.zh,
  lang: 'zh',
  languages: SANCTIONS_PATHS,
  image: `${SANCTIONS_PATHS.zh}/opengraph-image`,
});

export default function Page() {
  return <SanctionsPage lang="zh" />;
}
