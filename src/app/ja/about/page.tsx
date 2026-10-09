import AboutPage from '@/components/AboutPage';
import { ABOUT_PATHS, ABOUT_TEXT } from '@/content/about';
import { pageMeta } from '@/site/seo';

const t = ABOUT_TEXT.ja;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ABOUT_PATHS.ja,
  lang: 'ja',
  languages: ABOUT_PATHS,
});

export default function Page() {
  return <AboutPage lang="ja" />;
}
