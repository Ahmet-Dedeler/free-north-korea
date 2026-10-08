'use client';

import { useEffect, useState } from 'react';

const DAY = 86_400_000;
const since = (from: string) => Math.max(0, Math.round((Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY));

/**
 * Days since `from` (YYYY-MM-DD, UTC), recounted in the browser so a static page never shows a stale number.
 * The server renders `initial` (the count on the build day), so crawlers and no-JS readers still get a number.
 * `show="unit"` renders the matching unit word instead (`one` for 1, `many` otherwise), so plural forms stay in step.
 */
export default function LiveDays({ from, initial, show = 'n', one = '', many = '' }: { from: string; initial: number; show?: 'n' | 'unit'; one?: string; many?: string }) {
  const [n, setN] = useState(initial);
  useEffect(() => setN(since(from)), [from]);
  return <>{show === 'unit' ? (n === 1 ? one : many) : n}</>;
}
