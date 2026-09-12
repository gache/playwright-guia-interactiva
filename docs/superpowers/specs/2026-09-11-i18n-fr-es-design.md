# i18n: French + Spanish language switch — Design

**Date:** 2026-09-11

## Goal

Add French as a second language for the Playwright guide, alongside the existing Spanish content. The user can switch languages via a control in the sidebar; the choice persists across visits. Both UI chrome (nav labels, buttons, filters) and guide content (sections, exercises, glossary, roadmap) are translated — this is a full bilingual app, not a partial UI-only translation.

## Current state

All guide content lives as typed data in `src/data/{sections,exercises,glossary,roadmap}.ts`, imported directly by `App.tsx` and passed down to `Section`, `Exercises`, `Glossary`, `Roadmap`. Text is Spanish, embedded as plain strings and HTML strings (`descriptionHtml`, `questionHtml`, etc.) per the `Section`/`Block`/`GlossaryTerm`/`RoadmapStage` types in `src/types.ts`. UI chrome strings (filter labels, buttons, aria-labels) are hardcoded inline in components (e.g. `DIFF_FILTERS` in `App.tsx`). Progress tracking (`useProgress`) keys visited sections and quiz answers by `Section.id`.

## Approach

Content is split into per-locale data modules with identical shape, rather than adding a locale dimension to every field (e.g. `{es: string, fr: string}` per field). This keeps `types.ts` and every content-consuming component unchanged — they just receive a different array depending on active locale. It also isolates translation as a data-authoring task (new files), not a refactor of existing render logic.

### Data layout

- `src/data/es/{sections,exercises,glossary,roadmap}.ts` — current content, moved as-is (no text changes).
- `src/data/fr/{sections,exercises,glossary,roadmap}.ts` — French translation, same shape, same order, **same `id` values** as the ES equivalents (section ids, quiz ids, exercise ids). Ids must stay stable across locales because `useProgress` persists progress by id — switching language mid-session must not lose or duplicate progress.
- `src/data/index.ts` — exports `getSections(locale)`, `getExercises(locale)`, `getGlossaryTerms(locale)`, `getRoadmapStages(locale)`, each a thin lookup into the es/fr module.
- `src/data/strings.ts` — new file, UI chrome dictionary: `{ es: {...}, fr: {...} }` covering filter labels (`Todos`/`Tous`, difficulty labels), search placeholder, progress bar labels, buttons, aria-labels — anything currently hardcoded inline in `App.tsx` and components.
- `src/types.ts` — unchanged.

### Locale state

- `src/context/LocaleContext.tsx` — new. `LocaleProvider` holds `locale: 'es' | 'fr'` and `setLocale`. Initial value: `localStorage['lang']` if present and valid, else `navigator.language.startsWith('fr') ? 'fr' : 'es'`. `setLocale` updates state and writes to `localStorage['lang']`.
- `useLocale()` hook reads the context.
- `main.tsx` wraps `<App>` in `<LocaleProvider>`.

### Components

- `App.tsx` replaces its direct `import { sections } from './data/sections'` (etc.) with `useLocale()` + `getSections(locale)` (etc.), recomputed via `useMemo` keyed on `locale`. `DIFF_FILTERS` labels and other inline chrome strings read from `strings[locale]`.
- `Sidebar` gets a new small `LanguageSwitcher` control near the logo/header — two buttons or a toggle (`ES`/`FR`), calls `setLocale` on click, highlights the active one.
- `Section`, `Exercises`, `Glossary`, `Roadmap`: no prop-shape changes — they keep rendering whatever array they're given. No changes needed beyond any inline chrome strings they own also moving to `strings.ts`.

### Content translation

All French content (`data/fr/*.ts`) is authored by translating the existing Spanish data files field-by-field: `title`, `description`/`descriptionHtml`, callout `html`, quiz `questionHtml`/`options`/`explanationHtml`, exercise `taskHtml`, glossary `definitionHtml`, roadmap `descriptionHtml`. Code (`CodeBlockData.code`) stays as-is except inline `#`/`//` comments, which are translated. HTML structure (tags, `<code>`/`<strong>` wrapping) is preserved exactly; only text nodes change.

## Testing

- Extend the existing `dataIntegrity.test.ts` to assert `fr` datasets have the same length, same `id` sequence (and same `num`/`group`/`difficulty` where applicable) as their `es` counterparts, for sections, exercises, glossary, and roadmap. This is the safety net against translation drift (a missing section, a renumbered id) — no runtime fallback logic is added to components for this; a data-shape mismatch should fail a test, not silently degrade at runtime.
- `LocaleContext`: unit test covering initial-locale resolution (localStorage hit, browser-French fallback, default-Spanish fallback) and that `setLocale` persists to localStorage.
- `App` smoke test extended to also render with `locale='fr'` and assert French chrome strings appear.
- Existing ES-focused tests (`Quiz`, `Sidebar` search, component tests) are unaffected since they exercise the same data shape, just from `data/es/`.

## Error handling / edge cases

- Unknown/corrupt `localStorage['lang']` value: treated as absent, falls through to browser-language detection.
- Switching locale mid-session: progress (`visited`, `quiz` answers) is unaffected since it's keyed by `id`, which is identical across locales.

## Out of scope

- Languages beyond French/Spanish.
- Per-field locale objects (`{es, fr}` inline in one data file) — rejected in favor of parallel modules, see Approach.
- Automatic re-translation tooling / translation-memory system — this is a one-time hand-authored (AI-assisted) translation of existing content.
