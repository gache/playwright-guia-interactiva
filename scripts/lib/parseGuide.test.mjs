// scripts/lib/parseGuide.test.mjs
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { parseGuideDocument } from './parseGuide.mjs';

const FIXTURE = `
<!doctype html><html><body>
<nav id="sidebar">
  <div class="nav-group">Fundamentos</div>
  <a data-id="s1">01 Instalación</a>
</nav>
<main>
  <details class="section meta" id="ruta">
    <summary class="sec-head"><span class="sec-num">🗺️</span><h2 class="sec-title">Ruta de Aprendizaje</h2></summary>
    <div class="sec-body">
      <div class="roadmap">
        <div class="road-stage">
          <div class="road-dot">1</div>
          <div>
            <div class="road-title">Fundamentos<span class="road-range">Secciones 01–03</span></div>
            <div class="road-desc">Instala <code>Playwright</code>.</div>
          </div>
        </div>
      </div>
    </div>
  </details>
  <details class="section meta" id="glosario">
    <summary class="sec-head"><span class="sec-num">📖</span><h2 class="sec-title">Glosario</h2></summary>
    <div class="sec-body">
      <div class="glossary">
        <div class="gloss-item"><div class="gloss-term">Locator</div><div class="gloss-def">Una <code>receta</code>.</div></div>
      </div>
    </div>
  </details>
  <details class="section" id="s1">
    <summary class="sec-head">
      <span class="sec-num">01</span>
      <h2 class="sec-title">Instalación <span class="sec-tag new">Nuevo</span></h2>
      <span class="diff-badge diff-b">🟢 Principiante</span>
    </summary>
    <div class="sec-body">
      <p class="desc">Cómo instalar <code>Playwright</code>.</p>
      <div class="call info"><span class="call-icon">📋</span><span>Necesitas <strong>Node.js</strong>.</span></div>
      <div class="cb">
        <div class="cb-head"><span class="lang sh">terminal</span></div>
        <pre><code>npm init playwright@latest</code></pre>
      </div>
      <p style="font-weight:500">❶ Selector frágil</p>
      <div class="compare">
        <div class="cb"><div class="cb-head"><span class="lang bad">❌ Frágil</span></div><pre><code>page.locator('.btn')</code></pre></div>
        <div class="cb"><div class="cb-head"><span class="lang good">✅ Robusto</span></div><pre><code>page.getByRole('button')</code></pre></div>
      </div>
      <details class="exercise">
        <summary>Ejercicio 1 — Instala el paquete</summary>
        <div class="ex-body">
          <p class="ex-task">Escribe el comando.</p>
          <details class="solution">
            <summary>Ver solución</summary>
            <div class="cb"><div class="cb-head"><span class="lang sh">Solución</span></div><pre><code>npm init playwright@latest</code></pre></div>
          </details>
        </div>
      </details>
      <div class="quiz" id="quiz-s1" data-answer="1">
        <p class="quiz-q"><span class="quiz-icon">🧠</span><strong>Autoevaluación</strong> — ¿Qué comando instala Playwright?</p>
        <div class="quiz-options">
          <button class="quiz-opt"><span class="quiz-letter">A</span><span>npm i</span></button>
          <button class="quiz-opt"><span class="quiz-letter">B</span><span>npm init playwright@latest</span></button>
        </div>
        <p class="quiz-explain" hidden>Ese es el comando oficial.</p>
      </div>
    </div>
  </details>
</main>
</body></html>`;

describe('parseGuideDocument', () => {
  const dom = new JSDOM(FIXTURE);
  const result = parseGuideDocument(dom.window.document);

  it('extracts one roadmap stage', () => {
    expect(result.roadmapStages).toEqual([
      { dot: '1', title: 'Fundamentos', range: 'Secciones 01–03', descriptionHtml: 'Instala <code>Playwright</code>.' },
    ]);
  });

  it('extracts one glossary term', () => {
    expect(result.glossaryTerms).toEqual([{ term: 'Locator', definitionHtml: 'Una <code>receta</code>.' }]);
  });

  it('extracts the section with group, title, tag, and difficulty', () => {
    expect(result.sections).toHaveLength(1);
    const s1 = result.sections[0];
    expect(s1.id).toBe('s1');
    expect(s1.num).toBe('01');
    expect(s1.group).toBe('Fundamentos');
    expect(s1.title).toBe('Instalación');
    expect(s1.tag).toBe('Nuevo');
    expect(s1.difficulty).toBe('beginner');
    expect(s1.description).toBe('Cómo instalar <code>Playwright</code>.');
  });

  it('extracts callout, code, compare, exercise, and quiz blocks in order', () => {
    const [callout, code, compare, exercise, quiz] = result.sections[0].blocks;
    expect(callout).toEqual({ type: 'callout', variant: 'info', icon: '📋', html: 'Necesitas <strong>Node.js</strong>.' });
    expect(code).toEqual({ type: 'code', block: { label: 'terminal', langClass: 'sh', code: "npm init playwright@latest" } });
    expect(compare).toEqual({
      type: 'compare',
      title: '❶ Selector frágil',
      bad: { label: '❌ Frágil', langClass: 'bad', code: "page.locator('.btn')" },
      good: { label: '✅ Robusto', langClass: 'good', code: "page.getByRole('button')" },
    });
    expect(exercise).toEqual({
      type: 'exercise',
      title: 'Ejercicio 1 — Instala el paquete',
      taskHtml: 'Escribe el comando.',
      solution: { label: 'Solución', langClass: 'sh', code: 'npm init playwright@latest' },
    });
    expect(quiz).toEqual({
      type: 'quiz',
      id: 's1',
      isTeo: false,
      questionHtml: '<strong>Autoevaluación</strong> — ¿Qué comando instala Playwright?',
      options: ['npm i', 'npm init playwright@latest'],
      answerIndex: 1,
      explanationHtml: 'Ese es el comando oficial.',
    });
  });
});
