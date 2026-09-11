import { useEffect, useState } from 'react';
import type { Block, Section } from '../types';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { Compare } from './Compare';
import { Exercise } from './Exercise';
import { Quiz } from './Quiz';
import { Shortcuts } from './Shortcuts';

const DIFF_LABEL: Record<NonNullable<Section['difficulty']>, string> = {
  beginner: '🟢 Principiante',
  intermediate: '🟡 Intermedio',
  advanced: '🟠 Avanzado',
};
const DIFF_SUFFIX: Record<NonNullable<Section['difficulty']>, string> = {
  beginner: 'b',
  intermediate: 'i',
  advanced: 'a',
};


interface SectionProps {
  data: Section;
  isVisited: boolean;
  quizAnswers: Record<string, number>;
  onComplete: (id: string) => void;
  onUnComplete: (id: string) => void;
  onAnswer: (id: string, index: number) => void;
  nextId?: string;
  requestOpen?: boolean;
  onRequestHandled?: () => void;
}

export function SectionView({
  data, isVisited, quizAnswers,
  onComplete, onUnComplete, onAnswer,
  nextId, requestOpen, onRequestHandled,
}: SectionProps) {
  const [open, setOpen] = useState(false);
  const previewText = data.description.replace(/<[^>]*>/g, '').slice(0, 130).trim();
  const diffClass = data.difficulty ? ` diff-${DIFF_SUFFIX[data.difficulty]}` : '';

  // Open from outside (Siguiente button)
  useEffect(() => {
    if (requestOpen && !open) {
      setOpen(true);
      setTimeout(() => {
        document.getElementById(data.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      onRequestHandled?.();
    }
  }, [requestOpen]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const toggle = () => setOpen(o => !o);

  return (
    <div className={`section${diffClass}${open ? ' open' : ''}`} id={data.id}>
      <div
        className="sec-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle()}
      >
        <span className="sec-num">{data.num}</span>
        <div className="sec-head-content">
          <div className="sec-title-row">
            <h2 className="sec-title">
              {data.title}{data.tag && <span className="sec-tag new">{data.tag}</span>}
            </h2>
            {data.difficulty && (
              <span className={`diff-badge diff-${DIFF_SUFFIX[data.difficulty]}`}>{DIFF_LABEL[data.difficulty]}</span>
            )}
          </div>
          {!open && previewText && <p className="sec-preview">{previewText}…</p>}
          {!open && isVisited && <span className="sec-done-badge">✓</span>}
        </div>
        <span className="sec-chevron">▶</span>
      </div>
      <div className="sec-body-anim" aria-hidden={!open}>
        <div className="sec-body-clip">
          <div className="sec-body">
            <p className="desc" dangerouslySetInnerHTML={{ __html: data.description }} />
            {data.blocks.map((block, i) => (
              <BlockView key={i} block={block} quizAnswers={quizAnswers} onAnswer={onAnswer} />
            ))}
            <div className="sec-complete-row">
              {isVisited ? (
                <>
                  <span className="sec-complete-done">Sección completada</span>
                  <button
                    className="sec-uncomplete-btn"
                    onClick={() => onUnComplete(data.id)}
                    aria-label="Desmarcar como completada"
                  >
                    Desmarcar
                  </button>
                  {nextId && (
                    <button
                      className="sec-next-btn"
                      onClick={() => {
                        const el = document.getElementById(nextId);
                        el?.dispatchEvent(new CustomEvent('section-open-request', { bubbles: true }));
                      }}
                    >
                      Siguiente <span className="sec-next-arrow">→</span>
                    </button>
                  )}
                </>
              ) : (
                <button className="sec-complete-btn" onClick={() => onComplete(data.id)}>
                  Marcar como completada
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({
  block, quizAnswers, onAnswer,
}: {
  block: Block;
  quizAnswers: Record<string, number>;
  onAnswer: (id: string, index: number) => void;
}) {
  switch (block.type) {
    case 'callout':
      return <Callout variant={block.variant} icon={block.icon} html={block.html} />;
    case 'code':
      return <CodeBlock {...block.block} />;
    case 'compare':
      return <Compare title={block.title} bad={block.bad} good={block.good} />;
    case 'exercise':
      return <Exercise title={block.title} taskHtml={block.taskHtml} solution={block.solution} />;
    case 'quiz':
      return (
        <Quiz
          id={block.id}
          questionHtml={block.questionHtml}
          options={block.options}
          answerIndex={block.answerIndex}
          explanationHtml={block.explanationHtml}
          answeredIndex={quizAnswers[block.id]}
          onAnswer={onAnswer}
        />
      );
    case 'shortcuts':
      return <Shortcuts items={block.items} />;
    case 'raw':
      return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
}
