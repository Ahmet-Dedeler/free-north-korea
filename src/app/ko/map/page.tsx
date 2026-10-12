import MapExplorer from '@/map/Explorer';
import { MAP_PATHS, MAP_TEXT } from '@/content/mapI18n';
import { pageMeta } from '@/site/seo';
import { mapSatIndex } from '@/content/satWatch';
import { mapLatest } from '@/content/mapLatest';

const t = MAP_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: MAP_PATHS.ko,
  lang: 'ko',
  languages: MAP_PATHS,
});

export default function Page() {
  return <MapExplorer lang="ko" sat={mapSatIndex()} latest={mapLatest('ko')} />;
}
