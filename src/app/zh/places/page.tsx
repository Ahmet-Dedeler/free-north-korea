import PlacesPage from '@/components/PlacesPage';
import { PLACES_PATHS, PLACES_TEXT } from '@/content/placesI18n';
import { pageMeta } from '@/site/seo';

const t = PLACES_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: PLACES_PATHS.zh,
  lang: 'zh',
  languages: PLACES_PATHS,
});

export default function Page() {
  return <PlacesPage lang="zh" />;
}
