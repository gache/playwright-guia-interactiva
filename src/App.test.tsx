import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the sidebar, the two meta sections, and all 31 sections', () => {
    render(<App />);
    expect(screen.getAllByText(/Guía de Estudio/).length).toBeGreaterThan(0);
    expect(document.getElementById('ruta')).toBeInTheDocument();
    expect(document.getElementById('glosario')).toBeInTheDocument();
    for (let i = 1; i <= 31; i++) {
      expect(document.getElementById(`s${i}`)).toBeInTheDocument();
    }
  });
});
