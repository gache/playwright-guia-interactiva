import type { Exercise } from '../../types';

export const exercises: Exercise[] = [
  {
    id: 'ej-b01',
    num: 'B01',
    title: 'Ouvrir une page et vérifier le titre',
    difficulty: 'beginner',
    description:
      'Naviguez vers `https://playwright.dev` et vérifiez que le titre du document contient le mot "Playwright".',
    hint: 'Utilisez l\'assertion web-first `expect(page).toHaveTitle(...)` — elle supporte les nouvelles tentatives automatiques contrairement à `await page.title()`.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier le titre de playwright.dev', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
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

test("vérifier l'en-tête principal", async ({ page }) => {
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
    hint: 'Utilisez `page.getByPlaceholder(...)` pour le champ, `locator.press("Enter")` pour valider et `getByTestId("todo-title")` pour la tâche. Dans de vraies suites, définissez `baseURL` dans `playwright.config.ts` et utilisez `page.goto(\'/chemin\')`.',
    solution: `import { test, expect } from '@playwright/test';

test('ajouter une tâche dans TodoMVC', async ({ page }) => {
  // Dans une vraie suite : définissez baseURL dans playwright.config.ts et utilisez page.goto('/todomvc')
  await page.goto('https://demo.playwright.dev/todomvc');
  const nouvelleTache = page.getByPlaceholder('What needs to be done?');
  await nouvelleTache.fill('Apprendre Playwright');
  await nouvelleTache.press('Enter');
  await expect(page.getByTestId('todo-title')).toHaveText('Apprendre Playwright');
});`,
  },
  {
    id: 'ej-b04',
    num: 'B04',
    title: 'Remplir le formulaire d\'inscription et l\'envoyer',
    difficulty: 'beginner',
    description:
      'Allez sur `https://practice.expandtesting.com/register`. Remplissez les champs Username, Password et Confirm Password avec des données valides. Cliquez sur "Register" et vérifiez que le site vous redirige vers le login avec le message de succès.',
    hint: 'Utilisez `getByLabel("Username")`, `getByLabel("Password", { exact: true })` et `getByLabel("Confirm Password")`. Générez un utilisateur unique à chaque exécution pour que le test soit répétable.',
    solution: `import { test, expect } from '@playwright/test';

test('inscription sur practice.expandtesting.com', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  // Utilisateur unique à chaque exécution : le test ne dépend pas de données préexistantes
  const password = 'Test1234!';
  await page.getByLabel('Username').fill(\`user-\${Date.now()}\`);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\\/login/);
  await expect(page.getByText('Successfully registered')).toBeVisible();
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

test("capture d'écran complète", async ({ page }) => {
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
      'Allez sur `https://practice.expandtesting.com/dynamic-loading/1`. Cliquez sur "Start" et attendez que le texte final soit visible avant de le vérifier.',
    hint: '`expect(locator).toBeVisible()` attend déjà automatiquement (réessaie jusqu\'au timeout). Pas besoin de `waitForTimeout`.',
    solution: `import { test, expect } from '@playwright/test';

test('attendre un élément asynchrone', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  // L'assertion réessaie toute seule ; on augmente seulement le timeout car le chargement prend ~5 s
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible({ timeout: 10_000 });
});`,
  },
  {
    id: 'ej-b08',
    num: 'B08',
    title: 'Sélectionner une option dans un dropdown',
    difficulty: 'beginner',
    description:
      'Sur `https://practice.expandtesting.com/dropdown`, sélectionnez l\'option de valeur `50` de la liste "Elements per Page" et vérifiez qu\'elle est sélectionnée.',
    hint: 'Localisez le `<select>` par son étiquette avec `getByLabel(...)`, utilisez `locator.selectOption(valeur)` et vérifiez avec `expect(locator).toHaveValue(valeur)`.',
    solution: `import { test, expect } from '@playwright/test';

test('sélectionner une option dans un dropdown', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dropdown');
  const perPage = page.getByLabel('Elements per Page');
  await perPage.selectOption('50');
  await expect(perPage).toHaveValue('50');
});`,
  },
  {
    id: 'ej-b09',
    num: 'B09',
    title: 'Cocher et décocher des cases',
    difficulty: 'beginner',
    description:
      'Sur `https://practice.expandtesting.com/checkboxes`, vérifiez que "Checkbox 1" est décoché, cochez-le et vérifiez qu\'il est coché. Décochez ensuite "Checkbox 2" (coché au départ) et vérifiez le changement.',
    hint: 'Utilisez `locator.check()`, `locator.uncheck()` et les assertions web-first `expect(locator).toBeChecked()` / `expect(locator).not.toBeChecked()`.',
    solution: `import { test, expect } from '@playwright/test';

test('cocher et décocher des cases', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/checkboxes');
  const checkbox1 = page.getByLabel('Checkbox 1');
  const checkbox2 = page.getByLabel('Checkbox 2');

  await expect(checkbox1).not.toBeChecked();
  await checkbox1.check();
  await expect(checkbox1).toBeChecked();

  await expect(checkbox2).toBeChecked();
  await checkbox2.uncheck();
  await expect(checkbox2).not.toBeChecked();
});`,
  },
  {
    id: 'ej-b10',
    num: 'B10',
    title: 'Obtenir le texte de plusieurs éléments',
    difficulty: 'beginner',
    description:
      'Dans la démo TodoMVC, ajoutez 3 tâches distinctes. Récupérez ensuite tous les textes de la liste et vérifiez que les 3 tâches sont présentes.',
    hint: 'Utilisez `getByTestId("todo-title")` et l\'assertion web-first `toHaveText([...])`, qui compare tout le tableau avec réessais. Évitez `allTextContents()` + `expect` simple : il ne réessaie pas.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier plusieurs tâches', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  const taches = ['Tâche 1', 'Tâche 2', 'Tâche 3'];
  for (const tache of taches) {
    await input.fill(tache);
    await input.press('Enter');
  }
  await expect(page.getByTestId('todo-title')).toHaveText(taches);
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

test("vérifier le changement d'URL", async ({ page }) => {
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
      'Sur `https://practice.expandtesting.com/hovers`, passez le curseur sur le premier avatar et vérifiez que ses informations masquées apparaissent ("name: user1").',
    hint: 'Utilisez `locator.hover()` puis une assertion web-first : `expect(locator).toBeVisible()`. Localisez avec `getByTestId`.',
    solution: `import { test, expect } from '@playwright/test';

test('le survol révèle du contenu', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/hovers');
  const user = page.getByTestId('user-1');
  const caption = user.getByRole('heading', { name: 'name: user1' });

  await expect(caption).toBeHidden();
  await user.hover();
  await expect(caption).toBeVisible();
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

test('liste vide au départ', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByTestId('todo-count')).toBeHidden();
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
  await expect(page.getByTestId('todo-item')).toHaveCount(5);
});`,
  },
  {
    id: 'ej-b15',
    num: 'B15',
    title: 'Double-cliquer pour éditer',
    difficulty: 'beginner',
    description:
      'Dans TodoMVC, ajoutez une tâche. Double-cliquez dessus pour activer le mode édition et modifiez son texte.',
    hint: 'Utilisez `locator.dblclick()`. Le champ d\'édition est un `textbox` au nom accessible "Edit" : `getByRole("textbox", { name: "Edit" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('éditer une tâche par double-clic', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Texte original');
  await input.press('Enter');

  const item = page.getByTestId('todo-item');
  await item.getByTestId('todo-title').dblclick();
  const edit = item.getByRole('textbox', { name: 'Edit' });
  await edit.fill('Texte modifié');
  await edit.press('Enter');

  await expect(item.getByTestId('todo-title')).toHaveText('Texte modifié');
});`,
  },
  {
    id: 'ej-b16',
    num: 'B16',
    title: 'Vérifier un attribut d\'élément',
    difficulty: 'beginner',
    description:
      'Dans la démo TodoMVC, vérifiez que le champ de nouvelle tâche a le bon `placeholder` et que le lien de filtre "Active" pointe vers le `href` attendu.',
    hint: 'Utilisez `expect(locator).toHaveAttribute("nom", "valeur")`.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier des attributs', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page.getByPlaceholder('What needs to be done?')).toHaveAttribute('placeholder', 'What needs to be done?');
  // Le lien n'apparaît que lorsqu'il y a des tâches : on en ajoute une d'abord
  await page.getByPlaceholder('What needs to be done?').fill('Tâche');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByRole('link', { name: 'Active' })).toHaveAttribute('href', '#/active');
});`,
  },
  {
    id: 'ej-b17',
    num: 'B17',
    title: 'Appuyer sur des touches du clavier',
    difficulty: 'beginner',
    description:
      'Dans un champ texte, saisissez du contenu avec `fill`, puis sélectionnez tout avec `Ctrl+A` et supprimez-le avec `Delete`. Vérifiez que le champ est vide.',
    hint: 'Utilisez `locator.press("ControlOrMeta+A")` (Ctrl sous Windows/Linux, Cmd sous macOS) puis `"Delete"`. Pour vider un champ, `locator.clear()` est encore plus direct.',
    solution: `import { test, expect } from '@playwright/test';

test('vider un champ au clavier', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('texte de test');
  // ControlOrMeta fonctionne sur tous les systèmes
  await input.press('ControlOrMeta+A');
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

  const item = page.getByTestId('todo-item');
  await item.getByRole('checkbox', { name: 'Toggle Todo' }).check();
  await expect(item).toHaveClass(/completed/);
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

test("vérifier la valeur d'un input", async ({ page }) => {
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
  for (const titulo of ['A', 'B', 'C']) {
    await input.fill(titulo);
    await input.press('Enter');
  }

  const items = page.getByTestId('todo-item');
  await items.filter({ hasText: 'A' }).getByRole('checkbox').check();
  await items.filter({ hasText: 'B' }).getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(items).toHaveText(['A', 'B']);
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

test("défiler jusqu'à un élément", async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const footer = page.getByRole('contentinfo');
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
    hint: 'Utilisez `locator.screenshot({ path: "..." })` sur le locator de l\'élément, p. ex. `getByRole("navigation", { name: "Main" })`.',
    solution: `import { test, expect } from '@playwright/test';

test("capture d'un élément", async ({ page }) => {
  await page.goto('https://playwright.dev');
  const header = page.getByRole('navigation', { name: 'Main' });
  await expect(header).toBeVisible();
  await header.screenshot({ path: 'header.png' });
});`,
  },

  // ─────────────────────────── INTERMÉDIAIRE ─────────────────────────────
  {
    id: 'ej-i01',
    num: 'I01',
    title: 'Gérer plusieurs onglets',
    difficulty: 'intermediate',
    description:
      'Cliquez sur un lien qui ouvre un nouvel onglet. Capturez la nouvelle page avec `context.waitForEvent("page")` et vérifiez son URL.',
    hint: 'Écoutez l\'événement `"page"` dans le contexte AVANT de cliquer sur le lien.',
    solution: `import { test, expect } from '@playwright/test';

test('gérer un nouvel onglet', async ({ page, context }) => {
  await page.goto('https://practice.expandtesting.com/windows');
  // Enregistrer l'attente AVANT le clic qui ouvre l'onglet
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newPage = await pagePromise;

  await expect(newPage).toHaveURL(/\\/windows\\/new/);
  await expect(newPage.getByRole('heading', { level: 1 })).toContainText('new window');
});`,
  },
  {
    id: 'ej-i02',
    num: 'I02',
    title: 'Intercepter les requêtes HTTP',
    difficulty: 'intermediate',
    description:
      'Écoutez les requêtes réseau de votre app et enregistrez leurs URLs. Vérifiez qu\'une requête `GET` vers l\'endpoint `/api/todos` a été effectuée au chargement de la page.',
    hint: 'Créez la promesse avec `page.waitForRequest(...)` AVANT l\'action qui déclenche l\'appel et faites `await` ensuite. Évitez `waitForLoadState("networkidle")` : fragile avec du polling ou des websockets.',
    solution: `import { test, expect } from '@playwright/test';

test('intercepter les requêtes', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', req => urls.push(req.url()));

  // Enregistrer l'attente AVANT de naviguer, pour ne pas manquer la requête
  const todosRequest = page.waitForRequest('**/api/todos');
  await page.goto('https://mon-app.exemple.com/todos');
  const request = await todosRequest;

  expect(request.method()).toBe('GET');
  expect(urls.some(url => url.includes('/api/todos'))).toBe(true);
});`,
  },
  {
    id: 'ej-i03',
    num: 'I03',
    title: 'Simuler une réponse HTTP',
    difficulty: 'intermediate',
    description:
      'Interceptez l\'appel à un endpoint d\'API et renvoyez des données simulées. Vérifiez que la page affiche les données du mock.',
    hint: 'Utilisez `page.route(url, handler)` et dans le handler appelez `route.fulfill({ json: {...} })`.',
    solution: `import { test, expect } from '@playwright/test';

test("simuler une réponse d'API", async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Utilisateur Mock' }]),
    });
  });

  await page.goto('https://mon-app.exemple.com/usuarios');
  await expect(page.getByText('Utilisateur Mock')).toBeVisible();
});`,
  },
  {
    id: 'ej-i04',
    num: 'I04',
    title: 'Gérer les dialogues du navigateur',
    difficulty: 'intermediate',
    description:
      'Sur `https://practice.expandtesting.com/js-dialogs`, un bouton affiche une `alert`. Configurez un gestionnaire qui accepte le dialogue, vérifiez le message et contrôlez la réponse affichée par la page.',
    hint: 'Enregistrez le gestionnaire avec `page.once("dialog", ...)` AVANT le clic : le clic ne se termine pas tant que le dialogue n\'est pas traité, donc impossible de l\'attendre ensuite avec `waitForEvent`. Dans le gestionnaire, lisez `dialog.message()` et appelez `dialog.accept()`.',
    solution: `import { test, expect } from '@playwright/test';

test('accepter une alert du navigateur', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/js-dialogs');

  // Enregistrer le gestionnaire AVANT l'action qui ouvre le dialogue
  let message = '';
  page.once('dialog', async dialog => {
    message = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Js Alert' }).click();

  expect(message).toBe('I am a Js Alert');
  await expect(page.locator('#dialog-response')).toHaveText('OK');
});`,
  },
  {
    id: 'ej-i05',
    num: 'I05',
    title: 'Téléverser un fichier',
    difficulty: 'intermediate',
    description:
      'Sur `https://practice.expandtesting.com/upload`, téléversez un fichier de test (sans dépendre d\'un fichier sur disque) et vérifiez que la page confirme l\'envoi avec le nom du fichier.',
    hint: 'Utilisez `locator.setInputFiles(...)`. Vous pouvez passer un objet `{ name, mimeType, buffer }` pour ne pas dépendre d\'un fichier sur disque.',
    solution: `import { test, expect } from '@playwright/test';

test('téléverser un fichier', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/upload');
  await page.getByTestId('file-input').setInputFiles({
    name: 'fixture.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('contenu de test'),
  });
  await page.getByTestId('file-submit').click();

  await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
  // Le serveur ajoute un préfixe au nom : on utilise une regex
  await expect(page.getByText(/fixture\\.txt/)).toBeVisible();
});`,
  },
  {
    id: 'ej-i06',
    num: 'I06',
    title: 'Glisser-déposer (drag & drop)',
    difficulty: 'intermediate',
    description:
      'Sur une page avec deux boîtes déplaçables (A et B), faites glisser A sur B et vérifiez qu\'elles ont échangé leur contenu. (La page est construite avec `page.setContent` pour que le test ne dépende pas d\'un site externe.)',
    hint: 'Utilisez `locator.dragTo(target)` pour un glisser-déposer simple entre deux locators.',
    solution: `import { test, expect } from '@playwright/test';

test('drag and drop', async ({ page }) => {
  await page.setContent(\`
    <div id="column-a" draggable="true"><header>A</header></div>
    <div id="column-b" draggable="true"><header>B</header></div>
    <script>
      let dragged;
      for (const col of document.querySelectorAll('[draggable]')) {
        col.addEventListener('dragstart', e => { dragged = col; e.dataTransfer.setData('text/plain', col.id); });
        col.addEventListener('dragover', e => e.preventDefault());
        col.addEventListener('drop', e => {
          e.preventDefault();
          const a = dragged.querySelector('header'), b = col.querySelector('header');
          [a.textContent, b.textContent] = [b.textContent, a.textContent];
        });
      }
    </script>
  \`);
  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  await columnA.dragTo(columnB);

  await expect(columnA.locator('header')).toHaveText('B');
  await expect(columnB.locator('header')).toHaveText('A');
});`,
  },
  {
    id: 'ej-i07',
    num: 'I07',
    title: 'Travailler avec les iframes',
    difficulty: 'intermediate',
    description:
      'Soit une page avec un `<iframe>` contenant un formulaire, accédez à son contenu avec un frame locator, remplissez un champ dans l\'iframe et vérifiez le résultat. (La page est construite avec `page.setContent`, le test ne dépend donc d\'aucun site externe.)',
    hint: 'Utilisez `page.frameLocator("iframe")` (ou mieux `page.frameLocator("#id")`) et opérez dessus avec les mêmes locators (`getByLabel`, `getByRole`...). Les frame locators réessaient tout seuls.',
    solution: `import { test, expect } from '@playwright/test';

test('interagir avec un iframe', async ({ page }) => {
  await page.setContent(\`
    <h1>Page hôte</h1>
    <iframe id="pago-frame" srcdoc="
      <label>Nom <input id='n'></label>
      <button onclick='document.getElementById(&quot;out&quot;).textContent = document.getElementById(&quot;n&quot;).value'>Envoyer</button>
      <p id='out'></p>"></iframe>
  \`);

  const frame = page.frameLocator('#pago-frame');
  await frame.getByLabel('Nom').fill('Anne Martin');
  await frame.getByRole('button', { name: 'Envoyer' }).click();

  await expect(frame.locator('#out')).toHaveText('Anne Martin');
  await expect(page.getByRole('heading')).toHaveText('Page hôte');
});`,
  },
  {
    id: 'ej-i08',
    num: 'I08',
    title: 'Implémenter le Page Object Model basique',
    difficulty: 'intermediate',
    description:
      'Créez une classe `TodoPage` qui encapsule la démo TodoMVC : locators comme propriétés et actions `addTask(text)` et `completeTask(text)`. Écrivez un test qui utilise la classe et vérifie avec des assertions web-first (les assertions vivent dans le test, pas dans le POM).',
    hint: 'La classe reçoit `page` dans le constructeur et définit les locators UNE fois comme `readonly`. Les méthodes font des actions ; le test fait les assertions avec `expect(todo.items)...`.',
    solution: `import { test, expect, type Locator, type Page } from '@playwright/test';

class TodoPage {
  readonly newTodo: Locator;
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTask(text: string) {
    await this.newTodo.fill(text);
    await this.newTodo.press('Enter');
  }

  async completeTask(text: string) {
    await this.items.filter({ hasText: text }).getByRole('checkbox').check();
  }
}

test('POM de base', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.goto();
  await todo.addTask('Première');
  await todo.addTask('Deuxième');
  await todo.completeTask('Première');

  await expect(todo.items).toHaveCount(2);
  await expect(todo.items.first()).toHaveClass(/completed/);
});`,
  },
  {
    id: 'ej-i09',
    num: 'I09',
    title: 'Attentes conditionnelles avec waitFor',
    difficulty: 'intermediate',
    description:
      'Sur `https://practice.expandtesting.com/dynamic-loading/2`, après avoir cliqué sur "Start", un loader apparaît, puis disparaît et le contenu s\'affiche. Attendez chaque transition explicitement.',
    hint: 'Utilisez des assertions web-first sur le loader : `expect(loader).toBeVisible()` puis `expect(loader).toBeHidden()`. (`locator.waitFor({ state })` convient aussi quand vous n\'avez pas besoin d\'assertion.)',
    solution: `import { test, expect } from '@playwright/test';

test('attendre la transition loader → contenu', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-loading/2');
  await page.getByRole('button', { name: 'Start' }).click();

  const loader = page.getByText('Loading...');
  await expect(loader).toBeVisible();
  await expect(loader).toBeHidden({ timeout: 10_000 });

  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
});`,
  },
  {
    id: 'ej-i10',
    num: 'I10',
    title: 'Simuler un appareil mobile',
    difficulty: 'intermediate',
    description:
      'Exécutez un test en simulant un iPhone 12. Vérifiez que la page affiche le bouton du menu hamburger (barre de navigation repliée).',
    hint: 'Utilisez `test.use({ ...devices["iPhone 12"] })` au niveau du fichier ou du `describe` : Playwright crée le contexte pour vous et le ferme tout seul. Dans un vrai projet, définissez-le comme `project` dans la config.',
    solution: `import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test('vue mobile iPhone 12', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('button', { name: 'Toggle navigation bar' })).toBeVisible();
});`,
  },
  {
    id: 'ej-i11',
    num: 'I11',
    title: 'Gérer l\'authentification HTTP Basic',
    difficulty: 'intermediate',
    description:
      'Accédez à `https://practice.expandtesting.com/basic-auth`, protégée par HTTP Basic Auth (identifiants publiés sur le site : `admin` / `admin`). Vérifiez le message de bienvenue.',
    hint: 'Utilisez `test.use({ httpCredentials: { username, password } })`. Dans de vrais projets, lisez les identifiants depuis des variables d\'environnement, jamais depuis le code.',
    solution: `import { test, expect } from '@playwright/test';

// Identifiants publics de pratique. Dans un vrai projet : process.env.BASIC_USER / BASIC_PASS
test.use({
  httpCredentials: {
    username: process.env.BASIC_USER ?? 'admin',
    password: process.env.BASIC_PASS ?? 'admin',
  },
});

test('authentification HTTP Basic', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/basic-auth');
  await expect(page.getByText('Congratulations! You must have the proper credentials.')).toBeVisible();
});`,
  },
  {
    id: 'ej-i12',
    num: 'I12',
    title: 'Paramétrer les tests avec une boucle',
    difficulty: 'intermediate',
    description:
      'Générez un test pour chacune de 5 URLs différentes : chacun vérifie que la page répond avec le statut 200 et affiche un `<h1>`. (Playwright n\'a pas de `test.each` : on paramètre avec une boucle qui déclare les tests.)',
    hint: 'Parcourez un tableau avec `for (const url of urls) { test(`...${url}`, ...) }`. Le titre de chaque test doit être unique et inclure le paramètre.',
    solution: `import { test, expect } from '@playwright/test';

const urls = [
  'https://playwright.dev',
  'https://playwright.dev/docs/intro',
  'https://playwright.dev/docs/api/class-page',
  'https://playwright.dev/docs/locators',
  'https://playwright.dev/docs/test-assertions',
];

for (const url of urls) {
  test(\`la page \${url} répond 200 et a un en-tête\`, async ({ page }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}`,
  },
  {
    id: 'ej-i13',
    num: 'I13',
    title: 'Utiliser beforeEach et afterEach',
    difficulty: 'intermediate',
    description:
      'Créez une suite de tests pour TodoMVC où `beforeEach` navigue et ajoute une tâche de base, et `afterEach` vérifie qu\'il n\'y a pas eu d\'erreurs dans la console.',
    hint: '`test.beforeEach` et `test.afterEach` reçoivent le même objet `{ page }` que les tests. Enregistrez `page.on("console", ...)` dans `beforeEach` et vérifiez le tableau dans `afterEach`.',
    solution: `import { test, expect } from '@playwright/test';

test.describe('TodoMVC suite', () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Tâche de base');
    await input.press('Enter');
  });

  test.afterEach(() => {
    expect(consoleErrors, 'Il ne doit y avoir aucune erreur console').toEqual([]);
  });

  test('la tâche de base est visible', async ({ page }) => {
    await expect(page.getByTestId('todo-title')).toHaveText('Tâche de base');
  });

  test('on peut compléter la tâche de base', async ({ page }) => {
    const item = page.getByTestId('todo-item');
    await item.getByRole('checkbox', { name: 'Toggle Todo' }).check();
    await expect(item).toHaveClass(/completed/);
  });
});`,
  },
  {
    id: 'ej-i14',
    num: 'I14',
    title: 'Lire et écrire dans le localStorage',
    difficulty: 'intermediate',
    description:
      'Avant de charger la page, pré-remplissez le `localStorage` avec des données de session. Vérifiez que la page les lit et affiche l\'utilisateur comme s\'il était authentifié.',
    hint: 'Utilisez `page.addInitScript(() => { localStorage.setItem(key, value) })` avant `page.goto()`.',
    solution: `import { test, expect } from '@playwright/test';

test('pré-remplir le localStorage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', token: 'abc123' }));
  });

  await page.goto('https://mon-app.exemple.com');
  // L'app lit le token et affiche l'utilisateur :
  await expect(page.getByText('Test User')).toBeVisible();
});`,
  },
  {
    id: 'ej-i15',
    num: 'I15',
    title: 'Vérifier la réponse d\'API avec waitForResponse',
    difficulty: 'intermediate',
    description:
      'Dans l\'app de notes de `practice.expandtesting.com`, créez un utilisateur unique par API, connectez-vous via l\'interface et attendez la réponse de l\'endpoint de login. Vérifiez que le statut est 200 et que le body JSON contient les propriétés attendues.',
    hint: 'Préparez les données avec `request` (API) plutôt que par l\'UI. Créez `page.waitForResponse(...)` AVANT le clic qui déclenche l\'appel et faites `await` ensuite. Vérifiez avec `response.status()` et `await response.json()`.',
    solution: `import { test, expect } from '@playwright/test';

test("vérifier la réponse de l'API de login", async ({ page, request }) => {
  // Données de test uniques créées par API : le test est indépendant et répétable
  const email = \`qa-\${Date.now()}@example.com\`;
  const password = 'Test1234!';
  const created = await request.post('https://practice.expandtesting.com/notes/api/users/register', {
    data: { name: 'QA User', email, password },
  });
  expect(created.status()).toBe(201);

  await page.goto('https://practice.expandtesting.com/notes/app/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);

  // L'attente est créée AVANT l'action qui déclenche l'appel
  const responsePromise = page.waitForResponse(
    res => res.url().includes('/notes/api/users/login') && res.request().method() === 'POST'
  );
  await page.getByTestId('login-submit').click();
  const response = await responsePromise;

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    success: true,
    data: { email, token: expect.any(String) },
  });
});`,
  },
  {
    id: 'ej-i16',
    num: 'I16',
    title: 'Locators enchaînés et filtres',
    difficulty: 'intermediate',
    description:
      'Dans un tableau HTML, trouvez la ligne qui contient le nom "Anne Martin" et cliquez sur le bouton "Modifier" de cette ligne spécifique.',
    hint: 'Utilisez `page.getByRole("row").filter({ hasText: "Anne Martin" }).getByRole("button", { name: "Modifier" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('locator enchaîné dans un tableau', async ({ page }) => {
  await page.goto('https://mon-tableau.exemple.com');
  const fila = page.getByRole('row').filter({ hasText: 'Anne Martin' });
  await fila.getByRole('button', { name: "Modifier" }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Anne Martin');
});`,
  },
  {
    id: 'ej-i17',
    num: 'I17',
    title: 'Utiliser des fixtures personnalisées',
    difficulty: 'intermediate',
    description:
      'Créez un fixture `authenticatedPage` qui navigue et effectue le login automatiquement. Utilisez-le dans plusieurs tests pour ne pas répéter le flux d\'authentification.',
    hint: 'Étendez `test` avec `base.extend({ myFixture: async ({ page }, use) => { ... await use(page); } })`. Lisez les identifiants depuis des variables d\'environnement.',
    solution: `import { test as base, expect, type Page } from '@playwright/test';

