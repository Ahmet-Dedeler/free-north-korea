import { useEffect, useState } from 'react';

export type ThemePref = 'auto' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

const KEY = 'theme';
const media = () => matchMedia('(prefers-color-scheme: dark)');

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

/**
 * Theme preference (auto / light / dark) persisted per browser.
 * The *effective* theme is always written to <html data-theme>, so CSS and
 * MapLibre overrides only need one selector. index.html does the same before
 * first paint to avoid a flash.
 */
export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(readPref);
  const [systemDark, setSystemDark] = useState(() => media().matches);

  useEffect(() => {
    const m = media();
    const on = () => setSystemDark(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const theme: Theme = pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      if (pref === 'auto') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      /* private mode etc. */
    }
  }, [theme, pref]);

  const cycle = () => setPref((p) => (p === 'auto' ? 'light' : p === 'light' ? 'dark' : 'auto'));
  return { pref, theme, cycle };
}
