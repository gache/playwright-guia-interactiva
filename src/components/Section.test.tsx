import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../context/LocaleContext';
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
  it('renders title, opens on click, shows complete button, and reports answer', () => {
    const onComplete = vi.fn();
    const onAnswer = vi.fn();
    const onUnComplete = vi.fn();
    render(<LocaleProvider><SectionView data={DATA} isVisited={false} quizAnswers={{}} onComplete={onComplete} onUnComplete={onUnComplete} onAnswer={onAnswer} /></LocaleProvider>);

    expect(screen.getByText('Instalación')).toBeInTheDocument();

    // open the card
    fireEvent.click(document.querySelector('.sec-head')!);
    expect(document.getElementById('s1')).toHaveClass('open');

    expect(screen.getByText('Necesitas Node.js.')).toBeInTheDocument();
    expect(document.querySelector('.cb')).toHaveTextContent('npm init playwright@latest');

    fireEvent.click(screen.getByText('Marcar como completada'));
    expect(onComplete).toHaveBeenCalledWith('s1');

    fireEvent.click(screen.getByText('npm init playwright@latest', { selector: '.quiz-opt *' }));
    expect(onAnswer).toHaveBeenCalledWith('s1', 1);
  });

  it('shows done badge when closed and completed text when open with isVisited=true', () => {
    const onUnComplete = vi.fn();
    render(<LocaleProvider><SectionView data={DATA} isVisited={true} quizAnswers={{}} onComplete={vi.fn()} onUnComplete={onUnComplete} onAnswer={vi.fn()} /></LocaleProvider>);

    expect(document.querySelector('.sec-done-badge')).toBeInTheDocument();

    // open to see body content
    fireEvent.click(document.querySelector('.sec-head')!);
    expect(screen.getByText('Sección completada')).toBeInTheDocument();
    expect(screen.queryByText('Marcar como completada')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Desmarcar'));
    expect(onUnComplete).toHaveBeenCalledWith('s1');
  });
});
