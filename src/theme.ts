'use client';

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

type ThemeState = { theme: Theme };
const Ctx = createContext<ThemeState>({ theme: 'light' });

/**
 * Follows the user's OS/device theme preference (prefers-color-scheme).
 * The effective theme is written to <html data-theme>, so CSS and MapLibre
 * stay in sync. layout.tsx does the same before first paint to avoid a flash.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    const m = matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const next: Theme = m.matches ? 'dark' : 'light';
      setTheme(next);
      document.documentElement.dataset.theme = next;
    };
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  return createElement(Ctx.Provider, { value: { theme } }, children);
}

/** Current theme. Maps subscribe to this to swap basemaps when system theme flips. */
export function useTheme() {
  return useContext(Ctx);
}

/** Effective theme straight from <html data-theme> (set before first paint). Use for things created once on mount, like a map. */
export const domTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