// Identifiants publics de pratique ; dans un vrai projet ils viennent de process.env
const test = base.extend<{ loggedPage: Page }>({
  loggedPage: async ({ page }, use) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.getByLabel('Username').fill(process.env.PRACTICE_USER ?? 'practice');
    await page.getByLabel('Password', { exact: true }).fill(process.env.PRACTICE_PASS ?? 'SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\\/secure/);
    await use(page);
  },
});

test('voir la zone sécurisée une fois authentifié', async ({ loggedPage }) => {
  await expect(loggedPage.getByRole('heading', { level: 1 })).toContainText('Secure Area');
});

test('se déconnecter depuis la zone sécurisée', async ({ loggedPage }) => {
  await loggedPage.getByRole('link', { name: 'Logout' }).click();
  await expect(loggedPage).toHaveURL(/\\/login/);
});`,
  },
  {
    id: 'ej-i18',
    num: 'I18',
    title: 'Gérer les cookies de session',
    difficulty: 'intermediate',
    description:
      'Enregistrez les cookies après un login réussi. Dans un second contexte, chargez ces cookies et vérifiez que l\'utilisateur est toujours authentifié sans refaire le login.',
    hint: 'Utilisez `context.storageState()` pour sauvegarder et `browser.newContext({ storageState })` pour restaurer (cookies et localStorage inclus). Évitez de passer les cookies à la main si ce n\'est pas nécessaire.',
    solution: `import { test, expect } from '@playwright/test';

