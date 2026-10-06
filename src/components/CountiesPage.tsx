import AsOf from '@/components/AsOf';
import { Lock, ShieldAlert, Store, Users } from 'lucide-react';
import CountyExplorer, { type CountyRow } from '@/components/CountyExplorer';
import { Ext } from '@/components/Ext';
import { StatTile } from '@/components/Visual';
import { getAllCounties } from '@/content/counties';
import { COUNTIES_TEXT, formatCount } from '@/content/countiesI18n';
import { getCountyShapes, getProvinceShapes, VIEW_H, VIEW_W } from '@/site/geo';
import type { Lang } from '@/site/seo';

export default function CountiesPage({ lang }: { lang: Lang }) {
  const t = COUNTIES_TEXT[lang];
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
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>
      <div className="tiles">
        <StatTile icon={Users} value={t.million((sum('pop') / 1e6).toFixed(1))} label={t.peopleCensus} />
        <StatTile icon={ShieldAlert} value={formatCount(sum('incidents'), lang)} label={t.documentedAbuses} note={t.nkdb} tone="danger" />
        <StatTile icon={Lock} value={sum('detention')} label={t.detentionSites} tone="warn" />
        <StatTile icon={Store} value={sum('markets')} label={t.officialMarkets} tone="ok" />
      </div>
      <p>
        <AsOf date="2008" label={t.censusAsOf} lang={lang} />
      </p>
      <CountyExplorer rows={rows} provinces={getProvinceShapes().map((p) => ({ pcode: p.pcode, d: p.d }))} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} lang={lang} />
      <p className="muted small" style={{ marginTop: 16 }}>
        {t.sourcesLead}<Ext href="https://data.humdata.org/dataset/cod-ab-prk">{t.ochaShort}</Ext>, <Ext href="https://data.humdata.org/dataset/cod-ps-prk">{t.censusSource}</Ext>,{' '}
        <Ext href="https://www.visualatlas.org">{t.nkdbSource}</Ext>. {t.caveat}
      </p>
    </div>
  );
}
