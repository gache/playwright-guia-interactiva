import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { LocaleProvider } from './context/LocaleContext';

describe('App', () => {
  it('renders the sidebar, the two meta sections, and all 31 sections', () => {
    localStorage.setItem('lang', 'es');
    render(<LocaleProvider><App /></LocaleProvider>);
    expect(screen.getAllByText(/Guía de Estudio/).length).toBeGreaterThan(0);
    expect(document.getElementById('ruta')).toBeInTheDocument();
    expect(document.getElementById('glosario')).toBeInTheDocument();
    for (let i = 1; i <= 31; i++) {
      expect(document.getElementById(`s${i}`)).toBeInTheDocument();
    }
  });

  it('renders French chrome strings when locale is fr', () => {
    localStorage.setItem('lang', 'fr');
    render(<LocaleProvider><App /></LocaleProvider>);
    expect(screen.getByText("Parcours d'apprentissage")).toBeInTheDocument();
    expect(screen.queryByText('Ruta de Aprendizaje')).not.toBeInTheDocument();
  });
});

describe('App global search', () => {
  it('opens with Ctrl+K, finds a section and closes on select', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    localStorage.setItem('lang', 'es');
    render(<LocaleProvider><App /></LocaleProvider>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.type(screen.getByRole('combobox'), 'locators');
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
