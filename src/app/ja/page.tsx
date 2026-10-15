import HomePage from '@/components/HomePage';
import { HOME_TEXT } from '@/content/home';
import { pageMeta } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';

const t = HOME_TEXT.ja;

export const metadata = {
  ...pageMeta({
    title: t.metaTitle,
    description: t.metaDescription,
    path: '/ja',
    lang: 'ja',
    languages: HUB_PATHS,
  }),
  // the hub title already names the site, so skip the "| Free North Korea" template
  title: { absolute: t.metaTitle },
};

export default function JapaneseHomePage() {
  return <HomePage lang="ja" />;
}
