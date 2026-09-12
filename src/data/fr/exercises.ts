import type { Exercise } from '../../types';

export const exercises: Exercise[] = [
  {
    id: 'ej-b01',
    num: 'B01',
    title: 'Ouvrir une page et vérifier le titre',
    difficulty: 'beginner',
    description:
      'Naviguez vers `https://playwright.dev` et vérifiez que le titre du document contient le mot "Playwright".',
    hint: 'Utilisez `page.title()` pour récupérer le titre et `expect(title).toContain(...)` pour le vérifier.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier le titre de playwright.dev', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const title = await page.title();
  expect(title).toContain('Playwright');
});`,
  },
  {
    id: 'ej-b02',
    num: 'B02',
    title: 'Vérifier le texte visible sur la page',
    difficulty: 'beginner',
    description:
      'Naviguez vers `https://playwright.dev` et vérifiez que l\'en-tête principal contient le texte "Playwright".',
    hint: 'Utilisez `page.getByRole("heading", { level: 1 })` et `toBeVisible()`.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier l\'en-tête principal', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Playwright');
});`,
  },
  {
    id: 'ej-b03',
    num: 'B03',
    title: 'Cliquer sur un bouton',
    difficulty: 'beginner',
    description:
      'Utilisez la démo `https://demo.playwright.dev/todomvc`. Saisissez une tâche dans le champ texte et appuyez sur Entrée pour l\'ajouter. Vérifiez que la tâche apparaît dans la liste.',
    hint: 'Utilisez `page.getByPlaceholder(...)` pour le champ et `page.keyboard.press("Enter")`.',
    solution: `import { test, expect } from '@playwright/test';

test('ajouter une tâche dans TodoMVC', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Apprendre Playwright');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Apprendre Playwright')).toBeVisible();
});`,
  },
  {
    id: 'ej-b04',
    num: 'B04',
    title: 'Remplir le formulaire d\'inscription et l\'envoyer',
    difficulty: 'beginner',
    description:
      'Naviguez vers `https://practice.expandtesting.com/register`. Remplissez les champs Name, Email, Password et Confirm Password avec des données valides. Cliquez sur "Register" et vérifiez que le message de succès apparaît.',
    hint: 'Utilisez `getByPlaceholder("Name")` ou `getByLabel(...)` pour les champs. Le message de succès apparaît comme une alerte/toast verte.',
    solution: `import { test, expect } from '@playwright/test';

test('inscription sur practice.expandtesting.com', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  await page.getByPlaceholder('Name').fill('Ana García');
  await page.getByPlaceholder('Email').fill(\`ana\${Date.now()}@test.com\`);
  await page.getByPlaceholder('Password').fill('Test1234!');
  await page.getByPlaceholder('Confirm Password').fill('Test1234!');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText(/account created|registered successfully/i)).toBeVisible();
});`,
  },
  {
    id: 'ej-b05',
    num: 'B05',
    title: 'Naviguer en arrière et en avant',
    difficulty: 'beginner',
    description:
      'Visitez deux pages distinctes de `https://playwright.dev`, puis utilisez `goBack()` pour revenir en arrière et vérifiez l\'URL.',
    hint: 'Utilisez `page.goBack()` et `page.goForward()`. Vérifiez avec `expect(page).toHaveURL(...)`.',
    solution: `import { test, expect } from '@playwright/test';

test('navigation en arrière et en avant', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.goto('https://playwright.dev/docs/intro');
  await page.goBack();
  await expect(page).toHaveURL('https://playwright.dev/');
  await page.goForward();
  await expect(page).toHaveURL(/intro/);
});`,
  },
  {
    id: 'ej-b06',
    num: 'B06',
    title: 'Prendre une capture d\'écran',
    difficulty: 'beginner',
    description:
      'Naviguez vers une page quelconque et prenez une capture d\'écran complète. Enregistrez-la sous `page-complete.png`.',
    hint: 'Passez `{ fullPage: true }` à la méthode `screenshot()`.',
    solution: `import { test } from '@playwright/test';

test('capture d\'écran complète', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.screenshot({ path: 'page-complete.png', fullPage: true });
});`,
  },
  {
    id: 'ej-b07',
    num: 'B07',
    title: 'Attendre qu\'un élément soit visible',
    difficulty: 'beginner',
    description:
      'Naviguez vers une page avec du contenu chargé de façon asynchrone. Attendez qu\'un élément avec la classe `.results` soit visible avant de vérifier son texte.',
    hint: '`expect(locator).toBeVisible()` attend automatiquement. Vous pouvez aussi utiliser `locator.waitFor()`.',
    solution: `import { test, expect } from '@playwright/test';

test('attendre un élément asynchrone', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();
  const resultat = page.locator('#finish');
  await expect(resultat).toBeVisible({ timeout: 10_000 });
  await expect(resultat).toContainText('Hello World!');
});`,
  },
  {
    id: 'ej-b08',
    num: 'B08',
    title: 'Sélectionner une option dans un dropdown',
    difficulty: 'beginner',
    description:
      'Sur une page avec un `<select>`, sélectionnez une option spécifique par sa valeur et vérifiez qu\'elle est bien sélectionnée.',
    hint: 'Utilisez `page.selectOption(selector, valeur)` ou `locator.selectOption(valeur)`.',
    solution: `import { test, expect } from '@playwright/test';

test('sélectionner une option dans un dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.selectOption('#dropdown', '2');
  const selected = page.locator('#dropdown option:checked');
  await expect(selected).toHaveText('Option 2');
});`,
  },
  {
    id: 'ej-b09',
    num: 'B09',
    title: 'Cocher et décocher des cases',
    difficulty: 'beginner',
    description:
      'Trouvez une case à cocher sur une page, vérifiez qu\'elle est décochée, cochez-la puis vérifiez qu\'elle est cochée.',
    hint: 'Utilisez `locator.check()`, `locator.uncheck()` et `locator.isChecked()`.',
    solution: `import { test, expect } from '@playwright/test';

test('cocher une case', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const cb = page.locator('input[type="checkbox"]').first();
  await cb.uncheck();
  expect(await cb.isChecked()).toBe(false);
  await cb.check();
  expect(await cb.isChecked()).toBe(true);
});`,
  },
  {
    id: 'ej-b10',
    num: 'B10',
    title: 'Obtenir le texte de plusieurs éléments',
    difficulty: 'beginner',
    description:
      'Dans la démo TodoMVC, ajoutez 3 tâches distinctes. Récupérez ensuite tous les textes de la liste et vérifiez que les 3 tâches sont présentes.',
    hint: 'Utilisez `locator.allTextContents()` pour obtenir un tableau avec tous les textes.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier plusieurs tâches', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  for (const tache of ['Tâche 1', 'Tâche 2', 'Tâche 3']) {
    await input.fill(tache);
    await input.press('Enter');
  }
  const textes = await page.locator('.todo-list li label').allTextContents();
  expect(textes).toContain('Tâche 1');
  expect(textes).toContain('Tâche 2');
  expect(textes).toContain('Tâche 3');
});`,
  },
  {
    id: 'ej-b11',
    num: 'B11',
    title: 'Vérifier l\'URL actuelle',
    difficulty: 'beginner',
    description:
      'Cliquez sur un lien de navigation et vérifiez que l\'URL change vers la destination attendue à l\'aide d\'un matcher d\'URL.',
    hint: 'Utilisez `expect(page).toHaveURL(/motif/)` — accepte une chaîne, une regex ou une URL complète.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier le changement d\'URL', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/docs/);
});`,
  },
  {
    id: 'ej-b12',
    num: 'B12',
    title: 'Survoler un élément',
    difficulty: 'beginner',
    description:
      'Trouvez un élément qui révèle du contenu au passage du curseur. Effectuez un hover et vérifiez que le contenu caché devient visible.',
    hint: 'Utilisez `locator.hover()` puis `expect(locator).toBeVisible()`.',
    solution: `import { test, expect } from '@playwright/test';

test('le hover révèle du contenu', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');
  const card = page.locator('.figure').first();
  await card.hover();
  await expect(card.locator('.figcaption')).toBeVisible();
});`,
  },
  {
    id: 'ej-b13',
    num: 'B13',
    title: 'Vérifier qu\'un élément n\'existe PAS',
    difficulty: 'beginner',
    description:
      'Dans la démo TodoMVC sans tâches, vérifiez que la liste de tâches est vide (le compteur d\'éléments n\'est pas visible).',
    hint: 'Utilisez `expect(locator).not.toBeVisible()` ou `expect(locator).toHaveCount(0)`.',
    solution: `import { test, expect } from '@playwright/test';

test('liste vide au démarrage', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page.locator('.todo-list li')).toHaveCount(0);
  await expect(page.locator('.todo-count')).not.toBeVisible();
});`,
  },
  {
    id: 'ej-b14',
    num: 'B14',
    title: 'Compter les éléments d\'une liste',
    difficulty: 'beginner',
    description:
      'Ajoutez exactement 5 tâches dans TodoMVC et vérifiez qu\'il y a exactement 5 éléments dans la liste.',
    hint: 'Utilisez `expect(locator).toHaveCount(n)` pour vérifier le nombre exact d\'éléments.',
    solution: `import { test, expect } from '@playwright/test';

test('compter 5 tâches', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  for (let i = 1; i <= 5; i++) {
    await input.fill(\`Tâche \${i}\`);
    await input.press('Enter');
  }
  await expect(page.locator('.todo-list li')).toHaveCount(5);
});`,
  },
  {
    id: 'ej-b15',
    num: 'B15',
    title: 'Double-cliquer pour éditer',
    difficulty: 'beginner',
    description:
      'Dans TodoMVC, ajoutez une tâche. Double-cliquez dessus pour activer le mode édition et modifiez son texte.',
    hint: 'Utilisez `locator.dblclick()`. Le champ d\'édition apparaît avec la classe `.edit`.',
    solution: `import { test, expect } from '@playwright/test';

test('éditer une tâche par double-clic', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Texte original');
  await input.press('Enter');

  await page.locator('.todo-list li label').dblclick();
  await page.locator('.todo-list li .edit').fill('Texte modifié');
  await page.locator('.todo-list li .edit').press('Enter');

  await expect(page.getByText('Texte modifié')).toBeVisible();
});`,
  },
  {
    id: 'ej-b16',
    num: 'B16',
    title: 'Vérifier un attribut d\'élément',
    difficulty: 'beginner',
    description:
      'Vérifiez que le champ de recherche d\'une page possède l\'attribut `placeholder` correct et qu\'un lien a le `href` attendu.',
    hint: 'Utilisez `expect(locator).toHaveAttribute("nom", "valeur")`.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier les attributs', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('searchbox')).toHaveAttribute('placeholder', /search/i);
  await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', /docs/);
});`,
  },
  {
    id: 'ej-b17',
    num: 'B17',
    title: 'Appuyer sur des touches du clavier',
    difficulty: 'beginner',
    description:
      'Dans un champ texte, saisissez du contenu avec `fill`, puis sélectionnez tout avec `Ctrl+A` et supprimez-le avec `Delete`. Vérifiez que le champ est vide.',
    hint: 'Utilisez `page.keyboard.press("Control+A")` puis `"Delete"` ou `"Backspace"`.',
    solution: `import { test, expect } from '@playwright/test';

