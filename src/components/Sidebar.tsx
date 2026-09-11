import { useMemo, useState } from 'react';
import type { Section } from '../types';

const DIFF_ORDER: NonNullable<Section['difficulty']>[] = ['beginner', 'intermediate', 'advanced'];
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

interface SidebarProps {
  sections: Section[];
  activeId: string | null;
  visited: string[];
  quizAnsweredCount: number;
  quizTotal: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="nav-match">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function Sidebar({ sections, activeId, visited, quizAnsweredCount, quizTotal, mobileOpen, onMobileClose }: SidebarProps) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase().trim();

  const groups = useMemo(() => {
    const map = new Map<NonNullable<Section['difficulty']>, Section[]>();
    DIFF_ORDER.forEach(d => map.set(d, []));
    sections.forEach(s => {
      const key = s.difficulty ?? 'beginner';
      map.get(key)!.push(s);
    });
    return DIFF_ORDER.map(d => [DIFF_LABEL[d], map.get(d)!] as const).filter(([, items]) => items.length > 0);
  }, [sections]);

  function matches(title: string) {
    return q.length === 0 || title.toLowerCase().includes(q);
  }

  const visitedPct = sections.length > 0 ? (visited.length / sections.length) * 100 : 0;
  const quizPct = quizTotal > 0 ? (quizAnsweredCount / quizTotal) * 100 : 0;

  return (
    <nav id="sidebar" className={mobileOpen ? 'mobile-open' : ''}>
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
        {query.length > 0 && (
          <button className="search-clear" onClick={() => setQuery('')} aria-label="Limpiar búsqueda">✕</button>
        )}
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

      <div className="nav-group">Antes de Empezar</div>
      <a href="#ruta" className={activeId === 'ruta' ? 'active' : ''} onClick={() => { const el = document.getElementById('ruta') as HTMLDetailsElement | null; if (el) el.open = true; onMobileClose?.(); }}>
        <span className="n">🗺️</span> Ruta de Aprendizaje<span className="nav-check">✓</span>
      </a>
      <a href="#glosario" className={activeId === 'glosario' ? 'active' : ''} onClick={() => { const el = document.getElementById('glosario') as HTMLDetailsElement | null; if (el) el.open = true; onMobileClose?.(); }}>
        <span className="n">📖</span> Glosario<span className="nav-check">✓</span>
      </a>

      {groups.map(([group, items]) => {
        const visibleCount = q.length > 0 ? items.filter(s => matches(s.title)).length : items.length;
        const groupHidden = q.length > 0 && visibleCount === 0;
        if (groupHidden) return null;
        return (
          <details key={group} className="nav-section-group" open>
            <summary className="nav-group">
              {group}
              <span className="nav-group-count">{visibleCount}</span>
            </summary>
            {items.map(s => {
              if (!matches(s.title)) return null;
              const classes = [
                activeId === s.id ? 'active' : '',
                visited.includes(s.id) ? 'done' : '',
              ].filter(Boolean).join(' ');
              return (
                <a key={s.id} href={`#${s.id}`} className={classes} onClick={() => { const el = document.getElementById(s.id) as HTMLDetailsElement | null; if (el) el.open = true; onMobileClose?.(); }}>
                  <span className="n">{s.num}</span>
                  {s.difficulty && <span className={`diff-dot diff-${DIFF_SUFFIX[s.difficulty]}`} />}
                  {' '}
                  <Highlight text={s.title} query={q} />
                  <span className="nav-check">✓</span>
                </a>
              );
            })}
          </details>
        );
      })}

      <div className="nav-group">Práctica</div>
      <a href="#ejercicios" className={activeId === 'ejercicios' ? 'active' : ''} onClick={() => { const el = document.getElementById('ejercicios') as HTMLDetailsElement | null; if (el) el.open = true; onMobileClose?.(); }}>
        <span className="n">🏋️</span> Ejercicios Prácticos<span className="nav-check">✓</span>
      </a>
    </nav>
  );
}
