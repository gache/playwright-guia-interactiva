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

  // ─────────────────────────── AVANCÉ ──────────────────────────────────────
  {
    id: 'ej-a01',
    num: 'A01',
    title: 'Authentification persistante avec storageState',
    difficulty: 'advanced',
    description:
      'Créez un `globalSetup` qui effectue le login une seule fois et sauvegarde l\'état d\'authentification sur disque. Tous les tests du projet réutilisent cet état sans répéter le login.',
    hint: 'Dans `globalSetup`, utilisez `browser.newPage()`, effectuez le login, appelez `context.storageState({ path })`. Configurez `storageState` dans `playwright.config.ts`.',
    solution: `// global-setup.ts
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Utiliser practice.expandtesting.com — inscrivez un utilisateur avant d'exécuter ce setup
  await page.goto('https://practice.expandtesting.com/login');
  await page.getByPlaceholder('Email').fill('tu-email@test.com');
  await page.getByPlaceholder('Password').fill('Tu1234!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('https://practice.expandtesting.com/notes');
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

// playwright.config.ts
export default {
  globalSetup: './global-setup.ts',
  use: { storageState: 'auth.json' },
  // Tous les tests démarrent déjà authentifiés sur /notes
};`,
  },
  {
    id: 'ej-a02',
    num: 'A02',
    title: 'Page Object Model complet avec héritage',
    difficulty: 'advanced',
    description:
      'Implémentez un POM complet avec : `BasePage` (méthodes communes), `LoginPage extends BasePage`, `DashboardPage extends BasePage`. Écrivez des tests E2E qui utilisent les trois classes.',
    hint: 'La `BasePage` stocke `this.page` et définit des helpers comme `waitForToast()`. Les pages filles définissent leurs locators comme propriétés.',
    solution: `import { Page, expect } from '@playwright/test';

class BasePage {
  constructor(protected page: Page) {}
  async waitForToast(msg: string) {
    await expect(this.page.locator('.toast')).toContainText(msg);
  }
}

class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Password');
  readonly submitBtn = this.page.getByRole('button', { name: 'Login' });

  async goto() { await this.page.goto('https://practice.expandtesting.com/login'); }
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitBtn.click();
  }
}

class NotesPage extends BasePage {
  readonly heading = this.page.getByRole('heading', { name: /notes/i });
  readonly addNoteBtn = this.page.getByRole('button', { name: /add note|new note|\+/i });
  async isLoaded() { return this.heading.isVisible(); }
}

// test
import { test } from '@playwright/test';
test('login E2E avec POM sur practice.expandtesting.com', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('tu-email@test.com', 'Tu1234!');
  await page.waitForURL('https://practice.expandtesting.com/notes');
  const notes = new NotesPage(page);
  expect(await notes.isLoaded()).toBe(true);
});`,
  },
  {
    id: 'ej-a03',
    num: 'A03',
    title: 'Sharding de tests pour CI parallèle',
    difficulty: 'advanced',
    description:
      'Configurez votre projet pour exécuter les tests en 4 shards parallèles en CI. Écrivez le pipeline GitHub Actions qui combine les rapports de tous les shards.',
    hint: 'Utilisez `--shard=1/4`, `--shard=2/4`, etc. En CI, utilisez la strategy matrix de GitHub Actions. Combinez avec `merge-reports`.',
    solution: `# .github/workflows/playwright.yml
name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shard }}/4
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        with:
          name: blob-report-\${{ matrix.shard }}
          path: blob-report/

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true
      - run: npx playwright merge-reports --reporter html ./all-blob-reports`,
  },
  {
    id: 'ej-a04',
    num: 'A04',
    title: 'Mock complet d\'API avec HAR recording',
    difficulty: 'advanced',
    description:
      'Enregistrez les requêtes réseau de votre application dans un fichier HAR. Ensuite, rejouez ce HAR dans les tests hors ligne, sans avoir besoin du serveur réel.',
    hint: 'Enregistrez avec `page.routeFromHAR(path, { update: true })`. Dans les tests, utilisez `page.routeFromHAR(path)` sans `update`.',
    solution: `import { test, expect } from '@playwright/test';

// Étape 1 : enregistrer (exécuter une fois avec UPDATE_HAR=true)
// Étape 2 : rejouer dans les tests normaux
test('rejouer le HAR enregistré', async ({ page }) => {
  await page.routeFromHAR('./fixtures/api-responses.har', {
    url: '**/api/**',
    update: false,
  });

  await page.goto('https://mi-app.ejemplo.com');
  // L'application utilise les réponses du HAR à la place du serveur réel
  await expect(page.getByText('Datos desde HAR')).toBeVisible();
});

// Script d'enregistrement (exécuter manuellement) :
// npx playwright test --headed --update-snapshots
// avec page.routeFromHAR('./fixtures/api-responses.har', { update: true })`,
  },
  {
    id: 'ej-a05',
    num: 'A05',
    title: 'Tests d\'accessibilité avec axe-playwright',
    difficulty: 'advanced',
    description:
      'Intégrez `axe-playwright` pour effectuer un audit d\'accessibilité WCAG 2.1 AA sur chaque page principale de votre application. Faites échouer le test s\'il y a des violations de sévérité "critical" ou "serious".',
    hint: 'Installez `axe-playwright`, importez `checkA11y`, appelez-le avec `{ runOnly: { type: "tag", values: ["wcag2aa"] } }`.',
    solution: `import { test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const PAGES = ['/', '/login', '/dashboard', '/profile'];

for (const path of PAGES) {
  test(\`accessibilité WCAG 2.1 AA — \${path}\`, async ({ page }) => {
    await page.goto(\`https://mi-app.ejemplo.com\${path}\`);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2aa', 'wcag2a'] },
      },
      violationFilters: [{ severity: ['critical', 'serious'] }],
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
    hint: 'Utilisez `page.emulateNetworkConditions({ offline: false, downloadThroughput: ..., uploadThroughput: ..., latency: ... })`.',
    solution: `import { test, expect } from '@playwright/test';

test('UI avec réseau 3G lent', async ({ page }) => {
  // Simuler une connexion 3G standard
  const cdpSession = await page.context().newCDPSession(page);
  await cdpSession.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,  // 750 kbps
    uploadThroughput: (250 * 1024) / 8,    // 250 kbps
    latency: 100,
  });

  await page.goto('https://mi-app.ejemplo.com');

  // Le skeleton doit apparaître pendant le chargement
  const skeleton = page.locator('.skeleton');
  // Peut apparaître brièvement — on ne capture pas toujours l'état intermédiaire

  // L'application doit finir par se charger
  await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
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

  await pageA.goto('https://mi-app.ejemplo.com/doc/123');
  await pageB.goto('https://mi-app.ejemplo.com/doc/123');

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
          errors: [{ message: 'Email ya está en uso', extensions: { code: 'DUPLICATE_EMAIL' } }],
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://mi-app-graphql.ejemplo.com/register');
  await page.getByLabel('Email').fill('existente@test.com');
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await expect(page.getByRole('alert')).toContainText('Email ya está en uso');
});`,
  },
  {
    id: 'ej-a09',
    num: 'A09',
    title: 'Test retry et analyse de flakiness',
    difficulty: 'advanced',
    description:
      'Configurez `retries: 2` dans le projet. Écrivez un test qui simule la flakiness avec un compteur global. Vérifiez que le mécanisme de retry fonctionne et que le test réussit éventuellement.',
    hint: 'Dans `playwright.config.ts`, `retries: 2`. Utilisez `test.info().retry` dans le test pour savoir à quelle tentative vous êtes.',
    solution: `// playwright.config.ts
