import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import { exercises as es } from './es/exercises';
import { exercises as fr } from './fr/exercises';
import { sections as sectionsEs } from './es/sections';
import { sections as sectionsFr } from './fr/sections';
import type { CodeBlockData, Exercise } from '../types';

const LOCALES: [string, Exercise[]][] = [['es', es], ['fr', fr]];

/** Patterns the official best-practices guide discourages. Each one is checked on code lines only (comments may mention them). */
const ANTI_PATTERNS: [string, RegExp][] = [
  ['fixed sleep (waitForTimeout)', /waitForTimeout\(/],
  ["networkidle (discouraged: flaky with polling/websockets)", /networkidle/],
  ['legacy page.click/fill/type/check/selectOption/setInputFiles(selector)', /\bpage\.(click|fill|type|check|uncheck|selectOption|setInputFiles|dblclick|hover|press)\(/],
  ['waitForSelector (use locators + web-first assertions)', /waitForSelector\(/],
  ['page.$ / page.$$ element handles', /page\.\$\$?\(/],
  ['force: true bypasses actionability checks', /force:\s*true/],
  ['test.each does not exist in Playwright', /test\.each\(/],
  ['manual isVisible() assertion (use expect(locator).toBeVisible())', /expect\(await [^)]*\.isVisible\(\)\)/],
  ['test.only left in code', /test\.only\(/],
  ['unreliable third-party host (the-internet.herokuapp.com returns intermittent 503)', /herokuapp\.com/],
];

const codeLines = (code: string) => code.split('\n').filter(l => !/^\s*(\/\/|#|\*|\/\*)/.test(l));

describe.each(LOCALES)('exercise quality (%s)', (_loc, list) => {
  it('has unique ids and numbers that match the difficulty prefix', () => {
    expect(new Set(list.map(e => e.id)).size).toBe(list.length);
    expect(new Set(list.map(e => e.num)).size).toBe(list.length);
    const prefix = { beginner: 'B', intermediate: 'I', advanced: 'A' } as const;
    for (const e of list) expect(e.num[0], e.id).toBe(prefix[e.difficulty]);
  });

  it('every exercise has a title, description, hint and solution', () => {
    for (const e of list) {
      for (const f of ['title', 'description', 'hint', 'solution'] as const) {
        expect(e[f].trim().length, `${e.num}.${f}`).toBeGreaterThan(8);
      }
    }
  });

  it('every code solution parses (no unescaped quotes or broken templates)', () => {
    for (const e of list) {
      if (/^#|runs-on:/.test(e.solution)) continue; // YAML
      const tsx = /experimental-ct/.test(e.solution);
      const out = ts.transpileModule(e.solution, {
        reportDiagnostics: true,
        fileName: tsx ? 'x.tsx' : 'x.ts',
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 },
      });
      const msgs = (out.diagnostics ?? []).map(d => ts.flattenDiagnosticMessageText(d.messageText, ' '));
      expect(msgs, `${e.num} has syntax errors`).toEqual([]);
    }
  });

  it('solutions avoid the anti-patterns the official guide discourages', () => {
    const offenders: string[] = [];
    for (const e of list) {
      for (const line of codeLines(e.solution)) {
        for (const [name, re] of ANTI_PATTERNS) if (re.test(line)) offenders.push(`${e.num}: ${name} → ${line.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('solutions with tests use at least one web-first assertion or a documented alternative', () => {
    for (const e of list) {
      if (!/\btest\(/.test(e.solution) || /defineConfig/.test(e.solution)) continue;
      const ok = /expect(\.soft|\.poll)?\(/.test(e.solution) || /screenshot\(|checkA11y|waitForResponse|waitForEvent|dragTo/.test(e.solution);
      expect(ok, `${e.num} should assert something`).toBe(true);
    }
  });
});

describe.each([['es', sectionsEs], ['fr', sectionsFr]] as const)('lesson code quality (%s)', (_loc, sections) => {
  const blocks: { where: string; block: CodeBlockData }[] = [];
  for (const s of sections) {
    s.blocks.forEach((b, i) => {
      if (b.type === 'code') blocks.push({ where: `${s.id}#${i}`, block: b.block });
      if (b.type === 'compare') blocks.push({ where: `${s.id}#${i} (good)`, block: b.good });
      if (b.type === 'exercise') blocks.push({ where: `${s.id}#${i} (solution)`, block: b.solution });
    });
  }

  it('"good" examples and solutions never use fixed sleeps or force clicks', () => {
    const offenders = blocks
      .filter(({ block }) => block.langClass !== 'bad')
      .flatMap(({ where, block }) => codeLines(block.code)
        .filter(l => /waitForTimeout\(|force:\s*true/.test(l))
        .map(l => `${where}: ${l.trim()}`));
    expect(offenders).toEqual([]);
  });

  it('every code block parses as TypeScript/JavaScript (shell and config excluded)', () => {
    for (const { where, block } of blocks) {
      if (block.langClass === 'sh' || block.langClass === 'cfg') continue;
      const out = ts.transpileModule(block.code, { reportDiagnostics: true, fileName: 'x.ts', compilerOptions: { target: ts.ScriptTarget.ES2022 } });
      // Lessons show fragments (top-level await, partial snippets, ellipses) so only hard syntax errors about strings/templates matter
      const bad = (out.diagnostics ?? []).filter(d => /Unterminated|unterminated/.test(ts.flattenDiagnosticMessageText(d.messageText, ' ')));
      expect(bad.map(d => d.messageText), where).toEqual([]);
    }
  });
});
