import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';
import type { Section } from '../types';

const SECTIONS: Section[] = [
  { id: 's1', num: '01', group: 'Fundamentos', title: 'Instalación', difficulty: 'beginner', description: '', blocks: [] },
  { id: 's2', num: '02', group: 'Fundamentos', title: 'Estructura Básica', difficulty: 'beginner', description: '', blocks: [] },
  { id: 's4', num: '04', group: 'Interacción', title: 'Navegación', difficulty: 'beginner', description: '', blocks: [] },
];

describe('Sidebar', () => {
  it('renders difficulty-grouped nav links with progress stats', () => {
    render(<Sidebar sections={SECTIONS} activeId="s1" visited={['s1']} quizAnsweredCount={2} quizTotal={29} />);
    expect(screen.getByText(/🟢 Principiante/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Instalación/ })).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByText('🧠 2 / 29')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Instalación/ })).toHaveClass('active');
  });

  it('filters links by search text and removes non-matching sections from DOM', () => {
    render(<Sidebar sections={SECTIONS} activeId={null} visited={[]} quizAnsweredCount={0} quizTotal={29} />);
    const search = screen.getByPlaceholderText('Buscar sección…');
    fireEvent.change(search, { target: { value: 'navegación' } });

    expect(screen.getByRole('link', { name: /Navegación/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Instalación/ })).toBeNull();
  });

  it('shows clear button when search has text and clears on click', () => {
    render(<Sidebar sections={SECTIONS} activeId={null} visited={[]} quizAnsweredCount={0} quizTotal={29} />);
    const search = screen.getByPlaceholderText('Buscar sección…');
    expect(screen.queryByLabelText('Limpiar búsqueda')).toBeNull();

    fireEvent.change(search, { target: { value: 'nav' } });
    const clearBtn = screen.getByLabelText('Limpiar búsqueda');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(search).toHaveValue('');
    expect(screen.queryByLabelText('Limpiar búsqueda')).toBeNull();
  });
});
