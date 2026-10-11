import MapExplorer from '@/map/Explorer';
import { MAP_PATHS, MAP_TEXT } from '@/content/mapI18n';
import { pageMeta } from '@/site/seo';

const t = MAP_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: MAP_PATHS.zh,
  lang: 'zh',
  languages: MAP_PATHS,
});

export default function Page() {
  return <MapExplorer lang="zh" />;
}
