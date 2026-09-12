import { useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';

interface QuizProps {
  id: string;
  questionHtml: string;
  options: string[];
  answerIndex: number;
  explanationHtml: string;
  answeredIndex?: number;
  onAnswer: (id: string, index: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function Quiz({ id, questionHtml, options, answerIndex, explanationHtml, answeredIndex, onAnswer }: QuizProps) {
  const [localChoice, setLocalChoice] = useState<number | undefined>(answeredIndex);
  const answered = localChoice !== undefined;
  const { locale } = useLocale();
  const t = strings[locale];

  function choose(i: number) {
    if (answered) return;
    setLocalChoice(i);
    onAnswer(id, i);
  }

  return (
    <div className={`quiz${answered ? ' answered' : ''}`} id={`quiz-${id}`} data-answer={answerIndex}>
      <p className="quiz-q">
        <span className="quiz-icon">🧠</span>
        <span dangerouslySetInnerHTML={{ __html: questionHtml }} />
      </p>
      <div className="quiz-options" role="group" aria-label={t.quizOptionsAria}>
        {options.map((optHtml, i) => {
          const stateClass = answered ? (i === answerIndex ? ' correct' : i === localChoice ? ' wrong' : '') : '';
          return (
            <button key={i} type="button" className={`quiz-opt${stateClass}`} disabled={answered} onClick={() => choose(i)}>
              <span className="quiz-letter">{LETTERS[i]}</span>
              <span dangerouslySetInnerHTML={{ __html: optHtml }} />
            </button>
          );
        })}
      </div>
      <p className="quiz-explain" hidden={!answered} dangerouslySetInnerHTML={{ __html: explanationHtml }} />
    </div>
  );
}