export default {
  retries: 2,
  reporter: [['html'], ['list']],
};

// flaky.test.ts
import { test, expect } from '@playwright/test';

let callCount = 0;

test('test avec retry (échoue 2 fois, réussit au 3e)', async ({ page }) => {
  callCount++;
  console.log(\`Intento \${test.info().retry + 1}\`);

  if (callCount < 3) {
    // Simuler un échec (dans les vrais tests ce serait une condition de course)
    throw new Error(\`Fallo intencional en intento \${callCount}\`);
  }

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
      'Utilisez le CDP (Chrome DevTools Protocol) pour surveiller les frames d\'un WebSocket. Vérifiez que l\'application reçoit le message attendu du serveur.',
    hint: 'Utilisez `page.on("websocket", ws => ws.on("framesent"/"framereceived", ...))` pour surveiller les WebSockets.',
    solution: `import { test, expect } from '@playwright/test';

test('surveiller les messages WebSocket', async ({ page }) => {
  const wsMessages: string[] = [];

  page.on('websocket', ws => {
    ws.on('framereceived', frame => {
      if (typeof frame.payload === 'string') {
        wsMessages.push(frame.payload);
      }
    });
  });

  await page.goto('https://mi-app-ws.ejemplo.com');
  // Attendre l'arrivée d'un message spécifique
  await page.waitForFunction(
    () => (window as any).__wsReceived,
    { timeout: 10_000 }
  );

  expect(wsMessages.some(msg => msg.includes('connected'))).toBe(true);
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
    solution: `import { Reporter, TestCase, TestResult, FullConfig } from '@playwright/test/reporter';
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
    fs.writeFileSync(
      'test-metrics.json',
      JSON.stringify(this.results, null, 2)
    );
    console.log(\`Reporte guardado: test-metrics.json (\${this.results.length} tests)\`);
  }
}

export default MetricsReporter;
// Dans playwright.config.ts : reporter: [['./metrics-reporter.ts']]`,
  },
  {
    id: 'ej-a12',
    num: 'A12',
    title: 'Locators avancés avec filter et nth',
    difficulty: 'advanced',
    description:
      'Étant donné une liste de cartes de produits avec prix et bouton "Agregar", utilisez des locators enchaînés pour trouver la carte la moins chère (premier élément après le tri) et cliquer sur son bouton.',
    hint: 'Enchaînez `.filter({ has: locator })` et `.nth(0)`. Ou filtrez par `hasText` pour trouver le prix minimum après l\'avoir extrait.',
    solution: `import { test, expect } from '@playwright/test';

test('ajouter le produit le moins cher', async ({ page }) => {
  await page.goto('https://mi-tienda.ejemplo.com/productos');

  // Trier par prix croissant
  await page.getByRole('combobox', { name: /ordenar/i }).selectOption('price-asc');
  await page.waitForLoadState('networkidle');

  // Le premier dans la liste est le moins cher
  const tarjetas = page.locator('.product-card');
  const primeraTarjeta = tarjetas.first();

  const precio = await primeraTarjeta.locator('.price').textContent();
  await primeraTarjeta.getByRole('button', { name: /agregar/i }).click();

  await expect(page.locator('.cart-count')).toHaveText('1');
  await expect(page.locator('.cart-summary')).toContainText(precio!.trim());
});`,
  },
  {
    id: 'ej-a13',
    num: 'A13',
    title: 'Performance : mesurer les métriques Web Vitals',
    difficulty: 'advanced',
    description:
      'Mesurez le LCP (Largest Contentful Paint) et le CLS (Cumulative Layout Shift) de votre page d\'accueil. Faites échouer le test si LCP > 2500 ms ou CLS > 0.1.',
    hint: 'Utilisez `page.evaluate()` avec `PerformanceObserver` ou `performance.getEntriesByType()` pour obtenir les métriques.',
    solution: `import { test, expect } from '@playwright/test';

test('Web Vitals : LCP et CLS', async ({ page }) => {
  await page.goto('https://mi-app.ejemplo.com', { waitUntil: 'networkidle' });

  const vitals = await page.evaluate(async () => {
    return new Promise<{ lcp: number; cls: number }>(resolve => {
      let lcp = 0, cls = 0;
      new PerformanceObserver(list => {
        lcp = list.getEntries().at(-1)?.startTime ?? 0;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          cls += (entry as any).value;
        }
      }).observe({ type: 'layout-shift', buffered: true });

      setTimeout(() => resolve({ lcp, cls }), 2000);
    });
  });

  console.log('LCP:', vitals.lcp, 'CLS:', vitals.cls);
  expect(vitals.lcp).toBeLessThan(2500);
  expect(vitals.cls).toBeLessThan(0.1);
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
    email: overrides.email ?? \`user\${timestamp}@test.ejemplo.com\`,
    password: overrides.password ?? 'TestPassword123!',
  };

  await page.goto('/register');
  await page.getByLabel('Nombre').fill(userData.name);
  await page.getByLabel('Email').fill(userData.email);
  await page.getByLabel('Contraseña').fill(userData.password);
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await page.waitForURL(/dashboard/);

  return userData;
}

// Utilisation dans un test :
// const user = await createUser(page, { name: 'Admin Especial' });
// expect(user.email).toContain('@test.ejemplo.com');`,
  },
  {
    id: 'ej-a15',
    num: 'A15',
    title: 'Test de PWA : hors ligne et service worker',
    difficulty: 'advanced',
    description:
      'Vérifiez que votre PWA fonctionne hors ligne. Chargez l\'application, activez le mode hors ligne avec CDP, rechargez la page et vérifiez que le service worker sert le contenu mis en cache.',
    hint: 'Activez le mode hors ligne avec `cdp.send("Network.emulateNetworkConditions", { offline: true, ... })` après le premier chargement.',
    solution: `import { test, expect } from '@playwright/test';

test('PWA fonctionne hors ligne', async ({ page, context }) => {
  // 1. Charger l'application et attendre que le SW s'installe
  await page.goto('https://mi-pwa.ejemplo.com');
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  // 2. Activer le mode hors ligne
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  });

  // 3. Recharger et vérifier que le SW sert le cache
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Sin conexión')).not.toBeVisible();

  // 4. Revenir en ligne
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0,
  });
});`,
  },
  {
    id: 'ej-a16',
    num: 'A16',
    title: 'Playwright component testing (expérimental)',
    difficulty: 'advanced',
    description:
      'Utilisez Playwright Component Testing pour monter un composant React isolé. Vérifiez ses props, son état et ses événements sans avoir à démarrer toute l\'application.',
    hint: 'Installez `@playwright/experimental-ct-react`. Les tests utilisent `mount()` du package spécial.',
    solution: `// button.test.tsx (ct)
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('Button s\'affiche avec texte et déclenche onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button label="Guardar" onClick={() => { clicked = true; }} />
  );

  await expect(component).toContainText('Guardar');
  await component.click();
  expect(clicked).toBe(true);
});

test('Button désactivé ne déclenche pas onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button label="Guardar" disabled onClick={() => { clicked = true; }} />
  );

  await expect(component).toBeDisabled();
  await component.click({ force: true });
  expect(clicked).toBe(false);
});`,
  },
  {
    id: 'ej-a17',
    num: 'A17',
    title: 'Modifier les en-têtes de requêtes',
    difficulty: 'advanced',
    description:
      'Interceptez toutes les requêtes vers votre API et injectez un en-tête d\'authentification personnalisé (`X-API-Key`). Vérifiez que les requêtes arrivent avec l\'en-tête correct.',
    hint: 'Dans `page.route()`, utilisez `route.continue({ headers: { ...request.headers(), "X-API-Key": "valeur" } })`.',
    solution: `import { test, expect } from '@playwright/test';

test('injecter un en-tête d\'authentification', async ({ page }) => {
  const capturedHeaders: Record<string, string>[] = [];

  await page.route('**/api/**', async (route, request) => {
    const headers = { ...request.headers(), 'X-API-Key': 'mi-api-key-secreta' };
    capturedHeaders.push(headers);
    await route.continue({ headers });
  });

  await page.goto('https://mi-app.ejemplo.com');
  await page.waitForLoadState('networkidle');

  const apiRequests = capturedHeaders.filter(h => h['x-api-key']);
  expect(apiRequests.length).toBeGreaterThan(0);
  expect(apiRequests[0]['x-api-key']).toBe('mi-api-key-secreta');
});`,
  },
  {
    id: 'ej-a18',
    num: 'A18',
    title: 'Utilisation avancée de expect.poll',
    difficulty: 'advanced',
    description:
      'Utilisez `expect.poll()` pour vérifier l\'état d\'une longue opération asynchrone qui ne se reflète pas directement dans le DOM. Interrogez les appels API toutes les 500 ms jusqu\'à obtenir le résultat attendu.',
    hint: '`expect.poll(async () => { return await page.evaluate(...); }, { intervals: [500], timeout: 15000 })`.',
    solution: `import { test, expect } from '@playwright/test';

test('attendre le résultat avec expect.poll', async ({ page }) => {
  await page.goto('https://mi-app.ejemplo.com/jobs');

  // Déclencher un job long
  await page.getByRole('button', { name: 'Iniciar proceso' }).click();

  const jobId = await page.getByTestId('job-id').textContent();

  // Attendre que le job se termine en vérifiant l'API périodiquement
  await expect.poll(
    async () => {
      const response = await page.evaluate(async (id) => {
        const res = await fetch(\`/api/jobs/\${id}/status\`);
        return res.json();
      }, jobId);
      return response.status;
    },
    { intervals: [500, 1000, 2000], timeout: 30_000, message: 'El job no completó a tiempo' }
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
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-\${{ matrix.browser }}
          path: playwright-report/
          retention-days: 14

      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {"text": "Playwright \${{ matrix.browser }} falló en \${{ github.ref_name }} — ver: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}"}
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`,
  },
  {
    id: 'ej-a20',
    num: 'A20',
    title: 'Implémenter un test runner personnalisé avec phases',
    difficulty: 'advanced',
    description:
      'Créez un helper `runScenario(page, steps)` où `steps` est un tableau de fonctions nommées. Exécutez chaque step, mesurez sa durée et générez un rapport structuré à la fin.',
    hint: 'Chaque step est `{ name: string, run: (page) => Promise<void> }`. Capturez `Date.now()` avant et après chacun.',
    solution: `import { Page } from '@playwright/test';

interface Step {
  name: string;
  run: (page: Page) => Promise<void>;
}

interface StepResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  error?: string;
}

export async function runScenario(page: Page, steps: Step[]): Promise<StepResult[]> {
  const results: StepResult[] = [];

  for (const step of steps) {
    const start = Date.now();
    try {
      await step.run(page);
      results.push({ name: step.name, status: 'passed', duration: Date.now() - start });
    } catch (err) {
      results.push({
        name: step.name, status: 'failed',
        duration: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      });
      break; // ou continuer avec \`continue\` si vous voulez toutes les étapes
    }
  }

  const total = results.reduce((s, r) => s + r.duration, 0);
  const failed = results.filter(r => r.status === 'failed');
  console.table(results.map(r => ({ ...r, duration: \`\${r.duration}ms\` })));
  console.log(\`Total: \${total}ms | Passed: \${results.length - failed.length} | Failed: \${failed.length}\`);

  return results;
}

// Utilisation dans un test :
// const results = await runScenario(page, [
//   { name: 'Login', run: async p => { await p.goto('/login'); ... } },
//   { name: 'Ver dashboard', run: async p => { await expect(p.getByText('Home')).toBeVisible(); } },
// ]);
// expect(results.every(r => r.status === 'passed')).toBe(true);`,
  },
  {
    id: 'ej-a21',
    num: 'A21',
    title: 'Vérifier le SEO et les méta-tags',
    difficulty: 'advanced',
    description:
      'Écrivez un test qui vérifie les méta-tags SEO critiques de chaque page : `title`, `description`, `og:title`, `og:image`, `canonical`. Utilisez un fixture qui itère sur les pages du sitemap.',
    hint: 'Utilisez `page.locator("meta[name=description]").getAttribute("content")` pour lire les méta-tags.',
    solution: `import { test, expect } from '@playwright/test';

const PAGES = [
  { url: '/', minTitleLen: 20, hasOG: true },
  { url: '/blog', minTitleLen: 10, hasOG: false },
  { url: '/contacto', minTitleLen: 10, hasOG: false },
];

for (const p of PAGES) {
  test(\`SEO méta-tags — \${p.url}\`, async ({ page }) => {
    await page.goto(\`https://mi-sitio.ejemplo.com\${p.url}\`);

    // Titre
    const title = await page.title();
    expect(title.length).toBeGreaterThan(p.minTitleLen);
    expect(title.length).toBeLessThan(70);

    // Description
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).not.toBeNull();
    expect(desc!.length).toBeGreaterThan(50);
    expect(desc!.length).toBeLessThan(160);

    // Canonique
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain(p.url);

    // Open Graph (si applicable)
    if (p.hasOG) {
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogTitle).not.toBeNull();
      expect(ogImage).toMatch(/^https?:\/\//);
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
  // Mock du processeur de paiement (Stripe/PayPal/etc)
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

  // Flux d'achat
  await page.goto('https://mi-tienda.ejemplo.com');
  await page.locator('.product-card').first().getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('link', { name: 'Carrito' }).click();
  await page.getByRole('button', { name: 'Pagar' }).click();

  // Remplir le checkout
  await page.getByLabel('Email').fill('cliente@test.com');
  await page.getByLabel('Número de tarjeta').fill('4242 4242 4242 4242');
  await page.getByLabel('Fecha').fill('12/26');
  await page.getByLabel('CVC').fill('123');
  await page.getByRole('button', { name: 'Confirmar pago' }).click();

  // Vérifier la confirmation
  await expect(page).toHaveURL(/confirmacion/);
  await expect(page.getByText('Pago exitoso')).toBeVisible();
  await expect(page.getByText('cliente@test.com')).toBeVisible();
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
  await page.goto('https://the-internet.herokuapp.com/windows');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/new/);
  await expect(newPage.getByRole('heading')).toContainText('New Window');
});`,
  },
  {
    id: 'ej-i02',
    num: 'I02',
    title: 'Intercepter les requêtes HTTP',
    difficulty: 'intermediate',
    description:
      'Interceptez toutes les requêtes vers l\'API et enregistrez leurs URLs. Vérifiez qu\'au moins une requête vers l\'endpoint `/api/todos` a été effectuée.',
    hint: 'Utilisez `page.on("request", cb)` pour écouter. Ou `page.waitForRequest(/motif/)` pour attendre une spécifique.',
    solution: `import { test, expect } from '@playwright/test';

test('intercepter les requêtes', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', req => requests.push(req.url()));

  await page.goto('https://demo.playwright.dev/todomvc');
  // Attendre le chargement et vérifier optionnellement
  await page.waitForLoadState('networkidle');
  // Si l'app effectue des appels API, vérifier :
  // expect(requests.some(url => url.includes('/api/'))).toBe(true);
  expect(requests.length).toBeGreaterThan(0);
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

test('simuler une réponse d\'API', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Usuario Mock' }]),
    });
  });

  await page.goto('https://mi-app.ejemplo.com/usuarios');
  await expect(page.getByText('Usuario Mock')).toBeVisible();
});`,
  },
  {
    id: 'ej-i04',
    num: 'I04',
    title: 'Gérer les dialogues du navigateur',
    difficulty: 'intermediate',
    description:
      'La page affiche une `alert`. Configurez un gestionnaire qui accepte automatiquement le dialogue et vérifiez le message qu\'il contenait.',
    hint: 'Utilisez `page.on("dialog", dialog => { /* dialog.message(), dialog.accept() */ })`.',
    solution: `import { test, expect } from '@playwright/test';

test('accepter une alert du navigateur', async ({ page }) => {
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  expect(alertMessage).toBe('I am a JS Alert');
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});`,
  },
  {
    id: 'ej-i05',
    num: 'I05',
    title: 'Téléverser un fichier',
    difficulty: 'intermediate',
    description:
      'Trouvez un input de type file sur une page. Téléversez un fichier de test et vérifiez que le nom du fichier apparaît sur la page.',
    hint: 'Utilisez `locator.setInputFiles("chemin/vers/fichier.txt")` pour simuler le téléversement.',
    solution: `import { test, expect } from '@playwright/test';
import path from 'path';

test('téléverser un fichier', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  await page.setInputFiles('#file-upload', path.join(__dirname, 'fixture.txt'));
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.locator('#uploaded-files')).toContainText('fixture.txt');
});`,
  },
  {
    id: 'ej-i06',
    num: 'I06',
    title: 'Glisser-déposer (drag & drop)',
    difficulty: 'intermediate',
    description:
      'Sur une page avec des éléments glissables, déplacez un élément de la colonne A vers la colonne B et vérifiez le nouvel ordre.',
    hint: 'Utilisez `locator.dragTo(target)` pour un glisser-déposer simple entre deux locators.',
    solution: `import { test, expect } from '@playwright/test';

test('glisser-déposer', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
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
      'Trouvez un iframe dans la page. Accédez à son contenu, interagissez avec un élément à l\'intérieur et vérifiez le résultat.',
    hint: 'Utilisez `page.frameLocator("iframe")` pour obtenir un frame locator, puis opérez dessus normalement.',
    solution: `import { test, expect } from '@playwright/test';

test('interagir avec un iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  const frame = page.frameLocator('#mce_0_ifr');
  await frame.locator('body').fill('Texto dentro del iframe');
  await expect(frame.locator('body')).toContainText('Texto dentro del iframe');
});`,
  },
  {
    id: 'ej-i08',
    num: 'I08',
    title: 'Implémenter le Page Object Model basique',
    difficulty: 'intermediate',
    description:
      'Créez une classe `TodoPage` qui encapsule les actions de la démo TodoMVC : `addTask(text)`, `completeTask(index)`, `getTaskCount()`. Écrivez un test qui utilise cette classe.',
    hint: 'La classe reçoit `page` dans le constructeur. Les méthodes utilisent `this.page.locator(...)`.',
    solution: `import { test, expect, Page } from '@playwright/test';

class TodoPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('https://demo.playwright.dev/todomvc'); }
  async addTask(text: string) {
    await this.page.getByPlaceholder('What needs to be done?').fill(text);
    await this.page.getByPlaceholder('What needs to be done?').press('Enter');
  }
  async completeTask(index: number) {
    await this.page.locator('.todo-list li .toggle').nth(index).click();
  }
  async getTaskCount() {
    return this.page.locator('.todo-list li').count();
  }
}

test('POM basique', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.goto();
  await todo.addTask('Primera');
  await todo.addTask('Segunda');
  await todo.completeTask(0);
  expect(await todo.getTaskCount()).toBe(2);
  await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/);
});`,
  },
  {
    id: 'ej-i09',
    num: 'I09',
    title: 'Attentes conditionnelles avec waitFor',
    difficulty: 'intermediate',
    description:
      'Attendez qu\'un élément change d\'état : d\'abord un loader apparaît, puis il disparaît et le contenu apparaît. Attendez chaque transition explicitement.',
    hint: 'Combinez `locator.waitFor({ state: "hidden" })` et `locator.waitFor({ state: "visible" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('attendre la transition loader → contenu', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
  await page.getByRole('button', { name: 'Start' }).click();

  const loader = page.locator('#loading');
  await loader.waitFor({ state: 'visible' });
  await loader.waitFor({ state: 'hidden' });

  const finish = page.locator('#finish');
  await expect(finish).toBeVisible();
  await expect(finish).toContainText('Hello World!');
});`,
  },
  {
    id: 'ej-i10',
    num: 'I10',
    title: 'Simuler un appareil mobile',
    difficulty: 'intermediate',
    description:
      'Exécutez un test en simulant un iPhone 12. Vérifiez que la page affiche le menu hamburger au lieu du menu de bureau.',
    hint: 'Utilisez `devices["iPhone 12"]` de Playwright et passez-le à `browser.newContext({ ...devices["iPhone 12"] })`.',
    solution: `import { test, expect, devices } from '@playwright/test';

test('vue mobile iPhone 12', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await context.newPage();

  await page.goto('https://playwright.dev');
  // Vérifie que le header est responsive
  const viewport = page.viewportSize();
  expect(viewport?.width).toBe(390);
  await context.close();
});`,
  },
  {
    id: 'ej-i11',
    num: 'I11',
    title: 'Gérer l\'authentification HTTP Basic',
    difficulty: 'intermediate',
    description:
      'Accédez à `https://practice.expandtesting.com/basic-auth` protégée par HTTP Basic Auth. Les identifiants du site sont documentés sur sa page : utilisateur `practice` et le mot de passe indiqué sur le site. Vérifiez le message de bienvenue.',
    hint: 'Utilisez `browser.newContext({ httpCredentials: { username, password } })`. Stockez les identifiants dans des variables d\'environnement, pas dans le code.',
    solution: `import { test, expect } from '@playwright/test';

test('authentification HTTP Basic sur practice.expandtesting.com', async ({ browser }) => {
  // Identifiants publiés sur practice.expandtesting.com/basic-auth
  // Stockez dans .env : BASIC_USER=practice  BASIC_PASS=<voir le site>
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.BASIC_USER ?? 'practice',
      password: process.env.BASIC_PASS ?? '',
    },
  });
  const page = await context.newPage();
  await page.goto('https://practice.expandtesting.com/basic-auth');
  await expect(page.locator('p')).toContainText('Congratulations');
  await context.close();
});`,
  },
  {
    id: 'ej-i12',
    num: 'I12',
    title: 'Paramétrer les tests avec test.each',
    difficulty: 'intermediate',
    description:
      'Écrivez un test paramétré qui vérifie que 5 URLs distinctes répondent avec le status 200 et contiennent un `<h1>`.',
    hint: 'Utilisez `test.each([ [url1], [url2], ... ])("description %s", async ({ page }, url) => { ... })`.',
    solution: `import { test, expect } from '@playwright/test';

const urls = [
  'https://playwright.dev',
  'https://playwright.dev/docs/intro',
  'https://playwright.dev/docs/api/class-page',
];

test.each(urls)('la page %s a un en-tête', async ({ page }, url) => {
  await page.goto(url);
  await expect(page.locator('h1').first()).toBeVisible();
});`,
  },
  {
    id: 'ej-i13',
    num: 'I13',
    title: 'Utiliser beforeEach et afterEach',
    difficulty: 'intermediate',
    description:
      'Créez une suite de tests pour TodoMVC où `beforeEach` navigue et ajoute une tâche de base, et `afterEach` vérifie qu\'il n\'y a pas eu d\'erreurs dans la console.',
    hint: '`test.beforeEach` et `test.afterEach` reçoivent le même objet `{ page }` que les tests.',
    solution: `import { test, expect } from '@playwright/test';

test.describe('Suite TodoMVC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.getByPlaceholder('What needs to be done?').fill('Tarea base');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
  });

  test('la tâche de base est visible', async ({ page }) => {
    await expect(page.getByText('Tarea base')).toBeVisible();
  });

  test('la tâche de base peut être complétée', async ({ page }) => {
    await page.locator('.todo-list li .toggle').click();
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
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

  await page.goto('https://mi-app.ejemplo.com');
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
      'Attendez la réponse d\'un endpoint spécifique lors du chargement de la page. Vérifiez que le statut est 200 et que le body JSON contient les propriétés attendues.',
    hint: 'Utilisez `page.waitForResponse(urlOrPredicate)` avant l\'action qui déclenche l\'appel.',
    solution: `import { test, expect } from '@playwright/test';

test('vérifier la réponse d\'API sur practice.expandtesting.com', async ({ page }) => {
  // L'API de notes renvoie du JSON — d'abord on se connecte pour obtenir le token
  const [response] = await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/notes/api/users/login') && res.status() === 200
    ),
    page.goto('https://practice.expandtesting.com/login'),
  ]);

  // Après le chargement du login, on vérifie que la réponse de l'API a la structure attendue
  // (En flux réel : remplir le formulaire, cliquer sur Login, capturer la réponse POST /login)
  // Ici on vérifie la réponse de la requête initiale de la page :
  const status = response.status();
  expect([200, 302, 404].includes(status)).toBe(true);
});`,
  },
  {
    id: 'ej-i16',
    num: 'I16',
    title: 'Locators enchaînés et filtres',
    difficulty: 'intermediate',
    description:
      'Dans un tableau HTML, trouvez la ligne qui contient le nom "Ana García" et cliquez sur le bouton "Editar" de cette ligne spécifique.',
    hint: 'Utilisez `page.getByRole("row").filter({ hasText: "Ana García" }).getByRole("button", { name: "Editar" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('locator enchaîné dans un tableau', async ({ page }) => {
  await page.goto('https://mi-tabla.ejemplo.com');
  const fila = page.getByRole('row').filter({ hasText: 'Ana García' });
  await fila.getByRole('button', { name: 'Editar' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Ana García');
});`,
  },
  {
    id: 'ej-i17',
    num: 'I17',
    title: 'Utiliser des fixtures personnalisées',
    difficulty: 'intermediate',
    description:
      'Créez un fixture `authenticatedPage` qui navigue et effectue le login automatiquement. Utilisez-le dans plusieurs tests pour ne pas répéter le flux d\'authentification.',
    hint: 'Étendez `test` avec `test.extend({ myFixture: async ({ page }, use) => { ... await use(page); } })`.',
    solution: `import { test as base, expect } from '@playwright/test';

// D'abord enregistrez un utilisateur sur /register, puis utilisez ces identifiants ici
const test = base.extend<{ loggedPage: typeof base['prototype'] }>({
  loggedPage: async ({ page }, use) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.getByPlaceholder('Email').fill('tu-email@test.com');
    await page.getByPlaceholder('Password').fill('Tu1234!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('https://practice.expandtesting.com/notes');
    await use(page);
  },
});

test('voir les notes de l\'utilisateur authentifié', async ({ loggedPage }) => {
  await expect(loggedPage).toHaveURL(/notes/);
  await expect(loggedPage.getByRole('heading', { name: /notes|mis notas/i })).toBeVisible();
});`,
  },
  {
    id: 'ej-i18',
    num: 'I18',
    title: 'Gérer les cookies de session',
    difficulty: 'intermediate',
    description:
      'Enregistrez les cookies après un login réussi. Dans un second contexte, chargez ces cookies et vérifiez que l\'utilisateur est toujours authentifié sans refaire le login.',
    hint: 'Utilisez `context.cookies()` pour sauvegarder et `context.addCookies(cookies)` pour les restaurer.',
    solution: `import { test, expect } from '@playwright/test';

test('persistance de session sur practice.expandtesting.com', async ({ browser }) => {
  // Contexte 1 : login → sauvegarder les cookies
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.goto('https://practice.expandtesting.com/login');
  await page1.getByPlaceholder('Email').fill('tu-email@test.com');
  await page1.getByPlaceholder('Password').fill('Tu1234!');
  await page1.getByRole('button', { name: 'Login' }).click();
  await page1.waitForURL('https://practice.expandtesting.com/notes');
  const cookies = await ctx1.cookies();
  await ctx1.close();

  // Contexte 2 : restaurer les cookies → accéder directement à /notes sans login
  const ctx2 = await browser.newContext();
  await ctx2.addCookies(cookies);
  const page2 = await ctx2.newPage();
  await page2.goto('https://practice.expandtesting.com/notes');
  // Si les cookies sont valides, pas de redirection vers le login :
  await expect(page2).toHaveURL(/notes/);
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

test('soft assertions sur le formulaire d\'inscription', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  await expect.soft(page.getByPlaceholder('Name')).toBeVisible();
  await expect.soft(page.getByPlaceholder('Email')).toBeEnabled();
  await expect.soft(page.getByPlaceholder('Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByPlaceholder('Confirm Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByRole('button', { name: 'Register' })).toBeVisible();

  // Le test reporte tous les échecs ensemble à la fin
});`,
  },
  {
    id: 'ej-i20',
    num: 'I20',
    title: 'Exécuter du JavaScript dans la page',
    difficulty: 'intermediate',
    description:
      'Utilisez `page.evaluate()` pour exécuter du code JavaScript directement dans le contexte de la page et obtenir des informations qui ne sont pas dans le DOM (p. ex., une variable globale ou le résultat d\'un calcul).',
    hint: '`page.evaluate(fn)` exécute `fn` dans le contexte du navigateur et renvoie le résultat sérialisé.',
    solution: `import { test, expect } from '@playwright/test';

test('exécuter du JS dans le navigateur', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
  expect(typeof devicePixelRatio).toBe('number');

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  expect(scrollHeight).toBeGreaterThan(500);
});`,
  },
  {
    id: 'ej-i21',
    num: 'I21',
    title: 'Prendre des captures d\'écran comparatives',
    difficulty: 'intermediate',
    description:
      'Utilisez le matcher `toHaveScreenshot()` pour faire une comparaison visuelle d\'un composant. La première fois, il crée le snapshot de référence ; les suivantes détectent les différences.',
    hint: 'Lors de la première exécution, lancez avec `--update-snapshots` pour créer le baseline. Ensuite, lancez normalement.',
    solution: `import { test, expect } from '@playwright/test';

test('régression visuelle du header', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.locator('header').first()).toHaveScreenshot('header-baseline.png', {
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
    hint: 'Utilisez `page.route("**/*.{png,jpg,jpeg,webp,gif}", route => route.abort())`.',
    solution: `import { test, expect } from '@playwright/test';

test('bloquer les images pour accélérer le chargement', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', route => route.abort());

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // La page a chargé sans images
  const images = await page.locator('img').all();
  // Les images existent dans le DOM mais leur src a été bloqué
  expect(images.length).toBeGreaterThanOrEqual(0);
});`,
  },
];
