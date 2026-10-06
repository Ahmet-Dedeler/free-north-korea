import OrgDirectory from '@/components/OrgDirectory';
import { Ext } from '@/components/Ext';
import { ORG_PAGE } from '@/content/orgsI18n';
import { ORGS, ORGS_CHECKED } from '@/content/orgs';
import { REPO_URL } from '@/site/config';
import type { Lang } from '@/site/seo';

/** The organizations directory, shared by /organizations, /ko/organizations, /ja/organizations and /zh/organizations. */
export default function OrganizationsPage({ lang }: { lang: Lang }) {
  const t = ORG_PAGE[lang];
  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede(ORGS.length, ORGS_CHECKED)}</p>
      <OrgDirectory lang={lang} />
      <p className="muted">
        {t.footerBefore}
        <Ext href={`${REPO_URL}/issues/new`}>{t.footerLink}</Ext>
        {t.footerAfter}
      </p>
    </div>
  );
}
