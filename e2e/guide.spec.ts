import { test, expect, type Page } from '@playwright/test';

const exercisesSection = (page: Page) => page.locator('section#ejercicios, div#ejercicios').first();

const sidebarExercises = (page: Page) => page.locator('#sidebar a[href="#ejercicios"]');

async function openExercises(page: Page) {
  await sidebarExercises(page).click();
  await expect(exercisesSection(page)).toHaveClass(/open/);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); // app hydrated: keyboard shortcuts are registered
});

test.describe('language and metadata', () => {
  test('starts in Spanish and keeps <html lang> and the title in sync when switching to French', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page).toHaveTitle(/Paso a Paso/);

    await page.getByRole('button', { name: 'FR', exact: true }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page).toHaveTitle(/pas à pas/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fr_FR');
  });

  test('French content is loaded on demand and replaces the Spanish content', async ({ page }) => {
    const frenchChunk = page.waitForResponse(r => /\/assets\/.*\.js/.test(r.url()) && r.status() === 200 && /fr|sections/.test(r.url()), { timeout: 15_000 }).catch(() => null);
    await page.getByRole('button', { name: 'FR', exact: true }).click();
    await frenchChunk;
    await openExercises(page);
    await expect(page.locator('#ej-b01 .ex-title')).toHaveText('Ouvrir une page et vérifier le titre');
    await expect(page.locator('#ej-b01')).toContainText('Site réel');
  });

  test('remembers the chosen language after a reload', async ({ page }) => {
    await page.getByRole('button', { name: 'FR', exact: true }).click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });
});

