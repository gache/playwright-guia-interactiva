import { useMemo, useState } from 'react';
import type { Section } from '../types';

const DIFF_SUFFIX: Record<NonNullable<Section['difficulty']>, string> = {
  beginner: 'b',
  intermediate: 'i',
  advanced: 'a',
};

interface SidebarProps {
  sections: Section[];
  activeId: string | null;
  visited: string[];
  quizAnsweredCount: number;
  quizTotal: number;
}

export function Sidebar({ sections, activeId, visited, quizAnsweredCount, quizTotal }: SidebarProps) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase().trim();

  const groups = useMemo(() => {
    const map = new Map<string, Section[]>();
    sections.forEach(s => {
      const list = map.get(s.group) ?? [];
      list.push(s);
      map.set(s.group, list);
    });
    return Array.from(map.entries());
  }, [sections]);

  function matches(title: string) {
    return q.length === 0 || title.toLowerCase().includes(q);
  }

  const visitedPct = sections.length > 0 ? (visited.length / sections.length) * 100 : 0;
  const quizPct = quizTotal > 0 ? (quizAnsweredCount / quizTotal) * 100 : 0;

  return (
    <nav id="sidebar">
      <div className="nav-logo">
        <div className="mark">Playwright</div>
        <div className="sub">Guía de Estudio · ruta guiada + {sections.length} lecciones</div>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Buscar sección…"
          autoComplete="off"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="nav-stats">
        <div className="stats-bar">
          <div className="stats-fill" style={{ width: `${visitedPct}%` }} />
        </div>
        <span className="stats-text">
          {visited.length} / {sections.length}
        </span>
      </div>
      <div className="nav-stats">
        <div className="stats-bar">
          <div className="stats-fill quiz-fill" style={{ width: `${quizPct}%` }} />
        </div>
        <span className="stats-text">
          🧠 {quizAnsweredCount} / {quizTotal}
        </span>
      </div>

      <div className="diff-legend">
        <span>
          <i className="dot db" />
          Principiante
        </span>
        <span>
          <i className="dot di" />
          Intermedio
        </span>
        <span>
          <i className="dot da" />
          Avanzado
        </span>
      </div>

      <div className="nav-group">Antes de Empezar</div>
      <a href="#ruta" className={activeId === 'ruta' ? 'active' : ''}>
        <span className="n">🗺️</span> Ruta de Aprendizaje<span className="nav-check">✓</span>
      </a>
      <a href="#glosario" className={activeId === 'glosario' ? 'active' : ''}>
        <span className="n">📖</span> Glosario<span className="nav-check">✓</span>
      </a>

      {groups.map(([group, items]) => {
        const groupHidden = q.length > 0 && !items.some(s => matches(s.title));
        return (
          <div key={group} className={groupHidden ? 'hidden-group' : ''}>
            <div className="nav-group">{group}</div>
            {items.map(s => {
              const classes = [
                activeId === s.id ? 'active' : '',
                visited.includes(s.id) ? 'done' : '',
                matches(s.title) ? '' : 'hidden-link',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <a key={s.id} href={`#${s.id}`} className={classes}>
                  <span className="n">{s.num}</span>
                  {s.difficulty && <span className={`diff-dot diff-${DIFF_SUFFIX[s.difficulty]}`} />}
                  {' '}
                  {s.title}
                  <span className="nav-check">✓</span>
                </a>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
