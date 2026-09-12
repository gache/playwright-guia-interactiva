import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { SectionView } from './components/Section';
import { Roadmap } from './components/Roadmap';
import { Glossary } from './components/Glossary';
import { Exercises } from './components/Exercises';
import { useProgress } from './hooks/useProgress';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useActiveSection } from './hooks/useActiveSection';
import { sections } from './data/es/sections';
import { roadmapStages } from './data/es/roadmap';
import { glossaryTerms } from './data/es/glossary';
import { exercises } from './data/es/exercises';

const QUIZ_TOTAL = 29;

const DIFF_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

const sortedSections = (() => {
  const ordered = [...sections].sort((a, b) => {
    const da = DIFF_ORDER[a.difficulty ?? 'intermediate'] ?? 1;
    const db = DIFF_ORDER[b.difficulty ?? 'intermediate'] ?? 1;
    if (da !== db) return da - db;
    return Number(a.num) - Number(b.num);
  });
  const counters: Record<string, number> = {};
  return ordered.map(s => {
    const d = s.difficulty ?? 'intermediate';
    counters[d] = (counters[d] ?? 0) + 1;
    return { ...s, num: String(counters[d]).padStart(2, '0') };
  });
})();

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
const DIFF_FILTERS: { key: Difficulty; label: string; count: number }[] = [
  { key: 'all', label: 'Todos', count: sortedSections.length },
  { key: 'beginner', label: '🟢 Principiante', count: sortedSections.filter(s => s.difficulty === 'beginner').length },
  { key: 'intermediate', label: '🟡 Intermedio', count: sortedSections.filter(s => s.difficulty === 'intermediate').length },
  { key: 'advanced', label: '🟠 Avanzado', count: sortedSections.filter(s => s.difficulty === 'advanced').length },
];

function MetaSection({ id, icon, title, badge, children }: {
  id: string; icon: string; title: string;
  badge?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  return (
    <div className={`section meta${open ? ' open' : ''}`} id={id}>
      <div className="sec-head" onClick={toggle} role="button" tabIndex={0}
        aria-expanded={open}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle()}>
        <span className="sec-num">{icon}</span>
        <h2 className="sec-title">{title}{badge}</h2>
        <span className="sec-chevron">▶</span>
      </div>
      <div className="sec-body-anim" aria-hidden={!open}>
        <div className="sec-body-clip">
          <div className="sec-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { visited, quizAnswers, markVisited, markUnvisited, recordAnswer } = useProgress();
  const scrollPct = useScrollProgress();
  const sectionIds = useMemo(() => ['ruta', 'glosario', 'ejercicios', ...sortedSections.map(s => s.id)], []);
  const activeId = useActiveSection(sectionIds);
  const quizAnsweredCount = Object.keys(quizAnswers).filter(id => /^s\d+$/.test(id)).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [diffFilter, setDiffFilter] = useState<Difficulty>('all');
  const [requestOpenId, setRequestOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleSections = diffFilter === 'all'
    ? sortedSections
    : sortedSections.filter(s => s.difficulty === diffFilter);

  const completedPct = sortedSections.length > 0
    ? Math.round((visited.length / sortedSections.length) * 100)
    : 0;

  // Listen for section-open-request CustomEvent from Siguiente button
  useEffect(() => {
    const handler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[id]');
      if (!target) return;
      const id = target.id;
      setDiffFilter('all');
      setRequestOpenId(id);
    };
    gridRef.current?.addEventListener('section-open-request', handler);
    return () => gridRef.current?.removeEventListener('section-open-request', handler);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <div id="progress" style={{ width: `${scrollPct}%` }} />
      <button
        className={`hamburger${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Abrir menú de navegación"
      >☰</button>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        sections={sortedSections}
        activeId={activeId}
        visited={visited}
        quizAnsweredCount={quizAnsweredCount}
        quizTotal={QUIZ_TOTAL}
        mobileOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onMobileClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />
      <main id="main-content" className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
        <header className="page-head">
          <div className="page-head-badge">Guía de Estudio Interactiva</div>
          <h1>
            Domina <em>Playwright</em><br />
            <span className="page-head-sub">con TypeScript desde cero</span>
          </h1>
          <p>
            Todo lo que necesitas para aprender Playwright en español: ejemplos comentados,
            quizzes, glosario, ejercicios prácticos con soluciones y un mini proyecto completo.
          </p>

          {visited.length > 0 && (
            <div className="page-progress">
              <div className="page-progress-bar">
                <div className="page-progress-fill" style={{ width: `${completedPct}%` }} />
              </div>
              <span className="page-progress-label">
                {visited.length}/{sortedSections.length} completadas · {completedPct}%
              </span>
            </div>
          )}

          <div className="page-stats">
            <div className="page-stat"><span className="page-stat-n">31</span><span className="page-stat-l">secciones</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">29</span><span className="page-stat-l">quizzes</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">66</span><span className="page-stat-l">ejercicios</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">3</span><span className="page-stat-l">niveles</span></div>
          </div>
          <div className="chips">
            <span className="chip g">🗺️ Ruta guiada</span>
            <span className="chip g">🧠 Quiz por sección</span>
            <span className="chip g">📖 Glosario</span>
            <span className="chip g">🏋️ Ejercicios con soluciones</span>
            <span className="chip g">⚠️ Errores comunes</span>
            <span className="chip g">🚀 Mini proyecto</span>
            <span className="chip">TypeScript</span>
            <span className="chip">ES2024</span>
          </div>
        </header>

        <div className="sections-grid">
          <MetaSection id="ruta" icon="🗺️" title="Ruta de Aprendizaje">
            <Roadmap stages={roadmapStages} />
          </MetaSection>
          <MetaSection id="glosario" icon="📖" title="Glosario">
            <Glossary terms={glossaryTerms} />
          </MetaSection>
          <MetaSection id="ejercicios" icon="🏋️" title="Ejercicios Prácticos"
            badge={<span className="sec-tag">{exercises.length} ejercicios</span>}>
            <Exercises exercises={exercises} />
          </MetaSection>
        </div>

        <div className="diff-filter-bar">
          {DIFF_FILTERS.map(f => (
            <button
              key={f.key}
              className={`diff-filter-btn${diffFilter === f.key ? ' active' : ''}${f.key !== 'all' ? ` diff-filter-${f.key}` : ''}`}
              onClick={() => setDiffFilter(f.key)}
              aria-pressed={diffFilter === f.key}
            >
              {f.label} <span className="diff-filter-count">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="sections-grid" ref={gridRef}>
          {visibleSections.length === 0 ? (
            <div className="sections-empty">
              <span className="sections-empty-icon">🔍</span>
              <p>No hay secciones para este nivel.</p>
              <button className="sec-complete-btn" onClick={() => setDiffFilter('all')}>Ver todas</button>
            </div>
          ) : (
            visibleSections.map((s, i) => (
              <SectionView
                key={s.id}
                data={s}
                isVisited={visited.includes(s.id)}
                quizAnswers={quizAnswers}
                onComplete={markVisited}
                onUnComplete={markUnvisited}
                onAnswer={recordAnswer}
                nextId={visibleSections[i + 1]?.id}
                requestOpen={requestOpenId === s.id}
                onRequestHandled={() => setRequestOpenId(null)}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
