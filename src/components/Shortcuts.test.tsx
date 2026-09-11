import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Shortcuts } from './Shortcuts';

describe('Shortcuts', () => {
  it('renders each shortcut key and description', () => {
    render(
      <Shortcuts
        items={[
          { keys: '--ui', description: 'Interfaz visual' },
          { keys: '--debug', description: 'Debug paso a paso' },
        ]}
      />,
    );
    expect(screen.getByText('--ui')).toBeInTheDocument();
    expect(screen.getByText('Interfaz visual')).toBeInTheDocument();
    expect(screen.getByText('--debug')).toBeInTheDocument();
    expect(screen.getByText('Debug paso a paso')).toBeInTheDocument();
  });
});