test('vider un champ avec le clavier', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('texte de test');
  await input.press('Control+A');
  await input.press('Delete');
  await expect(input).toHaveValue('');
});`,
  },
  {
    id: 'ej-b18',
    num: 'B18',
    title: 'Vérifier les classes CSS d\'un élément',
    difficulty: 'beginner',
    description:
      'Dans TodoMVC, complétez une tâche en cliquant sur sa case à cocher. Vérifiez que l\'élément `<li>` obtient la classe `completed`.',
    hint: 'Utilisez `expect(locator).toHaveClass(/completed/)` — accepte une regex.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier la classe completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Tâche à compléter');
  await input.press('Enter');

  await page.locator('.todo-list li .toggle').click();
  await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
});`,
  },
  {
    id: 'ej-b19',
    num: 'B19',
    title: 'Vérifier la valeur d\'un input',
    difficulty: 'beginner',
    description:
      'Remplissez un champ texte et vérifiez que sa valeur est exactement le texte saisi avant de le soumettre.',
    hint: 'Utilisez `expect(locator).toHaveValue("texte exact")`.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier la valeur d\'un input', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Ma tâche importante');
  await expect(input).toHaveValue('Ma tâche importante');
});`,
  },
  {
    id: 'ej-b20',
    num: 'B20',
    title: 'Filtrer les tâches complétées',
    difficulty: 'beginner',
    description:
      'Dans TodoMVC, ajoutez 3 tâches, complétez-en 2. Cliquez sur le filtre "Completed" et vérifiez que seules les 2 complétées apparaissent.',
    hint: 'Les filtres sont des liens : `getByRole("link", { name: "Completed" })`. Comptez ensuite les `.todo-list li`.',
    solution: `import { test, expect } from '@playwright/test';