test.describe('exercises section', () => {
  test('opens from the sidebar and closes with a second click, the header or the bottom button', async ({ page }) => {
    const section = exercisesSection(page);
    const sidebarLink = sidebarExercises(page);

    await sidebarLink.click();
    await expect(section).toHaveClass(/open/);

    await sidebarLink.click();
    await expect(section).not.toHaveClass(/open/);

    await sidebarLink.click();
    await expect(section).toHaveClass(/open/);
    await section.getByRole('button', { name: /Cerrar sección/ }).click();
    await expect(section).not.toHaveClass(/open/);

    await section.getByRole('button', { name: /Ejercicios Prácticos/ }).click();
    await expect(section).toHaveClass(/open/);
    await section.getByRole('button', { name: /Ejercicios Prácticos/ }).first().click();
    await expect(section).not.toHaveClass(/open/);
  });

  test('collapsed content is not reachable by keyboard (inert)', async ({ page }) => {
    const section = exercisesSection(page);
    await expect(section.locator('.sec-body-anim')).toHaveAttribute('inert', '');
    await openExercises(page);
    await expect(section.locator('.sec-body-anim')).not.toHaveAttribute('inert', '');
  });

  test('the header toggles with the keyboard', async ({ page }) => {
    const section = exercisesSection(page);
    const header = section.locator('.sec-head');
    await header.focus();
    await page.keyboard.press('Enter');
    await expect(section).toHaveClass(/open/);
    await page.keyboard.press('Space');
    await expect(section).not.toHaveClass(/open/);
  });

  test('a solution opens and can be closed in every way', async ({ page }) => {
    await openExercises(page);
    const card = page.locator('#ej-b01');
    const solution = card.locator('.cb');

    await card.getByRole('button', { name: /Ver solución/ }).click();
    await expect(solution).toBeVisible();
    await expect(solution).toContainText("toHaveTitle(/Playwright/)");

    await card.getByRole('button', { name: /Ocultar solución/ }).first().click();
    await expect(solution).toBeHidden();

    await card.getByRole('button', { name: /Ver solución/ }).click();
    await card.getByRole('button', { name: /▲ Ocultar solución/ }).click();
    await expect(solution).toBeHidden();

    await card.getByRole('button', { name: /Mostrar pista/ }).click();
    await card.getByRole('button', { name: /Ver solución/ }).click();
    await card.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await expect(solution).toBeHidden();
    await expect(card.locator('.ex-hint')).toBeHidden();
  });

  test('"Cerrar todas las soluciones" closes every open card', async ({ page }) => {
    await openExercises(page);
    // Bottom-to-top: opening a card pushes the ones below it down while it animates, so a lower card must not move under the cursor
    for (const id of ['ej-b02', 'ej-b01']) await page.locator(`#${id}`).getByRole('button', { name: /Ver solución/ }).click();
    await expect(page.locator('.ex-card .cb:visible')).toHaveCount(2);

    await page.getByRole('button', { name: 'Cerrar todas las soluciones' }).click();
    await expect(page.locator('.ex-card .cb:visible')).toHaveCount(0);
  });

  test('marking exercises as done updates the counters and survives a reload', async ({ page }) => {
    await openExercises(page);
    const progress = page.getByRole('status').filter({ hasText: 'hechos' });
    await expect(progress).toContainText('0 / 66');

    await page.locator('#ej-b01').getByRole('button', { name: 'Marcar como hecho' }).click();
    await page.locator('#ej-b02').getByRole('button', { name: 'Marcar como hecho' }).click();
    await expect(progress).toContainText('2 / 66');
    await expect(page.locator('#sidebar')).toContainText('2/66');

    await page.reload();
    await openExercises(page);
    await expect(page.getByRole('status').filter({ hasText: 'hechos' })).toContainText('2 / 66');

    await page.getByRole('button', { name: 'Hechos', exact: true }).click();
    await expect(page.locator('.ex-card')).toHaveCount(2);
    await page.getByRole('button', { name: 'Pendientes', exact: true }).click();
    await expect(page.locator('.ex-card')).toHaveCount(64);
  });

  test('filters by difficulty and text, shows an empty state and resets', async ({ page }) => {
    await openExercises(page);
    await page.getByRole('button', { name: /Avanzado \(/ }).click();
    await expect(page.locator('.ex-card').first()).toContainText('A01');
    await expect(page.locator('.ex-card', { hasText: 'B01' })).toHaveCount(0);

    await page.getByRole('button', { name: /^Todos \(/ }).click();
    await page.getByRole('searchbox', { name: 'Buscar ejercicio…' }).fill('iframe');
    await expect(page.locator('.ex-card', { hasText: 'iframes' })).toHaveCount(1);

    await page.getByRole('searchbox', { name: 'Buscar ejercicio…' }).fill('zzzz-no-existe');
    await expect(page.getByText('Ningún ejercicio coincide con el filtro.')).toBeVisible();
    await page.getByRole('button', { name: 'Limpiar filtros' }).click();
    await expect(page.locator('.ex-card')).toHaveCount(66);
  });

  test('the filter is kept when the section is collapsed and reopened', async ({ page }) => {
    await openExercises(page);
    await page.getByRole('button', { name: /Avanzado \(/ }).click();
    await exercisesSection(page).getByRole('button', { name: /Cerrar sección/ }).click();
    await openExercises(page);
    await expect(page.getByRole('button', { name: /Avanzado \(/ })).toHaveAttribute('aria-pressed', 'true');
  });

  test('the self-check list is stored per exercise', async ({ page }) => {
    await openExercises(page);
    const card = page.locator('#ej-b03');
    await card.getByRole('button', { name: /Autoevaluar/ }).click();
    await card.getByLabel('Uso assertions web-first (expect(locator)…)').check();
    await expect(card.getByRole('button', { name: /Autoevaluar.*\(1\/5\)/ })).toBeVisible();

    await page.reload();
    await openExercises(page);
    await expect(page.locator('#ej-b03').getByRole('button', { name: /Autoevaluar.*\(1\/5\)/ })).toBeVisible();
  });

  test('a runnable solution can be downloaded as a .spec.ts file', async ({ page }) => {
    await openExercises(page);
    const card = page.locator('#ej-b01');
    await card.getByRole('button', { name: /Ver solución/ }).click();
    const download = page.waitForEvent('download');
    await card.getByRole('button', { name: '⬇ .spec.ts' }).click();
    expect((await download).suggestedFilename()).toBe('B01.spec.ts');
  });

  test('every card shows what it runs against', async ({ page }) => {
    await openExercises(page);
    await expect(page.locator('#ej-b01 .ex-badge-real')).toBeVisible();
    await expect(page.locator('#ej-i06 .ex-badge-self')).toBeVisible();
    await expect(page.locator('#ej-a12 .ex-badge-fiction')).toBeVisible();
    await expect(page.locator('#ej-a19 .ex-badge-config')).toBeVisible();
  });
});

test.describe('global search', () => {
  test('Ctrl/Cmd+K finds an exercise-related section and navigates to it', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+K');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('combobox').fill('locators');
    await expect(dialog.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
  });

  test('Escape closes the search', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+K');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});

test.describe('lessons', () => {
  test('a lesson can be marked as completed and progress is remembered', async ({ page }) => {
    const first = page.locator('#s1');
    await first.locator('.sec-head').click();
    await first.getByRole('button', { name: /Marcar como completada/ }).click();
    await page.reload();
    await expect(page.locator('#sidebar a.done').first()).toBeVisible();
  });
});
