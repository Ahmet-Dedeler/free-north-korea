import { DataHub } from '@/components/DataPage';
import { DATA_TEXT } from '@/content/dataPage';
import { DATA_PATHS } from '@/content/series';
import { pageMeta } from '@/site/seo';

const t = DATA_TEXT.zh;

export const metadata = pageMeta({ title: t.metaTitle, description: t.metaDescription, path: DATA_PATHS.zh, lang: 'zh', languages: DATA_PATHS });

export default function Page() {
  return <DataHub lang="zh" />;
}