test('filtrer les tâches complétées', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  for (const t of ['A', 'B', 'C']) { await input.fill(t); await input.press('Enter'); }
  const toggles = page.locator('.todo-list li .toggle');
  await toggles.nth(0).click();
  await toggles.nth(1).click();
  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveCount(2);
});`,
  },
  {
    id: 'ej-b21',
    num: 'B21',
    title: 'Faire défiler jusqu\'à un élément',
    difficulty: 'beginner',
    description:
      'Naviguez vers une page longue. Faites défiler jusqu\'à un élément hors du viewport et vérifiez qu\'il est visible.',
    hint: 'Utilisez `locator.scrollIntoViewIfNeeded()` puis `expect(locator).toBeInViewport()`.',
    solution: `import { test, expect } from '@playwright/test';

test('faire défiler jusqu\'à un élément', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();
});`,
  },
  {
    id: 'ej-b22',
    num: 'B22',
    title: 'Capture d\'écran d\'un élément',
    difficulty: 'beginner',
    description:
      'Prenez une capture d\'écran uniquement de l\'en-tête de la page (pas de toute la page) et enregistrez-la sous `header.png`.',
    hint: 'Utilisez `locator.screenshot({ path: "..." })` directement sur le locator de l\'élément.',
    solution: `import { test } from '@playwright/test';

test('capture d\'écran d\'un élément', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const header = page.locator('header').first();
  await header.screenshot({ path: 'header.png' });
});`,
  },
];
