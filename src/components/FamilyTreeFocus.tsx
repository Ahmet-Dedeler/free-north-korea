'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Interactivity for <FamilyTree>: hovering or focusing a person highlights their direct relatives, and deep links
 * (/kim-family-tree#kim-yo-jong) highlight that person on load. The tree itself is server-rendered; this only
 * toggles classes on it.
 */
export default function FamilyTreeFocus({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const on = new Set<string>();
    if (focus) {
      on.add(focus);
      el.querySelector<HTMLElement>(`[data-node="${focus}"]`)?.dataset.related?.split(' ').forEach((id) => on.add(id));
    }
    el.classList.toggle('has-focus', on.size > 0);
    el.querySelectorAll<HTMLElement>('[data-node]').forEach((n) => {
      n.classList.toggle('on', on.has(n.dataset.node!));
      n.classList.toggle('is-focus', n.dataset.node === focus);
    });
    el.querySelectorAll<SVGPathElement>('.ftree-edge').forEach((p) => {
      const hit = focus ? p.dataset.ids!.split(' ').includes(focus) : false;
      p.classList.toggle('on', hit);
      // lines share segments, so draw highlighted ones last to keep them on top (this subtree never re-renders)
      if (hit) p.parentNode?.appendChild(p);
    });
  }, [focus]);

  useEffect(() => {
    const want = decodeURIComponent(location.hash.slice(1));
    if (want && root.current?.querySelector(`[data-node="${want}"]`)) setFocus(want);
  }, []);

  const pick = (e: React.SyntheticEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-node]');
    if (el) setFocus(el.dataset.node!);
  };

  return (
    <div className="ftree" ref={root} onMouseOver={pick} onFocus={pick} onMouseLeave={() => setFocus(null)}>
      {children}
    </div>
  );
}
