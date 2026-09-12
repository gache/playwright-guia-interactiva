import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../context/LocaleContext';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('renders the label and the code', () => {
    render(<LocaleProvider><CodeBlock label="ejemplo.ts" langClass="ts" code="const x = 1;" /></LocaleProvider>);
    expect(screen.getByText('ejemplo.ts')).toBeInTheDocument();
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it('copies the raw code to the clipboard and shows confirmation', async () => {
    render(<LocaleProvider><CodeBlock label="ejemplo.ts" langClass="ts" code="const x = 1;" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    await waitFor(() => expect(screen.getByRole('button', { name: '¡Copiado!' })).toBeInTheDocument());
  });

  it('does not throw when the clipboard write fails', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    render(<LocaleProvider><CodeBlock label="ejemplo.ts" langClass="ts" code="const x = 1;" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    // give the rejected promise's catch handler a tick to run
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
    // component shows confirmation even when clipboard write fails
    expect(screen.getByRole('button', { name: '¡Copiado!' })).toBeInTheDocument();
  });
});
