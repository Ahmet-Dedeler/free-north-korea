// Fails when an English /learn article has no Korean or Japanese version (AGENTS.md: every article ships in all
// three languages). Runs as part of `npm run lint`. Each language keeps one file per article, named by its slug:
// src/content/articles/<slug>.tsx (English), src/content/articles/ko/<slug>.tsx, src/content/articles/ja/<slug>.tsx.
import { existsSync, readdirSync } from 'node:fs';

const dir = 'src/content/articles/';
const en = readdirSync(dir)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''));

let missing = 0;
for (const lang of ['ko', 'ja']) {
  for (const s of en) {
    if (!existsSync(`${dir}${lang}/${s}.tsx`)) {
      console.error(`Missing ${lang} translation: ${s} (add ${dir}${lang}/${s}.tsx and list it in ${dir}${lang}/index.ts)`);
      missing++;
    }
  }
}
if (missing) process.exit(1);
console.log(`Translations: all ${en.length} articles exist in ko and ja.`);
