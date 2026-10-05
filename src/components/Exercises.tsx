import { useEffect, useMemo, useState } from 'react';
import type { Exercise } from '../types';
import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';
import { CodeBlock } from './CodeBlock';
import { inertWhen } from '../a11y';

const DIFF_ORDER: Exercise['difficulty'][] = ['beginner', 'intermediate', 'advanced'];
const CHECK_KEYS = ['Locators', 'WebFirst', 'NoWaits', 'Isolated', 'NoThirdParty'] as const;

export type ExerciseStatus = 'all' | 'pending' | 'done';
export interface ExerciseFilter {
  diff: Exercise['difficulty'] | 'all';
  status: ExerciseStatus;
  query: string;
}
export type CardSize = 'normal' | 'large';
const SIZE_KEY = 'pwguide_ex_size';

function loadSize(): CardSize {
  try { return localStorage.getItem(SIZE_KEY) === 'large' ? 'large' : 'normal'; } catch { return 'normal'; }
}

export const DEFAULT_EXERCISE_FILTER: ExerciseFilter = { diff: 'all', status: 'all', query: '' };

type Strings = typeof strings[keyof typeof strings];
type Kind = 'real' | 'self' | 'fiction' | 'config';

/** What does the solution run against? Drives the badge shown on each card. */
export function exerciseKind(solution: string): Kind {
  if (/defineConfig|runs-on:/.test(solution)) return 'config';
  if (/practice\.expandtesting|demo\.playwright\.dev|playwright\.dev/.test(solution)) return 'real';
  if (/ejemplo\.com|exemple\.com/.test(solution)) return 'fiction';
  return 'self';
}

