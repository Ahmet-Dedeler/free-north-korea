import ShipsPage from '@/components/ShipsPage';
import { SHIPS_PATHS, SHIPS_TEXT } from '@/content/ships';
import { pageMeta } from '@/site/seo';

const t = SHIPS_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: SHIPS_PATHS.ja,
  lang: 'ja',
  languages: SHIPS_PATHS,
  image: `${SHIPS_PATHS.ja}/opengraph-image`,
});

export default function Page() {
  return <ShipsPage lang="ja" />;
}
