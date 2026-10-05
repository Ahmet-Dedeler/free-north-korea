'use client';
/**
 * Adds `in` to a block once it scrolls into view, so CSS can grow its bars or draw its marks. Only blocks that start
 * below the fold are armed; without JavaScript, or with reduced motion, the content is simply there.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function Reveal({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'' | 'armed' | 'armed in'>('');
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const below = el.getBoundingClientRect().top > innerHeight * 0.85;
    setState('armed');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        // one frame in the armed state first, so the transition has a start
        requestAnimationFrame(() => setState('armed in'));
        io.disconnect();
      },
      { rootMargin: below ? '0px 0px -15% 0px' : '0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${state} ${className}`.trim()}>
      {children}
    </div>
  );
}
