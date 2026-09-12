export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CodeBlockData {
  label: string;
  langClass: string; // original source class: 'js' | 'ts' | 'cfg' | 'sh' | 'bad' | 'good'
  code: string;
}

export interface CalloutBlock {
  type: 'callout';
  variant: 'info' | 'tip' | 'warn' | 'err' | 'why';
  icon: string;
  html: string;
}

export interface CodeBlockBlock {
  type: 'code';
  block: CodeBlockData;
}

export interface CompareBlock {
  type: 'compare';
  title: string;
  bad: CodeBlockData;
  good: CodeBlockData;
}

export interface ExerciseBlock {
  type: 'exercise';
  title: string;
  taskHtml: string;
  solution: CodeBlockData;
}

export interface QuizBlock {
  type: 'quiz';
  id: string;
  isTeo: boolean;
  questionHtml: string;
  options: string[];
  answerIndex: number;
  explanationHtml: string;
}

export interface RawBlock {
  type: 'raw';
  html: string;
}

export interface ShortcutItem {
  keys: string;
  description: string;
}

export interface ShortcutsBlock {
  type: 'shortcuts';
  items: ShortcutItem[];
}

export type Block =
  | CalloutBlock
  | CodeBlockBlock
  | CompareBlock
  | ExerciseBlock
  | QuizBlock
  | ShortcutsBlock
  | RawBlock;

export interface Section {
  id: string;
  num: string;
  group: string;
  title: string;
  tag?: string;
  difficulty?: Difficulty;
  description: string;
  blocks: Block[];
}

export interface GlossaryTerm {
  term: string;
  definitionHtml: string;
}

export interface RoadmapStage {
  dot: string;
  title: string;
  range: string;
  descriptionHtml: string;
}

export interface ProgressState {
  visited: string[];
  quiz: Record<string, number>;
}

export interface Exercise {
  id: string;
  num: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  hint: string;
  solution: string;
}

export type Locale = 'es' | 'fr';
