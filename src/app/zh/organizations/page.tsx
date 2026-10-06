import OrganizationsPage from '@/components/OrganizationsPage';
import { ORG_PAGE, ORG_PATHS } from '@/content/orgsI18n';
import { pageMeta } from '@/site/seo';

const t = ORG_PAGE.zh;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ORG_PATHS.zh,
  lang: 'zh',
  languages: ORG_PATHS,
});

export default function Page() {
  return <OrganizationsPage lang="zh" />;
}
