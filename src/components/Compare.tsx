import type { CodeBlockData } from '../types';
import { CodeBlock } from './CodeBlock';

interface CompareProps {
  title: string;
  bad: CodeBlockData;
  good: CodeBlockData;
}

export function Compare({ title, bad, good }: CompareProps) {
  return (
    <>
      <p className="compare-title">{title}</p>
      <div className="compare">
        <CodeBlock {...bad} />
        <CodeBlock {...good} />
      </div>
    </>
  );
}
