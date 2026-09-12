import type { Section } from '../../types';

export const sections: Section[] = [
  {
    "id": "s1",
    "num": "01",
    "group": "Fondamentaux",
    "title": "Installation",
    "difficulty": "beginner",
    "description": "Installez Playwright et les navigateurs nécessaires. La commande <code>init</code> configure tout automatiquement.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Avant d'écrire le moindre test, vous avez besoin d'un environnement prêt. Cette étape est la base de tout ce qui suit : sans les navigateurs installés, aucun test ne peut s'exécuter."
      },
      {
        "type": "code",
        "block": {
          "label": "bash",
          "langClass": "sh",
          "code": "# Initialiser le projet (recommandé — génère la config, les dossiers et télécharge les navigateurs)\nnpm init playwright@latest\n\n# Installer uniquement le paquet dans un projet existant\nnpm install --save-dev @playwright/test\n\n# Installer les navigateurs\nnpx playwright install             # tous\nnpx playwright install chromium    # Chrome uniquement\nnpx playwright install firefox\nnpx playwright install webkit      # Safari\n\n# Dépendances système\nnpx playwright install-deps"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "<strong>npm init playwright@latest</strong> est la façon la plus rapide : génère le dossier <code>tests/</code>, le fichier <code>playwright.config.ts</code> et télécharge les navigateurs en une seule étape."
      },
      {
        "type": "quiz",
        "id": "s1",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que fait la commande <code>npm init playwright@latest</code> ?",
        "options": [
          "Installe seulement le paquet Playwright, sans rien configurer d'autre.",
          "Exécute les tests existants en mode headless.",
          "Génère un rapport HTML de la dernière exécution.",
          "Crée le dossier de tests, le fichier de configuration et télécharge les navigateurs en une seule étape."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>npm init playwright@latest</code> est le scaffolding officiel : il génère <code>tests/</code>, <code>playwright.config.ts</code> et télécharge les navigateurs automatiquement."
      }
    ]
  },
  {
    "id": "s2",
    "num": "02",
    "group": "Fondamentaux",
    "title": "Structure de Base d'un Test",
    "difficulty": "beginner",
    "description": "Voici le squelette que vous allez répéter dans chaque fichier de test : importer <code>test</code> et <code>expect</code>, décrire le test avec un nom clair, et utiliser <code>await</code> à chaque étape.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Chaque test Playwright suit la même forme : un nom descriptif, le fixture <code>page</code>, et <code>await</code> à chaque étape parce que le navigateur est un processus externe qui met du temps à répondre. Avec TypeScript, vous bénéficiez en plus de l'autocomplétion sur toute l'API sans avoir à mémoriser la documentation."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { test, expect } from '@playwright/test';\n\ntest('flujo de login completo', async ({ page }) => {\n  await page.goto('/login');                     // utilise baseURL de la config\n\n  await page.getByLabel('Email').fill('user@test.com');\n  await page.getByLabel('Contraseña').fill('secret123');\n  await page.getByRole('button', { name: 'Entrar' }).click();\n\n  // Vérifier la redirection vers le dashboard\n  await expect(page).toHaveURL(/dashboard/);\n  await expect(page.getByText('Bienvenido')).toBeVisible();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s2",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Dans l'exemple, <code>page.goto('/login')</code> navigue vers une URL relative. D'où Playwright tire-t-il le domaine complet ?",
        "options": [
          "De la variable d'environnement NODE_ENV.",
          "De la dernière URL visitée dans le test précédent.",
          "De <code>baseURL</code>, défini dans <code>playwright.config.ts</code>.",
          "Il le demande comme paramètre obligatoire dans <code>test()</code>."
        ],
        "answerIndex": 2,
        "explanationHtml": "Quand vous définissez <code>use: { baseURL: '...' }</code> dans la configuration, tout chemin relatif (<code>/login</code>, <code>/dashboard</code>) est automatiquement complété par rapport à cette base."
      }
    ]
  },
  {
    "id": "s3",
    "num": "03",
    "group": "Fondamentaux",
    "title": "Browser & Context",
    "difficulty": "intermediate",
    "description": "Le <strong>Browser</strong> est l'instance du navigateur. Le <strong>BrowserContext</strong> est un profil isolé (comme une fenêtre privée). Idéal pour simuler plusieurs utilisateurs simultanés.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Comprendre la différence entre Browser et BrowserContext vous permet de simuler plusieurs utilisateurs (ou sessions) en même temps sans ouvrir plusieurs navigateurs."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { chromium } from '@playwright/test';\n\nconst browser = await chromium.launch({\n  headless: false,   // true = sans fenêtre visible\n  slowMo: 50,         // ms de pause entre les actions (utile pour déboguer)\n});\n\nconst context = await browser.newContext({\n  ignoreHTTPSErrors: true,\n  viewport: { width: 1280, height: 720 },\n  locale: 'es-MX',\n  storageState: './auth.json',  // session enregistrée précédemment\n});\n\nconst page = await context.newPage();\nawait page.goto('https://mi-app.com');\n\nawait context.close();\nawait browser.close();"
        }
      },
      {
        "type": "callout",
        "variant": "info",
        "icon": "ℹ️",
        "html": "Dans des tests normaux, vous utilisez directement le <code>page</code> du fixture. Créer un browser/context manuellement est utile pour des tests avec plusieurs rôles d'utilisateur simultanés."
      },
      {
        "type": "quiz",
        "id": "s3",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Qu'est-ce qu'un <code>BrowserContext</code> ?",
        "options": [
          "Un profil isolé au sein du même navigateur, comme une fenêtre de navigation privée, idéal pour simuler des utilisateurs différents.",
          "Une autre instance complète du navigateur, plus lourde que Browser.",
          "Le fichier de configuration de Playwright.",
          "Un type de locator pour sélectionner des éléments."
        ],
        "answerIndex": 0,
        "explanationHtml": "Un Browser peut avoir plusieurs BrowserContexts, chacun avec ses propres cookies, storage et session — parfait pour des tests nécessitant deux utilisateurs simultanés (par exemple, tester un chat)."
      }
    ]
  },
  {
    "id": "s4",
    "num": "04",
    "group": "Interaction",
    "title": "Navigation de Page",
    "difficulty": "beginner",
    "description": "Méthodes pour contrôler la navigation : aller vers des URLs, recharger, utiliser l'historique et attendre des états de chargement.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Savoir attendre le bon moment (URL, état de chargement) évite des tests qui échouent de façon aléatoire juste après un login ou un submit."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.goto('https://mi-app.com/productos');\nawait page.goto('/dashboard');                    // relative à baseURL\n\nawait page.goBack();\nawait page.goForward();\nawait page.reload();\n\n// Attendre que l'URL change (après login, redirect…)\nawait page.waitForURL('**/dashboard');    // motif glob\nawait page.waitForURL(/\\/dashboard/);    // regex\n\n// Attendre des états de chargement\nawait page.waitForLoadState('load');\nawait page.waitForLoadState('domcontentloaded');\nawait page.waitForLoadState('networkidle');  // réseau inactif ≥500ms"
        }
      },
      {
        "type": "quiz",
        "id": "s4",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quelle différence y a-t-il entre <code>waitForLoadState('load')</code> et <code>waitForLoadState('networkidle')</code> ?",
        "options": [
          "Ce sont des synonymes, il n'y a pas de différence réelle.",
          "'networkidle' est toujours plus rapide.",
          "'load' attend l'événement de chargement du document ; 'networkidle' attend qu'il n'y ait aucune requête réseau active pendant au moins 500ms.",
          "'load' ne fonctionne que sur Chromium."
        ],
        "answerIndex": 2,
        "explanationHtml": "\"networkidle\" est utile pour les applis qui chargent des données en AJAX après le rendu initial, mais Playwright recommande de préférer attendre un élément visible plutôt que de dépendre d'états réseau génériques."
      }
    ]
  },
  {
    "id": "s5",
    "num": "05",
    "group": "Interaction",
    "title": "Locators",
    "difficulty": "beginner",
    "description": "Les locators sélectionnent des éléments. Playwright recommande des locators sémantiques plutôt que du CSS fragile, car ils résistent mieux aux changements de design.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Les locators sont la base de chaque interaction. En choisir un fragile (comme une classe CSS qui change à chaque refonte) est la cause numéro un des tests qui cassent sans qu'il y ait de vrai bug."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Tous les types",
          "langClass": "ts",
          "code": "// ── CSS / XPath ──────────────────────────────────────\npage.locator('button.submit')\npage.locator('#form input[type=\"email\"]')\n\n// ── ✅ Sémantiques (préférés) ───────────────────────\npage.getByRole('button', { name: 'Enviar' })\npage.getByRole('textbox', { name: 'Email' })\npage.getByRole('link', { name: 'Inicio' })\npage.getByLabel('Contraseña')\npage.getByPlaceholder('Escribe tu email')\npage.getByText('Bienvenido')\npage.getByText(/bienvenido/i)           // regex, insensible à la casse\npage.getByAltText('Logo empresa')\npage.getByTestId('submit-btn')          // data-testid\n\n// ── Filtrer et chaîner ──────────────────────────────\npage.locator('.card').filter({ hasText: 'Disponible' })\npage.locator('li').nth(2)               // troisième élément\npage.locator('li').first()\npage.locator('li').last()\n\n// ── Tous les éléments ──────────────────────────────\nconst items  = await page.locator('li').all();\nconst textos = await page.locator('li').allTextContents();\nconst total  = await page.locator('li').count();\n\n// ── État ───────────────────────────────────────────\nconst visible = await page.locator('#modal').isVisible();\nconst enabled = await page.locator('button').isEnabled();"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Ordre de préférence : <strong>getByRole</strong> › <strong>getByLabel</strong> › <strong>getByTestId</strong> › CSS. Les deux premiers reflètent la façon dont les vrais utilisateurs interagissent avec l'interface."
      },
      {
        "type": "exercise",
        "title": "Exercice — Trouvez les bons éléments",
        "taskHtml": "Étant donné ce HTML :\n          <br><br>\n          <code>&lt;form&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;label for=\"u\"&gt;Utilisateur&lt;/label&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;input id=\"u\" placeholder=\"Votre nom d'utilisateur\"&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;button type=\"submit\"&gt;Créer un compte&lt;/button&gt;</code><br>\n          <code>&lt;/form&gt;</code>\n          <br><br>\n          Écrivez trois locators différents pour sélectionner le champ de texte, et un pour le bouton de submit. Utilisez la forme la plus sémantique possible.",
        "solution": {
          "label": "Solution",
          "langClass": "ts",
          "code": "// Champ de texte — 3 façons\npage.getByLabel('Usuario')                          // ✅ meilleure option\npage.getByPlaceholder('Tu nombre de usuario')         // ✅ également valide\npage.getByRole('textbox', { name: 'Usuario' })       // ✅ sémantique\n\n// Bouton\npage.getByRole('button', { name: 'Crear cuenta' })   // ✅ le meilleur choix\npage.getByText('Crear cuenta')                       // fonctionne mais moins précis"
        }
      },
      {
        "type": "quiz",
        "id": "s5",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Selon l'ordre de préférence recommandé, quel locator devriez-vous utiliser en premier ?",
        "options": [
          "<code>getByRole()</code>, car il reflète la façon dont les vrais utilisateurs interagissent avec l'interface.",
          "XPath, car c'est le plus flexible.",
          "Un sélecteur CSS imbriqué comme <code>div &gt; form &gt; button:nth-child(3)</code>.",
          "<code>getByTestId()</code>, c'est toujours le meilleur choix."
        ],
        "answerIndex": 0,
        "explanationHtml": "L'ordre recommandé est getByRole › getByLabel › getByTestId › CSS. Les deux premiers sont \"sémantiques\" : ils dépendent du sens de l'élément (son rôle, son label), pas de détails d'implémentation qui changent avec le design."
      }
    ]
  },
  {
    "id": "s6",
    "num": "06",
    "group": "Interaction",
    "title": "Actions",
    "difficulty": "beginner",
    "description": "Playwright attend automatiquement que l'élément soit visible, activé et stable avant d'exécuter chaque action.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Playwright attend déjà automatiquement qu'un élément soit visible et activé avant d'agir. Vous n'avez pas besoin d'écrire ce code vous-même, mais vous devez savoir quelle action utiliser dans chaque cas."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const btn   = page.getByRole('button', { name: 'Enviar' });\nconst email = page.getByLabel('Email');\n\n// Clics\nawait btn.click();\nawait btn.dblclick();\nawait btn.click({ button: 'right' });\nawait btn.click({ modifiers: ['Control'] });\n\n// Formulaires\nawait email.fill('user@correo.com');   // efface et écrit\nawait email.clear();\nawait email.type('lento', { delay: 80 }); // simule une frappe réelle\nawait email.press('Tab');\nawait page.keyboard.press('Control+A');\n\n// Checkbox / Radio\nawait page.getByLabel('Recordarme').check();\nawait page.getByLabel('Recordarme').uncheck();\n\n// Select\nawait page.getByLabel('País').selectOption('México');\nawait page.getByLabel('Idiomas').selectOption(['es', 'en']);\n\n// Hover, focus, drag\nawait btn.hover();\nawait page.locator('#card').dragTo(page.locator('#done'));"
        }
      },
      {
        "type": "exercise",
        "title": "Exercice — Complétez un formulaire d'inscription",
        "taskHtml": "Écrivez un test qui :\n          <br>1. Navigue vers <code>https://practice.expandtesting.com/register</code>\n          <br>2. Remplit le champ <strong>Username</strong> avec <code>monutilisateur</code>\n          <br>3. Remplit <strong>Password</strong> et <strong>Confirm Password</strong> avec <code>MonMotDePasse123!</code>\n          <br>4. Coche la case des termes et conditions\n          <br>5. Clique sur le bouton <strong>Register</strong>",
        "solution": {
          "label": "Solution",
          "langClass": "ts",
          "code": "test('registro de nuevo usuario', async ({ page }) => {\n  await page.goto('https://practice.expandtesting.com/register');\n\n  await page.getByLabel('Username').fill('miusuario');\n  await page.getByLabel('Password', { exact: true }).fill('MiClave123!');\n  await page.getByLabel('Confirm Password').fill('MiClave123!');\n  await page.getByLabel(/terms/i).check();\n  await page.getByRole('button', { name: 'Register' }).click();\n\n  await expect(page.getByText(/successfully/i)).toBeVisible();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s6",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que fait <code>fill()</code> que <code>type()</code> ne fait pas ?",
        "options": [
          "<code>fill()</code> simule la frappe lettre par lettre avec des délais réalistes.",
          "<code>type()</code> ne fonctionne que sur des champs de type email.",
          "<code>fill()</code> vide le champ avant d'écrire ; <code>type()</code> simule une vraie frappe et est plus lent.",
          "Il n'y a pas de différence, ce sont des alias de la même méthode."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>fill()</code> est rapide et direct (il vide et écrit d'un coup) — utilisez-le presque toujours. <code>type()</code> simule des frappes réelles avec <code>delay</code>, utile seulement quand vous testez un comportement qui dépend d'événements clavier (comme une autocomplétion)."
      }
    ]
  },
  {
    "id": "s7",
    "num": "07",
    "group": "Validation",
    "title": "Assertions (Expect)",
    "difficulty": "beginner",
    "description": "Playwright réessaie automatiquement les assertions pendant le timeout (5 s par défaut). Vous n'avez pas besoin d'attentes manuelles avant de vérifier.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Les assertions de Playwright réessaient d'elles-mêmes pendant plusieurs secondes. Si vous comprenez cela, vous arrêtez d'écrire des attentes manuelles avant chaque vérification."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Assertions les plus utilisées",
          "langClass": "ts",
          "code": "// Visibilité et état\nawait expect(locator).toBeVisible();\nawait expect(locator).toBeHidden();\nawait expect(locator).toBeEnabled();\nawait expect(locator).toBeDisabled();\nawait expect(locator).toBeChecked();\n\n// Contenu\nawait expect(locator).toHaveText('Bienvenido, Carlos');  // exact\nawait expect(locator).toHaveText(/bienvenido/i);\nawait expect(locator).toContainText('Carlos');\nawait expect(locator).toHaveValue('carlos@email.com');\nawait expect(locator).toHaveCount(5);\n\n// Attributs et styles\nawait expect(locator).toHaveAttribute('href', '/perfil');\nawait expect(locator).toHaveClass('btn-active');\nawait expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)');\n\n// Page\nawait expect(page).toHaveTitle(/Dashboard/);\nawait expect(page).toHaveURL(/\\/home/);\n\n// Négation\nawait expect(locator).not.toBeVisible();\nawait expect(page).not.toHaveURL(/error/);"
        }
      },
      {
        "type": "exercise",
        "title": "Exercice — Vérifiez l'état d'une page",
        "taskHtml": "Après vous être connecté à une appli, écrivez des assertions pour vérifier :\n          <br>1. L'URL contient <code>/dashboard</code>\n          <br>2. Il y a un <code>&lt;h1&gt;</code> qui dit \"Panneau de contrôle\"\n          <br>3. Le bouton \"Déconnexion\" est visible\n          <br>4. Le bouton \"Login\" n'est plus visible",
        "solution": {
          "label": "Solution",
          "langClass": "ts",
          "code": "await expect(page).toHaveURL(/\\/dashboard/);\nawait expect(page.getByRole('heading', { name: 'Panel de control' })).toBeVisible();\nawait expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();\nawait expect(page.getByRole('button', { name: 'Login' })).not.toBeVisible();"
        }
      },
      {
        "type": "quiz",
        "id": "s7",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Vous cliquez sur un bouton qui ouvre un modal avec animation, puis vous écrivez <code>await expect(locator).toBeVisible()</code>. Avez-vous besoin d'un <code>waitForTimeout</code> avant ?",
        "options": [
          "Oui, toujours, pour laisser le temps à l'animation.",
          "Oui, mais seulement sur Firefox.",
          "Seulement si le modal utilise des CSS transitions.",
          "Non — <code>expect()</code> réessaie automatiquement pendant le timeout par défaut (5s) jusqu'à ce que la condition soit remplie."
        ],
        "answerIndex": 3,
        "explanationHtml": "C'est l'une des fonctionnalités les plus puissantes de Playwright : les assertions avec <code>expect</code> n'échouent pas à la première tentative, mais réessaient jusqu'à être satisfaites ou jusqu'à épuiser le timeout — c'est pourquoi vous n'avez presque jamais besoin de <code>waitForTimeout</code>."
      }
    ]
  },
  {
    "id": "s8",
    "num": "08",
    "group": "Validation",
    "title": "Waits (Attentes Explicites)",
    "difficulty": "intermediate",
    "description": "Playwright dispose de l'auto-waiting sur presque toutes les actions. Ces fonctions servent pour des conditions avancées que l'auto-wait ne couvre pas.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> L'auto-wait couvre la plupart des cas, mais quand vous devez attendre une condition très spécifique (une requête réseau, un compteur dans le DOM), ces outils deviennent nécessaires."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// Attendre qu'un spinner disparaisse et que le résultat apparaisse\nawait page.locator('.spinner').waitFor({ state: 'hidden' });\nawait page.locator('.resultado').waitFor({ state: 'visible' });\n// États : 'visible' | 'hidden' | 'attached' | 'detached'\n\n// Attendre un changement d'URL (après submit de formulaire)\nawait page.waitForURL('**/confirmacion', { timeout: 15000 });\n\n// Attendre une condition personnalisée (polling)\nawait page.waitForFunction(() =>\n  document.querySelectorAll('.producto').length >= 10\n);\n\n// Attendre une réponse réseau + action en simultané\nconst [response] = await Promise.all([\n  page.waitForResponse('**/api/productos'),\n  page.getByRole('button', { name: 'Cargar más' }).click(),\n]);\nconst data = await response.json();"
        }
      },
      {
        "type": "callout",
        "variant": "warn",
        "icon": "⚠️",
        "html": "Évitez <code>waitForTimeout(5000)</code>. Les timeouts fixes rendent les tests lents et instables en CI. Attendez toujours une condition, jamais un temps arbitraire."
      },
      {
        "type": "quiz",
        "id": "s8",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quel est le principal problème d'utiliser <code>waitForTimeout(5000)</code> plutôt que d'attendre une condition ?",
        "options": [
          "Ça ne fonctionne qu'avec les navigateurs headless.",
          "Ça rend les tests lents sur des machines rapides et instables (flaky) en CI quand la machine est plus lente que prévu.",
          "C'est illégal selon la licence de Playwright.",
          "Ça consomme plus de mémoire que d'autres méthodes d'attente."
        ],
        "answerIndex": 1,
        "explanationHtml": "Un temps fixe n'est jamais exact : s'il est trop long, vous gaspillez des secondes à chaque exécution ; s'il est trop court (par exemple sur un runner CI plus lent), le test échoue même si l'appli fonctionne bien. Attendre une condition réelle résout les deux problèmes."
      }
    ]
  },
  {
    "id": "s9",
    "num": "09",
    "group": "Avancé",
    "title": "Frames (iFrames)",
    "difficulty": "intermediate",
    "description": "Pour interagir avec un <code>&lt;iframe&gt;</code>, obtenez d'abord le frame. Vous l'utilisez ensuite exactement comme <code>page</code>.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Un iframe est littéralement un document HTML distinct intégré dans la page. Playwright doit savoir explicitement que vous voulez « entrer » dans ce document avant d'y chercher des éléments."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// frameLocator — méthode recommandée\nconst frame = page.frameLocator('iframe[name=\"pago\"]');\n\nawait frame.getByLabel('Número de tarjeta').fill('4111 1111 1111 1111');\nawait frame.getByLabel('CVV').fill('123');\nawait frame.getByRole('button', { name: 'Pagar' }).click();\n\n// Objet Frame (alternative)\nconst f = page.frame({ name: 'mi-iframe' });\nawait f.locator('input.nombre').fill('Juan');"
        }
      },
      {
        "type": "quiz",
        "id": "s9",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quelle méthode est recommandée pour travailler avec un iframe ?",
        "options": [
          "<code>page.evaluate()</code> avec du JavaScript manuel.",
          "Il n'est pas possible d'interagir avec des iframes dans Playwright.",
          "<code>page.frameLocator()</code>, qui s'utilise exactement comme <code>page</code>.",
          "<code>page.locator()</code> directement, cela fonctionne pareil dedans et en dehors de l'iframe."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>frameLocator()</code> est la façon moderne et recommandée : il renvoie un objet avec la même API que <code>page</code>, donc vous pouvez enchaîner <code>.getByLabel()</code>, <code>.click()</code>, etc. sans changer votre façon de penser."
      }
    ]
  },
  {
    "id": "s10",
    "num": "10",
    "group": "Avancé",
    "title": "Dialogs (alert, confirm, prompt)",
    "difficulty": "intermediate",
    "description": "Les boîtes de dialogue natives du navigateur se capturent avec l'événement <code>dialog</code>. Enregistrez le handler AVANT l'action qui le déclenche.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Les boîtes de dialogue natives (alert, confirm, prompt) bloquent le navigateur. Si vous n'enregistrez pas le handler à temps, votre test reste bloqué à attendre quelque chose que vous ne pourrez jamais cliquer."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// Accepter n'importe quelle boîte de dialogue\npage.on('dialog', dialog => dialog.accept());\n\n// Gérer selon le type\npage.on('dialog', async dialog => {\n  console.log(dialog.type);        // 'alert' | 'confirm' | 'prompt'\n  console.log(dialog.message());\n  if (dialog.type === 'prompt') {\n    await dialog.accept('Mi respuesta');\n  } else {\n    await dialog.accept();\n  }\n});\n\n// Seulement la PROCHAINE boîte de dialogue (pas toutes les futures)\npage.once('dialog', d => d.accept());\nawait page.getByRole('button', { name: 'Eliminar cuenta' }).click();"
        }
      },
      {
        "type": "quiz",
        "id": "s10",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Pourquoi faut-il enregistrer <code>page.on('dialog', ...)</code> AVANT le clic qui déclenche la boîte de dialogue ?",
        "options": [
          "Parce que TypeScript l'exige à cause du typage strict.",
          "Parce que la boîte de dialogue bloque le navigateur dès qu'elle apparaît — si le handler n'est pas prêt, Playwright ne peut pas l'accepter et le test reste en attente.",
          "Parce que l'événement 'dialog' ne se déclenche qu'une seule fois par session de test.",
          "C'est seulement une bonne pratique de style, mais cela fonctionne pareil si on l'enregistre après."
        ],
        "answerIndex": 1,
        "explanationHtml": "Les boîtes de dialogue natives sont bloquantes par conception du navigateur. Le bon schéma est toujours : d'abord <code>page.on('dialog', ...)</code>, ensuite l'action qui l'ouvre — jamais l'inverse."
      }
    ]
  },
  {
    "id": "s11",
    "num": "11",
    "group": "Avancé",
    "title": "Popups (nouvelles fenêtres)",
    "difficulty": "intermediate",
    "description": "Fenêtres ouvertes avec <code>target=\"_blank\"</code>. Écoutez l'événement <strong>avant</strong> le clic qui les ouvre.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Un lien avec <code>target=\"_blank\"</code> ouvre un nouvel onglet presque instantanément. Si vous écoutez l'événement après le clic, vous risquez de le manquer."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const [popup] = await Promise.all([\n  page.waitForEvent('popup'),\n  page.getByRole('link', { name: 'Abrir en nueva pestaña' }).click(),\n]);\nawait popup.waitForLoadState();\nawait expect(popup).toHaveURL(/terminos/);\nawait popup.close();"
        }
      },
      {
        "type": "quiz",
        "id": "s11",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Pourquoi utilise-t-on <code>Promise.all([page.waitForEvent('popup'), link.click()])</code> plutôt que de cliquer puis attendre ?",
        "options": [
          "Parce que cela améliore la performance générale du test.",
          "Parce que <code>Promise.all</code> démarre les deux promesses avant d'attendre, ce qui évite la race condition où le popup s'ouvre avant que vous ne commenciez à écouter.",
          "Par style de code ; les deux formes sont équivalentes en pratique.",
          "Parce que <code>waitForEvent</code> ne peut pas être utilisé en dehors d'un <code>Promise.all</code>."
        ],
        "answerIndex": 1,
        "explanationHtml": "C'est le même schéma qui évite de manquer l'événement \"dialog\" : enregistrer l'écoute et déclencher l'action au même instant, pas en séquence."
      }
    ]
  },
  {
    "id": "s12",
    "num": "12",
    "group": "Avancé",
    "title": "File Upload",
    "difficulty": "intermediate",
    "description": "Simule la sélection de fichiers sans ouvrir la boîte de dialogue du système d'exploitation.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Les sélecteurs de fichiers du système d'exploitation ne peuvent pas être automatisés directement. Playwright les évite complètement en injectant le fichier dans l'input."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.setInputFiles('input[type=\"file\"]', './foto.png');\nawait page.setInputFiles('input[type=\"file\"]', ['./a.png', './b.pdf']);\nawait page.setInputFiles('input[type=\"file\"]', []);  // nettoyer\n\n// Avec un locator\nawait page.getByLabel('Sube tu CV').setInputFiles('./mi-cv.pdf');"
        }
      },
      {
        "type": "quiz",
        "id": "s12",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que fait <code>setInputFiles('input[type=\"file\"]', [])</code> avec un tableau vide ?",
        "options": [
          "Lève une erreur car il faut au moins un fichier.",
          "Ouvre la boîte de dialogue native du système d'exploitation.",
          "Efface la sélection de fichiers de l'input.",
          "Sélectionne tous les fichiers du dossier actuel."
        ],
        "answerIndex": 2,
        "explanationHtml": "Passer un tableau vide est la façon de simuler que l'utilisateur a annulé ou effacé sa sélection, sans avoir à interagir avec une boîte de dialogue du système."
      }
    ]
  },
  {
    "id": "s13",
    "num": "13",
    "group": "Avancé",
    "title": "Téléchargements",
    "difficulty": "intermediate",
    "description": "Capture les fichiers téléchargés. Le schéma est le même qu'avec les popups : écoutez avant l'action.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Comme pour les popups et les dialogs, un téléchargement est un événement qui peut se déclencher très rapidement. Le schéma « écouter avant d'agir » se répète dans Playwright pour la même raison."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const [download] = await Promise.all([\n  page.waitForEvent('download'),\n  page.getByRole('button', { name: 'Descargar Reporte' }).click(),\n]);\nconsole.log(download.suggestedFilename());         // \"reporte.pdf\"\nawait download.saveAs('./reportes/reporte.pdf');\nawait download.delete();                            // nettoie le fichier temporaire"
        }
      },
      {
        "type": "quiz",
        "id": "s13",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Après avoir capturé l'événement <code>'download'</code>, que fait <code>download.saveAs(chemin)</code> ?",
        "options": [
          "Annule le téléchargement.",
          "Enregistre le fichier téléchargé (qui se trouve dans un dossier temporaire) à l'emplacement indiqué.",
          "Ouvre le fichier téléchargé dans le navigateur.",
          "Vérifie que le téléchargement a réussi (c'est une assertion)."
        ],
        "answerIndex": 1,
        "explanationHtml": "Playwright enregistre automatiquement chaque téléchargement dans un fichier temporaire ; <code>saveAs()</code> est ce qui déplace ce fichier là où vous le décidez pour l'inspecter ou le conserver."
      }
    ]
  },
  {
    "id": "s14",
    "num": "14",
    "group": "Avancé",
    "title": "Cookies",
    "difficulty": "intermediate",
    "description": "Gérez les cookies du contexte pour simuler des sessions sans passer par le flux de connexion à chaque test.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Se connecter via l'UI à chaque test est lent. Injecter des cookies ou le <code>storageState</code> sauvegardé vous permet de démarrer chaque test déjà authentifié."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await context.addCookies([{\n  name: 'session_token', value: 'eyJhbGci...',\n  domain: 'mi-app.com', path: '/',\n  httpOnly: true, secure: true,\n}]);\n\nconst cookies = await context.cookies();\nawait context.clearCookies();\n\n// Sauvegarder l'état complet (cookies + localStorage) pour réutiliser la session\nawait context.storageState({ path: './auth.json' });"
        }
      },
      {
        "type": "quiz",
        "id": "s14",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que sauvegarde <code>context.storageState({ path: './auth.json' })</code> ?",
        "options": [
          "Une capture d'écran de l'état actuel.",
          "Seulement les cookies du contexte.",
          "L'historique de navigation.",
          "Les cookies et le localStorage ensemble, dans un fichier réutilisable comme session sauvegardée."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>storageState</code> est la façon recommandée de « sauter » la connexion dans les tests : vous vous connectez une fois, sauvegardez l'état, et le réutilisez comme point de départ dans d'autres tests."
      }
    ]
  },
  {
    "id": "s15",
    "num": "15",
    "group": "Avancé",
    "title": "Local Storage / Session Storage",
    "difficulty": "intermediate",
    "description": "Accédez au stockage du navigateur avec <code>page.evaluate()</code>, qui exécute du code JS dans le contexte de la page.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> localStorage ne fait pas partie de l'API de Playwright, il fait partie du navigateur. <code>page.evaluate()</code> est le pont qui vous permet d'exécuter du vrai JavaScript dans la page."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.evaluate(() => {\n  localStorage.setItem('tema', 'oscuro');\n  localStorage.setItem('usuario', JSON.stringify({ id: 42 }));\n});\n\nconst tema = await page.evaluate(() => localStorage.getItem('tema'));\n\nawait page.evaluate(() => {\n  localStorage.clear();\n  sessionStorage.clear();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s15",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Pourquoi avez-vous besoin de <code>page.evaluate()</code> pour lire ou écrire dans localStorage, plutôt qu'une méthode directe de Playwright ?",
        "options": [
          "Cela ne fonctionne que sur Chromium, pas sur Firefox ou WebKit.",
          "C'est un bug connu que Playwright n'a pas corrigé.",
          "Playwright ne prend pas du tout en charge localStorage.",
          "localStorage est une API du navigateur, pas de Playwright ; <code>evaluate()</code> exécute votre fonction dans le contexte de la page, où <code>localStorage</code> existe bel et bien."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>page.evaluate()</code> est votre porte d'entrée vers toute API du navigateur que Playwright n'expose pas directement : il exécute le callback dans la page, pas dans votre script Node."
      }
    ]
  },
  {
    "id": "s16",
    "num": "16",
    "group": "Avancé",
    "title": "API Testing (Request)",
    "difficulty": "advanced",
    "description": "Playwright peut effectuer des requêtes HTTP directement sans ouvrir de navigateur. Idéal pour préparer des données de test ou vérifier des endpoints REST.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Tous les tests n'ont pas besoin d'un navigateur. Créer des données de test (ou vérifier un backend) via une API directe est bien plus rapide que de le faire clic par clic dans l'UI."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "test('API — CRUD usuario', async ({ request }) => {\n  // GET\n  const res = await request.get('https://api.app.com/usuarios');\n  await expect(res).toBeOK();\n  const lista = await res.json();\n\n  // POST — créer\n  const post = await request.post('https://api.app.com/usuarios', {\n    data: { nombre: 'Ana García', email: 'ana@test.com' },\n    headers: { Authorization: 'Bearer mi-token' },\n  });\n  await expect(post).toHaveStatus(201);\n\n  // PUT / DELETE\n  const { id } = await post.json();\n  await request.put(`/usuarios/${id}`, { data: { nombre: 'Ana López' } });\n  await request.delete(`/usuarios/${id}`);\n  await request.dispose();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s16",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quel est l'avantage clé d'utiliser le fixture <code>request</code> plutôt que de simuler l'UI pour préparer des données de test ?",
        "options": [
          "C'est bien plus rapide et stable car cela saute complètement l'UI et parle directement à l'API.",
          "<code>request</code> peut cliquer sur des boutons plus vite que <code>page</code>.",
          "Cela ne fonctionne qu'avec des API GraphQL.",
          "<code>request</code> n'a pas besoin d'authentification."
        ],
        "answerIndex": 0,
        "explanationHtml": "Utiliser <code>request</code> pour créer ou supprimer des données de setup (au lieu de remplir des formulaires) permet à vos tests d'UI de se concentrer uniquement sur ce que vous voulez vraiment tester, et de s'exécuter bien plus vite."
      }
    ]
  },
  {
    "id": "s17",
    "num": "17",
    "group": "Avancé",
    "title": "Intercepter et Mocker les Requêtes Réseau",
    "difficulty": "advanced",
    "description": "Avec <code>page.route()</code>, vous interceptez toute requête faite par la page avant qu'elle n'atteigne le serveur, et vous décidez quoi répondre. Cela sert à simuler des erreurs du backend, accélérer les tests en bloquant des ressources inutiles, ou tester l'UI sans dépendre d'un serveur réel.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Dépendre d'un backend réel rend les tests lents, instables et parfois impossibles à écrire (comment provoquer une erreur 500 exprès ?). Intercepter le réseau vous donne un contrôle total sur ce que la page reçoit."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Mocker une réponse complète",
          "langClass": "ts",
          "code": "await page.route('**/api/usuarios', async route => {\n  await route.fulfill({\n    status: 200,\n    contentType: 'application/json',\n    body: JSON.stringify([{ id: 1, nombre: 'Usuario de prueba' }]),\n  });\n});\nawait page.goto('/usuarios');\n// La page ne touche jamais le backend réel"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Modifier une réponse réelle, et bloquer des ressources",
          "langClass": "ts",
          "code": "await page.route('**/api/usuarios', async route => {\n  const response = await route.fetch();            // laisse passer la requête réelle\n  const body = await response.json();\n  body.push({ id: 999, nombre: 'Usuario inyectado' }); // vous modifiez le résultat\n  await route.fulfill({ response, body: JSON.stringify(body) });\n});\n\n// Bloquer les requêtes dont vous n'avez pas besoin — tests plus rapides et plus stables\nawait page.route('**/*.{png,jpg,jpeg}', route => route.abort());\nawait page.route('**/analytics/**', route => route.abort());"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Pour simuler une erreur du serveur, il suffit de changer le <code>status</code> : <code>route.fulfill({'{'} status: 500, body: 'Erreur interne' {'}'})</code> — vous testez ainsi comment réagit votre UI sans avoir à casser le backend réel."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sans mock — dépend de données réelles",
          "langClass": "bad",
          "code": "// Le test échoue si le backend est en panne,\n// si un autre test a déjà supprimé cet utilisateur, etc.\nawait page.goto('/usuarios');\nawait expect(page.getByText('Ana García')).toBeVisible();"
        },
        "good": {
          "label": "✅ Avec mock — déterministe",
          "langClass": "good",
          "code": "// Le résultat est toujours le même,\n// peu importe l'état du backend\nawait page.route('**/api/usuarios', route => route.fulfill({ body: '[...]' }));\nawait page.goto('/usuarios');"
        }
      },
      {
        "type": "exercise",
        "title": "Exercice — Simulez une erreur du serveur",
        "taskHtml": "Utilisez <code>page.route()</code> pour intercepter <code>**/api/pedido</code> et répondre avec le status <code>500</code>. Puis naviguez vers <code>/pedido</code> et vérifiez que la page affiche le texte <strong>« Une erreur s'est produite »</strong>.",
        "solution": {
          "label": "Solution",
          "langClass": "ts",
          "code": "await page.route('**/api/pedido', route => route.fulfill({\n  status: 500,\n  body: 'Error interno',\n}));\n\nawait page.goto('/pedido');\nawait expect(page.getByText('Ocurrió un error')).toBeVisible();"
        }
      },
      {
        "type": "quiz",
        "id": "s17",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que fait <code>route.fetch()</code> suivi de <code>route.fulfill({ response, body: ... })</code> dans un handler de <code>page.route()</code> ?",
        "options": [
          "Laisse la requête réelle atteindre le serveur, puis modifie la réponse avant de la donner à la page.",
          "Bloque complètement la requête, sans jamais la laisser sortir.",
          "Duplique la requête et l'envoie deux fois au serveur.",
          "Ne fonctionne qu'avec des requêtes de type GET, jamais avec POST."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>route.fetch()</code> exécute la requête originale et vous donne la réponse réelle ; à partir de là, vous pouvez la lire, la modifier (par exemple ajouter un élément à la liste) et la transmettre à la page avec <code>fulfill()</code> — contrairement à <code>route.fulfill()</code> direct, qui ne touche jamais le serveur."
      }
    ]
  },
  {
    "id": "s18",
    "num": "18",
    "group": "Avancé",
    "title": "Informations de Page",
    "difficulty": "intermediate",
    "description": "Obtenez des métadonnées, du contenu DOM et exécutez du JavaScript dans le contexte de la page.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Parfois vous avez besoin de données qui ne sont pas un élément visuel : le titre, l'URL actuelle, ou exécuter une logique JavaScript qui n'a pas d'équivalent direct dans l'API de Playwright."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const titulo = await page.title();\nconst url    = page.url();\nconst vp     = page.viewportSize();\nconst texto  = await page.locator('h1').innerText();\n\n// Exécuter du JS dans le navigateur\nconst scrollY = await page.evaluate(() => window.scrollY);\nconst n = await page.evaluate(\n  sel => document.querySelectorAll(sel).length,\n  '.tarjeta'\n);\n\nawait page.pdf({ path: 'pagina.pdf', format: 'A4' });"
        }
      },
      {
        "type": "quiz",
        "id": "s18",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quelle est la différence entre <code>page.title()</code> et <code>page.url()</code> concernant le besoin d'un <code>await</code> ?",
        "options": [
          "<code>title()</code> est asynchrone (nécessite await) ; <code>url()</code> est synchrone car Playwright a déjà cette donnée en mémoire.",
          "Les deux sont asynchrones et nécessitent await.",
          "Aucun des deux n'a besoin d'await.",
          "Cela dépend du navigateur utilisé."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>url()</code> ne croise pas le processus du navigateur — Playwright connaît déjà l'URL actuelle en interne. <code>title()</code> nécessite une requête asynchrone au document."
      }
    ]
  },
  {
    "id": "s19",
    "num": "19",
    "group": "Avancé",
    "title": "Viewport & Émulation",
    "difficulty": "intermediate",
    "description": "Simulez des appareils, le mode sombre, le fuseau horaire et la géolocalisation pour les tests responsive.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Une application peut se comporter différemment sur mobile que sur ordinateur. Émuler des appareils, le thème sombre ou la géolocalisation permet de tester ces scénarios sans appareil physique."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { devices } from '@playwright/test';\n\n// Appareil complet (viewport + userAgent + touch)\nconst ctx = await browser.newContext({ ...devices['iPhone 14'] });\n\nawait context.setViewportSize({ width: 375, height: 812 });\nawait context.emulateMedia({ colorScheme: 'dark' });\nawait context.emulateTimezone('America/Mexico_City');\nawait context.grantPermissions(['geolocation']);\nawait context.setGeolocation({ latitude: 19.4326, longitude: -99.1332 });"
        }
      },
      {
        "type": "quiz",
        "id": "s19",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Qu'inclut <code>devices['iPhone 14']</code> qu'un simple <code>setViewportSize()</code> n'inclut pas ?",
        "options": [
          "La localisation GPS de l'appareil réel.",
          "Les navigateurs installés sur un iPhone réel.",
          "Seulement la largeur et la hauteur de l'écran.",
          "Le viewport, le user agent et l'émulation tactile (touch) ensemble, comme un profil d'appareil complet."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>devices[...]</code> est un preset complet (viewport + userAgent + hasTouch, etc.), tandis que <code>setViewportSize()</code> change seulement la taille de la fenêtre."
      }
    ]
  },
  {
    "id": "s20",
    "num": "20",
    "group": "Avancé",
    "title": "Screenshots & Vidéos",
    "difficulty": "intermediate",
    "description": "Captures d'écran pour le débogage visuel et la détection de régressions dans l'interface.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Un test qui échoue est beaucoup plus facile à déboguer avec une capture d'écran ou une vidéo qu'avec uniquement un message d'erreur texte."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.screenshot({ path: 'inicio.png' });\nawait page.screenshot({ path: 'full.png', fullPage: true });\nawait page.locator('#chart').screenshot({ path: 'chart.png' });\n\n// Snapshot testing (comparaison visuelle)\nawait expect(page).toHaveScreenshot('homepage.png');\n\n// Vidéo\nconst ctx = await browser.newContext({\n  recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }\n});\n\n// Désactiver les animations pour des captures stables\nawait page.addStyleTag({\n  content: '*, *::before, *::after { animation-duration: 0s !important; }'\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s20",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — À quoi sert <code>toHaveScreenshot()</code> par rapport à <code>page.screenshot()</code> ?",
        "options": [
          "<code>page.screenshot()</code> ne peut pas capturer la page entière.",
          "Ils sont identiques, seul le nom change.",
          "Ne fonctionne qu'en mode headed.",
          "C'est une assertion : elle compare la capture actuelle à une référence sauvegardée et échoue si elles diffèrent (test visuel)."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>page.screenshot()</code> enregistre simplement une image. <code>toHaveScreenshot()</code> fait partie du système d'assertions : il compare pixel par pixel avec un \"baseline\" sauvegardé, détectant les régressions visuelles."
      }
    ]
  },
  {
    "id": "s21",
    "num": "21",
    "group": "Avancé",
    "title": "Traçage",
    "difficulty": "advanced",
    "description": "La trace capture les captures d'écran, le réseau, le DOM et le code source pour chaque action. Elle se visualise dans le Playwright Trace Viewer.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Quand un test échoue en CI et que vous ne pouvez pas le reproduire sur votre machine, une trace est le plus proche de « enregistrer » exactement ce qui s'est passé, étape par étape."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await context.tracing.start({ screenshots: true, snapshots: true, sources: true });\n\n// ... test ...\nawait page.goto('/login');\nawait page.getByRole('button', { name: 'Entrar' }).click();\n\nawait context.tracing.stop({ path: './trazas/login.zip' });\n// $ npx playwright show-trace trazas/login.zip"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "En production, utilisez <code>trace: 'on-first-retry'</code> dans la config pour ne sauvegarder la trace que lorsqu'un test échoue pour la première fois."
      },
      {
        "type": "quiz",
        "id": "s21",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quelle est la configuration recommandée de <code>trace</code> en production/CI ?",
        "options": [
          "Il n'y a pas de recommandation standard.",
          "<code>'on-first-retry'</code> : enregistre la trace seulement quand un test échoue lors de sa première tentative et est rejoué.",
          "<code>'off'</code>, car elle consomme trop de ressources.",
          "<code>'on'</code>, pour enregistrer toujours, dans tous les tests."
        ],
        "answerIndex": 1,
        "explanationHtml": "Enregistrer toujours est coûteux en espace et en temps. \"on-first-retry\" est le compromis : vous ne payez le coût de la trace que quand quelque chose a vraiment échoué et doit être investigué."
      }
    ]
  },
  {
    "id": "s22",
    "num": "22",
    "group": "Avancé",
    "title": "Configuration (playwright.config.ts)",
    "difficulty": "advanced",
    "description": "Définissez les navigateurs, les timeouts, le répertoire des tests et les options globales.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Le fichier de configuration centralise les décisions qui, si vous les répétez test par test, créent des incohérences. Un seul endroit contrôle les navigateurs, les timeouts et les rapports pour tout le projet."
      },
      {
        "type": "code",
        "block": {
          "label": "playwright.config.ts",
          "langClass": "cfg",
          "code": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  timeout: 30_000,\n  retries: 2,\n  workers: 4,\n  reporter: [[ 'html', { open: 'on-failure' }]],\n\n  use: {\n    baseURL: 'https://mi-app.com',\n    headless: true,\n    viewport: { width: 1280, height: 720 },\n    screenshot: 'only-on-failure',\n    trace: 'on-first-retry',\n    video: 'on-first-retry',\n  },\n\n  projects: [\n    { name: 'Chrome',  use: { ...devices['Desktop Chrome'] } },\n    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'Mobile',  use: { ...devices['iPhone 14'] } },\n  ],\n\n  webServer: {\n    command: 'npm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: true,\n  },\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s22",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Dans le bloc <code>projects</code>, à quoi servent des entrées séparées pour Chrome, Firefox et Mobile ?",
        "options": [
          "Permet d'exécuter la même suite de tests contre différents navigateurs/appareils sans dupliquer le code des tests.",
          "Chaque projet a besoin de son propre fichier de tests ; ils ne peuvent pas être partagés.",
          "Cela n'affecte que le rapport final, pas l'exécution réelle.",
          "Il est obligatoire d'avoir au moins 3 projets configurés."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>projects</code> est une multiplication gratuite : vous écrivez les tests une seule fois et Playwright les exécute contre chaque configuration de navigateur/appareil que vous définissez."
      }
    ]
  },
  {
    "id": "s23",
    "num": "23",
    "group": "Avancé",
    "title": "Annotations de Tests",
    "difficulty": "intermediate",
    "description": "Organisez les tests en groupes, utilisez des hooks de cycle de vie et marquez les tests spéciaux sans supprimer le code.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Organiser les tests en groupes et utiliser des hooks évite de répéter le même code de setup dans chaque test, et marquer les tests comme skip ou fixme documente l'état réel de votre suite sans supprimer le travail effectué."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "test.describe('Autenticación', () => {\n  test.beforeAll(async () => { /* una vez antes del grupo */ });\n  test.afterAll(async  () => { /* una vez después del grupo */ });\n  test.beforeEach(async ({ page }) => { await page.goto('/login'); });\n  test.afterEach(async  ({ page }) => { /* limpieza */ });\n\n  test('login exitoso', async ({ page }) => { ... });\n  test.skip('SSO — no implementado', async () => {});\n  test.fixme('reset contraseña — flaky', async () => {});\n});\n\ntest.only('depurar este test', async ({ page }) => { ... });  // seulement celui-ci\ntest.slow('test pesado', async ({ page }) => { ... });       // triple timeout"
        }
      },
      {
        "type": "quiz",
        "id": "s23",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Quel est le vrai risque de laisser <code>test.only()</code> dans un commit ?",
        "options": [
          "Seul ce test s'exécutera en CI — tous les autres restent silencieusement sans s'exécuter, donnant une fausse impression que tout passe.",
          "Aucun : Playwright le détecte et l'ignore automatiquement en CI.",
          "Le test s'exécutera plus lentement que les autres.",
          "Cela casse la compilation TypeScript."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>test.only</code> est utile pendant le débogage d'un test localement, mais s'il arrive sur main, le CI cesse de vérifier tout le reste sans aucune erreur visible — c'est pourquoi il est recommandé d'avoir un linter qui le détecte avant le commit."
      }
    ]
  },
  {
    "id": "s24",
    "num": "24",
    "group": "Avancé",
    "title": "Commandes et Raccourcis",
    "difficulty": "beginner",
    "description": "Commandes pour exécuter, filtrer, déboguer et générer des rapports de tests depuis le terminal.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Connaître les flags de la CLI vous fait gagner des minutes à chaque débogage : filtrer par nom, voir seulement ce qui a échoué, ou enregistrer des actions plutôt que de les écrire à la main."
      },
      {
        "type": "shortcuts",
        "items": [
          {
            "keys": "--ui",
            "description": "Interface visuelle"
          },
          {
            "keys": "--headed",
            "description": "Voir le navigateur"
          },
          {
            "keys": "--debug",
            "description": "Debug pas à pas"
          },
          {
            "keys": "-g \"texto\"",
            "description": "Filtrer par nom"
          },
          {
            "keys": "--last-failed",
            "description": "Seulement les échoués"
          },
          {
            "keys": "codegen",
            "description": "Enregistrer les actions"
          }
        ]
      },
      {
        "type": "code",
        "block": {
          "label": "bash",
          "langClass": "sh",
          "code": "npx playwright test                          # todos los tests\nnpx playwright test --ui                      # interfaz visual (recomendado)\nnpx playwright test tests/login.spec.ts       # un archivo\nnpx playwright test -g \"login exitoso\"        # filtrar por nombre\nnpx playwright test --project=Chrome          # un solo browser\nnpx playwright test --debug                   # debug interactivo\nnpx playwright show-report                    # ver reporte HTML\nnpx playwright codegen https://mi-app.com     # grabar → generar código\nnpx playwright show-trace trazas/trace.zip    # ver trace"
        }
      },
      {
        "type": "quiz",
        "id": "s24",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que fait <code>npx playwright codegen https://mi-app.com</code> ?",
        "options": [
          "Optimise le code existant des tests.",
          "Génère le fichier playwright.config.ts depuis zéro.",
          "Exécute tous les tests existants contre cette URL.",
          "Ouvre un navigateur où vous enregistrez vos actions (clics, saisie) et génère le code Playwright automatiquement."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>codegen</code> est un outil d'exploration : vous interagissez avec l'application manuellement et Playwright traduit chaque action en code — très utile pour découvrir quels locators utiliser."
      }
    ]
  },
  {
    "id": "s25",
    "num": "25",
    "group": "Avancé",
    "title": "Page Object Model (POM)",
    "difficulty": "advanced",
    "description": "Un <strong>Page Object</strong> est une classe qui regroupe les locators et les actions d'une page (ou composant) en un seul endroit. Au lieu d'écrire <code>page.getByLabel('Email').fill(...)</code> dans chaque test, le test appelle une méthode avec un nom métier comme <code>loginPage.login(usuario, clave)</code>.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Répéter les mêmes locators dans chaque test est la raison la plus courante pour laquelle une suite devient impossible à maintenir. Le pattern Page Object résout cela en regroupant chaque page dans une classe réutilisable."
      },
      {
        "type": "code",
        "block": {
          "label": "pages/LoginPage.ts",
          "langClass": "ts",
          "code": "import { type Page, type Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly email: Locator;\n  readonly password: Locator;\n  readonly submitBtn: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    // Les locators sont définis une seule fois, ici\n    this.email = page.getByLabel('Email');\n    this.password = page.getByLabel('Contraseña');\n    this.submitBtn = page.getByRole('button', { name: 'Entrar' });\n  }\n\n  async goto() {\n    await this.page.goto('/login');\n  }\n\n  // La méthode exprime l'INTENTION, pas les étapes techniques\n  async login(usuario: string, clave: string) {\n    await this.email.fill(usuario);\n    await this.password.fill(clave);\n    await this.submitBtn.click();\n  }\n}"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "tests/login.spec.ts — el test ya no conoce ningún locator",
          "langClass": "ts",
          "code": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntest('login exitoso', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n\n  await loginPage.goto();\n  await loginPage.login('user@test.com', 'secret123');\n\n  await expect(page).toHaveURL(/dashboard/);\n});"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Si la conception change et que le champ \"Contraseña\" passe à \"Clave de acceso\", vous ne corrigez qu'<strong>un seul locator</strong> dans <code>LoginPage.ts</code> — aucun test n'a besoin d'être modifié."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sans POM — locators répétés dans chaque test",
          "langClass": "bad",
          "code": "test('test 1', async ({ page }) => {\n  await page.getByLabel('Email').fill('a@test.com');\n  await page.getByLabel('Contraseña').fill('123');\n  await page.getByRole('button', { name: 'Entrar' }).click();\n});\ntest('test 2', async ({ page }) => {\n  await page.getByLabel('Email').fill('b@test.com');\n  // ...mêmes locators, encore une fois\n});"
        },
        "good": {
          "label": "✅ Avec POM — un seul endroit à maintenir",
          "langClass": "good",
          "code": "test('test 1', async ({ page }) => {\n  await new LoginPage(page).login('a@test.com', '123');\n});\ntest('test 2', async ({ page }) => {\n  await new LoginPage(page).login('b@test.com', '456');\n});"
        }
      },
      {
        "type": "exercise",
        "title": "Exercice — Créez votre propre Page Object",
        "taskHtml": "Convertissez cette logique répétée en Page Object appelé <code>SearchPage</code> avec une méthode <code>search(termino: string)</code> :\n          <br><br>\n          <code>await page.getByPlaceholder('Buscar...').fill('zapatos');</code><br>\n          <code>await page.getByRole('button', { name: 'Buscar' }).click();</code>",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "export class SearchPage {\n  readonly page: Page;\n  readonly searchInput: Locator;\n  readonly searchBtn: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.searchInput = page.getByPlaceholder('Buscar...');\n    this.searchBtn = page.getByRole('button', { name: 'Buscar' });\n  }\n\n  async search(termino: string) {\n    await this.searchInput.fill(termino);\n    await this.searchBtn.click();\n  }\n}"
        }
      },
      {
        "type": "quiz",
        "id": "s25",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Qu'apporte un test qui utilise un Page Object comme <code>loginPage.login(usuario, clave)</code> au lieu d'écrire les locators directement ?",
        "options": [
          "C'est une exigence obligatoire de l'API de Playwright pour pouvoir utiliser des fixtures.",
          "Playwright génère automatiquement le rapport HTML seulement si vous utilisez des Page Objects.",
          "Le test devient plus lisible et, si la conception de la page change, il suffit de mettre à jour le Page Object — pas chaque test.",
          "Le test s'exécute plus rapidement car il utilise moins de mémoire."
        ],
        "answerIndex": 2,
        "explanationHtml": "Un Page Object centralise le « comment » (les locators, les étapes techniques) pour que le test n'exprime que le « quoi » (l'intention métier). Vous verrez ce même principe appliqué à un projet complet en section 27, avec <code>TodoPage</code>."
      }
    ]
  },
  {
    "id": "s26",
    "num": "26",
    "group": "Avancé",
    "title": "Fixtures Personnalisés",
    "difficulty": "advanced",
    "description": "Un <strong>fixture</strong> personnalisé vous permet d'injecter quelque chose directement dans la signature du test — comme un Page Object déjà instancié avec login effectué — sans répéter <code>new LoginPage(page)</code> ni <code>beforeEach</code> dans chaque fichier. C'est ainsi que sont organisés les frameworks Playwright dans les projets réels.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>Pourquoi c'est important ?</strong> Répéter 'new LoginPage(page)' et la navigation initiale dans le beforeEach de chaque fichier est exactement le type de duplication qu'un fixture personnalisé élimine — vous le définissez une fois et n'importe quel test le demande par nom."
      },
      {
        "type": "code",
        "block": {
          "label": "fixtures/pages.fixture.ts",
          "langClass": "ts",
          "code": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntype MisFixtures = { loginPage: LoginPage };\n\nexport const test = base.extend<MisFixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await loginPage.goto();               // setup — s'exécute AVANT le test\n\n    await use(loginPage);                 // ici le test reçoit le fixture et s'exécute\n\n    // code après use() = teardown, s'exécute APRÈS le test\n  },\n});\n\nexport { expect } from '@playwright/test';"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "tests/login.spec.ts — el test pide el fixture por nombre",
          "langClass": "ts",
          "code": "import { test, expect } from '../fixtures/pages.fixture';\n\ntest('login exitoso', async ({ loginPage, page }) => {\n  // loginPage existe déjà et a déjà navigué — le setup est terminé\n  await loginPage.login('user@test.com', 'secret123');\n  await expect(page).toHaveURL(/dashboard/);\n});"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "<code>use(valor)</code> est le point où le fixture remet la valeur au test. Tout ce que vous écrivez <strong>après</strong> ce <code>await use(...)</code> s'exécute comme teardown automatique à la fin du test — même si le test a échoué."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sans fixture — répété dans chaque fichier",
          "langClass": "bad",
          "code": "test.beforeEach(async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n});\n// ...et encore dans le fichier de test suivant"
        },
        "good": {
          "label": "✅ Avec fixture — une seule définition",
          "langClass": "good",
          "code": "test('...', async ({ loginPage }) => {\n  // prêt à utiliser, dans n'importe quel fichier\n});"
        }
      },
      {
        "type": "exercise",
        "title": "Exercice — Fixture avec login automatique",
        "taskHtml": "Modifiez le fixture <code>loginPage</code> pour qu'il effectue également la connexion automatiquement avec <code>demo@test.com</code> / <code>demo123</code> avant de le remettre au test — ainsi, tout test demandant <code>{'{'} loginPage {'}'}</code> démarrera déjà authentifié.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "loginPage: async ({ page }, use) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n  await loginPage.login('demo@test.com', 'demo123');  // login déjà inclus dans le setup\n\n  await use(loginPage);\n},"
        }
      },
      {
        "type": "quiz",
        "id": "s26",
        "isTeo": false,
        "questionHtml": "<strong>Auto-évaluation</strong> — Que représente le code qui se trouve APRÈS <code>await use(loginPage)</code> à l'intérieur d'un fixture ?",
        "options": [
          "De la documentation que Playwright ignore à l'exécution.",
          "Un second fixture alternatif si le premier échoue.",
          "Du code qui s'exécute avant le reste du fixture, peu importe sa position.",
          "Le teardown : code que Playwright exécute automatiquement à la fin du test, même si le test a échoué."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>use(valor)</code> est le point où le fixture remet la valeur au test et le test s'exécute ; tout ce que vous écrivez après cet <code>await</code> s'exécute quand le test se termine — c'est l'endroit naturel pour fermer les sessions, nettoyer les données ou libérer les ressources."
      }
    ]
  }
];
