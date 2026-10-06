import PlacesPage from '@/components/PlacesPage';
import { PLACES_PATHS, PLACES_TEXT } from '@/content/placesI18n';
import { pageMeta } from '@/site/seo';

const t = PLACES_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: PLACES_PATHS.ko,
  lang: 'ko',
  languages: PLACES_PATHS,
});

export default function Page() {
  return <PlacesPage lang="ko" />;
}
