import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SectionView } from './Section';
import type { Section } from '../types';

const DATA: Section = {
  id: 's1',
  num: '01',
  group: 'Fundamentos',
  title: 'Instalación',
  difficulty: 'beginner',
  description: 'Cómo instalar <code>Playwright</code>.',
  blocks: [
    { type: 'callout', variant: 'info', icon: '📋', html: 'Necesitas Node.js.' },
    { type: 'code', block: { label: 'terminal', langClass: 'sh', code: 'npm init playwright@latest' } },
    {
      type: 'quiz',
      id: 's1',
      isTeo: false,
      questionHtml: '¿Qué comando instala Playwright?',
      options: ['npm i', 'npm init playwright@latest'],
      answerIndex: 1,
      explanationHtml: 'Ese es el comando oficial.',
    },
  ],
};

describe('SectionView', () => {
  it('renders description, blocks, complete button, and reports answer events', () => {
    const onComplete = vi.fn();
    const onAnswer = vi.fn();
    render(<SectionView data={DATA} isVisited={false} quizAnswers={{}} onComplete={onComplete} onAnswer={onAnswer} />);

    expect(screen.getByText('Instalación')).toBeInTheDocument();
    expect(screen.getByText('Necesitas Node.js.')).toBeInTheDocument();
    expect(document.querySelector('.cb')).toHaveTextContent('npm init playwright@latest');

    fireEvent.click(screen.getByText('Marcar como completada'));
    expect(onComplete).toHaveBeenCalledWith('s1');

    fireEvent.click(screen.getByText('npm init playwright@latest', { selector: '.quiz-opt *' }));
    expect(onAnswer).toHaveBeenCalledWith('s1', 1);
  });

  it('shows done badge in summary and completed text in body when isVisited=true', () => {
    render(<SectionView data={DATA} isVisited={true} quizAnswers={{}} onComplete={vi.fn()} onAnswer={vi.fn()} />);
    expect(document.querySelector('.sec-done-badge')).toBeInTheDocument();
    const details = document.getElementById('s1') as HTMLDetailsElement;
    details.open = true;
    fireEvent(details, new Event('toggle'));
    expect(screen.getByText('Sección completada')).toBeInTheDocument();
    expect(screen.queryByText('Marcar como completada')).not.toBeInTheDocument();
  });
});
