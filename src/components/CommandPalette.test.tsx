import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';
import { LocaleProvider } from '../context/LocaleContext';
import { buildIndex } from '../search/searchIndex';
import { getExercises, getGlossaryTerms, getSections } from '../data';

const index = buildIndex({
  sections: getSections('es'),
  exercises: getExercises('es'),
  glossary: getGlossaryTerms('es'),
  pages: [{ id: 'glosario', title: 'Glosario' }],
});

function setup(open = true) {
  localStorage.setItem('lang', 'es');
  const onClose = vi.fn();
  const onSelect = vi.fn();
  render(
    <LocaleProvider>
      <CommandPalette open={open} index={index} onClose={onClose} onSelect={onSelect} />
    </LocaleProvider>,
  );
  return { onClose, onSelect };
}

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows quick links when the query is empty', () => {
    setup();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });

  it('filters results while typing and selects with Enter', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup();
    await user.type(screen.getByRole('combobox'), 'locators');
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('moves the active option with arrow keys', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByRole('combobox'), 'locators');
    const first = screen.getAllByRole('option')[0];
    expect(first).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows an empty state with no matches', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByRole('combobox'), 'zzzzqqqq');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText(/Sin resultados/)).toBeInTheDocument();
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
