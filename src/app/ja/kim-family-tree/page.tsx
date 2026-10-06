import KimFamilyPage from '@/components/KimFamilyPage';
import { KIM_FAMILY_PATHS, KIM_FAMILY_TEXT } from '@/content/kimFamilyI18n';
import { pageMeta } from '@/site/seo';

const t = KIM_FAMILY_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: KIM_FAMILY_PATHS.ja,
  lang: 'ja',
  languages: KIM_FAMILY_PATHS,
});

export default function Page() {
  return <KimFamilyPage lang="ja" />;
}
