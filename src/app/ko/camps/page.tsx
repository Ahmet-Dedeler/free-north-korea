import CampsPage from '@/components/CampsPage';
import { CAMPS_PATHS, CAMPS_TEXT } from '@/content/campsI18n';
import { pageMeta } from '@/site/seo';

const t = CAMPS_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: CAMPS_PATHS.ko,
  lang: 'ko',
  languages: CAMPS_PATHS,
});

export default function Page() {
  return <CampsPage lang="ko" />;
}
