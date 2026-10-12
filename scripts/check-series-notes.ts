// Fails when a chart note in data/series/series.json has no translation, or no longer matches the English template in
// SERIES_TEXT (src/content/series.ts). The build scripts write notes in English; pages show them in the reader's language
// through seriesNote(), and fall back to English when the template stops matching. Runs as part of `npm run lint`.
import { readFileSync } from 'node:fs';
import { SERIES_TEXT, seriesNote } from '../src/content/series.ts';

const { series } = JSON.parse(readFileSync('data/series/series.json', 'utf8')) as { series: { id: string; note?: string }[] };
const langs = ['en', 'ko', 'ja', 'zh'] as const;

let bad = 0;
let notes = 0;
for (const s of series) {
  if (!s.note) continue;
  notes++;
  if (seriesNote(s.id, 'en', s.note) !== s.note) {
    console.error(`Chart note for ${s.id} does not match its English template in SERIES_TEXT (src/content/series.ts):\n  ${s.note}`);
    bad++;
    continue;
  }
  const holes = (t: string) => [...t.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort().join();
  for (const lang of langs) {
    const tr = SERIES_TEXT[s.id][lang].note!;
    if (!seriesNote(s.id, lang, s.note) || holes(tr) !== holes(SERIES_TEXT[s.id].en.note!)) {
      console.error(`Chart note for ${s.id} is missing in ${lang}, or its {placeholders} differ from the English (src/content/series.ts)`);
      bad++;
    }
  }
}
if (bad) process.exit(1);
console.log(`Chart notes: all ${notes} exist in en, ko, ja and zh.`);