test('persister la session sans refaire le login', async ({ browser }) => {
  // Contexte 1 : login → sauvegarder l'état de session
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.goto('https://practice.expandtesting.com/login');
  await page1.getByLabel('Username').fill('practice');
  await page1.getByLabel('Password', { exact: true }).fill('SuperSecretPassword!');
  await page1.getByRole('button', { name: 'Login' }).click();
  await expect(page1).toHaveURL(/\\/secure/);
  const storageState = await ctx1.storageState();
  await ctx1.close();

  // Contexte 2 : restaurer → accès direct sans login
  const ctx2 = await browser.newContext({ storageState });
  const page2 = await ctx2.newPage();
  await page2.goto('https://practice.expandtesting.com/secure');
  await expect(page2.getByRole('heading', { level: 1 })).toContainText('Secure Area');
  await ctx2.close();
});`,
  },
  {
    id: 'ej-i19',
    num: 'I19',
    title: 'Assertions douces — ne pas avorter au premier échec',
    difficulty: 'intermediate',
    description:
      'Utilisez les soft assertions pour vérifier plusieurs propriétés d\'un formulaire. À la fin du test, tous les échecs sont reportés ensemble au lieu d\'avorter au premier.',
    hint: 'Utilisez `expect.soft(locator).matcher()`. Le test continue même en cas d\'échec. À la fin, Playwright les reporte tous.',
    solution: `import { test, expect } from '@playwright/test';