const isRunnableSpec = (s: string) => /from '@playwright\/test'/.test(s) && /\btest\(/.test(s) && !/defineConfig/.test(s);

function downloadSpec(ex: Exercise) {
  const blob = new Blob([ex.solution + '\n'], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ex.num}.spec.ts`;
  a.click();
  URL.revokeObjectURL(url);
}

interface CardProps {
  ex: Exercise;
  t: Strings;
  done: boolean;
  checks: string[];
  closeSignal: number;
  onToggleDone: (id: string) => void;
  onToggleCheck: (id: string, key: string) => void;
}

function ExerciseCard({ ex, t, done, checks, closeSignal, onToggleDone, onToggleCheck }: CardProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const kind = useMemo(() => exerciseKind(ex.solution), [ex.solution]);
  const chromiumOnly = /newCDPSession|browserName !== 'chromium'/.test(ex.solution);

  // "Close all solutions" from the toolbar
  useEffect(() => {
    if (closeSignal > 0) { setShowHint(false); setShowSolution(false); setShowChecks(false); }
  }, [closeSignal]);

  const kindLabel = { real: t.kindReal, self: t.kindSelf, fiction: t.kindFiction, config: t.kindConfig }[kind];
  const kindTip = { real: t.kindRealTip, self: t.kindSelfTip, fiction: t.kindFictionTip, config: t.kindConfigTip }[kind];
  const checkLabels: Record<string, string> = {
    Locators: t.checkLocators, WebFirst: t.checkWebFirst, NoWaits: t.checkNoWaits,
    Isolated: t.checkIsolated, NoThirdParty: t.checkNoThirdParty,
  };

  return (
    <div className={`ex-card${showSolution ? ' solution-open' : ''}${done ? ' ex-done' : ''}`} id={ex.id}>
      <div className="ex-head">
        <span className="ex-num">{ex.num}</span>
        <h3 className="ex-title">{ex.title}</h3>
        {(showHint || showSolution || showChecks) && (
          <button type="button" className="ex-close" aria-label={t.closeExercise}
            onClick={() => { setShowHint(false); setShowSolution(false); setShowChecks(false); }}>
            ✕ {t.closeExercise}
          </button>
        )}
      </div>
      <div className="ex-badges">
        <span className={`ex-badge ex-badge-${kind}`} title={kindTip}>{kindLabel}</span>
        {chromiumOnly && <span className="ex-badge ex-badge-chromium">{t.chromiumOnly}</span>}
        {done && <span className="ex-badge ex-badge-done">{t.markedDone}</span>}
      </div>
      <p className="ex-desc">{ex.description}</p>
      <div className="ex-actions">
        <button className="ex-btn" aria-expanded={showHint} onClick={() => setShowHint(v => !v)}>
          {showHint ? t.hideHint : t.showHint}
        </button>
        <button className="ex-btn ex-btn-sol" aria-expanded={showSolution} onClick={() => setShowSolution(v => !v)}>
          {showSolution ? t.hideSolution : t.showSolution}
        </button>
        <button className="ex-btn" aria-expanded={showChecks} onClick={() => setShowChecks(v => !v)}>
          {t.selfCheck} {checks.length > 0 && `(${checks.length}/${CHECK_KEYS.length})`}
        </button>
        <button type="button" className={`ex-btn ex-btn-done${done ? ' is-done' : ''}`} aria-pressed={done}
          onClick={() => onToggleDone(ex.id)}>
          {done ? t.markedDone : t.markDone}
        </button>
      </div>
      <div className={`ex-anim${showHint ? ' open' : ''}`} aria-hidden={!showHint} {...inertWhen(!showHint)}>
        <div className="ex-anim-clip">
          <div className="ex-hint">
            <span className="ex-hint-label">{t.hintLabel}</span> {ex.hint}
          </div>
        </div>
      </div>
      <div className={`ex-anim${showChecks ? ' open' : ''}`} aria-hidden={!showChecks} {...inertWhen(!showChecks)}>
        <div className="ex-anim-clip">
          <fieldset className="ex-checks" disabled={!showChecks}>
            <legend>{t.selfCheckTitle}</legend>
            {CHECK_KEYS.map(k => (
              <label key={k}>
                <input type="checkbox" checked={checks.includes(k)} onChange={() => onToggleCheck(ex.id, k)} />
                <span>{checkLabels[k]}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>
      <div className={`ex-anim${showSolution ? ' open' : ''}`} aria-hidden={!showSolution} {...inertWhen(!showSolution)}>
        <div className="ex-anim-clip">
          <CodeBlock label="TypeScript" langClass="ts" code={ex.solution} />
          <div className="ex-solution-actions">
            {isRunnableSpec(ex.solution) && (
              <button type="button" className="ex-btn" onClick={() => downloadSpec(ex)}>
                {t.downloadSpec}
              </button>
            )}
            <button type="button" className="ex-hide-bar"
              onClick={() => setShowSolution(false)}>▲ {t.hideSolution}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExercisesProps {
  exercises: Exercise[];
  doneIds?: string[];
  checks?: Record<string, string[]>;
  onToggleDone?: (id: string) => void;
  onToggleCheck?: (id: string, key: string) => void;
  filter?: ExerciseFilter;
  onFilterChange?: (f: ExerciseFilter) => void;
}

export function Exercises({
  exercises, doneIds = [], checks = {}, onToggleDone = () => {}, onToggleCheck = () => {},
  filter: controlled, onFilterChange,
}: ExercisesProps) {
  const [local, setLocal] = useState<ExerciseFilter>(DEFAULT_EXERCISE_FILTER);
  const filter = controlled ?? local;
  const setFilter = (next: ExerciseFilter) => (onFilterChange ?? setLocal)(next);
  const [closeSignal, setCloseSignal] = useState(0);
  const [size, setSizeState] = useState<CardSize>(loadSize);
  const setSize = (next: CardSize) => {
    setSizeState(next);
    try { localStorage.setItem(SIZE_KEY, next); } catch { /* storage unavailable: keep it for this session */ }
  };
  const { locale } = useLocale();
  const t = strings[locale];
  const DIFF_LABEL: Record<Exercise['difficulty'], string> = {
    beginner: t.diffBeginner,
    intermediate: t.diffIntermediate,
    advanced: t.diffAdvanced,
  };

  const counts = DIFF_ORDER.reduce((acc, d) => ({
    ...acc,
    [d]: exercises.filter(e => e.difficulty === d).length,
  }), {} as Record<Exercise['difficulty'], number>);

  const q = filter.query.trim().toLowerCase();
  const matches = (e: Exercise) => {
    if (filter.diff !== 'all' && e.difficulty !== filter.diff) return false;
    if (filter.status === 'done' && !doneIds.includes(e.id)) return false;
    if (filter.status === 'pending' && doneIds.includes(e.id)) return false;
    if (q && !`${e.num} ${e.title} ${e.description}`.toLowerCase().includes(q)) return false;
    return true;
  };
  const filtered = DIFF_ORDER
    .map(d => ({ diff: d, label: DIFF_LABEL[d], items: exercises.filter(e => e.difficulty === d && matches(e)) }))
    .filter(g => g.items.length > 0);
  const hasFilter = filter.diff !== 'all' || filter.status !== 'all' || q !== '';
  const doneCount = exercises.filter(e => doneIds.includes(e.id)).length;

  return (
    <div className="ex-wrapper">
      <p className="ex-intro">
        {t.exercisesIntro(exercises.length)}
      </p>
      <div className="ex-practice-banner">
        <span className="ex-practice-icon">🌐</span>
        <div>
          <strong>{t.practiceBannerLabel}</strong>{' '}
          <a href="https://practice.expandtesting.com/register" target="_blank" rel="noreferrer" className="ex-practice-link">
            practice.expandtesting.com
          </a>
          {' '}{t.practiceBannerText}
        </div>
      </div>

      <div className="ex-progress" role="status">
        <div className="ex-progress-bar"><div className="ex-progress-fill" style={{ width: `${exercises.length ? (doneCount / exercises.length) * 100 : 0}%` }} /></div>
        <span>{t.exerciseProgress(doneCount, exercises.length)}</span>
      </div>

      <div className="ex-filters">
        <button
          className={`ex-filter${filter.diff === 'all' ? ' active' : ''}`}
          aria-pressed={filter.diff === 'all'}
          onClick={() => setFilter({ ...filter, diff: 'all' })}
        >
          {t.filterAll(exercises.length)}
        </button>
        {DIFF_ORDER.map(d => (
          <button
            key={d}
            className={`ex-filter ex-filter-${d}${filter.diff === d ? ' active' : ''}`}
            aria-pressed={filter.diff === d}
            onClick={() => setFilter({ ...filter, diff: d })}
          >
            {DIFF_LABEL[d]} ({counts[d]})
          </button>
        ))}
      </div>

      <div className="ex-toolbar">
        <input
          type="search"
          className="ex-search"
          value={filter.query}
          placeholder={t.searchExercises}
          aria-label={t.searchExercises}
          onChange={e => setFilter({ ...filter, query: e.target.value })}
        />
        <div className="ex-status" role="group">
          {(['all', 'pending', 'done'] as const).map(s => (
            <button key={s} className={`ex-filter${filter.status === s ? ' active' : ''}`} aria-pressed={filter.status === s}
              onClick={() => setFilter({ ...filter, status: s })}>
              {{ all: t.statusAll, pending: t.statusPending, done: t.statusDone }[s]}
            </button>
          ))}
        </div>
        <button className="ex-btn" onClick={() => setCloseSignal(n => n + 1)}>{t.closeAllSolutions}</button>
        <div className="ex-size" role="group" aria-label={t.sizeAria}>
          <span className="ex-size-label">{t.sizeLabel}</span>
          {(['normal', 'large'] as const).map(z => (
            <button key={z} className={`ex-filter${size === z ? ' active' : ''}`} aria-pressed={size === z} onClick={() => setSize(z)}>
              {z === 'normal' ? t.sizeNormal : t.sizeLarge}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="ex-empty">
          <p>{t.noExerciseMatches}</p>
          {hasFilter && <button className="ex-btn" onClick={() => setFilter(DEFAULT_EXERCISE_FILTER)}>{t.resetFilters}</button>}
        </div>
      )}

      {filtered.map(({ diff, label, items }) => (
        <section key={diff} className="ex-group">
          <h2 className="ex-group-title">{label}</h2>
          <div className="ex-grid" data-size={size}>
            {items.map(ex => (
              <ExerciseCard
                key={ex.id}
                ex={ex}
                t={t}
                done={doneIds.includes(ex.id)}
                checks={checks[ex.id] ?? []}
                closeSignal={closeSignal}
                onToggleDone={onToggleDone}
                onToggleCheck={onToggleCheck}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
