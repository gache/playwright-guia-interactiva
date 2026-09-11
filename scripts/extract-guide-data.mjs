import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { parseGuideDocument } from './lib/parseGuide.mjs';

const sourcePath = process.argv[2]
  ? process.argv[2]
  : fileURLToPath(new URL('./source/playwright-guide-source.html', import.meta.url));

const html = readFileSync(sourcePath, 'utf-8');
const dom = new JSDOM(html);
const { sections, roadmapStages, glossaryTerms } = parseGuideDocument(dom.window.document);

function write(relativePath, typeName, varName, value) {
  const outPath = fileURLToPath(new URL(relativePath, import.meta.url));
  const body = `import type { ${typeName} } from '../types';\n\nexport const ${varName}: ${typeName}[] = ${JSON.stringify(value, null, 2)};\n`;
  writeFileSync(outPath, body);
  console.log(`Wrote ${relativePath} (${value.length} items)`);
}

write('../src/data/sections.ts', 'Section', 'sections', sections);
write('../src/data/roadmap.ts', 'RoadmapStage', 'roadmapStages', roadmapStages);
write('../src/data/glossary.ts', 'GlossaryTerm', 'glossaryTerms', glossaryTerms);
