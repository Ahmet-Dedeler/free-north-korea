// Fails when an English /learn article has no Korean or Japanese version (AGENTS.md: every article ships in all
// three languages). Runs as part of `npm run lint`. Reads slugs straight from the source files, no build needed.
import { readdirSync, readFileSync } from 'node:fs';

const slugs = (text) => [...text.matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1]);
const dir = 'src/content/articles/';
const en = readdirSync(dir)
  .filter((f) => f.endsWith('.tsx'))
  .flatMap((f) => slugs(readFileSync(dir + f, 'utf8')));

let missing = 0;
for (const lang of ['ko', 'ja']) {
  const have = new Set(slugs(readFileSync(`src/content/translations/${lang}.ts`, 'utf8')));
  for (const s of en) {
    if (!have.has(s)) {
      console.error(`Missing ${lang} translation: ${s} (add it to src/content/translations/${lang}.ts)`);
      missing++;
    }
  }
}
if (missing) process.exit(1);
console.log(`Translations: all ${en.length} articles exist in ko and ja.`);
