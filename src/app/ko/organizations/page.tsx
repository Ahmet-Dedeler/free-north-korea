import OrganizationsPage from '@/components/OrganizationsPage';
import { ORG_PAGE, ORG_PATHS } from '@/content/orgsI18n';
import { pageMeta } from '@/site/seo';

const t = ORG_PAGE.ko;

export const metadata = pageMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  path: ORG_PATHS.ko,
  lang: 'ko',
  languages: ORG_PATHS,
});

export default function Page() {
  return <OrganizationsPage lang="ko" />;
}
