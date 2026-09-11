import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders the variant class, icon, and HTML body', () => {
    const { container } = render(
      <Callout variant="tip" icon="💡" html="Usa <code>getByRole</code> primero." />,
    );
    expect(container.querySelector('.call.tip')).toBeInTheDocument();
    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('getByRole');
  });
});
