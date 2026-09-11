import type { CodeBlockData } from '../types';
import { CodeBlock } from './CodeBlock';

interface ExerciseProps {
  title: string;
  taskHtml: string;
  solution: CodeBlockData;
}

export function Exercise({ title, taskHtml, solution }: ExerciseProps) {
  return (
    <details className="exercise" open>
      <summary>{title}</summary>
      <div className="ex-body">
        <p className="ex-task" dangerouslySetInnerHTML={{ __html: taskHtml }} />
        <details className="solution">
          <summary>Ver solución</summary>
          <CodeBlock {...solution} />
        </details>
      </div>
    </details>
  );
}
