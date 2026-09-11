import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Glossary } from './Glossary';

describe('Glossary', () => {
  it('renders every term and definition', () => {
    render(
      <Glossary
        terms={[
          { term: 'Locator', definitionHtml: 'Una receta para encontrar un elemento.' },
          { term: 'Fixture', definitionHtml: 'Un objeto listo para usar en cada test.' },
        ]}
      />,
    );
    expect(screen.getByText('Locator')).toBeInTheDocument();
    expect(screen.getByText('Una receta para encontrar un elemento.')).toBeInTheDocument();
    expect(screen.getByText('Fixture')).toBeInTheDocument();
  });
});
