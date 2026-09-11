import { useState, useMemo } from 'react';
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { SectionView } from './components/Section';
import { Roadmap } from './components/Roadmap';
import { Glossary } from './components/Glossary';
import { Exercises } from './components/Exercises';
import { useProgress } from './hooks/useProgress';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useActiveSection } from './hooks/useActiveSection';
import { sections } from './data/sections';
import { roadmapStages } from './data/roadmap';
import { glossaryTerms } from './data/glossary';
import { exercises } from './data/exercises';

const QUIZ_TOTAL = 29;

const DIFF_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
const sortedSections = [...sections].sort(
  (a, b) => (DIFF_ORDER[a.difficulty ?? 'intermediate'] ?? 1) - (DIFF_ORDER[b.difficulty ?? 'intermediate'] ?? 1),
);

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
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle()}>
        <span className="sec-num">{icon}</span>
        <h2 className="sec-title">{title}{badge}</h2>
        <span className="sec-chevron">▶</span>
      </div>
      {open && <div className="sec-body">{children}</div>}
    </div>
  );
}

export default function App() {
  const { visited, quizAnswers, markVisited, recordAnswer } = useProgress();
  const scrollPct = useScrollProgress();
  const sectionIds = useMemo(() => ['ruta', 'glosario', 'ejercicios', ...sortedSections.map(s => s.id)], []);
  const activeId = useActiveSection(sectionIds);
  const quizAnsweredCount = Object.keys(quizAnswers).filter(id => /^s\d+$/.test(id)).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [diffFilter, setDiffFilter] = useState<Difficulty>('all');
  const visibleSections = diffFilter === 'all'
    ? sortedSections
    : sortedSections.filter(s => s.difficulty === diffFilter);

  return (
    <>
      <div id="progress" style={{ width: `${scrollPct}%` }} />
      <button
        className={`hamburger${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle menu"
      >☰</button>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        sections={sortedSections}
        activeId={activeId}
        visited={visited}
        quizAnsweredCount={quizAnsweredCount}
        quizTotal={QUIZ_TOTAL}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <main>
        <header className="page-head">
          <h1>
            <em>Playwright</em> — Guía de Estudio Interactiva
          </h1>
          <p>
            31 secciones con ejemplos comentados en español, bancos de ejercicios prácticos y teóricos, errores
            comunes y un mini proyecto completo para conectar todo.
          </p>
          <div className="chips">
            <span className="chip g">🗺️ Ruta guiada</span>
            <span className="chip g">🧠 Quiz por sección</span>
            <span className="chip g">📖 Glosario</span>
            <span className="chip g">✓ Ejercicios con soluciones</span>
            <span className="chip g">✓ Errores comunes</span>
            <span className="chip g">✓ Mini proyecto completo</span>
            <span className="chip">TypeScript</span>
            <span className="chip">31 secciones</span>
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
            >
              {f.label} <span className="diff-filter-count">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="sections-grid">
          {visibleSections.map(s => (
            <SectionView key={s.id} data={s} quizAnswers={quizAnswers} onToggleOpen={markVisited} onAnswer={recordAnswer} />
          ))}
        </div>
      </main>
    </>
  );
}
