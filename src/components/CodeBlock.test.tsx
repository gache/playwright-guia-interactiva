import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('renders the label and the code', () => {
    render(<CodeBlock label="ejemplo.ts" langClass="ts" code="const x = 1;" />);
    expect(screen.getByText('ejemplo.ts')).toBeInTheDocument();
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it('copies the raw code to the clipboard and shows confirmation', async () => {
    render(<CodeBlock label="ejemplo.ts" langClass="ts" code="const x = 1;" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    await waitFor(() => expect(screen.getByRole('button', { name: '¡Copiado!' })).toBeInTheDocument());
  });
});
