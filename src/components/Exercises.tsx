import { useState } from 'react';
import type { Exercise } from '../types';
import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';

const DIFF_ORDER: Exercise['difficulty'][] = ['beginner', 'intermediate', 'advanced'];

interface ExercisesProps {
  exercises: Exercise[];
}

function ExerciseCard({ ex, t }: { ex: Exercise; t: typeof strings[keyof typeof strings] }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="ex-card" id={ex.id}>
      <div className="ex-head">
        <span className="ex-num">{ex.num}</span>
        <h3 className="ex-title">{ex.title}</h3>
      </div>
      <p className="ex-desc">{ex.description}</p>
      <div className="ex-actions">
        <button className="ex-btn" onClick={() => setShowHint(v => !v)}>
          {showHint ? t.hideHint : t.showHint}
        </button>
        <button className="ex-btn ex-btn-sol" onClick={() => setShowSolution(v => !v)}>
          {showSolution ? t.hideSolution : t.showSolution}
        </button>
      </div>
      {showHint && (
        <div className="ex-hint">
          <span className="ex-hint-label">{t.hintLabel}</span> {ex.hint}
        </div>
      )}
      {showSolution && (
        <pre className="ex-solution"><code>{ex.solution}</code></pre>
      )}
    </div>
  );
}

export function Exercises({ exercises }: ExercisesProps) {
  const [activeFilter, setActiveFilter] = useState<Exercise['difficulty'] | 'all'>('all');
  const { locale } = useLocale();
  const t = strings[locale];
  const DIFF_LABEL: Record<Exercise['difficulty'], string> = {
    beginner: t.diffBeginner,
    intermediate: t.diffIntermediate,
    advanced: t.diffAdvanced,
  };

  const grouped = DIFF_ORDER.map(d => ({
    diff: d,
    label: DIFF_LABEL[d],
    items: exercises.filter(e => e.difficulty === d),
  }));

  const filtered = grouped.map(g => ({
    ...g,
    items: activeFilter === 'all' ? g.items : activeFilter === g.diff ? g.items : [],
  })).filter(g => g.items.length > 0);

  const counts = DIFF_ORDER.reduce((acc, d) => ({
    ...acc,
    [d]: exercises.filter(e => e.difficulty === d).length,
  }), {} as Record<Exercise['difficulty'], number>);

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

      <div className="ex-filters">
        <button
          className={`ex-filter${activeFilter === 'all' ? ' active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          {t.filterAll(exercises.length)}
        </button>
        {DIFF_ORDER.map(d => (
          <button
            key={d}
            className={`ex-filter ex-filter-${d}${activeFilter === d ? ' active' : ''}`}
            onClick={() => setActiveFilter(d)}
          >
            {DIFF_LABEL[d]} ({counts[d]})
          </button>
        ))}
      </div>

      {filtered.map(({ diff, label, items }) => (
        <section key={diff} className="ex-group">
          <h2 className="ex-group-title">{label}</h2>
          <div className="ex-grid">
            {items.map(ex => <ExerciseCard key={ex.id} ex={ex} t={t} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
