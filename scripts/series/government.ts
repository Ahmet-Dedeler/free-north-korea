// Official statistics that are published, but not as data: a PDF on Korea's open data portal and UN OCHA's API.
//   - Defector arrivals in South Korea by year and sex: Ministry of Unification "북한이탈주민 주요 현황" PDF on
//     data.go.kr (dataset 15106185). The newest year in the PDF is often half a year; full years that the PDF doesn't
//     have yet come from data/series/curated/defectors.json, each with the ministry announcement it came from.
//   - Humanitarian funding to North Korea by year: UN OCHA Financial Tracking Service.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { UA, fetchJson, today, type Point, type PointSource, type Series, type SeriesSource } from './lib.ts';

const DGK = 'https://www.data.go.kr';
const DATASET = '15106185';

async function defectors(): Promise<Series> {
  // The portal hands out the current attachment id through this JSON call; the PDF itself is ~100 KB.
  const info = await fetchJson<{ atchFileId: string; dataSetFileDetailInfo: { updtDt?: string } }>(
    `${DGK}/tcs/dss/selectFileDataDownload.do?publicDataPk=${DATASET}&fileDetailSn=1&dataNm=x`,
  );
  const res = await fetch(`${DGK}/cmm/cmm/fileDownload.do?atchFileId=${info.atchFileId}&fileDetailSn=1&insertDataPrcus=N`, {
    headers: { 'user-agent': UA },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`defectors pdf: HTTP ${res.status}`);
  const dir = mkdtempSync(join(tmpdir(), 'nk-'));
  const pdf = join(dir, 'mou.pdf');
  writeFileSync(pdf, Buffer.from(await res.arrayBuffer()));
  const text = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' }); // poppler-utils

  // Header line looks like "입국 현황(’25.6월말 입국자 기준)": the last year row is partial unless it says 12월.
  const asOf = text.match(/[’'](\d{2})\.(\d{1,2})월말/);
  const partialYear = asOf && +asOf[2] < 12 ? 2000 + +asOf[1] : null;
  const men: Point[] = [];
  const women: Point[] = [];
  const table = text.slice(0, text.search(/^\s*합계\s+[\d,]/m)); // stop at the totals row
  for (const m of table.matchAll(/^\s*(~?\d{4})\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)/gm)) {
    if (m[1].startsWith('~')) continue; // "~1998" and "~2001" are multi-year buckets
    const y = +m[1];
    if (y === partialYear) continue;
    men.push([y, +m[2].replace(/,/g, '')]);
    women.push([y, +m[3].replace(/,/g, '')]);
  }
  if (men.length < 20) throw new Error(`defectors pdf: parsed only ${men.length} years`);

  // Full years announced by the ministry after the PDF was posted.
  const curated = JSON.parse(readFileSync('data/series/curated/defectors.json', 'utf8')) as {
    years: { year: number; men: number; women: number; url: string; note?: string }[];
  };
  const pointSources: PointSource[] = [];
  for (const c of curated.years) {
    if (men.some((p) => p[0] === c.year)) continue; // the official file wins once it has the year
    men.push([c.year, c.men]);
    women.push([c.year, c.women]);
    pointSources.push({ t: c.year, url: c.url, note: c.note });
  }
  men.sort((a, b) => +a[0] - +b[0]);
  women.sort((a, b) => +a[0] - +b[0]);

  return {
    id: 'defector-arrivals',
    title: 'North Koreans arriving in South Korea each year, by sex',
    unit: 'people',
    frequency: 'annual',
    entities: { women, men },
    source: { name: 'Ministry of Unification (South Korea), 북한이탈주민 주요 현황', url: `${DGK}/data/${DATASET}/fileData.do`, license: 'KOGL Type 1 (public)' },
    fetched: today(),
    updated: info.dataSetFileDetailInfo.updtDt?.slice(0, 10),
    note: 'Counted when people reach South Korea, which can be years after they left North Korea. 2002 onward; earlier years are only published as multi-year totals.',
    ...(pointSources.length && { pointSources }),
  };
}

type Fts = { data: { report3: { fundingTotals: { objects: { singleFundingObjects: { name: string; totalFunding: number }[] }[] } } } };

async function aid(): Promise<Series> {
  const url = 'https://api.hpc.tools/v1/public/fts/flow?countryISO3=PRK&groupby=year';
  const d = await fetchJson<Fts>(url);
  const thisYear = new Date().getFullYear();
  const pts: Point[] = d.data.report3.fundingTotals.objects[0].singleFundingObjects
    .map((o) => [+o.name, Math.round(o.totalFunding / 1e4) / 100] as Point) // US$ millions, 2 decimals
    .filter(([y]) => +y >= 2000 && +y <= thisYear)
    .sort((a, b) => +a[0] - +b[0]);
  return {
    id: 'humanitarian-aid',
    title: 'Humanitarian funding for North Korea',
    unit: 'US$ million',
    frequency: 'annual',
    entities: { PRK: pts },
    source: { name: 'UN OCHA Financial Tracking Service', url: 'https://fts.unocha.org/countries/115/summary/2025', license: 'CC BY 4.0' },
    fetched: today(),
    note: `Money reported to the UN as received for humanitarian work in North Korea, by the year it was meant for. ${thisYear} is the year so far.`,
  };
}

export const government: SeriesSource = {
  name: 'government',
  maxAgeDays: 13,
  async build() {
    const out: Series[] = [];
    for (const f of [defectors, aid]) {
      try {
        out.push(await f());
      } catch (e) {
        console.warn(`  government ${f.name}: ${(e as Error).message}`);
      }
    }
    return out;
  },
};
