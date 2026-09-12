import { useState } from 'react';
import type { Exercise } from '../types';

const DIFF_LABEL: Record<Exercise['difficulty'], string> = {
  beginner: '🟢 Principiante',
  intermediate: '🟡 Intermedio',
  advanced: '🟠 Avanzado',
};

const DIFF_ORDER: Exercise['difficulty'][] = ['beginner', 'intermediate', 'advanced'];

interface ExercisesProps {
  exercises: Exercise[];
}

function ExerciseCard({ ex }: { ex: Exercise }) {
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
          {showHint ? 'Ocultar pista' : '💡 Mostrar pista'}
        </button>
        <button className="ex-btn ex-btn-sol" onClick={() => setShowSolution(v => !v)}>
          {showSolution ? 'Ocultar solución' : '✅ Ver solución'}
        </button>
      </div>
      {showHint && (
        <div className="ex-hint">
          <span className="ex-hint-label">💡 Pista:</span> {ex.hint}
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
        {exercises.length} ejercicios prácticos organizados por nivel. Cada uno incluye descripción,
        pista opcional y solución con código TypeScript listo para ejecutar.
      </p>
      <div className="ex-practice-banner">
        <span className="ex-practice-icon">🌐</span>
        <div>
          <strong>Sitio de práctica recomendado:</strong>{' '}
          <a href="https://practice.expandtesting.com/register" target="_blank" rel="noreferrer" className="ex-practice-link">
            practice.expandtesting.com
          </a>
          {' '}— tiene formularios de registro/login, notas CRUD, basic-auth y más. Los ejercicios B04, I11, I17, I18, I19, A01 y A02 apuntan a este sitio directamente.
        </div>
      </div>

      <div className="ex-filters">
        <button
          className={`ex-filter${activeFilter === 'all' ? ' active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Todos ({exercises.length})
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
            {items.map(ex => <ExerciseCard key={ex.id} ex={ex} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
