import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';
import type { Locale } from '../types';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="lang-switcher" role="group" aria-label={strings[locale].languageLabel}>
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher-btn${locale === code ? ' active' : ''}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
