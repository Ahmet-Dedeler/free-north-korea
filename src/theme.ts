'use client';

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemePref = 'auto' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

const KEY = 'theme';

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

type ThemeState = { pref: ThemePref; theme: Theme; cycle: () => void };
const Ctx = createContext<ThemeState>({ pref: 'auto', theme: 'light', cycle: () => {} });

/**
 * Theme preference (auto / light / dark) persisted per browser.
 * The *effective* theme is always written to <html data-theme>, so CSS and
 * MapLibre overrides only need one selector. index.html does the same before
 * first paint to avoid a flash.
 *
 * Pages are prerendered on the server, where there is no localStorage or
 * matchMedia. So the first render always assumes "auto/light" (matching the
 * server HTML), and the real preference is read right after hydration.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<ThemePref>('auto');
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const m = matchMedia('(prefers-color-scheme: dark)');
    setPref(readPref());
    setSystemDark(m.matches);
    setReady(true);
    const on = () => setSystemDark(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const theme: Theme = pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref;

  useEffect(() => {
    // before the stored preference is read, leave the attribute index.html already set alone
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    try {
      if (pref === 'auto') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      /* private mode etc. */
    }
  }, [theme, pref, ready]);

  const cycle = () => setPref((p) => (p === 'auto' ? 'light' : p === 'light' ? 'dark' : 'auto'));
  return createElement(Ctx.Provider, { value: { pref, theme, cycle } }, children);
}

/** Current theme. Before hydration finishes this may say "light" while the page is dark; maps wait for `ready` via the effect order. */
export function useTheme() {
  return useContext(Ctx);
}

/** Effective theme straight from <html data-theme> (set before first paint). Use for things created once on mount, like a map. */
export const domTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