test("soft assertions sur le formulaire d'inscription", async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  await expect.soft(page.getByLabel('Username')).toBeVisible();
  await expect.soft(page.getByLabel('Username')).toBeEnabled();
  await expect.soft(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
  await expect.soft(page.getByLabel('Confirm Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByRole('button', { name: 'Register' })).toBeVisible();

  // Le test échoue à la fin si une soft assertion a échoué, en listant tous les échecs
});`,
  },
  {
    id: 'ej-i20',
    num: 'I20',
    title: 'Exécuter du JavaScript dans la page',
    difficulty: 'intermediate',
    description:
      'Utilisez `page.evaluate()` pour exécuter du code JavaScript directement dans le contexte de la page et obtenir des informations qui ne sont pas dans le DOM (p. ex., une variable globale ou le résultat d\'un calcul).',
    hint: '`page.evaluate(fn)` exécute `fn` dans le navigateur et renvoie le résultat sérialisé. Utilisez-le seulement quand il n\'existe pas de locator ou d\'assertion pour ce dont vous avez besoin.',
    solution: `import { test, expect } from '@playwright/test';

test('exécuter du JS dans le navigateur', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
  expect(devicePixelRatio).toBeGreaterThan(0);

  // On peut passer un argument sérialisable au navigateur
  const somme = await page.evaluate(([a, b]) => a + b, [2, 3]);
  expect(somme).toBe(5);
});`,
  },
  {
    id: 'ej-i21',
    num: 'I21',
    title: 'Prendre des captures d\'écran comparatives',
    difficulty: 'intermediate',
    description:
      'Utilisez le matcher `toHaveScreenshot()` pour faire une comparaison visuelle d\'un composant. La première fois, il crée le snapshot de référence ; les suivantes détectent les différences.',
    hint: 'Première exécution : `npx playwright test --update-snapshots` crée le baseline. Ensuite, lancez normalement. Générez toujours les baselines sur le même OS/navigateur que la CI (p. ex. Docker) : le rendu change selon la plateforme.',
    solution: `import { test, expect } from '@playwright/test';

test('régression visuelle du header', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveScreenshot('header-baseline.png', {
    maxDiffPixels: 10,
  });
});`,
  },
  {
    id: 'ej-i22',
    num: 'I22',
    title: 'Bloquer et rediriger les requêtes',
    difficulty: 'intermediate',
    description:
      'Bloquez toutes les requêtes d\'images pour accélérer le chargement de la page. Vérifiez que la page charge tout aussi bien sans images.',
    hint: 'Utilisez `page.route("**/*", ...)` et décidez par `route.request().resourceType()` : plus robuste que lister des extensions. Vérifiez le blocage avec l\'événement `requestfailed`.',
    solution: `import { test, expect } from '@playwright/test';

