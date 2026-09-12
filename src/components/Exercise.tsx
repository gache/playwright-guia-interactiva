import type { CodeBlockData } from '../types';
import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';
import { CodeBlock } from './CodeBlock';

interface ExerciseProps {
  title: string;
  taskHtml: string;
  solution: CodeBlockData;
}

export function Exercise({ title, taskHtml, solution }: ExerciseProps) {
  const { locale } = useLocale();
  const t = strings[locale];
  return (
    <details className="exercise">
      <summary>{title}</summary>
      <div className="ex-body">
        <p className="ex-task" dangerouslySetInnerHTML={{ __html: taskHtml }} />
        <details className="solution">
          <summary>{t.viewSolution}</summary>
          <CodeBlock {...solution} />
        </details>
      </div>
    </details>
  );
}
