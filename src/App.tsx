import { useState, useMemo } from 'react';
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

export default function App() {
  const { visited, quizAnswers, markVisited, recordAnswer } = useProgress();
  const scrollPct = useScrollProgress();
  const sectionIds = useMemo(() => ['ruta', 'glosario', 'ejercicios', ...sortedSections.map(s => s.id)], []);
  const activeId = useActiveSection(sectionIds);
  const quizAnsweredCount = Object.keys(quizAnswers).filter(id => /^s\d+$/.test(id)).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        <details className="section meta" id="ruta">
          <summary className="sec-head">
            <span className="sec-num">🗺️</span>
            <h2 className="sec-title">Ruta de Aprendizaje</h2>
          </summary>
          <div className="sec-body">
            <Roadmap stages={roadmapStages} />
          </div>
        </details>

        <details className="section meta" id="glosario">
          <summary className="sec-head">
            <span className="sec-num">📖</span>
            <h2 className="sec-title">Glosario</h2>
          </summary>
          <div className="sec-body">
            <Glossary terms={glossaryTerms} />
          </div>
        </details>

        <details className="section meta" id="ejercicios">
          <summary className="sec-head">
            <span className="sec-num">🏋️</span>
            <h2 className="sec-title">Ejercicios Prácticos</h2>
            <span className="sec-tag">{exercises.length} ejercicios</span>
          </summary>
          <div className="sec-body">
            <Exercises exercises={exercises} />
          </div>
        </details>

        {sortedSections.map(s => (
          <SectionView key={s.id} data={s} quizAnswers={quizAnswers} onToggleOpen={markVisited} onAnswer={recordAnswer} />
        ))}
      </main>
    </>
  );
}
