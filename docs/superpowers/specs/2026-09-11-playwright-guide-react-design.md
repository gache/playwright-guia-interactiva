# Playwright Guide → React App — Design

**Date:** 2026-09-11
**Source:** `/Users/erickfranco/Downloads/playwright-guide-didactico_5.html` (single-file static HTML, 2646 lines)

## Goal

Port the existing static HTML study guide (31 sections on Playwright, in Spanish, with self-check quizzes, a glossary, a learning roadmap, and progress tracking) into a maintainable React application. The driving motivation is **maintainability**: the guide's content will keep growing (more sections, more quizzes), and hand-authored HTML with inline syntax-highlighting spans is already hard to extend. Moving to a data-driven React app separates content from rendering so new sections are additions to a data file, not new markup.

This is a content port, not a redesign — visual look, interactions, and behavior should match the original.

## What the original does

- Single HTML file, no backend, no build step.
- Sidebar nav: logo, search box (filters nav links by text, hides empty groups), two progress bars (sections visited X/31, quizzes answered X/29), difficulty legend, grouped links (Antes de Empezar, Fundamentos, Interacción, Validación, Avanzado, Práctica).
- Main content: page header, an info callout, then 31 `<details>` sections (collapsed by default) plus 2 non-counted "meta" sections (Ruta de Aprendizaje, Glosario).
- Each section: number, title, difficulty dot, description, one or more code blocks (hand-highlighted via `<span class="kw|fn|str|num|cmt|prop|bool">`), callout boxes (info/tip/warning), and (for most sections) a self-check quiz (multiple choice, disables after answering, shows correct/wrong + explanation).
- Sections 27–31 are special: Mini Proyecto (multi-file code), Errores Frecuentes, Preguntas de Entrevista, and two exercise banks (Ejercicios Prácticos, Ejercicios Teóricos) with their own quiz-style scoring (`quiz-teo`, separate answered/correct counter).
- Top scroll-progress bar (reading position).
- Active nav-link highlighting via `IntersectionObserver` as the user scrolls.
- Smooth-scroll on nav click; auto-opens a `<details>` if collapsed.
- "Visited" = user opened the `<details>` (toggle event), not just scrolled past.
- Copy-to-clipboard button per code block (`navigator.clipboard`, with `execCommand` fallback).
- Progress persistence in `localStorage` under key `pwguide_progress_v1`: `{ visited: string[], quiz: Record<sectionId, chosenOptionIndex> }`. Degrades gracefully (try/catch) if localStorage is unavailable or contains corrupt JSON.

## Approach

### Stack

Vite + React + TypeScript. No router — this stays a single page with anchor-based scrolling, matching the original. Next.js was considered but rejected: no backend, no multi-route need today.

### Data model (`src/data/`, `src/types.ts`)

All guide content lives as typed data, not JSX:

- `sections.ts` — array of all 31 sections. Each entry: `{ id, num, group, title, difficulty, description, calls: Callout[], codeBlocks: CodeBlock[], quiz?: Quiz }`.
- `glossary.ts` — array of `{ term, definition }`.
- `roadmap.ts` — array of learning stages `{ stage, title, range, description }`.
- Sections 27–31's special content (mini-project multi-file code, exercise banks with their own scoring) are modeled as the same `Section` shape with `codeBlocks`/`quiz` arrays sized accordingly — no separate one-off components.
- `CodeBlock` stores code as a **plain string** (language tagged), not pre-highlighted markup.

The sidebar nav is generated from `sections.ts` grouped by `group` — nav and content share one source of truth, so they can't drift out of sync the way hand-maintained HTML can.

### Components (`src/components/`)

- `Sidebar` — logo, search input, two progress bars, difficulty legend, grouped nav links.
- `Section` — renders one section as a collapsible `<details>`; fires `onToggle` to mark visited.
- `CodeBlock` — renders header (language badge + copy button) and syntax-highlighted code body.
- `Quiz` — renders question/options, handles answer selection, shows correct/wrong state + explanation, disables after answering.
- `Callout` — info/tip/warning box.
- `Roadmap`, `Glossary` — render the two "meta" sections' data.

Every component is a pure function of props — no component knows anything about Playwright-the-tool; they only know how to render their generic data shape.

### Syntax highlighting

Shiki (or Prism — final pick made during implementation) renders code from the plain-string data at display time. This replaces the original's hand-wrapped `<span class="kw">` etc. Trade-off accepted: colors may differ slightly from the original's manual highlighting, in exchange for zero per-code-block authoring overhead going forward.

### State & hooks (`src/hooks/`)

- `useProgress` — owns `visited: Set<string>` and `quizAnswers: Record<string, number>`. Hydrates from `localStorage['pwguide_progress_v1']` on mount (try/catch around both read and `JSON.parse`; falls back to empty state on missing key, unavailable storage, or corrupt JSON). Persists on every change. Exposes `markVisited(id)` and `recordAnswer(id, idx)`.
- `useActiveSection` — `IntersectionObserver` over rendered section elements, exposes the currently active section id for nav highlighting.
- `useScrollProgress` — window scroll listener, exposes reading-progress percentage for the top bar.

Derived stats (sections visited X/31, quizzes answered X/29, and the section-31 answered/correct counter) are computed from `visited.size` / `Object.keys(quizAnswers).length` — not stored separately, avoiding double state.

### Styling

Original `<style>` block (CSS custom properties, dark theme, ~300 lines) ported nearly as-is into a single global `src/index.css`. Same class names and variables where practical, so the visual result matches the source HTML. No CSS Modules split — not enough maintainability payoff to justify the refactor for a single-theme, single-page app.

## Error handling / edge cases

- `localStorage` unavailable (private browsing, blocked): `useProgress` catches and falls back to in-memory-only state, matching original behavior.
- Corrupt JSON in the stored progress key: caught during parse, falls back to empty `{ visited: [], quiz: {} }`.
- Sidebar search: filters nav links by substring match (case-insensitive) against link text; a `nav-group` header hides itself when every link under it is filtered out. Implemented as derived/filtered render state, not direct DOM manipulation (the original's approach).
- Quiz already answered: options render `disabled`, further clicks are no-ops — same guard as original (`if (quizEl.classList.contains('answered')) return`).

## Testing

Vitest + React Testing Library (Vite-native fit).

- `useProgress`: persists and restores visited/quiz state; handles missing key and corrupt JSON gracefully.
- `Quiz`: selecting an option marks correct/wrong, shows explanation, disables further input.
- `Sidebar` search: filters links by text, hides groups with zero visible links.
- `App` smoke test: renders all 31 sections plus the 2 meta sections.

No E2E suite — this is static, interactive content; unit/component coverage is sufficient. (Note: the source project directory is named `app_playwrigth`, which the user may later use for actual Playwright E2E work against this or other apps — out of scope for this spec.)

## Out of scope

- Visual redesign — this is a faithful port, not a restyle.
- Routing / multi-guide support — noted as a possible future direction (see roadmap motivation) but not built now.
- Backend/API, auth, multi-user progress sync — none exists in the original; none added here.
