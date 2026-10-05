import { describe, expect, it } from 'vitest';
import { buildIndex, fold, highlightSegments, search, stripHtml, tokenize } from './searchIndex';
import { getExercises, getGlossaryTerms, getSections } from '../data';

const index = buildIndex({
  sections: getSections('es'),
  exercises: getExercises('es'),
  glossary: getGlossaryTerms('es'),
  pages: [{ id: 'glosario', title: 'Glosario' }],
});

describe('search helpers', () => {
  it('folds accents and case', () => {
    expect(fold('Navegación ÁÉÍ')).toBe('navegacion aei');
    expect(tokenize('  Locators,  waits ')).toEqual(['locators', 'waits']);
  });

  it('strips html and entities', () => {
    expect(stripHtml('<p>a &lt;b&gt; <code>c</code></p>')).toBe('a <b> c');
  });

  it('highlights every token, accent-insensitive', () => {
    const segs = highlightSegments('Navegación de Página', ['navegacion', 'pagina']);
    expect(segs.filter(s => s.match).map(s => s.text)).toEqual(['Navegación', 'Página']);
  });
});

describe('search', () => {
  it('returns nothing for an empty query', () => {
    expect(search(index, '   ')).toEqual([]);
  });

  it('finds sections, exercises and glossary terms', () => {
    const kinds = new Set(search(index, 'locator', 200).map(r => r.entry.kind));
    expect(kinds.has('section')).toBe(true);
    expect(kinds.has('exercise')).toBe(true);
    expect(kinds.has('glossary')).toBe(true);
  });

  it('ranks a title hit above a body-only hit', () => {
    const results = search(index, 'locators');
    expect(results[0].entry.fTitle).toContain('locators');
  });

  it('is accent-insensitive', () => {
    expect(search(index, 'navegacion').length).toBe(search(index, 'navegación').length);
    expect(search(index, 'navegacion').length).toBeGreaterThan(0);
  });

  it('requires all tokens (AND)', () => {
    const broad = search(index, 'locators', 500).length;
    const narrow = search(index, 'locators zzzzqqq', 500).length;
    expect(narrow).toBe(0);
    expect(broad).toBeGreaterThan(0);
  });

  it('gives a snippet around a body match', () => {
    const r = search(index, 'getByRole', 5).find(x => x.snippet);
    expect(r?.snippet.toLowerCase()).toContain('getbyrole');
  });

  it('exercise entries point at the exercises meta section', () => {
    const ex = index.find(e => e.kind === 'exercise')!;
    expect(ex.parent).toBe('ejercicios');
  });
});
