import AboutPage from '@/components/AboutPage';
import { ABOUT_PATHS, ABOUT_TEXT } from '@/content/about';
import { pageMeta } from '@/site/seo';

const t = ABOUT_TEXT.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ABOUT_PATHS.zh,
  lang: 'zh',
  languages: ABOUT_PATHS,
});

export default function Page() {
  return <AboutPage lang="zh" />;
}
