import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Quiz } from './Quiz';

const OPTIONS = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];

describe('Quiz', () => {
  it('marks the chosen wrong option and the correct one, then disables all', () => {
    const onAnswer = vi.fn();
    render(
      <Quiz
        id="s1"
        questionHtml="¿Cuál comando instala Playwright?"
        options={OPTIONS}
        answerIndex={2}
        explanationHtml="La C es correcta porque..."
        onAnswer={onAnswer}
      />,
    );
    fireEvent.click(screen.getByText('Opción A'));
    expect(onAnswer).toHaveBeenCalledWith('s1', 0);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('wrong');
    expect(buttons[2]).toHaveClass('correct');
    buttons.forEach(b => expect(b).toBeDisabled());
    expect(screen.getByText('La C es correcta porque...')).toBeVisible();
  });

  it('ignores further clicks once answered', () => {
    const onAnswer = vi.fn();
    render(
      <Quiz
        id="s1"
        questionHtml="q"
        options={OPTIONS}
        answerIndex={0}
        explanationHtml="e"
        onAnswer={onAnswer}
      />,
    );
    fireEvent.click(screen.getByText('Opción A'));
    fireEvent.click(screen.getByText('Opción B'));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders pre-answered state from answeredIndex without calling onAnswer', () => {
    const onAnswer = vi.fn();
    render(
      <Quiz
        id="s1"
        questionHtml="q"
        options={OPTIONS}
        answerIndex={1}
        explanationHtml="e"
        answeredIndex={1}
        onAnswer={onAnswer}
      />,
    );
    expect(screen.getAllByRole('button')[1]).toHaveClass('correct');
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
    expect(onAnswer).not.toHaveBeenCalled();
  });
});
