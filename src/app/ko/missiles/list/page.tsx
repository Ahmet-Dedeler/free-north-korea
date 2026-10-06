import MissileListPage, { MISSILE_LIST_DATA } from '@/components/MissileListPage';
import { MISSILE_LIST_PATHS, MISSILE_LIST_TEXT } from '@/content/missileList';
import { pageMeta } from '@/site/seo';

const text = MISSILE_LIST_TEXT.ko;
const { minYear, maxYear, tests } = MISSILE_LIST_DATA;

export const metadata = pageMeta({
  title: text.metaTitle(minYear, maxYear),
  description: text.metaDescription(tests.length, minYear, maxYear),
  path: MISSILE_LIST_PATHS.ko,
  lang: 'ko',
  languages: MISSILE_LIST_PATHS,
});

export default function Page() {
  return <MissileListPage lang="ko" />;
}
