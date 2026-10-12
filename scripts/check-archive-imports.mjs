// Fails when anything under src/ imports from data/archive: the archive is for scripts, and importing it would put
// megabytes of records into the site bundle. Pages read the summaries scripts write into data/ instead.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const bad = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|js|mjs)$/.test(f) && /data\/archive/.test(readFileSync(p, 'utf8'))) bad.push(p);
  }
};
walk('src');
if (bad.length) {
  console.error(`These files import from data/archive (use a summary in data/ instead):\n  ${bad.join('\n  ')}`);
  process.exit(1);
}
console.log('Archive: no imports from src/.');