test('bloquer les images pour accélérer le chargement', async ({ page }) => {
  const blocked: string[] = [];
  page.on('requestfailed', req => {
    if (req.resourceType() === 'image') blocked.push(req.url());
  });

  await page.route('**/*', route =>
    route.request().resourceType() === 'image' ? route.abort() : route.continue()
  );

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // La page fonctionne sans images et elles ont bien été bloquées
  await expect.poll(() => blocked.length).toBeGreaterThan(0);
});`,
  },
  // ─────────────────────────── AVANCÉ ──────────────────────────────────────
  {
    id: 'ej-a01',
    num: 'A01',
    title: 'Authentification persistante avec storageState',
    difficulty: 'advanced',
    description:
      'Créez un projet `setup` qui fait le login une seule fois et sauvegarde l\'état d\'authentification sur disque. Les autres projets en dépendent et réutilisent cet état sans refaire le login.',
    hint: 'Recommandé par Playwright à la place de `globalSetup` : un projet `setup` avec `dependencies`. Sauvegardez avec `page.context().storageState({ path })`, utilisez `storageState` dans le projet principal et ajoutez le fichier à `.gitignore`.',
    solution: `// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json'; // à ajouter dans .gitignore

setup('authenticate', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await page.getByLabel('Username').fill(process.env.PRACTICE_USER ?? 'practice');
  await page.getByLabel('Password', { exact: true }).fill(process.env.PRACTICE_PASS ?? 'SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\\/secure/);
  await page.context().storageState({ path: authFile });
});

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,           // échoue si un test.only reste en CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://practice.expandtesting.com',
    trace: 'on-first-retry',               // trace viewer : recommandé pour déboguer en CI
  },
  projects: [
    { name: 'setup', testMatch: /auth\\.setup\\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    // Ajoutez firefox et webkit comme chromium pour tester sur tous les navigateurs
  ],
});`,
  },
  {
    id: 'ej-a02',
    num: 'A02',
    title: 'Page Object Model complet avec héritage',
    difficulty: 'advanced',
    description:
      'Implémentez un POM complet avec : `BasePage` (méthodes communes), `LoginPage extends BasePage`, `DashboardPage extends BasePage`. Écrivez des tests E2E qui utilisent les trois classes.',
    hint: 'La `BasePage` garde `this.page` et définit des helpers communs. Les pages filles définissent leurs locators comme propriétés `readonly` et n\'exposent que des actions ; les assertions vont dans le test.',
    solution: `import { test, expect, type Page } from '@playwright/test';

class BasePage {
  constructor(protected readonly page: Page) {}

  get flash() {
    return this.page.getByRole('alert');
  }
}

class LoginPage extends BasePage {
  readonly username = this.page.getByLabel('Username');
  readonly password = this.page.getByLabel('Password', { exact: true });
  readonly submit = this.page.getByRole('button', { name: 'Login' });

  async goto() {
    await this.page.goto('https://practice.expandtesting.com/login');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}

class SecurePage extends BasePage {
  readonly heading = this.page.getByRole('heading', { level: 1 });
  readonly logout = this.page.getByRole('link', { name: 'Logout' });
}

test('login et logout E2E avec POM', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('practice', 'SuperSecretPassword!');

  const secure = new SecurePage(page);
  await expect(secure.heading).toContainText('Secure Area');
  await expect(secure.flash).toContainText('You logged into a secure area!');

  await secure.logout.click();
  await expect(page).toHaveURL(/\\/login/);
});`,
  },
  {
    id: 'ej-a03',
    num: 'A03',
    title: 'Sharding de tests pour CI parallèle',
    difficulty: 'advanced',
    description:
      'Configurez votre projet pour exécuter les tests en 4 shards parallèles en CI. Écrivez le pipeline GitHub Actions qui combine les rapports de tous les shards.',
    hint: 'Utilisez `--shard=1/4`... dans une matrix GitHub Actions. Configurez le reporter `blob` en CI pour pouvoir les fusionner ensuite avec `merge-reports`, et téléversez le rapport aussi quand les tests échouent (`if: ${{ !cancelled() }}`).',
    solution: `# playwright.config.ts → reporter: process.env.CI ? 'blob' : 'html'

