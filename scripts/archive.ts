// Permanent, append-only archive of data that its source only serves for a while (see data/archive/README.md).
//
// Each source keeps cleaned-up records, one JSON object per line, in data/archive/<source>/<kind>/<partition>.jsonl.
// Records are matched on a stable key and updated in place: a record is never deleted, so a fact the source later
// drops stays in the archive (and in git history). Files are written sorted, so a weekly run only shows what really
// changed in the diff. Nothing under src/ may import from data/archive (scripts/check-archive-imports.mjs); site
// builds read small summaries that scripts make from the archive instead.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const ARCHIVE = 'data/archive';

/** Every record of one kind, from all its partition files. */
export function readArchive<T>(kind: string): T[] {
  const dir = join(ARCHIVE, kind);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.jsonl'))
    .sort()
    .flatMap((f) =>
      readFileSync(join(dir, f), 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((l) => JSON.parse(l) as T),
    );
}

/**
 * Merges `incoming` into the archive of `kind` and rewrites the touched partitions.
 * - `key` identifies a record across runs; an existing record is updated with the incoming fields, keeping its
 *   `firstFetched` (the day we first stored it). `updated` is the day it last changed, so an idle week writes nothing.
 * - `partition` names the file a record goes in ("2026" → 2026.jsonl).
 * - `order` sorts records inside a file.
 * Returns how many records were added and how many changed.
 */
export function mergeArchive<T extends object>(
  kind: string,
  incoming: T[],
  {
    key,
    partition,
    order,
  }: {
    key: (r: T) => string;
    partition: (r: T) => string;
    order: (a: T, b: T) => number;
  },
): { added: number; changed: number; total: number } {
  const today = new Date().toISOString().slice(0, 10);
  const all = new Map(readArchive<T>(kind).map((r) => [key(r), r]));
  const touched = new Set<string>();
  let added = 0;
  let changed = 0;
  for (const r of incoming) {
    const k = key(r);
    const old = all.get(k) as (T & { firstFetched?: string; updated?: string }) | undefined;
    const next = {
      ...old,
      ...r,
      firstFetched: old?.firstFetched ?? today,
      updated: today,
    } as T;
    if (!old) added++;
    else if (JSON.stringify({ ...old, updated: 0 }) !== JSON.stringify({ ...next, updated: 0 })) changed++;
    else continue;
    all.set(k, next);
    touched.add(partition(next));
  }
  const byPart = new Map<string, T[]>();
  for (const r of all.values()) {
    const p = partition(r);
    if (!touched.has(p)) continue;
    (byPart.get(p) ?? byPart.set(p, []).get(p)!).push(r);
  }
  for (const [p, rows] of byPart) {
    const file = join(ARCHIVE, kind, `${p}.jsonl`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(
      file,
      rows
        .sort(order)
        .map((r) => JSON.stringify(r))
        .join('\n') + '\n',
    );
  }
  return { added, changed, total: all.size };
}
