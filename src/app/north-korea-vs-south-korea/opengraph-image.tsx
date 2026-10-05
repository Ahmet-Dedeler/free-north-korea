import { latest } from '@/charts/data';
import { ENTITY_LABEL } from '@/content/series';
import { TWO_KOREAS } from '@/content/twoKoreas';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The card carries the two headline gaps, read from the data like the page itself.
export default function OgImage() {
  const t = TWO_KOREAS.en;
  const f = (v: number, d = 1) => new Intl.NumberFormat('en', { maximumFractionDigits: d }).format(v);
  const le = [latest('life-expectancy', 'PRK')!.v, latest('life-expectancy', 'KOR')!.v];
  const gdp = [latest('gdp-per-capita', 'PRK')!.v, latest('gdp-per-capita', 'KOR')!.v];
  const vs = `${ENTITY_LABEL.PRK.en} / ${ENTITY_LABEL.KOR.en}`;
  return ogCard({ kicker: t.eyebrow, title: t.h1, sub: `${vs}: ${t.tape.life} ${f(le[0])} / ${f(le[1])} · ${t.tape.gdp} $${f(gdp[0], 0)} / $${f(gdp[1], 0)}` });
}