# .github/workflows/playwright.yml
name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: blob-report-\${{ matrix.shardIndex }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    if: \${{ !cancelled() }}
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true
      - run: npx playwright merge-reports --reporter html ./all-blob-reports
      - uses: actions/upload-artifact@v4
        with:
          name: html-report
          path: playwright-report/`,
  },
  {
    id: 'ej-a04',
    num: 'A04',
    title: 'Mock complet d\'API avec HAR recording',
    difficulty: 'advanced',
    description:
      'Enregistrez les requêtes réseau de votre application dans un fichier HAR. Ensuite, rejouez ce HAR dans les tests hors ligne, sans avoir besoin du serveur réel.',
    hint: 'Enregistrez avec `page.routeFromHAR(path, { update: true })` et rejouez avec `page.routeFromHAR(path, { url, update: false })`. Contrôlez le mode avec une variable d\'environnement, pas en modifiant le code.',
    solution: `import { test, expect } from '@playwright/test';

// Enregistrer : UPDATE_HAR=1 npx playwright test  ·  Rejouer : npx playwright test
const update = !!process.env.UPDATE_HAR;

test('rejouer un HAR enregistré', async ({ page }) => {
  await page.routeFromHAR('./fixtures/api-responses.har', {
    url: '**/api/**',
    update,
  });

  await page.goto('https://mon-app.exemple.com');
  // L'app utilise les réponses du HAR au lieu du serveur réel
  await expect(page.getByText('Données depuis HAR')).toBeVisible();
});`,
  },
  {
    id: 'ej-a05',
    num: 'A05',
    title: 'Tests d\'accessibilité avec axe-playwright',
    difficulty: 'advanced',
    description:
      'Intégrez `axe-playwright` pour effectuer un audit d\'accessibilité WCAG 2.1 AA sur chaque page principale de votre application. Faites échouer le test s\'il y a des violations de sévérité "critical" ou "serious".',
    hint: 'Installez `axe-playwright`, importez `injectAxe` et `checkA11y`. Filtrez par gravité avec `includedImpacts: ["critical", "serious"]` et par règles avec `axeOptions.runOnly`.',
    solution: `import { test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const PAGES = ['/', '/login', '/dashboard', '/profile'];

for (const path of PAGES) {
  test(\`accessibilité WCAG 2.1 AA — \${path}\`, async ({ page }) => {
    await page.goto(\`https://mon-app.exemple.com\${path}\`);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      includedImpacts: ['critical', 'serious'],
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      },
    });
  });
}`,
  },
  {
    id: 'ej-a06',
    num: 'A06',
    title: 'Simuler des conditions réseau lentes',
    difficulty: 'advanced',
    description:
      'Simulez une connexion 3G lente (750 kbps, latence 100 ms). Vérifiez que la page affiche un skeleton/loader pendant le chargement et que l\'application reste utilisable.',
    hint: 'Playwright n\'a pas de `page.emulateNetworkConditions` : utilisez une session CDP (`context.newCDPSession(page)`) avec `Network.emulateNetworkConditions`. Cela ne fonctionne que sous Chromium, donc sautez le test sur les autres navigateurs.',
    solution: `import { test, expect } from '@playwright/test';

test('UI avec un réseau 3G lent', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP est disponible uniquement sous Chromium');

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8, // 750 kbps
    uploadThroughput: (250 * 1024) / 8,   // 250 kbps
    latency: 100,
  });

  // 'commit' rend la main dès que la réponse arrive : on voit ainsi l'état de chargement
  await page.goto('https://mon-app.exemple.com', { waitUntil: 'commit' });

  await expect(page.getByTestId('skeleton').first()).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('skeleton')).toHaveCount(0);
});`,
  },
  {
    id: 'ej-a07',
    num: 'A07',
    title: 'Tests avec plusieurs utilisateurs simultanés',
    difficulty: 'advanced',
    description:
      'Simulez une collaboration en temps réel : l\'utilisateur A et l\'utilisateur B ouvrent la même page. A écrit quelque chose et B vérifie qu\'il le voit en temps réel (WebSocket/polling).',
    hint: 'Utilisez `browser.newContext()` pour créer deux contextes indépendants, chacun avec son propre utilisateur authentifié.',
    solution: `import { test, expect } from '@playwright/test';

test('collaboration en temps réel', async ({ browser }) => {
  // Créer deux sessions indépendantes
  const ctxA = await browser.newContext({ storageState: 'auth-userA.json' });
  const ctxB = await browser.newContext({ storageState: 'auth-userB.json' });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  await pageA.goto('https://mon-app.exemple.com/doc/123');
  await pageB.goto('https://mon-app.exemple.com/doc/123');

  // L'utilisateur A écrit
  await pageA.getByRole('textbox').fill('Hola desde A');

  // L'utilisateur B voit la mise à jour
  await expect(pageB.getByText('Hola desde A')).toBeVisible({ timeout: 5_000 });

  await ctxA.close();
  await ctxB.close();
});`,
  },
  {
    id: 'ej-a08',
    num: 'A08',
    title: 'Intercepter et modifier des réponses GraphQL',
    difficulty: 'advanced',
    description:
      'Interceptez une mutation GraphQL spécifique. Modifiez la réponse pour simuler une erreur serveur et vérifiez que l\'interface affiche le message d\'erreur correct.',
    hint: 'Utilisez `page.route("**/graphql", ...)` et dans le handler inspectez `request.postDataJSON()` pour identifier l\'opération.',
    solution: `import { test, expect } from '@playwright/test';

test('simuler une erreur dans une mutation GraphQL', async ({ page }) => {
  await page.route('**/graphql', async (route, request) => {
    const body = request.postDataJSON();

    if (body?.operationName === 'CreateUser') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: 'E-mail déjà utilisé', extensions: { code: 'DUPLICATE_EMAIL' } }],
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://mon-app-graphql.exemple.com/register');
  await page.getByLabel('Email').fill('existente@test.com');
  await page.getByRole('button', { name: "S'inscrire" }).click();
  await expect(page.getByRole('alert')).toContainText('E-mail déjà utilisé');
});`,
  },
  {
    id: 'ej-a09',
    num: 'A09',
    title: 'Réessais (retries) et détection de flakiness',
    difficulty: 'advanced',
    description:
      'Configurez `retries: 2` dans le projet et écrivez un test qui échoue aux deux premières tentatives et réussit à la troisième (simulant de la flakiness). Vérifiez que le mécanisme fonctionne et rappelez-vous : un retry qui "sauve" un test est un signal à investiguer, pas une solution.',
    hint: 'Lisez `testInfo.retry` (0 à la première tentative) au lieu d\'un compteur global : c\'est un état de Playwright, pas de votre module. Le rapport marque ces tests comme "flaky".',
    solution: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: { trace: 'on-first-retry' }, // la trace ne est enregistrée qu'au réessai
});

// flaky.spec.ts
import { test, expect } from '@playwright/test';

test('échoue 2 fois, réussit à la 3e', async ({ page }, testInfo) => {
  // Simulation d'un échec intermittent (dans de vrais tests ce serait une condition de concurrence)
  expect(testInfo.retry, 'échec simulé').toBeGreaterThanOrEqual(2);

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});`,
  },
  {
    id: 'ej-a10',
    num: 'A10',
    title: 'WebSocket : vérifier les messages en temps réel',
    difficulty: 'advanced',
    description:
      'Surveillez un WebSocket avec les événements de Playwright (sans CDP) et vérifiez que l\'app reçoit le message attendu du serveur.',
    hint: 'Utilisez `page.waitForEvent("websocket")` puis `ws.waitForEvent("framereceived", predicate)`. Créez les attentes AVANT de naviguer.',
    solution: `import { test, expect } from '@playwright/test';

test('surveiller les messages WebSocket', async ({ page }) => {
  // Attendre le WebSocket AVANT de naviguer
  const wsPromise = page.waitForEvent('websocket');
  await page.goto('https://mon-app-ws.exemple.com');
  const ws = await wsPromise;

  const frame = await ws.waitForEvent('framereceived', {
    predicate: f => String(f.payload).includes('connected'),
    timeout: 10_000,
  });
  expect(JSON.parse(String(frame.payload))).toMatchObject({ status: 'connected' });

  // L'UI reflète aussi l'état
  await expect(page.getByTestId('connection-status')).toHaveText('connected');
});`,
  },
  {
    id: 'ej-a11',
    num: 'A11',
    title: 'Rapport HTML personnalisé avec métadonnées',
    difficulty: 'advanced',
    description:
      'Créez un reporter personnalisé qui étend `Reporter` de Playwright. Générez un JSON avec les métriques de chaque test : durée, tentatives, statut, et une capture d\'écran de l\'échec si elle existe.',
    hint: 'Implémentez la classe avec `onTestEnd(test, result)`. Sauvegardez un `result.attachments` pour les captures d\'écran en cas d\'échec.',
    solution: `import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';

class MetricsReporter implements Reporter {
  private results: object[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    const failureScreenshot = result.attachments.find(
      a => a.name === 'screenshot' && result.status !== 'passed'
    );

    this.results.push({
      title: test.title,
      file: test.location.file,
      duration: result.duration,
      status: result.status,
      retries: result.retry,
      failureScreenshot: failureScreenshot?.path ?? null,
      errors: result.errors.map(e => e.message),
    });
  }

  onEnd() {
    fs.writeFileSync('test-metrics.json', JSON.stringify(this.results, null, 2));
    console.log(\`Rapport enregistré: test-metrics.json (\${this.results.length} tests)\`);
  }
}

export default MetricsReporter;
// playwright.config.ts: reporter: [['list'], ['./metrics-reporter.ts']]
// Et utilisez \`screenshot: "only-on-failure"\` pour que les captures d'échec existent`,
  },
  {
    id: 'ej-a12',
    num: 'A12',
    title: 'Locators avancés avec filter et nth',
    difficulty: 'advanced',
    description:
      'Étant donné une liste de cartes de produits avec prix et bouton "Ajouter", utilisez des locators enchaînés pour trouver la carte la moins chère (premier élément après le tri) et cliquer sur son bouton.',
    hint: 'Attendez la réponse du tri avec `waitForResponse` (créée AVANT `selectOption`) et localisez les cartes avec `getByTestId`. Évitez `waitForLoadState("networkidle")`.',
    solution: `import { test, expect } from '@playwright/test';

test('ajouter le produit le moins cher', async ({ page }) => {
  await page.goto('https://ma-boutique.exemple.com/produits');

  // Trier et attendre la réponse de l'API qui renvoie le nouvel ordre
  const sorted = page.waitForResponse(res => res.url().includes('/api/produits') && res.url().includes('sort=price-asc') && res.ok());
  await page.getByRole('combobox', { name: /trier/i }).selectOption('price-asc');
  await sorted;

  // Le premier de la liste triée est le moins cher
  const cheapest = page.getByTestId('product-card').first();
  const price = await cheapest.getByTestId('price').innerText();
  await cheapest.getByRole('button', { name: /ajouter/i }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await expect(page.getByTestId('cart-summary')).toContainText(price);
});`,
  },
  {
    id: 'ej-a13',
    num: 'A13',
    title: 'Performance : mesurer les métriques Web Vitals',
    difficulty: 'advanced',
    description:
      'Mesurez le LCP (Largest Contentful Paint) et le CLS (Cumulative Layout Shift) de votre page d\'accueil. Faites échouer le test si LCP > 2500 ms ou CLS > 0.1.',
    hint: 'Installez les `PerformanceObserver` avec `page.addInitScript` AVANT de naviguer et lisez les valeurs avec `expect.poll` : sans `setTimeout` ni `networkidle`. Les seuils dépendent de l\'environnement ; utilisez-les comme budget, pas comme mesure exacte.',
    solution: `import { test, expect } from '@playwright/test';

test('Web Vitals: LCP et CLS', async ({ page }) => {
  // Les observers sont enregistrés avant le chargement de la page
  await page.addInitScript(() => {
    const w = window as any;
    w.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => {
      w.__vitals.lcp = list.getEntries().at(-1)?.startTime ?? w.__vitals.lcp;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) w.__vitals.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('https://mon-app.exemple.com');

  // Attendre qu'un LCP existe, sans sleeps fixes
  await expect.poll(() => page.evaluate(() => (window as any).__vitals.lcp)).toBeGreaterThan(0);

  const vitals = await page.evaluate(() => (window as any).__vitals as { lcp: number; cls: number });
  expect(vitals.lcp, 'LCP').toBeLessThan(2500);
  expect(vitals.cls, 'CLS').toBeLessThan(0.1);
});`,
  },
  {
    id: 'ej-a14',
    num: 'A14',
    title: 'Créer un helper de test réutilisable',
    difficulty: 'advanced',
    description:
      'Créez un helper `createUser(page, overrides?)` qui remplit et envoie le formulaire d\'inscription avec des données aléatoires. Il accepte des overrides optionnels pour personnaliser les champs. Il retourne les données de l\'utilisateur créé.',
    hint: 'Utilisez une bibliothèque comme `@faker-js/faker` pour des données aléatoires. Le helper retourne l\'objet avec les données utilisées.',
    solution: `import { Page } from '@playwright/test';

interface UserData {
  name: string;
  email: string;
  password: string;
}

export async function createUser(page: Page, overrides: Partial<UserData> = {}): Promise<UserData> {
  const timestamp = Date.now();
  const userData: UserData = {
    name: overrides.name ?? \`Test User \${timestamp}\`,
    email: overrides.email ?? \`user\${timestamp}@test.exemple.com\`,
    password: overrides.password ?? 'TestPassword123!',
  };

  await page.goto('/register');
  await page.getByLabel('Nom').fill(userData.name);
  await page.getByLabel('Email').fill(userData.email);
  await page.getByLabel('Mot de passe').fill(userData.password);
  await page.getByRole('button', { name: "S'inscrire" }).click();
  await page.waitForURL(/dashboard/);

  return userData;
}

// Utilisation dans un test :
// const user = await createUser(page, { name: 'Admin Especial' });
// expect(user.email).toContain('@test.exemple.com');`,
  },
  {
    id: 'ej-a15',
    num: 'A15',
    title: 'Test de PWA : hors ligne et service worker',
    difficulty: 'advanced',
    description:
      'Vérifiez que votre PWA fonctionne hors ligne. Chargez l\'app, attendez le service worker, passez le contexte en mode hors ligne, rechargez et vérifiez que le service worker sert le contenu en cache.',
    hint: 'Utilisez `context.setOffline(true)` (API native, sans CDP) après le premier chargement et `await navigator.serviceWorker.ready` pour attendre le SW.',
    solution: `import { test, expect } from '@playwright/test';

test('la PWA fonctionne hors ligne', async ({ page, context }) => {
  // 1. Charger l'app et attendre que le service worker soit actif
  await page.goto('https://ma-pwa.exemple.com');
  await page.evaluate(() => navigator.serviceWorker.ready);

  // 2. Passer hors ligne et recharger : il doit servir le cache
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByText('Hors connexion')).toBeHidden();

  // 3. Revenir en ligne
  await context.setOffline(false);
});`,
  },
  {
    id: 'ej-a16',
    num: 'A16',
    title: 'Playwright component testing (expérimental)',
    difficulty: 'advanced',
    description:
      'Utilisez Playwright Component Testing pour monter un composant React isolé. Vérifiez ses props, son état et ses événements sans avoir à démarrer toute l\'application.',
    hint: 'Installez `@playwright/experimental-ct-react`. Les tests utilisent `mount()` et les mêmes assertions web-first. Pour les événements, passez un callback et vérifiez-le avec `expect.poll` ou une promesse.',
    solution: `// button.spec.tsx (component testing)
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('Button affiche son texte et déclenche onClick', async ({ mount }) => {
  let clicks = 0;
  const component = await mount(
    <Button label="Enregistrer" onClick={() => { clicks++; }} />
  );

  await expect(component).toContainText('Enregistrer');
  await component.click();
  await expect.poll(() => clicks).toBe(1);
});

test("Button désactivé n'est pas interactif", async ({ mount }) => {
  const component = await mount(<Button label="Enregistrer" disabled />);

  // Un utilisateur réel ne peut pas cliquer : il suffit de vérifier l'état (pas de click avec force)
  await expect(component).toBeDisabled();
});`,
  },
  {
    id: 'ej-a17',
    num: 'A17',
    title: 'Modifier les en-têtes de requêtes',
    difficulty: 'advanced',
    description:
      'Interceptez toutes les requêtes vers votre API et injectez un en-tête d\'authentification personnalisé (`X-API-Key`). Vérifiez que les requêtes arrivent avec l\'en-tête correct.',
    hint: 'Dans `page.route()`, utilisez `route.continue({ headers: { ...request.headers(), "X-API-Key": valeur } })`. Lisez la clé depuis une variable d\'environnement et attendez que la requête ait lieu avec `expect.poll`, pas avec `networkidle`.',
    solution: `import { test, expect } from '@playwright/test';

test("injecter un header d'authentification", async ({ page }) => {
  const apiKey = process.env.API_KEY ?? 'test-key';
  const injected: Record<string, string>[] = [];

  await page.route('**/api/**', async (route, request) => {
    const headers = { ...request.headers(), 'x-api-key': apiKey };
    injected.push(headers);
    await route.continue({ headers });
  });

  await page.goto('https://mon-app.exemple.com');

  // Attendre qu'au moins un appel à l'API soit intercepté
  await expect.poll(() => injected.length).toBeGreaterThan(0);
  expect(injected[0]['x-api-key']).toBe(apiKey);
});`,
  },
  {
    id: 'ej-a18',
    num: 'A18',
    title: 'Utilisation avancée de expect.poll',
    difficulty: 'advanced',
    description:
      'Utilisez `expect.poll()` pour vérifier l\'état d\'une longue opération asynchrone qui ne se reflète pas directement dans le DOM. Interrogez les appels API toutes les 500 ms jusqu\'à obtenir le résultat attendu.',
    hint: '`expect.poll(async () => ..., { intervals, timeout })`. À l\'intérieur, utilisez `page.request.get(...)` (partage les cookies avec la page) au lieu de `page.evaluate(fetch)`.',
    solution: `import { test, expect } from '@playwright/test';

test('attendre un résultat avec expect.poll', async ({ page }) => {
  await page.goto('https://mon-app.exemple.com/jobs');
  await page.getByRole('button', { name: 'Démarrer le processus' }).click();

  const jobIdLocator = page.getByTestId('job-id');
  await expect(jobIdLocator).not.toBeEmpty();
  const jobId = await jobIdLocator.innerText();

  // Interroger l'API périodiquement jusqu'à la fin du job
  await expect.poll(
    async () => {
      const res = await page.request.get(new URL(\`/api/jobs/\${jobId}/status\`, page.url()).href);
      return (await res.json()).status;
    },
    { intervals: [500, 1000, 2000], timeout: 30_000, message: "Le job n'a pas fini à temps" }
  ).toBe('completed');
});`,
  },
  {
    id: 'ej-a19',
    num: 'A19',
    title: 'Pipeline CI/CD complet avec cache',
    difficulty: 'advanced',
    description:
      'Écrivez un workflow complet GitHub Actions pour Playwright avec : cache des navigateurs, matrice de navigateurs (chromium/firefox/webkit), artifacts avec rapports HTML, et notification Slack en cas d\'échec.',
    hint: 'Mettez en cache le dossier `~/.cache/ms-playwright`. Les artifacts vont dans le répertoire `playwright-report/`. Le webhook Slack va dans les secrets.',
    solution: `# .github/workflows/playwright.yml
name: E2E Tests
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-\${{ matrix.browser }}-\${{ hashFiles('package-lock.json') }}

      - name: Install browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps \${{ matrix.browser }}

      - name: Install system deps
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps \${{ matrix.browser }}

      - name: Run tests
        run: npx playwright test --project=\${{ matrix.browser }}

      - name: Upload report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-\${{ matrix.browser }}
          path: playwright-report/
          retention-days: 14

      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-type: incoming-webhook
          payload: |
            {"text": "Playwright \${{ matrix.browser }} a échoué sur \${{ github.ref_name }} — \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}"}
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`,
  },
  {
    id: 'ej-a20',
    num: 'A20',
    title: 'Helper de scénarios avec test.step',
    difficulty: 'advanced',
    description:
      'Créez un helper `runScenario(page, steps)` où `steps` est un tableau d\'étapes nommées. Chaque étape doit apparaître comme `test.step` dans le rapport HTML/trace, enregistrer sa durée et NE PAS masquer les échecs (si une étape échoue, le test échoue).',
    hint: 'Enveloppez chaque étape dans `test.step(name, fn)` : Playwright mesure déjà sa durée et affiche l\'arbre dans le rapport. N\'attrapez pas les erreurs avec `try/catch` sauf si vous les relancez.',
    solution: `import { test, expect, type Page } from '@playwright/test';

interface Step {
  name: string;
  run: (page: Page) => Promise<void>;
}

export async function runScenario(page: Page, steps: Step[]) {
  for (const step of steps) {
    const start = Date.now();
    // test.step apparaît dans le rapport et la trace ; en cas d'échec, le test échoue
    await test.step(step.name, () => step.run(page));
    test.info().annotations.push({
      type: 'step-duration',
      description: \`\${step.name}: \${Date.now() - start}ms\`,
    });
  }
}

// Utilisation:
test('parcours login et dashboard', async ({ page }) => {
  await runScenario(page, [
    { name: 'Login', run: async p => { await p.goto('https://mon-app.exemple.com/login'); /* ... */ } },
    { name: 'Voir le dashboard', run: async p => { await expect(p.getByText('Home')).toBeVisible(); } },
  ]);
});`,
  },
  {
    id: 'ej-a21',
    num: 'A21',
    title: 'Vérifier le SEO et les méta-tags',
    difficulty: 'advanced',
    description:
      'Écrivez un test qui vérifie les méta-tags SEO critiques de chaque page : `title`, `description`, `og:title`, `og:image`, `canonical`. Utilisez un fixture qui itère sur les pages du sitemap.',
    hint: 'Utilisez des assertions web-first sur le `<meta>` : `expect(locator).toHaveAttribute("content", /regex/)` réessaie et donne un meilleur message d\'erreur que lire la valeur et comparer à la main. `expect(page).toHaveTitle(regex)` pour le titre.',
    solution: `import { test, expect } from '@playwright/test';

const PAGES = [
  { url: '/', minTitleLen: 20, hasOG: true },
  { url: '/blog', minTitleLen: 10, hasOG: false },
  { url: '/contact', minTitleLen: 10, hasOG: false },
];

for (const p of PAGES) {
  test(\`SEO meta tags — \${p.url}\`, async ({ page }) => {
    await page.goto(\`https://mon-site.exemple.com\${p.url}\`);

    await expect(page).toHaveTitle(new RegExp(\`^.{\${p.minTitleLen},70}$\`));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{50,160}$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(\`\${p.url === '/' ? '/$' : p.url}\`)
    );

    if (p.hasOG) {
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\\/\\//);
    }
  });
}`,
  },
  {
    id: 'ej-a22',
    num: 'A22',
    title: 'Automatiser le flux de paiement avec interception',
    difficulty: 'advanced',
    description:
      'Simulez le flux complet de checkout d\'un e-commerce. Interceptez l\'appel au processeur de paiement et renvoyez un paiement réussi simulé sans débiter une vraie carte. Vérifiez l\'email de confirmation dans la réponse de l\'API.',
    hint: 'Interceptez le POST vers l\'endpoint de paiement avec `page.route`. Retournez la structure de réponse que votre application attend du processeur.',
    solution: `import { test, expect } from '@playwright/test';

test('checkout complet avec paiement simulé', async ({ page }) => {
  // Mock du processeur de paiement (Stripe/PayPal/etc) : aucune vraie carte n'est débitée
  await page.route('**/api/payments/process', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'pay_mock_123',
        status: 'succeeded',
        amount: 4999,
        receipt_email: 'cliente@test.com',
      }),
    });
  });

  await page.goto('https://ma-boutique.exemple.com');
  await page.getByTestId('product-card').first().getByRole('button', { name: 'Ajouter' }).click();
  await page.getByRole('link', { name: 'Panier' }).click();
  await page.getByRole('button', { name: 'Payer' }).click();

  await page.getByLabel('Email').fill('cliente@test.com');
  await page.getByLabel('Numéro de carte').fill('4242 4242 4242 4242');
  await page.getByLabel('Date').fill('12/26');
  await page.getByLabel('CVC').fill('123');

  // Vérifier aussi ce que l'app ENVOIE au processeur
  const paymentRequest = page.waitForRequest('**/api/payments/process');
  await page.getByRole('button', { name: 'Confirmer le paiement' }).click();
  expect((await paymentRequest).postDataJSON()).toMatchObject({ email: 'cliente@test.com' });

  await expect(page).toHaveURL(/confirmation/);
  await expect(page.getByText('Paiement réussi')).toBeVisible();
  await expect(page.getByText('cliente@test.com')).toBeVisible();
});`,
  },

];
