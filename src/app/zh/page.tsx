import HomePage from '@/components/HomePage';
import { HOME_TEXT } from '@/content/home';
import { pageMeta } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';

const t = HOME_TEXT.zh;

export const metadata = {
  ...pageMeta({
    title: t.metaTitle,
    description: t.metaDescription,
    path: '/zh',
    lang: 'zh',
    languages: HUB_PATHS,
  }),
  // the hub title already names the site, so skip the "| Save North Korea" template
  title: { absolute: t.metaTitle },
};

export default function ChineseHomePage() {
  return <HomePage lang="zh" />;
}
