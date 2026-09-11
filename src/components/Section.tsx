import type { Block, Section } from '../types';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { Compare } from './Compare';
import { Exercise } from './Exercise';
import { Quiz } from './Quiz';

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
  quizAnswers: Record<string, number>;
  onToggleOpen: (id: string) => void;
  onAnswer: (id: string, index: number) => void;
}

export function SectionView({ data, quizAnswers, onToggleOpen, onAnswer }: SectionProps) {
  return (
    <details
      className="section"
      id={data.id}
      onToggle={e => {
        if ((e.target as HTMLDetailsElement).open) onToggleOpen(data.id);
      }}
    >
      <summary className="sec-head">
        <span className="sec-num">{data.num}</span>
        <h2 className="sec-title">
          {data.title} {data.tag && <span className="sec-tag new">{data.tag}</span>}
        </h2>
        {data.difficulty && (
          <span className={`diff-badge diff-${DIFF_SUFFIX[data.difficulty]}`}>{DIFF_LABEL[data.difficulty]}</span>
        )}
      </summary>
      <div className="sec-body">
        <p className="desc" dangerouslySetInnerHTML={{ __html: data.description }} />
        {data.blocks.map((block, i) => (
          <BlockView key={i} block={block} quizAnswers={quizAnswers} onAnswer={onAnswer} />
        ))}
      </div>
    </details>
  );
}

function BlockView({
  block,
  quizAnswers,
  onAnswer,
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
    case 'raw':
      return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
}
