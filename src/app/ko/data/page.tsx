import { DataHub } from '@/components/DataPage';
import { DATA_TEXT } from '@/content/dataPage';
import { DATA_PATHS } from '@/content/series';
import { pageMeta } from '@/site/seo';

const t = DATA_TEXT.ko;

export const metadata = pageMeta({ title: t.metaTitle, description: t.metaDescription, path: DATA_PATHS.ko, lang: 'ko', languages: DATA_PATHS });

export default function Page() {
  return <DataHub lang="ko" />;
}
