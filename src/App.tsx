import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { SectionView } from './components/Section';
import { Roadmap } from './components/Roadmap';
import { Glossary } from './components/Glossary';
import { inertWhen } from './a11y';
import { Exercises, DEFAULT_EXERCISE_FILTER, type ExerciseFilter } from './components/Exercises';
import { useProgress } from './hooks/useProgress';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useActiveSection } from './hooks/useActiveSection';
import { useLocale } from './context/LocaleContext';
import { useGuideData } from './data';
import { strings } from './data/strings';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { CommandPalette } from './components/CommandPalette';
import { buildIndex } from './search/searchIndex';
import type { SearchEntry } from './search/searchIndex';

const QUIZ_TOTAL = 29;

const DIFF_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

const META_IDS = ['ruta', 'glosario', 'ejercicios'];

/** Monotonic id: Date.now() is too coarse in Safari (consecutive clicks could share a value and be ignored) */
let requestCounter = 0;
const nextRequestId = () => ++requestCounter;

interface MetaRequest { id: string; target: string; n: number; toggle?: boolean }

/** Scroll to an element and flash it so the eye can find it. */
function revealElement(targetId: string) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  el.classList.remove('search-flash');
  void el.offsetWidth; // restart animation if already flashing
  el.classList.add('search-flash');
  window.setTimeout(() => el.classList.remove('search-flash'), 2200);
}

function MetaSection({ id, icon, title, badge, request, children }: {
  id: string; icon: string; title: string;
  badge?: React.ReactNode; request: MetaRequest | null; children: React.ReactNode;
}) {
  const { locale } = useLocale();
  const t = strings[locale];
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const handled = useRef<number | null>(null);
  const apply = (next: boolean) => { openRef.current = next; setOpen(next); };
  const toggle = () => apply(!openRef.current);

  // Opened from the global search or the sidebar: expand (sidebar clicks toggle), then reveal the target
  useEffect(() => {
    if (!request || request.id !== id || handled.current === request.n) return;
    handled.current = request.n;
    if (request.toggle && openRef.current) {
      apply(false);
      return;
    }
    apply(true);
    window.setTimeout(() => revealElement(request.target), 420);
  }, [request, id]);
  return (
    <div className={`section meta${open ? ' open' : ''}`} id={id}>
      <div className="sec-head" onClick={toggle} role="button" tabIndex={0}
        aria-expanded={open} aria-controls={`${id}-body`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}>
        <span className="sec-num">{icon}</span>
        <h2 className="sec-title">{title}{badge}</h2>
        <span className="sec-chevron">▶</span>
      </div>
      <div className="sec-body-anim" id={`${id}-body`} aria-hidden={!open} {...inertWhen(!open)}>
        <div className="sec-body-clip">
          <div className="sec-body">
            {children}
            <button type="button" className="meta-collapse" onClick={toggle}>▲ {t.collapseSection}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { locale } = useLocale();
  const t = strings[locale];
  const { data: guide } = useGuideData(locale);
  const { sections, exercises, glossaryTerms, roadmapStages } = guide;

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

  const { visited, quizAnswers, markVisited, markUnvisited, recordAnswer, doneExercises, checks, toggleExercise, toggleCheck } = useProgress();
  const [exerciseFilter, setExerciseFilter] = useState<ExerciseFilter>(DEFAULT_EXERCISE_FILTER);
  const scrollPct = useScrollProgress();
  const sectionIds = useMemo(() => ['ruta', 'glosario', 'ejercicios', ...sortedSections.map(s => s.id)], [sortedSections]);
  const activeId = useActiveSection(sectionIds);
  const quizAnsweredCount = Object.keys(quizAnswers).filter(id => /^s\d+$/.test(id)).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [diffFilter, setDiffFilter] = useState<Difficulty>('all');
  const [requestOpenId, setRequestOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [metaRequest, setMetaRequest] = useState<MetaRequest | null>(null);

  const searchIndex = useMemo(() => buildIndex({
    sections: sortedSections,
    exercises,
    glossary: glossaryTerms,
    pages: [
      { id: 'ruta', title: t.roadmapTitle },
      { id: 'glosario', title: t.glossaryTitle },
      { id: 'ejercicios', title: t.exercisesTitle },
    ],
  }), [sortedSections, exercises, glossaryTerms, t]);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  // Global shortcuts: Ctrl/Cmd+K toggles, "/" opens (unless typing somewhere)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = e.target as HTMLElement | null;
        const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sidebar links to meta sections (#ruta, #glosario, #ejercicios): expand the accordion too
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('nav a[href^="#"]');
      const id = a?.getAttribute('href')?.slice(1);
      if (id && META_IDS.includes(id)) setMetaRequest({ id, target: id, n: nextRequestId(), toggle: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function handleSearchSelect(entry: SearchEntry) {
    setSearchOpen(false);
    setSidebarOpen(false);
    window.history.replaceState(null, '', `#${entry.id}`);
    if (entry.kind === 'section') {
      setDiffFilter('all');
      setRequestOpenId(entry.id);
    } else if (entry.kind === 'page') {
      setMetaRequest({ id: entry.id, target: entry.id, n: nextRequestId() });
    } else {
      setMetaRequest({ id: entry.parent ?? entry.id, target: entry.id, n: nextRequestId() });
    }
  }

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
        exercisesDone={doneExercises.filter(id => exercises.some(e => e.id === id)).length}
        exercisesTotal={exercises.length}
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

          <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={t.searchTriggerAria}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <span className="search-trigger-text">{t.searchTrigger}</span>
            <span className="search-trigger-keys" aria-hidden="true"><kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
          </button>

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
          <MetaSection id="ruta" icon="🗺️" title={t.roadmapTitle} request={metaRequest}>
            <Roadmap stages={roadmapStages} />
          </MetaSection>
          <MetaSection id="glosario" icon="📖" title={t.glossaryTitle} request={metaRequest}>
            <Glossary terms={glossaryTerms} />
          </MetaSection>
          <MetaSection id="ejercicios" icon="🏋️" title={t.exercisesTitle} request={metaRequest}
            badge={<span className="sec-tag">{t.exercisesBadge(exercises.length)}</span>}>
            <Exercises
              exercises={exercises}
              doneIds={doneExercises}
              checks={checks}
              onToggleDone={toggleExercise}
              onToggleCheck={toggleCheck}
              filter={exerciseFilter}
              onFilterChange={setExerciseFilter}
            />
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
      <CommandPalette
        open={searchOpen}
        index={searchIndex}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </>
  );
}
