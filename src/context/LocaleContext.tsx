import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '../types';

const STORAGE_KEY = 'lang';
const VALID_LOCALES: Locale[] = ['es', 'fr'];
const LOCALE_META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: 'Playwright Paso a Paso — Guía de Estudio Interactiva',
    description: 'Aprende Playwright con TypeScript desde cero: 31 lecciones, quizzes, glosario y ejercicios prácticos con solución.',
  },
  fr: {
    title: "Playwright pas à pas — Guide d'étude interactif",
    description: 'Apprenez Playwright avec TypeScript depuis zéro : 31 leçons, quiz, glossaire et exercices pratiques avec solution.',
  },
};

function detectInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_LOCALES as string[]).includes(stored)) {
      return stored as Locale;
    }
  } catch {
    // localStorage unavailable (private browsing, blocked) — fall through
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'es';
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  // Keep <html lang> and the page metadata in sync with the language (screen readers, SEO, link previews)
  useEffect(() => {
    document.documentElement.lang = locale;
    const meta = LOCALE_META[locale];
    document.title = meta.title;
    const set = (selector: string, value: string) => document.querySelector(selector)?.setAttribute('content', value);
    set('meta[name="description"]', meta.description);
    set('meta[property="og:title"]', meta.title);
    set('meta[property="og:description"]', meta.description);
    set('meta[property="og:locale"]', locale === 'fr' ? 'fr_FR' : 'es_ES');
    set('meta[name="twitter:title"]', meta.title);
    set('meta[name="twitter:description"]', meta.description);
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — locale still switches for this session
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
