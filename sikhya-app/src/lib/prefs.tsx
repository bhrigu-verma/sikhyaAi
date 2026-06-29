'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';
export type Lang = 'en' | 'hi' | 'pa';

export interface Prefs {
  textSize: TextSize;
  lang: Lang;
  dyslexia: boolean;
  reducedMotion: boolean;
}

const DEFAULTS: Prefs = { textSize: 'md', lang: 'en', dyslexia: false, reducedMotion: false };
const KEY = 'sikhya-prefs';

interface Ctx extends Prefs {
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
}

const PrefsContext = createContext<Ctx | null>(null);

const HTML_LANG: Record<Lang, string> = { en: 'en', hi: 'hi', pa: 'pa' };

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  // Hydrate from localStorage once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  // Apply to <html> + persist whenever prefs change.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-text-size', prefs.textSize);
    el.setAttribute('data-dyslexia', prefs.dyslexia ? '1' : '0');
    el.setAttribute('data-reduced-motion', prefs.reducedMotion ? '1' : '0');
    el.lang = HTML_LANG[prefs.lang];
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  }, [prefs]);

  const setPref = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs(p => ({ ...p, [key]: value }));
  }, []);

  return <PrefsContext.Provider value={{ ...prefs, setPref }}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Ctx {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
