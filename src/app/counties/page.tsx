import { Lock, ShieldAlert, Store, Users } from 'lucide-react';
import CountyExplorer, { type CountyRow } from '@/components/CountyExplorer';
import { Ext } from '@/components/Ext';
import { StatTile } from '@/components/Visual';
import { getCountyShapes, getProvinceShapes, VIEW_H, VIEW_W } from '@/site/geo';
import { getAllCounties } from '@/content/counties';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'All 179 North Korea Counties: Demographics, Abuses & Facilities',
  description:
    'County-by-county atlas of North Korea: 2008 census demographics, documented human rights violations (NKDB), detention facilities, and markets across all 179 counties and cities.',
  path: '/counties',
});

export default function CountiesIndex() {
  const counties = getAllCounties();
  const shapes = new Map(getCountyShapes().map((s) => [s.pcode, s.d]));
  const rows: CountyRow[] = counties.map((c) => ({
    pcode: c.pcode,
    slug: c.slug,
    name: c.name,
    province: c.province,
    pop: c.pop,
    density: c.density,
    incidents: c.incidents,
    detention: c.detention,
    markets: c.markets,
    d: shapes.get(c.pcode) ?? '',
  }));
  const sum = (k: 'pop' | 'incidents' | 'detention' | 'markets') => counties.reduce((a, c) => a + (c[k] ?? 0), 0);

  return (
    <div className="wide">
      <p className="eyebrow">Demographics · Local intel</p>
      <h1>All 179 counties and cities</h1>
      <p className="lede">Every county in North Korea with its 2008 census population, abuses documented by NKDB, detention sites and official markets.</p>
      <div className="tiles">
        <StatTile icon={Users} value={`${(sum('pop') / 1e6).toFixed(1)}M`} label="people (2008 census)" />
        <StatTile icon={ShieldAlert} value={sum('incidents').toLocaleString()} label="documented abuses" note="NKDB" tone="danger" />
        <StatTile icon={Lock} value={sum('detention')} label="detention sites" tone="warn" />
        <StatTile icon={Store} value={sum('markets')} label="official markets" tone="ok" />
      </div>
      <CountyExplorer rows={rows} provinces={getProvinceShapes().map((p) => ({ pcode: p.pcode, d: p.d }))} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} />
      <p className="muted small" style={{ marginTop: 16 }}>
        Sources: <Ext href="https://data.humdata.org/dataset/cod-ab-prk">UN OCHA boundaries</Ext>, <Ext href="https://data.humdata.org/dataset/cod-ps-prk">2008 census (UNFPA)</Ext>,{' '}
        <Ext href="https://www.visualatlas.org">NKDB Visual Atlas</Ext>. Few documented abuses usually means few escapees from that county, not fewer abuses.
      </p>
    </div>
  );
}
