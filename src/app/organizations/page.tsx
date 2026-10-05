import OrgDirectory from '@/components/OrgDirectory';
import { Ext } from '@/components/Ext';
import { ORGS, ORGS_CHECKED } from '@/content/orgs';
import { REPO_URL } from '@/site/config';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Human Rights Organizations (2026 Directory)',
  description:
    'Organizations and people helping North Koreans in 2026: refugee rescue, USB and radio into North Korea, documentation, resettlement, freezing the regime\'s stolen crypto and research, with status and how to help each.',
  path: '/organizations',
});

export default function Organizations() {
  return (
    <div className="wide">
      <p className="eyebrow">Directory</p>
      <h1>Who is helping North Koreans</h1>
      <p className="lede">
        {ORGS.length} groups and people doing rescue, information, documentation, resettlement, research, and cutting off the regime&apos;s
        stolen crypto. Not only nonprofits: a lone investigator who freezes Lazarus money counts too.
        Several lost US funding in 2025, so we mark that too. Status was last checked {ORGS_CHECKED}. This isn't an endorsement or an audit,
        so do your own reading before giving big amounts.
      </p>
      <OrgDirectory />
      <p className="muted">
        Missing a group, or is something out of date? <Ext href={`${REPO_URL}/issues/new`}>Tell us on GitHub</Ext>.
      </p>
    </div>
  );
}
