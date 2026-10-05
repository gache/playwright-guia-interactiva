import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useLocale } from '../context/LocaleContext';
import { strings } from '../data/strings';
import { highlightSegments, search, tokenize } from '../search/searchIndex';
import type { SearchEntry, SearchKind, SearchResult } from '../search/searchIndex';

const DIFF_SUFFIX = { beginner: 'b', intermediate: 'i', advanced: 'a' } as const;
const KIND_ORDER: SearchKind[] = ['page', 'section', 'exercise', 'glossary'];
const PER_KIND = 8;

interface CommandPaletteProps {
  open: boolean;
  index: SearchEntry[];
  onClose: () => void;
  onSelect: (entry: SearchEntry) => void;
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  return (
    <>
      {highlightSegments(text, tokens).map((seg, i) =>
        seg.match ? <mark key={i} className="cp-mark">{seg.text}</mark> : <span key={i}>{seg.text}</span>,
      )}
    </>
  );
}

function KindIcon({ kind }: { kind: SearchKind }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (kind) {
    case 'section':
      return <svg {...common}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3" /></svg>;
    case 'exercise':
      return <svg {...common}><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13.5 5-3 14" /></svg>;
    case 'glossary':
      return <svg {...common}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M9 9h6M9 13h4" /></svg>;
    default:
      return <svg {...common}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  }
}

export function CommandPalette({ open, index, onClose, onSelect }: CommandPaletteProps) {
  const { locale } = useLocale();
  const t = strings[locale];
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const uid = useId();
  const deferred = useDeferredValue(query);
  const tokens = useMemo(() => tokenize(deferred), [deferred]);

  const KIND_LABEL: Record<SearchKind, string> = {
    page: t.searchSuggested,
    section: t.searchKindSection,
    exercise: t.searchKindExercise,
    glossary: t.searchKindGlossary,
  };

  // grouped + flattened results (flat order drives keyboard navigation)
  const { groups, flat } = useMemo(() => {
    let results: SearchResult[];
    if (tokens.length === 0) {
      results = index
        .filter(e => e.kind === 'page')
        .map(entry => ({ entry, score: 0, snippet: '' }));
    } else {
      results = search(index, deferred, 200);
    }
    const byKind = new Map<SearchKind, SearchResult[]>();
    for (const r of results) {
      const list = byKind.get(r.entry.kind) ?? [];
      if (list.length < PER_KIND) list.push(r);
      byKind.set(r.entry.kind, list);
    }
    const ordered = KIND_ORDER
      .filter(k => byKind.has(k))
      // groups with the strongest hit first; stable fallback to KIND_ORDER
      .sort((a, b) => (byKind.get(b)![0].score - byKind.get(a)![0].score));
    const groups = ordered.map(kind => ({ kind, items: byKind.get(kind)! }));
    return { groups, flat: groups.flatMap(g => g.items) };
  }, [index, deferred, tokens.length]);

  // reset / focus management
  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setActive(0);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        document.body.style.overflow = '';
        returnFocusRef.current?.focus?.();
      };
    }
  }, [open]);

  useEffect(() => { setActive(0); }, [deferred]);

  // Escape works even if focus is not inside the dialog yet
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  // keep the active row in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (flat.length) setActive(a => (a + 1) % flat.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (flat.length) setActive(a => (a - 1 + flat.length) % flat.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flat[active]) onSelect(flat[active].entry);
        break;
      case 'Tab':
        // single-field dialog: keep focus on the input
        e.preventDefault();
        inputRef.current?.focus();
        break;
    }
  }

  const listId = `${uid}-list`;
  const optId = (i: number) => `${uid}-opt-${i}`;
  let runningIdx = -1;

  return (
    <div className="cp-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="cp-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t.searchDialogAria}
        onKeyDown={onKeyDown}
      >
        <div className="cp-input-row">
          <svg className="cp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            className="cp-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={flat.length ? optId(active) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={t.searchInputPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="cp-close" onClick={onClose} aria-label={t.searchCloseAria}>esc</button>
        </div>

        <div className="cp-list" id={listId} role="listbox" ref={listRef}>
          {tokens.length > 0 && flat.length === 0 && (
            <div className="cp-empty">
              <p className="cp-empty-title">{t.searchNoResults(query.trim())}</p>
              <p className="cp-empty-hint">{t.searchNoResultsHint}</p>
            </div>
          )}

          {groups.map(({ kind, items }) => (
            <div className="cp-group" key={kind} role="group" aria-label={KIND_LABEL[kind]}>
              <div className="cp-group-title">{KIND_LABEL[kind]}</div>
              {items.map(({ entry, snippet }) => {
                runningIdx += 1;
                const idx = runningIdx;
                return (
                  <div
                    key={`${entry.kind}-${entry.id}`}
                    id={optId(idx)}
                    data-idx={idx}
                    role="option"
                    aria-selected={idx === active}
                    className={`cp-item${idx === active ? ' active' : ''}`}
                    onMouseMove={() => idx !== active && setActive(idx)}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => onSelect(entry)}
                  >
                    <span className={`cp-icon cp-icon-${entry.kind}`}><KindIcon kind={entry.kind} /></span>
                    <span className="cp-item-main">
                      <span className="cp-item-title">
                        {entry.num && <span className="cp-num">{entry.num}</span>}
                        <span className="cp-title-text"><Highlight text={entry.title} tokens={tokens} /></span>
                        {entry.difficulty && <span className={`cp-dot diff-${DIFF_SUFFIX[entry.difficulty]}`} />}
                      </span>
                      {snippet && (
                        <span className="cp-item-snippet"><Highlight text={snippet} tokens={tokens} /></span>
                      )}
                    </span>
                    <span className="cp-enter" aria-hidden="true">↵</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cp-footer" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> {t.searchHintNav}</span>
          <span><kbd>↵</kbd> {t.searchHintOpen}</span>
          <span><kbd>esc</kbd> {t.searchHintClose}</span>
          {tokens.length > 0 && <span className="cp-count">{t.searchResultsCount(flat.length)}</span>}
        </div>
        <div className="sr-only" aria-live="polite">
          {tokens.length > 0 ? t.searchResultsCount(flat.length) : ''}
        </div>
      </div>
    </div>
  );
}
