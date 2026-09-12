import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('marks the active locale button and switches on click', () => {
    localStorage.setItem('lang', 'es');
    render(<LocaleProvider><LanguageSwitcher /></LocaleProvider>);
    expect(screen.getByText('ES').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('FR').getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(screen.getByText('FR'));
    expect(screen.getByText('FR').getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('lang')).toBe('fr');
  });
});
