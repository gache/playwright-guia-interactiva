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
import { useLocale } from './context/LocaleContext';
import { getSections, getExercises, getGlossaryTerms, getRoadmapStages } from './data';
import { strings } from './data/strings';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const QUIZ_TOTAL = 29;

const DIFF_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

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
  const { locale } = useLocale();
  const t = strings[locale];
  const sections = useMemo(() => getSections(locale), [locale]);
  const exercises = useMemo(() => getExercises(locale), [locale]);
  const glossaryTerms = useMemo(() => getGlossaryTerms(locale), [locale]);
  const roadmapStages = useMemo(() => getRoadmapStages(locale), [locale]);

  const sortedSections = useMemo(() => {
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
  }, [sections]);

  const DIFF_FILTERS: { key: Difficulty; label: string; count: number }[] = [
    { key: 'all', label: t.diffAll, count: sortedSections.length },
    { key: 'beginner', label: t.diffBeginner, count: sortedSections.filter(s => s.difficulty === 'beginner').length },
    { key: 'intermediate', label: t.diffIntermediate, count: sortedSections.filter(s => s.difficulty === 'intermediate').length },
    { key: 'advanced', label: t.diffAdvanced, count: sortedSections.filter(s => s.difficulty === 'advanced').length },
  ];

  const { visited, quizAnswers, markVisited, markUnvisited, recordAnswer } = useProgress();
  const scrollPct = useScrollProgress();
  const sectionIds = useMemo(() => ['ruta', 'glosario', 'ejercicios', ...sortedSections.map(s => s.id)], [sortedSections]);
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
      <a href="#main-content" className="skip-link">{t.skipLink}</a>
      <div id="progress" style={{ width: `${scrollPct}%` }} />
      <button
        className={`hamburger${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label={t.openNavAria}
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
          <LanguageSwitcher />
          <div className="page-head-badge">{t.pageHeadBadge}</div>
          <h1>
            {t.headTitlePrefix} <em>Playwright</em><br />
            <span className="page-head-sub">{t.headSubtitle}</span>
          </h1>
          <p>{t.intro}</p>

          {visited.length > 0 && (
            <div className="page-progress">
              <div className="page-progress-bar">
                <div className="page-progress-fill" style={{ width: `${completedPct}%` }} />
              </div>
              <span className="page-progress-label">
                {t.progressLabel(visited.length, sortedSections.length, completedPct)}
              </span>
            </div>
          )}

          <div className="page-stats">
            <div className="page-stat"><span className="page-stat-n">{sortedSections.length}</span><span className="page-stat-l">{t.statSections}</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">{QUIZ_TOTAL}</span><span className="page-stat-l">{t.statQuizzes}</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">{exercises.length}</span><span className="page-stat-l">{t.statExercises}</span></div>
            <div className="page-stat-div" />
            <div className="page-stat"><span className="page-stat-n">3</span><span className="page-stat-l">{t.statLevels}</span></div>
          </div>
          <div className="chips">
            <span className="chip g">{t.chipRoute}</span>
            <span className="chip g">{t.chipQuiz}</span>
            <span className="chip g">{t.chipGlossary}</span>
            <span className="chip g">{t.chipExercises}</span>
            <span className="chip g">{t.chipErrors}</span>
            <span className="chip g">{t.chipProject}</span>
            <span className="chip">{t.chipTs}</span>
            <span className="chip">{t.chipEs}</span>
          </div>
        </header>

        <div className="sections-grid">
          <MetaSection id="ruta" icon="🗺️" title={t.roadmapTitle}>
            <Roadmap stages={roadmapStages} />
          </MetaSection>
          <MetaSection id="glosario" icon="📖" title={t.glossaryTitle}>
            <Glossary terms={glossaryTerms} />
          </MetaSection>
          <MetaSection id="ejercicios" icon="🏋️" title={t.exercisesTitle}
            badge={<span className="sec-tag">{t.exercisesBadge(exercises.length)}</span>}>
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
              <p>{t.emptyStateText}</p>
              <button className="sec-complete-btn" onClick={() => setDiffFilter('all')}>{t.emptyStateBtn}</button>
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
