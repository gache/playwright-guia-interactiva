import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Roadmap } from './Roadmap';

describe('Roadmap', () => {
  it('renders every stage', () => {
    render(
      <Roadmap
        stages={[
          { dot: '1', title: 'Fundamentos', range: 'Secciones 01–03', descriptionHtml: 'Instala Playwright.' },
          { dot: '2', title: 'Interacción', range: 'Secciones 04–06', descriptionHtml: 'Navega y actúa.' },
        ]}
      />,
    );
    expect(screen.getByText('Fundamentos')).toBeInTheDocument();
    expect(screen.getByText('Secciones 01–03')).toBeInTheDocument();
    expect(screen.getByText('Interacción')).toBeInTheDocument();
  });
});
