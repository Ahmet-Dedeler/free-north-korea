import PeoplePage from '@/components/PeoplePage';
import { PEOPLE_PATHS, PEOPLE_TEXT } from '@/content/peopleI18n';
import { pageMeta } from '@/site/seo';

const t = PEOPLE_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: PEOPLE_PATHS.ja,
  lang: 'ja',
  languages: PEOPLE_PATHS,
});

export default function Page() {
  return <PeoplePage lang="ja" />;
}
