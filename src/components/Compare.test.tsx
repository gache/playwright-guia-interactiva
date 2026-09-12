import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LocaleProvider } from '../context/LocaleContext';
import { Compare } from './Compare';

describe('Compare', () => {
  it('renders the title and both code blocks', () => {
    render(
      <LocaleProvider>
        <Compare
          title="❶ Usar selector CSS frágil"
          bad={{ label: '❌ Frágil', langClass: 'bad', code: "page.locator('.btn')" }}
          good={{ label: '✅ Robusto', langClass: 'good', code: "page.getByRole('button')" }}
        />
      </LocaleProvider>,
    );
    expect(screen.getByText('❶ Usar selector CSS frágil')).toBeInTheDocument();
    expect(screen.getByText('❌ Frágil')).toBeInTheDocument();
    expect(screen.getByText('✅ Robusto')).toBeInTheDocument();
  });
});
