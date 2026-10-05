// Turns every exercise solution (ES + FR) into runnable Playwright specs under verify/.generated
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '.generated');
const REAL = /(demo\.playwright\.dev|playwright\.dev|practice\.expandtesting)/;

export function loadExercises(loc) {
  const src = fs.readFileSync(path.join(here, '..', 'src', 'data', loc, 'exercises.ts'), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: 'commonjs', target: 'es2020' } }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', js)(mod.exports, mod);
  return mod.exports.exercises;
}

export const isCode = s => /from '@playwright|import |test\(|export default/.test(s) && !/^#/.test(s);

/** Syntax diagnostics for every code-like solution. Returns [{loc, num, message}] */
export function syntaxErrors() {
  const errors = [];
  for (const loc of ['es', 'fr']) {
    for (const ex of loadExercises(loc)) {
      if (!isCode(ex.solution)) continue;
      const tsx = /experimental-ct/.test(ex.solution);
      const r = ts.transpileModule(ex.solution, { reportDiagnostics: true, fileName: tsx ? 'x.tsx' : 'x.ts', compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 } });
      for (const d of r.diagnostics ?? []) {
        const { line } = ts.getLineAndCharacterOfPosition(d.file, d.start);
        errors.push({ loc, num: ex.num, message: `L${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}` });
      }
    }
  }
  return errors;
}

export function generate() {
  fs.rmSync(out, { recursive: true, force: true });
  const summary = { specs: 0, packages: 0, yaml: [] };
  for (const loc of ['es', 'fr']) {
    for (const ex of loadExercises(loc)) {
      const s = ex.solution;
      const dir = (...p) => path.join(out, loc, ...p);

      if (ex.num === 'A01') { // setup project + storageState
        const [setup, cfg] = s.split('// playwright.config.ts');
        fs.mkdirSync(dir('pkg-A01', 'tests'), { recursive: true });
        fs.writeFileSync(dir('pkg-A01', 'tests', 'auth.setup.ts'), setup.replace('// tests/auth.setup.ts', ''));
        fs.writeFileSync(dir('pkg-A01', 'playwright.config.ts'), cfg);
        fs.writeFileSync(dir('pkg-A01', 'tests', 'secure.spec.ts'), "import { test, expect } from '@playwright/test';\ntest('ya autenticado', async ({ page }) => {\n  await page.goto('/secure');\n  await expect(page.getByRole('heading', { level: 1 })).toContainText('Secure Area');\n});\n");
        summary.packages++; continue;
      }
      if (ex.num === 'A09') { // retries config + flaky spec
        const [cfg, spec] = s.split('// flaky.spec.ts');
        fs.mkdirSync(dir('pkg-A09'), { recursive: true });
        fs.writeFileSync(dir('pkg-A09', 'playwright.config.ts'), cfg.replace('// playwright.config.ts', ''));
        fs.writeFileSync(dir('pkg-A09', 'flaky.spec.ts'), spec);
        summary.packages++; continue;
      }
      if (ex.num === 'A03' || ex.num === 'A19') { summary.yaml.push({ loc, num: ex.num, text: s }); continue; }
      if (ex.num === 'A11') { // custom reporter
        fs.mkdirSync(dir('pkg-A11'), { recursive: true });
        fs.writeFileSync(dir('pkg-A11', 'metrics-reporter.ts'), s);
        fs.writeFileSync(dir('pkg-A11', 'playwright.config.ts'), "import { defineConfig } from '@playwright/test';\nexport default defineConfig({ reporter: [['list'], ['./metrics-reporter.ts']], use: { screenshot: 'only-on-failure' } });\n");
        fs.writeFileSync(dir('pkg-A11', 'a.spec.ts'), "import { test, expect } from '@playwright/test';\ntest('ok', async ({ page }) => { await page.setContent('<h1>x</h1>'); await expect(page.locator('h1')).toBeVisible(); });\ntest('falla', async ({ page }) => { await page.setContent('<h1>x</h1>'); await expect(page.locator('h2')).toBeVisible({ timeout: 500 }); });\n");
        summary.packages++; continue;
      }
      if (!/from '@playwright\/test'/.test(s) || /experimental-ct|defineConfig/.test(s) || !/test\(/.test(s)) continue; // helpers (A14), CT (A16)

      const kind = REAL.test(s) ? 'real' : 'fiction';
      fs.mkdirSync(dir(kind), { recursive: true });
      // page.request resolves DNS in Node (not in the browser), so it can't see the mock hosts: point it at the mock directly
      const code = ex.num === 'A18'
        ? s.replace(/new URL\((`[^`]*`), page\.url\(\)\)\.href/, 'new URL($1, "https://127.0.0.1:8443").href')
        : s;
      fs.writeFileSync(dir(kind, `${ex.num}.spec.ts`), code);
      summary.specs++;
    }
  }
  return summary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(generate());
