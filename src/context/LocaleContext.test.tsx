import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider, useLocale } from './LocaleContext';

function Probe() {
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('fr')}>fr</button>
      <button onClick={() => setLocale('es')}>es</button>
    </div>
  );
}

describe('LocaleContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', { ...navigator, language: 'en-US' });
  });

  it('defaults to es when no stored locale and browser language is not French', () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('es');
  });

  it('defaults to fr when browser language starts with fr and nothing is stored', () => {
    vi.stubGlobal('navigator', { ...navigator, language: 'fr-FR' });
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('fr');
  });

  it('prefers a stored locale over browser language', () => {
    localStorage.setItem('lang', 'fr');
    vi.stubGlobal('navigator', { ...navigator, language: 'en-US' });
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('fr');
  });

  it('ignores a corrupt stored value and falls back to browser detection', () => {
    localStorage.setItem('lang', 'de');
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('es');
  });

  it('setLocale updates the locale and persists it to localStorage', () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    fireEvent.click(screen.getByText('fr'));
    expect(screen.getByTestId('locale').textContent).toBe('fr');
    expect(localStorage.getItem('lang')).toBe('fr');
  });

  it('throws when useLocale is used outside a LocaleProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useLocale must be used within a LocaleProvider');
    consoleError.mockRestore();
  });
});
