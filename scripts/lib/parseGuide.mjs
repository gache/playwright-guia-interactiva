// scripts/lib/parseGuide.mjs
const DIFF_MAP = { 'diff-b': 'beginner', 'diff-i': 'intermediate', 'diff-a': 'advanced' };

function text(el) {
  return el ? el.textContent.trim() : '';
}

function innerHtml(el) {
  return el ? el.innerHTML.trim() : '';
}

function buildGroupMap(document) {
  const groupById = new Map();
  let currentGroup = '';
  document.querySelectorAll('nav#sidebar .nav-group, nav#sidebar a[data-id]').forEach(el => {
    if (el.classList.contains('nav-group')) {
      currentGroup = text(el);
    } else {
      groupById.set(el.dataset.id, currentGroup);
    }
  });
  return groupById;
}

function parseDifficulty(summary) {
  const badge = summary.querySelector('.diff-badge');
  if (!badge) return undefined;
  const cls = [...badge.classList].find(c => DIFF_MAP[c]);
  return cls ? DIFF_MAP[cls] : undefined;
}

function parseCodeBlockEl(cbEl) {
  const langEl = cbEl.querySelector('.cb-head .lang');
  const langClass = [...(langEl?.classList ?? [])].find(c => c !== 'lang') ?? 'ts';
  return {
    label: text(langEl),
    langClass,
    code: text(cbEl.querySelector('pre')),
  };
}

function parseQuizEl(quizEl) {
  const id = quizEl.id.replace(/^quiz-/, '');
  const options = [...quizEl.querySelectorAll('.quiz-opt')].map(opt => {
    const spans = opt.querySelectorAll('span');
    return innerHtml(spans[1]);
  });
  const questionEl = quizEl.querySelector('.quiz-q');
  const questionHtml = innerHtml(questionEl).replace(/^<span class="quiz-icon">.*?<\/span>\s*/, '');
  return {
    type: 'quiz',
    id,
    isTeo: quizEl.classList.contains('quiz-teo'),
    questionHtml,
    options,
    answerIndex: parseInt(quizEl.dataset.answer, 10),
    explanationHtml: innerHtml(quizEl.querySelector('.quiz-explain')),
  };
}

function parseExerciseEl(exEl) {
  const solutionCb = exEl.querySelector('.solution .cb');
  return {
    type: 'exercise',
    title: text(exEl.querySelector(':scope > summary')),
    taskHtml: innerHtml(exEl.querySelector('.ex-task')),
    solution: solutionCb ? parseCodeBlockEl(solutionCb) : { label: 'Solución', langClass: 'ts', code: '' },
  };
}

function parseCompareEl(compareEl, precedingLabel) {
  const cbs = [...compareEl.querySelectorAll(':scope > .cb')];
  return {
    type: 'compare',
    title: precedingLabel,
    bad: parseCodeBlockEl(cbs[0]),
    good: parseCodeBlockEl(cbs[1]),
  };
}

function parseShortcutsEl(shortcutsEl) {
  const items = [...shortcutsEl.querySelectorAll(':scope > .sc')].map(scEl => ({
    keys: text(scEl.querySelector('kbd')),
    description: text(scEl.querySelector('.sc-desc')),
  }));
  return { type: 'shortcuts', items };
}

function parseCalloutEl(callEl) {
  const variant = [...callEl.classList].find(c => c !== 'call');
  const iconEl = callEl.querySelector('.call-icon');
  return {
    type: 'callout',
    variant,
    icon: text(iconEl),
    html: innerHtml(iconEl?.nextElementSibling ?? null),
  };
}

function parseSectionBody(bodyEl, warn) {
  const blocks = [];
  let description = '';
  let pendingLabel = '';

  for (const child of bodyEl.children) {
    if (child.matches('p.desc')) {
      description = innerHtml(child);
    } else if (child.matches('div.call')) {
      blocks.push(parseCalloutEl(child));
    } else if (child.matches('div.compare')) {
      blocks.push(parseCompareEl(child, pendingLabel));
      pendingLabel = '';
    } else if (child.matches('div.cb')) {
      blocks.push({ type: 'code', block: parseCodeBlockEl(child) });
    } else if (child.matches('details.exercise')) {
      blocks.push(parseExerciseEl(child));
    } else if (child.matches('div.quiz')) {
      blocks.push(parseQuizEl(child));
    } else if (child.matches('div.shortcuts')) {
      blocks.push(parseShortcutsEl(child));
    } else if (child.tagName === 'P' && !child.classList.contains('desc')) {
      pendingLabel = text(child);
    } else if (child.tagName === 'HR') {
      // layout-only, skip
    } else if (child.tagName === 'DIV' && (child.classList.contains('roadmap') || child.classList.contains('glossary'))) {
      // handled separately by parseGuideDocument for the meta sections
    } else {
      blocks.push({ type: 'raw', html: child.outerHTML });
      warn(`unrecognized block: ${child.outerHTML.slice(0, 80)}`);
    }
  }
  return { description, blocks };
}

function parseSection(sectionEl, groupById, warn) {
  const summary = sectionEl.querySelector('summary.sec-head');
  const titleEl = summary.querySelector('.sec-title');
  const tagEl = titleEl.querySelector('.sec-tag');
  const tag = tagEl ? text(tagEl) : undefined;

  const titleClone = titleEl.cloneNode(true);
  const tagInClone = titleClone.querySelector('.sec-tag');
  if (tagInClone) tagInClone.remove();

  const { description, blocks } = parseSectionBody(sectionEl.querySelector('.sec-body'), warn);

  return {
    id: sectionEl.id,
    num: text(summary.querySelector('.sec-num')),
    group: groupById.get(sectionEl.id) ?? '',
    title: text(titleClone),
    ...(tag ? { tag } : {}),
    ...(parseDifficulty(summary) ? { difficulty: parseDifficulty(summary) } : {}),
    description,
    blocks,
  };
}

function parseRoadmap(document) {
  return [...document.querySelectorAll('#ruta .road-stage')].map(stageEl => {
    const range = text(stageEl.querySelector('.road-range'));
    const fullTitle = text(stageEl.querySelector('.road-title'));
    return {
      dot: text(stageEl.querySelector('.road-dot')),
      title: fullTitle.replace(range, '').trim(),
      range,
      descriptionHtml: innerHtml(stageEl.querySelector('.road-desc')),
    };
  });
}

function parseGlossary(document) {
  return [...document.querySelectorAll('#glosario .gloss-item')].map(itemEl => ({
    term: text(itemEl.querySelector('.gloss-term')),
    definitionHtml: innerHtml(itemEl.querySelector('.gloss-def')),
  }));
}

export function parseGuideDocument(document, { warn = console.warn } = {}) {
  const groupById = buildGroupMap(document);
  const sections = [...document.querySelectorAll('details.section:not(.meta)')].map(el =>
    parseSection(el, groupById, warn),
  );
  return {
    sections,
    roadmapStages: parseRoadmap(document),
    glossaryTerms: parseGlossary(document),
  };
}
