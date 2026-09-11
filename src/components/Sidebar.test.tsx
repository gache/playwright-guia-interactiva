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
  it('renders grouped nav links with progress stats', () => {
    render(<Sidebar sections={SECTIONS} activeId="s1" visited={['s1']} quizAnsweredCount={2} quizTotal={29} />);
    expect(screen.getByText('Fundamentos')).toBeInTheDocument();
    expect(screen.getByText('Interacción')).toBeInTheDocument();
    expect(screen.getByText('Instalación')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByText('🧠 2 / 29')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Instalación/ })).toHaveClass('active');
  });

  it('filters links by search text and hides empty groups', () => {
    render(<Sidebar sections={SECTIONS} activeId={null} visited={[]} quizAnsweredCount={0} quizTotal={29} />);
    const search = screen.getByPlaceholderText('Buscar sección…');
    fireEvent.change(search, { target: { value: 'navegación' } });

    expect(screen.getByRole('link', { name: /Navegación/ })).not.toHaveClass('hidden-link');
    expect(screen.getByRole('link', { name: /Instalación/ })).toHaveClass('hidden-link');
  });
});
