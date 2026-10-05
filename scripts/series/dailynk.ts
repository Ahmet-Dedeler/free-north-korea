// Market prices inside North Korea, surveyed every two weeks by Daily NK's sources in Pyongyang, Sinuiju and Hyesan.
// Daily NK keeps the numbers in a public Google Sheet behind its /market page but publishes no download, so we keep
// the clean history here. Sheet tabs: `rate` (won per US dollar) and `rice` (won per kg).
import { fetchText, parseCsv, sortPoints, today, type Point, type Series, type SeriesSource } from './lib.ts';

const SHEET = '1l78JcbokjkdlJ1aSU6F8cuqgC0AbfMkuXOKWiEEbueo';
const CITIES: Record<string, string> = { 평양: 'pyongyang', 신의주: 'sinuiju', 혜산: 'hyesan' };
// The November 30, 2009 currency reform knocked two zeros off the won. Older rows are in old won.
const REFORM = '2009-12-01';

async function tab(name: string): Promise<Record<string, Point[]>> {
  const rows = parseCsv(await fetchText(`https://docs.google.com/spreadsheets/d/${SHEET}/gviz/tq?tqx=out:csv&sheet=${name}`));
  const cols = rows[0].map((h) => CITIES[h.trim()]);
  if (!cols.includes('pyongyang')) throw new Error(`dailynk ${name}: unexpected header ${rows[0].join(',')}`);
  const out: Record<string, Point[]> = {};
  for (const r of rows.slice(1)) {
    const m = r[0].match(/^(\d{2})-(\d{2})-(\d{2})$/);
    if (!m) continue;
    const date = `20${m[1]}-${m[2]}-${m[3]}`;
    for (let i = 1; i < r.length; i++) {
      const city = cols[i];
      let v = +r[i].replace(/,/g, '');
      if (!city || !v) continue; // the sheet has a 0 row for the week of the reform
      if (date < REFORM) v /= 100;
      (out[city] ??= []).push([date, v]);
    }
  }
  for (const k in out) sortPoints(out[k]);
  return out;
}

const source = { name: 'Daily NK market price survey', url: 'https://www.dailynk.com/english/category/market-indicators/' };
const note = 'Prices before the November 2009 currency reform were in old won; we divided them by 100 so the line is continuous.';

export const dailynk: SeriesSource = {
  name: 'dailynk',
  maxAgeDays: 6, // new survey every ~2 weeks
  async build() {
    const [rate, rice] = await Promise.all([tab('rate'), tab('rice')]);
    const base = { frequency: 'irregular' as const, source, fetched: today(), note };
    return [
      { ...base, id: 'won-per-dollar', title: 'Market exchange rate: North Korean won per US dollar', unit: 'won per US$', entities: rate },
      { ...base, id: 'rice-price', title: 'Market price of rice', unit: 'won per kg', entities: rice },
    ] satisfies Series[];
  },
};
