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
  }
];
