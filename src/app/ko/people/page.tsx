import PeoplePage from '@/components/PeoplePage';
import { PEOPLE_PATHS, PEOPLE_TEXT } from '@/content/peopleI18n';
import { pageMeta } from '@/site/seo';

const t = PEOPLE_TEXT.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: PEOPLE_PATHS.ko,
  lang: 'ko',
  languages: PEOPLE_PATHS,
});

export default function Page() {
  return <PeoplePage lang="ko" />;
}
