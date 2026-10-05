// npm run verify:exercises [-- --offline]
//  - syntax + type-check every solution (ES/FR)
//  - validate the CI workflow YAML solutions
//  - run the fictional-site solutions against a local mock HTTPS server
//  - run multi-file solutions (A01 setup project, A09 retries, A11 reporter)
//  - unless --offline: run the solutions that target public practice sites for real
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';
import { generate, syntaxErrors } from './generate.mjs';
import { startMock } from './mock-server.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const bin = name => path.join(here, '..', 'node_modules', '.bin', name);
const offline = process.argv.includes('--offline');
const failures = [];
const step = (name, ok, detail = '') => {
  console.log(`${ok ? '✔' : '✘'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(name);
};
// async on purpose: the mock server lives in this process and must keep serving while Playwright runs
const run = (cmd, args, env = {}, cwd = here) =>
  new Promise(resolve => {
    const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit' });
    child.on('exit', code => resolve(code === 0));
    child.on('error', () => resolve(false));
  });

// 1. syntax
const syn = syntaxErrors();
syn.slice(0, 10).forEach(e => console.log(`   ${e.loc} ${e.num} ${e.message}`));
step('syntax of every solution', syn.length === 0, syn.length ? `${syn.length} errors` : '');

// 2. generate + type-check
const summary = generate();
step(`generated ${summary.specs} specs + ${summary.packages} packages`, summary.specs > 0);
step('type-check against @playwright/test', await run(bin('tsc'), ['-p', 'tsconfig.json']));

// 3. YAML
for (const { loc, num, text } of summary.yaml) {
  let ok = true, detail = '';
  try {
    const doc = loadYaml(text);
    ok = !!doc?.jobs && Object.keys(doc.jobs).length > 0;
    detail = Object.keys(doc.jobs ?? {}).join(', ');
  } catch (e) { ok = false; detail = String(e.message).split('\n')[0]; }
  step(`workflow YAML ${num} (${loc})`, ok, detail);
}

// stubs the exercises expect to find in the working directory
fs.writeFileSync(path.join(here, 'auth-userA.json'), '{"cookies":[],"origins":[]}');
fs.writeFileSync(path.join(here, 'auth-userB.json'), '{"cookies":[],"origins":[]}');
fs.rmSync(path.join(here, 'fixtures'), { recursive: true, force: true });
fs.mkdirSync(path.join(here, 'fixtures'));

// 4. fictional sites against the local mock
const server = await startMock();
for (const loc of ['es', 'fr']) {
  const env = { VERIFY_KIND: 'fiction', VERIFY_LOC: loc };
  step(`A04 HAR record (${loc})`, await run(bin('playwright'), ['test', 'A04'], { ...env, UPDATE_HAR: '1' }));
  step(`fictional-site solutions (${loc})`, await run(bin('playwright'), ['test'], env));
}
server.close();

// 5. multi-file packages
for (const loc of ['es', 'fr']) {
  for (const pkg of ['pkg-A09', 'pkg-A11', ...(offline ? [] : ['pkg-A01'])]) {
    const cwd = path.join(here, '.generated', loc, pkg);
    const env = pkg === 'pkg-A09' ? { CI: '1' } : {};
    // A09 must end "flaky" (failed, failed, passed) -> Playwright exits 0 for flaky tests
    const ok = await run(bin('playwright'), ['test', '-c', cwd], env, cwd);
    // A11 intentionally contains a failing test, so only check it produced the metrics file
    if (pkg === 'pkg-A11') step(`${pkg} reporter (${loc})`, fs.existsSync(path.join(cwd, 'test-metrics.json')));
    else step(`${pkg} (${loc})`, ok);
  }
}

// 6. real public sites
if (!offline) {
  for (const loc of ['es', 'fr']) {
    step(`public-site solutions (${loc})`, await run(bin('playwright'), ['test', '--update-snapshots'], { VERIFY_KIND: 'real', VERIFY_LOC: loc }));
  }
}

console.log(failures.length ? `\n✘ ${failures.length} check(s) failed:\n  - ${failures.join('\n  - ')}` : '\n✔ all exercise checks passed');
process.exit(failures.length ? 1 : 0);
