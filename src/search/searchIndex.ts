import type { Block, Difficulty, Exercise, GlossaryTerm, Section } from '../types';

export type SearchKind = 'section' | 'exercise' | 'glossary' | 'page';

export interface SearchEntry {
  kind: SearchKind;
  id: string;
  title: string;
  difficulty?: Difficulty;
  /** Optional navigation target (element id) when different from `id`. */
  target?: string;
  /** Parent meta-section to open before scrolling (exercise/glossary). */
  parent?: string;
  num?: string;
  description: string;
  body: string;
  // pre-folded copies, computed once at index time
  fTitle: string;
  fDescription: string;
  fBody: string;
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

export function fold(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function blockText(b: Block): string {
  switch (b.type) {
    case 'callout': return stripHtml(b.html);
    case 'code': return `${b.block.label} ${b.block.code}`;
    case 'compare': return `${b.title} ${b.bad.code} ${b.good.code}`;
    case 'exercise': return `${b.title} ${stripHtml(b.taskHtml)} ${b.solution.code}`;
    case 'quiz': return `${stripHtml(b.questionHtml)} ${b.options.map(stripHtml).join(' ')} ${stripHtml(b.explanationHtml)}`;
    case 'shortcuts': return b.items.map(i => `${i.keys} ${i.description}`).join(' ');
    case 'raw': return stripHtml(b.html);
  }
}

function makeEntry(
  base: Pick<SearchEntry, 'kind' | 'id' | 'title' | 'difficulty' | 'target' | 'parent' | 'num'>,
  description: string,
  body: string,
): SearchEntry {
  return {
    ...base,
    description,
    body,
    fTitle: fold(base.title),
    fDescription: fold(description),
    fBody: fold(body),
  };
}

export interface IndexSources {
  sections: Section[];
  exercises: Exercise[];
  glossary: GlossaryTerm[];
  pages: { id: string; title: string }[];
}

export function buildIndex({ sections, exercises, glossary, pages }: IndexSources): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const p of pages) {
    entries.push(makeEntry({ kind: 'page', id: p.id, title: p.title }, '', ''));
  }
  for (const s of sections) {
    entries.push(makeEntry(
      { kind: 'section', id: s.id, title: s.title, difficulty: s.difficulty, num: s.num },
      stripHtml(s.description),
      s.blocks.map(blockText).join(' '),
    ));
  }
  for (const e of exercises) {
    entries.push(makeEntry(
      { kind: 'exercise', id: e.id, title: e.title, difficulty: e.difficulty, parent: 'ejercicios', num: e.num },
      e.description,
      `${e.hint} ${e.solution}`,
    ));
  }
  glossary.forEach((g, i) => {
    entries.push(makeEntry(
      { kind: 'glossary', id: `gloss-${i}`, title: g.term, parent: 'glosario' },
      stripHtml(g.definitionHtml),
      '',
    ));
  });

  return entries;
}

export function tokenize(query: string): string[] {
  return fold(query).split(/[\s,;]+/).filter(Boolean);
}

function wordStart(hay: string, tok: string): boolean {
  const i = hay.indexOf(tok);
  if (i === -1) return false;
  if (i === 0) return true;
  return /[^a-z0-9]/.test(hay[i - 1]);
}

function snippetFrom(text: string, folded: string, tok: string, radius = 56): string {
  const i = folded.indexOf(tok);
  if (i === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + tok.length + radius);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

type Field = 'title' | 'description' | 'body';

const W_TITLE = 12;
const W_DESC = 4;
const W_BODY = 1;

export function search(index: SearchEntry[], query: string, limit = 40): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const phrase = tokens.join(' ');

  const results: SearchResult[] = [];

  for (const entry of index) {
    let score = 0;
    let matchedField: Field = 'title';
    let matchedTok = tokens[0];
    let bestFieldWeight = 0;
    let ok = true;

    for (const tok of tokens) {
      let w = 0;
      let field: Field = 'title';
      if (entry.fTitle.includes(tok)) {
        w = W_TITLE + (wordStart(entry.fTitle, tok) ? 4 : 0) + (entry.fTitle.startsWith(tok) ? 4 : 0);
        field = 'title';
      } else if (entry.fDescription.includes(tok)) {
        w = W_DESC + (wordStart(entry.fDescription, tok) ? 1 : 0);
        field = 'description';
      } else if (entry.fBody.includes(tok)) {
        w = W_BODY;
        field = 'body';
      }
      if (w === 0) { ok = false; break; }
      score += w;
      if (w > bestFieldWeight) {
        bestFieldWeight = w;
        matchedField = field;
        matchedTok = tok;
      }
    }
    if (!ok) continue;

    if (entry.fTitle === phrase) score += 30;
    else if (entry.fTitle.includes(phrase)) score += 10;
    // glossary terms and pages are short "answers": prefer them on a title hit
    if ((entry.kind === 'glossary' || entry.kind === 'page') && bestFieldWeight >= W_TITLE) score += 4;

    let snippet = '';
    if (matchedField === 'description') snippet = snippetFrom(entry.description, entry.fDescription, matchedTok);
    else if (matchedField === 'body') snippet = snippetFrom(entry.body, entry.fBody, matchedTok);
    else if (entry.description) snippet = entry.description.slice(0, 112).trim() + (entry.description.length > 112 ? '…' : '');

    results.push({ entry, score, snippet });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/** Split `text` into [plain, match, plain, match…] segments for the given query tokens. */
export function highlightSegments(text: string, tokens: string[]): { text: string; match: boolean }[] {
  if (tokens.length === 0 || !text) return [{ text, match: false }];
  const folded = fold(text);
  const marks = new Array<boolean>(text.length).fill(false);
  for (const tok of tokens) {
    let from = 0;
    for (;;) {
      const i = folded.indexOf(tok, from);
      if (i === -1) break;
      for (let k = i; k < i + tok.length && k < marks.length; k++) marks[k] = true;
      from = i + tok.length;
    }
  }
  const out: { text: string; match: boolean }[] = [];
  let cur = '';
  let curMatch = marks[0] ?? false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] !== curMatch) {
      out.push({ text: cur, match: curMatch });
      cur = '';
      curMatch = marks[i];
    }
    cur += text[i];
  }
  if (cur) out.push({ text: cur, match: curMatch });
  return out;
}
