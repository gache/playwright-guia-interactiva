import type { Section } from '../../types';

export const sections: Section[] = [
  {
    "id": "s1",
    "num": "01",
    "group": "Fundamentos",
    "title": "Instalación",
    "difficulty": "beginner",
    "description": "Instala Playwright y los navegadores necesarios. El comando <code>init</code> lo configura todo automáticamente.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Antes de escribir un solo test necesitas el entorno listo. Este paso es la base de todo lo que sigue: sin los navegadores instalados, ningún test puede ejecutarse."
      },
      {
        "type": "code",
        "block": {
          "label": "bash",
          "langClass": "sh",
          "code": "# Inicializar proyecto (recomendado — genera config, carpetas y descarga browsers)\nnpm init playwright@latest\n\n# Instalar solo el paquete en proyecto existente\nnpm install --save-dev @playwright/test\n\n# Instalar navegadores\nnpx playwright install             # todos\nnpx playwright install chromium    # solo Chrome\nnpx playwright install firefox\nnpx playwright install webkit      # Safari\n\n# Dependencias del sistema operativo\nnpx playwright install-deps"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "<strong>npm init playwright@latest</strong> es la forma más rápida: genera la carpeta <code>tests/</code>, el archivo <code>playwright.config.ts</code> y descarga los browsers en un solo paso."
      },
      {
        "type": "quiz",
        "id": "s1",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué hace el comando <code>npm init playwright@latest</code>?",
        "options": [
          "Solo instala el paquete de Playwright, sin configurar nada más.",
          "Ejecuta los tests existentes en modo headless.",
          "Genera un reporte HTML de la última ejecución.",
          "Crea la carpeta de tests, el archivo de configuración y descarga los navegadores en un solo paso."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>npm init playwright@latest</code> es el scaffolding oficial: genera <code>tests/</code>, <code>playwright.config.ts</code> y descarga los navegadores automáticamente."
      }
    ]
  },
  {
    "id": "s2",
    "num": "02",
    "group": "Fundamentos",
    "title": "Estructura Básica de un Test",
    "difficulty": "beginner",
    "description": "Este es el esqueleto que vas a repetir en cada archivo de test: importar <code>test</code> y <code>expect</code>, describir el test con un nombre claro, y usar <code>await</code> en cada paso.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Todo test de Playwright sigue la misma forma: un nombre descriptivo, el fixture <code>page</code>, y <code>await</code> en cada paso porque el navegador es un proceso externo que tarda en responder. Con TypeScript, además, obtienes autocompletado de toda la API sin memorizar la documentación."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { test, expect } from '@playwright/test';\n\ntest('flujo de login completo', async ({ page }) => {\n  await page.goto('/login');                     // usa baseURL del config\n\n  await page.getByLabel('Email').fill('user@test.com');\n  await page.getByLabel('Contraseña').fill('secret123');\n  await page.getByRole('button', { name: 'Entrar' }).click();\n\n  // Verificar redirección al dashboard\n  await expect(page).toHaveURL(/dashboard/);\n  await expect(page.getByText('Bienvenido')).toBeVisible();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s2",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — En el ejemplo, <code>page.goto('/login')</code> navega a una URL relativa. ¿De dónde saca Playwright el dominio completo?",
        "options": [
          "De la variable de entorno NODE_ENV.",
          "De la última URL visitada en el test anterior.",
          "De <code>baseURL</code>, definido en <code>playwright.config.ts</code>.",
          "Lo pide como parámetro obligatorio en <code>test()</code>."
        ],
        "answerIndex": 2,
        "explanationHtml": "Cuando defines <code>use: { baseURL: '...' }</code> en la configuración, cualquier ruta relativa (<code>/login</code>, <code>/dashboard</code>) se completa automáticamente contra esa base."
      }
    ]
  },
  {
    "id": "s3",
    "num": "03",
    "group": "Fundamentos",
    "title": "Browser & Context",
    "difficulty": "intermediate",
    "description": "El <strong>Browser</strong> es la instancia del navegador. El <strong>BrowserContext</strong> es un perfil aislado (como una ventana privada). Ideal para simular múltiples usuarios simultáneos.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Entender la diferencia entre Browser y BrowserContext te permite simular varios usuarios (o sesiones) al mismo tiempo sin abrir varios navegadores."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { chromium } from '@playwright/test';\n\nconst browser = await chromium.launch({\n  headless: false,   // true = sin ventana visible\n  slowMo: 50,         // ms de pausa entre acciones (útil para depurar)\n});\n\nconst context = await browser.newContext({\n  ignoreHTTPSErrors: true,\n  viewport: { width: 1280, height: 720 },\n  locale: 'es-MX',\n  storageState: './auth.json',  // sesión guardada previamente\n});\n\nconst page = await context.newPage();\nawait page.goto('https://mi-app.com');\n\nawait context.close();\nawait browser.close();"
        }
      },
      {
        "type": "callout",
        "variant": "info",
        "icon": "ℹ️",
        "html": "En tests normales usas el <code>page</code> del fixture directamente. Crear browser/context manual es útil para tests con múltiples roles de usuario simultáneos."
      },
      {
        "type": "quiz",
        "id": "s3",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué es un <code>BrowserContext</code>?",
        "options": [
          "Un perfil aislado dentro del mismo navegador, como una ventana de incógnito, ideal para simular usuarios distintos.",
          "Otra instancia completa del navegador, más pesada que Browser.",
          "El archivo de configuración de Playwright.",
          "Un tipo de locator para seleccionar elementos."
        ],
        "answerIndex": 0,
        "explanationHtml": "Un Browser puede tener muchos BrowserContexts, cada uno con sus propias cookies, storage y sesión — perfecto para tests que necesitan dos usuarios simultáneos (por ejemplo, probar un chat)."
      }
    ]
  },
  {
    "id": "s4",
    "num": "04",
    "group": "Interacción",
    "title": "Navegación de Página",
    "difficulty": "beginner",
    "description": "Métodos para controlar la navegación: ir a URLs, recargar, usar historial y esperar estados de carga.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Saber esperar el momento correcto (URL, estado de carga) evita tests que fallan de forma aleatoria justo después de un login o un submit."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.goto('https://mi-app.com/productos');\nawait page.goto('/dashboard');                    // relativa a baseURL\n\nawait page.goBack();\nawait page.goForward();\nawait page.reload();\n\n// Esperar a que la URL cambie (tras login, redirect…)\nawait page.waitForURL('**/dashboard');    // glob pattern\nawait page.waitForURL(/\\/dashboard/);    // regex\n\n// Esperar estados de carga\nawait page.waitForLoadState('load');\nawait page.waitForLoadState('domcontentloaded');\nawait page.waitForLoadState('networkidle');  // red inactiva ≥500ms"
        }
      },
      {
        "type": "quiz",
        "id": "s4",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué diferencia hay entre <code>waitForLoadState('load')</code> y <code>waitForLoadState('networkidle')</code>?",
        "options": [
          "Son sinónimos, no hay diferencia real.",
          "'networkidle' es siempre más rápido.",
          "'load' espera el evento de carga del documento; 'networkidle' espera a que no haya peticiones de red activas durante al menos 500ms.",
          "'load' solo funciona en Chromium."
        ],
        "answerIndex": 2,
        "explanationHtml": "\"networkidle\" es útil para apps que cargan datos por AJAX después del render inicial, pero Playwright recomienda preferir esperar un elemento visible en vez de depender de estados de red genéricos."
      }
    ]
  },
  {
    "id": "s5",
    "num": "05",
    "group": "Interacción",
    "title": "Locators",
    "difficulty": "beginner",
    "description": "Los locators seleccionan elementos. Playwright recomienda locators semánticos sobre CSS frágil porque son más resistentes a cambios de diseño.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Los locators son la base de cada interacción. Elegir uno frágil (como una clase CSS que cambia con cada rediseño) es la causa número uno de tests que se rompen sin que el bug sea real."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Todos los tipos",
          "langClass": "ts",
          "code": "// ── CSS / XPath ──────────────────────────────────────\npage.locator('button.submit')\npage.locator('#form input[type=\"email\"]')\n\n// ── ✅ Semánticos (preferidos) ───────────────────────\npage.getByRole('button', { name: 'Enviar' })\npage.getByRole('textbox', { name: 'Email' })\npage.getByRole('link', { name: 'Inicio' })\npage.getByLabel('Contraseña')\npage.getByPlaceholder('Escribe tu email')\npage.getByText('Bienvenido')\npage.getByText(/bienvenido/i)           // regex, sin distinción may/min\npage.getByAltText('Logo empresa')\npage.getByTestId('submit-btn')          // data-testid\n\n// ── Filtrar y encadenar ──────────────────────────────\npage.locator('.card').filter({ hasText: 'Disponible' })\npage.locator('li').nth(2)               // tercer elemento\npage.locator('li').first()\npage.locator('li').last()\n\n// ── Todos los elementos ──────────────────────────────\nconst items  = await page.locator('li').all();\nconst textos = await page.locator('li').allTextContents();\nconst total  = await page.locator('li').count();\n\n// ── Estado ───────────────────────────────────────────\nconst visible = await page.locator('#modal').isVisible();\nconst enabled = await page.locator('button').isEnabled();"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Orden de preferencia: <strong>getByRole</strong> › <strong>getByLabel</strong> › <strong>getByTestId</strong> › CSS. Los dos primeros reflejan cómo los usuarios reales interactúan con la interfaz."
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Encuentra los elementos correctos",
        "taskHtml": "Dado este HTML:\n          <br><br>\n          <code>&lt;form&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;label for=\"u\"&gt;Usuario&lt;/label&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;input id=\"u\" placeholder=\"Tu nombre de usuario\"&gt;</code><br>\n          <code>&nbsp;&nbsp;&lt;button type=\"submit\"&gt;Crear cuenta&lt;/button&gt;</code><br>\n          <code>&lt;/form&gt;</code>\n          <br><br>\n          Escribe tres locators diferentes para seleccionar el campo de texto, y uno para el botón de submit. Usa la forma más semántica posible.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "// Campo de texto — 3 formas\npage.getByLabel('Usuario')                          // ✅ mejor\npage.getByPlaceholder('Tu nombre de usuario')         // ✅ también válido\npage.getByRole('textbox', { name: 'Usuario' })       // ✅ semántico\n\n// Botón\npage.getByRole('button', { name: 'Crear cuenta' })   // ✅ lo mejor\npage.getByText('Crear cuenta')                       // funciona pero menos preciso"
        }
      },
      {
        "type": "quiz",
        "id": "s5",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — Según el orden de preferencia recomendado, ¿cuál locator deberías usar primero?",
        "options": [
          "<code>getByRole()</code>, porque refleja cómo interactúan los usuarios reales con la interfaz.",
          "XPath, porque es el más flexible.",
          "Un selector CSS anidado como <code>div &gt; form &gt; button:nth-child(3)</code>.",
          "<code>getByTestId()</code>, siempre es la mejor opción."
        ],
        "answerIndex": 0,
        "explanationHtml": "El orden recomendado es getByRole › getByLabel › getByTestId › CSS. Los dos primeros son \"semánticos\": dependen del significado del elemento (su rol, su etiqueta), no de detalles de implementación que cambian con el diseño."
      }
    ]
  },
  {
    "id": "s6",
    "num": "06",
    "group": "Interacción",
    "title": "Acciones",
    "difficulty": "beginner",
    "description": "Playwright espera automáticamente a que el elemento sea visible, habilitado y estable antes de ejecutar cada acción.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Playwright ya espera automáticamente a que un elemento sea visible y esté habilitado antes de actuar. No necesitas escribir ese código tú mismo, pero sí necesitas saber qué acción usar en cada caso."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const btn   = page.getByRole('button', { name: 'Enviar' });\nconst email = page.getByLabel('Email');\n\n// Clics\nawait btn.click();\nawait btn.dblclick();\nawait btn.click({ button: 'right' });\nawait btn.click({ modifiers: ['Control'] });\n\n// Formularios\nawait email.fill('user@correo.com');   // limpia y escribe\nawait email.clear();\nawait email.type('lento', { delay: 80 }); // simula tecleo real\nawait email.press('Tab');\nawait page.keyboard.press('Control+A');\n\n// Checkbox / Radio\nawait page.getByLabel('Recordarme').check();\nawait page.getByLabel('Recordarme').uncheck();\n\n// Select\nawait page.getByLabel('País').selectOption('México');\nawait page.getByLabel('Idiomas').selectOption(['es', 'en']);\n\n// Hover, foco, drag\nawait btn.hover();\nawait page.locator('#card').dragTo(page.locator('#done'));"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Completa un formulario de registro",
        "taskHtml": "Escribe un test que:\n          <br>1. Navegue a <code>https://practice.expandtesting.com/register</code>\n          <br>2. Rellene el campo <strong>Username</strong> con <code>miusuario</code>\n          <br>3. Rellene <strong>Password</strong> y <strong>Confirm Password</strong> con <code>MiClave123!</code>\n          <br>4. Marque el checkbox de términos y condiciones\n          <br>5. Haga clic en el botón <strong>Register</strong>",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "test('registro de nuevo usuario', async ({ page }) => {\n  await page.goto('https://practice.expandtesting.com/register');\n\n  await page.getByLabel('Username').fill('miusuario');\n  await page.getByLabel('Password', { exact: true }).fill('MiClave123!');\n  await page.getByLabel('Confirm Password').fill('MiClave123!');\n  await page.getByLabel(/terms/i).check();\n  await page.getByRole('button', { name: 'Register' }).click();\n\n  await expect(page.getByText(/successfully/i)).toBeVisible();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s6",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué hace <code>fill()</code> que <code>type()</code> no hace?",
        "options": [
          "<code>fill()</code> simula el tecleo letra por letra con delays realistas.",
          "<code>type()</code> solo funciona en campos de tipo email.",
          "<code>fill()</code> limpia el campo antes de escribir; <code>type()</code> simula tecleo real y es más lento.",
          "No hay diferencia, son alias del mismo método."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>fill()</code> es rápido y directo (limpia y escribe de golpe) — úsalo casi siempre. <code>type()</code> simula pulsaciones reales con <code>delay</code>, útil solo cuando pruebas comportamiento que depende de eventos de teclado (como un autocompletado)."
      }
    ]
  },
  {
    "id": "s7",
    "num": "07",
    "group": "Validación",
    "title": "Assertions (Expect)",
    "difficulty": "beginner",
    "description": "Playwright reintenta las assertions automáticamente durante el timeout (5 s por defecto). No necesitas esperas manuales antes de verificar.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Las assertions de Playwright reintentan solas durante varios segundos. Si entiendes esto, dejas de escribir esperas manuales antes de cada verificación."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Assertions más usadas",
          "langClass": "ts",
          "code": "// Visibilidad y estado\nawait expect(locator).toBeVisible();\nawait expect(locator).toBeHidden();\nawait expect(locator).toBeEnabled();\nawait expect(locator).toBeDisabled();\nawait expect(locator).toBeChecked();\n\n// Contenido\nawait expect(locator).toHaveText('Bienvenido, Carlos');  // exacto\nawait expect(locator).toHaveText(/bienvenido/i);\nawait expect(locator).toContainText('Carlos');\nawait expect(locator).toHaveValue('carlos@email.com');\nawait expect(locator).toHaveCount(5);\n\n// Atributos y estilos\nawait expect(locator).toHaveAttribute('href', '/perfil');\nawait expect(locator).toHaveClass('btn-active');\nawait expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)');\n\n// Página\nawait expect(page).toHaveTitle(/Dashboard/);\nawait expect(page).toHaveURL(/\\/home/);\n\n// Negación\nawait expect(locator).not.toBeVisible();\nawait expect(page).not.toHaveURL(/error/);"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Verifica el estado de una página",
        "taskHtml": "Después de hacer login en una app, escribe assertions para verificar:\n          <br>1. La URL contiene <code>/dashboard</code>\n          <br>2. Hay un <code>&lt;h1&gt;</code> que dice \"Panel de control\"\n          <br>3. El botón \"Cerrar sesión\" es visible\n          <br>4. El botón \"Login\" ya no está visible",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await expect(page).toHaveURL(/\\/dashboard/);\nawait expect(page.getByRole('heading', { name: 'Panel de control' })).toBeVisible();\nawait expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();\nawait expect(page.getByRole('button', { name: 'Login' })).not.toBeVisible();"
        }
      },
      {
        "type": "quiz",
        "id": "s7",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — Haces clic en un botón que abre un modal con animación y luego escribes <code>await expect(locator).toBeVisible()</code>. ¿Necesitas un <code>waitForTimeout</code> antes?",
        "options": [
          "Sí, siempre, para dar tiempo a la animación.",
          "Sí, pero solo en Firefox.",
          "Solo si el modal usa CSS transitions.",
          "No — <code>expect()</code> reintenta automáticamente durante el timeout por defecto (5s) hasta que la condición se cumpla."
        ],
        "answerIndex": 3,
        "explanationHtml": "Esta es una de las características más poderosas de Playwright: las assertions con <code>expect</code> no fallan al primer intento, sino que reintentan hasta cumplirse o agotar el timeout — por eso casi nunca necesitas <code>waitForTimeout</code>."
      }
    ]
  },
  {
    "id": "s8",
    "num": "08",
    "group": "Validación",
    "title": "Waits (Esperas Explícitas)",
    "difficulty": "intermediate",
    "description": "Playwright tiene auto-waiting en casi todas las acciones. Estas funciones son para condiciones avanzadas que el auto-wait no cubre.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> El auto-wait cubre la mayoría de los casos, pero cuando necesitas esperar una condición muy específica (una petición de red, un contador en el DOM) hacen falta estas herramientas."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// Esperar a que desaparezca un spinner y aparezca el resultado\nawait page.locator('.spinner').waitFor({ state: 'hidden' });\nawait page.locator('.resultado').waitFor({ state: 'visible' });\n// Estados: 'visible' | 'hidden' | 'attached' | 'detached'\n\n// Esperar cambio de URL (tras submit de formulario)\nawait page.waitForURL('**/confirmacion', { timeout: 15000 });\n\n// Esperar condición personalizada (polling)\nawait page.waitForFunction(() =>\n  document.querySelectorAll('.producto').length >= 10\n);\n\n// Esperar respuesta de red + acción en simultáneo\nconst [response] = await Promise.all([\n  page.waitForResponse('**/api/productos'),\n  page.getByRole('button', { name: 'Cargar más' }).click(),\n]);\nconst data = await response.json();"
        }
      },
      {
        "type": "callout",
        "variant": "warn",
        "icon": "⚠️",
        "html": "Evita <code>waitForTimeout(5000)</code>. Los timeouts fijos hacen tests lentos e inestables en CI. Siempre espera una condición, no un tiempo arbitrario."
      },
      {
        "type": "quiz",
        "id": "s8",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Cuál es el problema principal de usar <code>waitForTimeout(5000)</code> en vez de esperar una condición?",
        "options": [
          "Solo funciona con navegadores headless.",
          "Hace los tests lentos en máquinas rápidas e inestables (flaky) en CI cuando la máquina es más lenta de lo esperado.",
          "Es ilegal en la licencia de Playwright.",
          "Consume más memoria que otros métodos de espera."
        ],
        "answerIndex": 1,
        "explanationHtml": "Un tiempo fijo nunca es exacto: si sobra, desperdicias segundos en cada ejecución; si falta (por ejemplo en un runner de CI más lento), el test falla aunque la app funcione bien. Esperar una condición real resuelve ambos problemas."
      }
    ]
  },
  {
    "id": "s9",
    "num": "09",
    "group": "Avanzado",
    "title": "Frames (iFrames)",
    "difficulty": "intermediate",
    "description": "Para interactuar con un <code>&lt;iframe&gt;</code> primero obtén el frame. Luego lo usas exactamente igual que <code>page</code>.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Un iframe es literalmente un documento HTML distinto embebido en la página. Playwright necesita saber explícitamente que quieres ‘entrar’ a ese documento antes de buscar elementos dentro."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// frameLocator — método recomendado\nconst frame = page.frameLocator('iframe[name=\"pago\"]');\n\nawait frame.getByLabel('Número de tarjeta').fill('4111 1111 1111 1111');\nawait frame.getByLabel('CVV').fill('123');\nawait frame.getByRole('button', { name: 'Pagar' }).click();\n\n// Objeto Frame (alternativa legacy — prefiere frameLocator)\nconst f = page.frame({ name: 'mi-iframe' });\n// ⚠️ Prefiere getByLabel/getByRole sobre selectores CSS\nawait f?.getByLabel('Nombre').fill('Juan');"
        }
      },
      {
        "type": "quiz",
        "id": "s9",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué método se recomienda para trabajar con un iframe?",
        "options": [
          "<code>page.evaluate()</code> con JavaScript manual.",
          "No es posible interactuar con iframes en Playwright.",
          "<code>page.frameLocator()</code>, que se usa exactamente igual que <code>page</code>.",
          "<code>page.locator()</code> directamente, funciona igual dentro y fuera del iframe."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>frameLocator()</code> es la forma moderna y recomendada: devuelve un objeto con la misma API que <code>page</code>, así que puedes encadenar <code>.getByLabel()</code>, <code>.click()</code>, etc. sin cambiar tu forma de pensar."
      }
    ]
  },
  {
    "id": "s10",
    "num": "10",
    "group": "Avanzado",
    "title": "Dialogs (alert, confirm, prompt)",
    "difficulty": "intermediate",
    "description": "Los diálogos nativos del navegador se capturan con el evento <code>dialog</code>. Registra el handler ANTES de la acción que lo dispara.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Los diálogos nativos (alert, confirm, prompt) bloquean el navegador. Si no registras el handler a tiempo, tu test se queda colgado esperando algo que nunca vas a poder pulsar."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "// Aceptar cualquier diálogo\npage.on('dialog', dialog => dialog.accept());\n\n// Manejar según tipo\npage.on('dialog', async dialog => {\n  console.log(dialog.type);        // 'alert' | 'confirm' | 'prompt'\n  console.log(dialog.message());\n  if (dialog.type === 'prompt') {\n    await dialog.accept('Mi respuesta');\n  } else {\n    await dialog.accept();\n  }\n});\n\n// Solo el PRÓXIMO diálogo (no todos los futuros)\npage.once('dialog', d => d.accept());\nawait page.getByRole('button', { name: 'Eliminar cuenta' }).click();"
        }
      },
      {
        "type": "quiz",
        "id": "s10",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Por qué hay que registrar <code>page.on('dialog', ...)</code> ANTES del clic que dispara el diálogo?",
        "options": [
          "Porque TypeScript lo exige por tipado estricto.",
          "Porque el diálogo bloquea el navegador en cuanto aparece — si el handler no está listo, Playwright no puede aceptarlo y el test se queda esperando.",
          "Porque el evento 'dialog' solo se dispara una vez por sesión de test.",
          "Es solo una buena práctica de estilo, pero funciona igual si se registra después."
        ],
        "answerIndex": 1,
        "explanationHtml": "Los diálogos nativos son bloqueantes por diseño del navegador. El patrón correcto siempre es: primero <code>page.on('dialog', ...)</code>, después la acción que lo abre — nunca al revés."
      }
    ]
  },
  {
    "id": "s11",
    "num": "11",
    "group": "Avanzado",
    "title": "Popups (ventanas nuevas)",
    "difficulty": "intermediate",
    "description": "Ventanas abiertas con <code>target=\"_blank\"</code>. Escucha el evento <strong>antes</strong> del clic que las abre.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Un enlace con <code>target=\"_blank\"</code> abre una pestaña nueva casi instantáneamente. Si escuchas el evento después del clic, puedes perderlo."
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
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Por qué se usa <code>Promise.all([page.waitForEvent('popup'), link.click()])</code> en vez de hacer el clic y luego esperar?",
        "options": [
          "Porque mejora el rendimiento general del test.",
          "Porque <code>Promise.all</code> inicia ambas promesas antes de esperar, evitando la race condition donde el popup se abre antes de que empieces a escuchar.",
          "Por estilo de código; ambas formas son equivalentes en la práctica.",
          "Porque <code>waitForEvent</code> no puede usarse fuera de un <code>Promise.all</code>."
        ],
        "answerIndex": 1,
        "explanationHtml": "Es el mismo patrón que evita perder el evento \"dialog\": registrar la escucha y disparar la acción en el mismo instante, no en secuencia."
      }
    ]
  },
  {
    "id": "s12",
    "num": "12",
    "group": "Avanzado",
    "title": "File Upload",
    "difficulty": "intermediate",
    "description": "Simula la selección de archivos sin abrir el diálogo del sistema operativo.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Los selectores de archivo del sistema operativo no se pueden automatizar directamente. Playwright los evita por completo inyectando el archivo en el input."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.setInputFiles('input[type=\"file\"]', './foto.png');\nawait page.setInputFiles('input[type=\"file\"]', ['./a.png', './b.pdf']);\nawait page.setInputFiles('input[type=\"file\"]', []);  // limpiar\n\n// Con locator\nawait page.getByLabel('Sube tu CV').setInputFiles('./mi-cv.pdf');"
        }
      },
      {
        "type": "quiz",
        "id": "s12",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué hace <code>setInputFiles('input[type=\"file\"]', [])</code> con un array vacío?",
        "options": [
          "Lanza un error porque necesita al menos un archivo.",
          "Abre el diálogo nativo del sistema operativo.",
          "Limpia la selección de archivos del input.",
          "Selecciona todos los archivos de la carpeta actual."
        ],
        "answerIndex": 2,
        "explanationHtml": "Pasar un array vacío es la forma de simular que el usuario canceló o borró su selección, sin tener que interactuar con ningún diálogo del sistema."
      }
    ]
  },
  {
    "id": "s13",
    "num": "13",
    "group": "Avanzado",
    "title": "Descargas",
    "difficulty": "intermediate",
    "description": "Captura archivos descargados. El patrón es el mismo que con popups: escucha antes de la acción.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Igual que con popups y dialogs, una descarga es un evento que puede dispararse muy rápido. El patrón de ‘escuchar antes de actuar’ se repite en Playwright por la misma razón."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const [download] = await Promise.all([\n  page.waitForEvent('download'),\n  page.getByRole('button', { name: 'Descargar Reporte' }).click(),\n]);\nconsole.log(download.suggestedFilename());         // \"reporte.pdf\"\nawait download.saveAs('./reportes/reporte.pdf');\nawait download.delete();                            // limpia el temporal"
        }
      },
      {
        "type": "quiz",
        "id": "s13",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — Después de capturar el evento <code>'download'</code>, ¿qué hace <code>download.saveAs(ruta)</code>?",
        "options": [
          "Cancela la descarga.",
          "Guarda el archivo descargado (que vive en una carpeta temporal) en la ruta indicada.",
          "Abre el archivo descargado en el navegador.",
          "Verifica que la descarga tuvo éxito (es un assertion)."
        ],
        "answerIndex": 1,
        "explanationHtml": "Playwright guarda cada descarga en un archivo temporal automáticamente; <code>saveAs()</code> es lo que mueve ese archivo a donde tú decidas para inspeccionarlo o guardarlo."
      }
    ]
  },
  {
    "id": "s14",
    "num": "14",
    "group": "Avanzado",
    "title": "Cookies",
    "difficulty": "intermediate",
    "description": "Gestiona cookies del contexto para simular sesiones sin pasar por el flujo de login en cada test.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Hacer login por la UI en cada test es lento. Inyectar cookies o el <code>storageState</code> guardado te permite arrancar cada test ya autenticado."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await context.addCookies([{\n  name: 'session_token', value: 'eyJhbGci...',\n  domain: 'mi-app.com', path: '/',\n  httpOnly: true, secure: true,\n}]);\n\nconst cookies = await context.cookies();\nawait context.clearCookies();\n\n// Guardar estado completo (cookies + localStorage) para reutilizar sesión\nawait context.storageState({ path: './auth.json' });"
        }
      },
      {
        "type": "quiz",
        "id": "s14",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué guarda <code>context.storageState({ path: './auth.json' })</code>?",
        "options": [
          "Una captura de pantalla del estado actual.",
          "Solo las cookies del contexto.",
          "El historial de navegación.",
          "Cookies y localStorage juntos, en un archivo reutilizable como sesión guardada."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>storageState</code> es la forma recomendada de \"saltarse\" el login en tests: haces login una vez, guardas el estado, y lo reutilizas como punto de partida en otros tests."
      }
    ]
  },
  {
    "id": "s15",
    "num": "15",
    "group": "Avanzado",
    "title": "Local Storage / Session Storage",
    "difficulty": "intermediate",
    "description": "Accede al almacenamiento del navegador con <code>page.evaluate()</code>, que ejecuta código JS dentro del contexto de la página.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> localStorage no es parte de la API de Playwright, es parte del navegador. <code>page.evaluate()</code> es el puente que te deja ejecutar JavaScript real dentro de la página."
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
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Por qué necesitas <code>page.evaluate()</code> para leer o escribir en localStorage, en vez de un método directo de Playwright?",
        "options": [
          "Solo funciona en Chromium, no en Firefox o WebKit.",
          "Es un bug conocido que Playwright no ha corregido.",
          "Playwright no soporta localStorage en absoluto.",
          "localStorage es una API del navegador, no de Playwright; <code>evaluate()</code> ejecuta tu función dentro del contexto de la página, donde <code>localStorage</code> sí existe."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>page.evaluate()</code> es tu puerta de entrada a cualquier API del navegador que Playwright no exponga directamente: corre el callback dentro de la página, no en tu script de Node."
      }
    ]
  },
  {
    "id": "s16",
    "num": "16",
    "group": "Avanzado",
    "title": "API Testing (Request)",
    "difficulty": "advanced",
    "description": "Playwright puede hacer peticiones HTTP directamente sin abrir un navegador. Ideal para preparar datos de test o verificar endpoints REST.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> No todo test necesita un navegador. Crear datos de prueba (o verificar un backend) por API directa es mucho más rápido que hacerlo clic por clic en la UI."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "test('API — CRUD usuario', async ({ request }) => {\n  // GET\n  const res = await request.get('https://api.app.com/usuarios');\n  await expect(res).toBeOK();\n  const lista = await res.json();\n\n  // POST — crear\n  const post = await request.post('https://api.app.com/usuarios', {\n    data: { nombre: 'Ana García', email: 'ana@test.com' },\n    headers: { Authorization: 'Bearer mi-token' },\n  });\n  await expect(post).toHaveStatus(201);\n\n  // PUT / DELETE\n  const { id } = await post.json();\n  await request.put(`/usuarios/${id}`, { data: { nombre: 'Ana López' } });\n  await request.delete(`/usuarios/${id}`);\n  await request.dispose();\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s16",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Cuál es la ventaja clave de usar el fixture <code>request</code> en vez de simular la UI para preparar datos de test?",
        "options": [
          "Es mucho más rápido y estable porque salta la UI por completo y habla directo con la API.",
          "<code>request</code> puede hacer clic en botones más rápido que <code>page</code>.",
          "Solo funciona con APIs GraphQL.",
          "<code>request</code> no necesita autenticación."
        ],
        "answerIndex": 0,
        "explanationHtml": "Usar <code>request</code> para crear o borrar datos de setup (en vez de rellenar formularios) hace que tus tests de UI se enfoquen solo en lo que realmente quieres probar, y corran mucho más rápido."
      }
    ]
  },
  {
    "id": "s17",
    "num": "17",
    "group": "Avanzado",
    "title": "Interceptar y Mockear Peticiones de Red",
    "difficulty": "advanced",
    "description": "Con <code>page.route()</code> interceptas cualquier petición que haga la página antes de que llegue al servidor, y decides qué responder. Sirve para simular errores del backend, acelerar tests bloqueando recursos innecesarios, o probar la UI sin depender de un servidor real.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Depender de un backend real hace los tests lentos, inestables y a veces imposibles de escribir (¿cómo provocas un error 500 a propósito?). Interceptar la red te da control total sobre lo que la página recibe."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Mockear una respuesta completa",
          "langClass": "ts",
          "code": "await page.route('**/api/usuarios', async route => {\n  await route.fulfill({\n    status: 200,\n    contentType: 'application/json',\n    body: JSON.stringify([{ id: 1, nombre: 'Usuario de prueba' }]),\n  });\n});\nawait page.goto('/usuarios');\n// La página nunca llega a tocar el backend real"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript — Modificar una respuesta real, y bloquear recursos",
          "langClass": "ts",
          "code": "await page.route('**/api/usuarios', async route => {\n  const response = await route.fetch();            // deja pasar la petición real\n  const body = await response.json();\n  body.push({ id: 999, nombre: 'Usuario inyectado' }); // modificas el resultado\n  await route.fulfill({ response, body: JSON.stringify(body) });\n});\n\n// Bloquear peticiones que no necesitas — tests más rápidos y estables\nawait page.route('**/*.{png,jpg,jpeg}', route => route.abort());\nawait page.route('**/analytics/**', route => route.abort());"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Para simular un error del servidor solo necesitas cambiar el <code>status</code>: <code>route.fulfill({'{'} status: 500, body: 'Error interno' {'}'})</code> — así pruebas cómo reacciona tu UI sin tener que romper el backend real."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sin mock — depende de datos reales",
          "langClass": "bad",
          "code": "// El test falla si el backend está caído,\n// si otro test ya borró ese usuario, etc.\nawait page.goto('/usuarios');\nawait expect(page.getByText('Ana García')).toBeVisible();"
        },
        "good": {
          "label": "✅ Con mock — determinístico",
          "langClass": "good",
          "code": "// El resultado es siempre el mismo,\n// sin importar el estado del backend\nawait page.route('**/api/usuarios', route => route.fulfill({ body: '[...]' }));\nawait page.goto('/usuarios');"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Simula un error del servidor",
        "taskHtml": "Usa <code>page.route()</code> para interceptar <code>**/api/pedido</code> y responder con status <code>500</code>. Luego navega a <code>/pedido</code> y verifica que la página muestra el texto <strong>\"Ocurrió un error\"</strong>.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await page.route('**/api/pedido', route => route.fulfill({\n  status: 500,\n  body: 'Error interno',\n}));\n\nawait page.goto('/pedido');\nawait expect(page.getByText('Ocurrió un error')).toBeVisible();"
        }
      },
      {
        "type": "quiz",
        "id": "s17",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué hace <code>route.fetch()</code> seguido de <code>route.fulfill({ response, body: ... })</code> en un handler de <code>page.route()</code>?",
        "options": [
          "Deja que la petición real llegue al servidor y luego modifica la respuesta antes de dársela a la página.",
          "Bloquea la petición por completo, sin dejarla salir nunca.",
          "Duplica la petición y la envía dos veces al servidor.",
          "Solo funciona con peticiones de tipo GET, nunca con POST."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>route.fetch()</code> ejecuta la petición original y te da la respuesta real; a partir de ahí puedes leerla, modificarla (por ejemplo agregar un elemento a la lista) y entregársela a la página con <code>fulfill()</code> — a diferencia de <code>route.fulfill()</code> directo, que nunca toca el servidor."
      }
    ]
  },
  {
    "id": "s18",
    "num": "18",
    "group": "Avanzado",
    "title": "Información de Página",
    "difficulty": "intermediate",
    "description": "Obtén metadatos, contenido del DOM y ejecuta JavaScript en el contexto de la página.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> A veces necesitas datos que no son un elemento visual: el título, la URL actual, o ejecutar lógica de JavaScript que no tiene equivalente directo en la API de Playwright."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "const titulo = await page.title();\nconst url    = page.url();\nconst vp     = page.viewportSize();\nconst texto  = await page.locator('h1').innerText();\n\n// Ejecutar JS en el browser\nconst scrollY = await page.evaluate(() => window.scrollY);\nconst n = await page.locator('.tarjeta').count();\n\nawait page.pdf({ path: 'pagina.pdf', format: 'A4' });"
        }
      },
      {
        "type": "quiz",
        "id": "s18",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué diferencia hay entre <code>page.title()</code> y <code>page.url()</code> en cuanto a si necesitan <code>await</code>?",
        "options": [
          "<code>title()</code> es asíncrono (necesita await); <code>url()</code> es síncrono porque Playwright ya tiene ese dato en memoria.",
          "Ambos son asíncronos y necesitan await.",
          "Ninguno de los dos necesita await.",
          "Depende del navegador usado."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>url()</code> no cruza al proceso del navegador — Playwright ya conoce la URL actual internamente. <code>title()</code> sí requiere una consulta asíncrona al documento."
      }
    ]
  },
  {
    "id": "s19",
    "num": "19",
    "group": "Avanzado",
    "title": "Viewport & Emulación",
    "difficulty": "intermediate",
    "description": "Simula dispositivos, dark mode, zona horaria y geolocalización para tests responsivos.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Una app puede comportarse distinto en móvil que en escritorio. Emular dispositivos, tema oscuro o geolocalización te permite probar esos escenarios sin un dispositivo físico."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "import { devices } from '@playwright/test';\n\n// Dispositivo completo (viewport + userAgent + touch)\nconst ctx = await browser.newContext({ ...devices['iPhone 14'] });\n\nawait context.setViewportSize({ width: 375, height: 812 });\nawait context.emulateMedia({ colorScheme: 'dark' });\nawait context.emulateTimezone('America/Mexico_City');\nawait context.grantPermissions(['geolocation']);\nawait context.setGeolocation({ latitude: 19.4326, longitude: -99.1332 });"
        }
      },
      {
        "type": "quiz",
        "id": "s19",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué incluye <code>devices['iPhone 14']</code> que un simple <code>setViewportSize()</code> no incluye?",
        "options": [
          "La ubicación GPS del dispositivo real.",
          "Los navegadores instalados en un iPhone real.",
          "Solo el ancho y alto de pantalla.",
          "El viewport, el user agent y la emulación táctil (touch) juntos, como un perfil de dispositivo completo."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>devices[...]</code> es un preset completo (viewport + userAgent + hasTouch, etc.), mientras que <code>setViewportSize()</code> solo cambia el tamaño de la ventana."
      }
    ]
  },
  {
    "id": "s20",
    "num": "20",
    "group": "Avanzado",
    "title": "Screenshots & Videos",
    "difficulty": "intermediate",
    "description": "Capturas para depuración visual y detección de regresiones en la UI.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Un test que falla es mucho más fácil de depurar con una captura o un video que solo con un mensaje de error de texto."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "await page.screenshot({ path: 'inicio.png' });\nawait page.screenshot({ path: 'full.png', fullPage: true });\nawait page.locator('#chart').screenshot({ path: 'chart.png' });\n\n// Snapshot testing (comparación visual)\nawait expect(page).toHaveScreenshot('homepage.png');\n\n// Video\nconst ctx = await browser.newContext({\n  recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }\n});\n\n// Desactivar animaciones para capturas estables\nawait page.addStyleTag({\n  content: '*, *::before, *::after { animation-duration: 0s !important; }'\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s20",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Para qué sirve <code>toHaveScreenshot()</code> a diferencia de <code>page.screenshot()</code>?",
        "options": [
          "<code>page.screenshot()</code> no puede capturar la página completa.",
          "Son idénticos, solo cambia el nombre.",
          "Solo funciona en modo headed.",
          "Es una assertion: compara la captura actual contra una guardada como referencia y falla si difieren (testing visual)."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>page.screenshot()</code> simplemente guarda una imagen. <code>toHaveScreenshot()</code> es parte del sistema de assertions: compara píxel a píxel contra un \"baseline\" guardado, detectando regresiones visuales."
      }
    ]
  },
  {
    "id": "s21",
    "num": "21",
    "group": "Avanzado",
    "title": "Tracing",
    "difficulty": "advanced",
    "description": "El trace captura screenshots, red, DOM y código fuente por cada acción. Se visualiza en el Playwright Trace Viewer.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Cuando un test falla en CI y no puedes reproducirlo en tu máquina, un trace es lo más cercano a ‘grabar’ exactamente lo que pasó, paso a paso."
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
        "html": "En producción usa <code>trace: 'on-first-retry'</code> en la config para solo guardar trace cuando un test falla por primera vez."
      },
      {
        "type": "quiz",
        "id": "s21",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Cuál es la configuración recomendada de <code>trace</code> en producción/CI?",
        "options": [
          "No hay una recomendación estándar.",
          "<code>'on-first-retry'</code>: graba el trace solo cuando un test falla en su primer intento y se reintenta.",
          "<code>'off'</code>, porque consume demasiados recursos.",
          "<code>'on'</code>, para grabar siempre, en todos los tests."
        ],
        "answerIndex": 1,
        "explanationHtml": "Grabar siempre es costoso en espacio y tiempo. \"on-first-retry\" es el punto medio: solo pagas el costo del trace cuando algo realmente falló y necesitas investigarlo."
      }
    ]
  },
  {
    "id": "s22",
    "num": "22",
    "group": "Avanzado",
    "title": "Configuración (playwright.config.ts)",
    "difficulty": "advanced",
    "description": "Define browsers, timeouts, directorio de tests y opciones globales.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> El archivo de configuración centraliza decisiones que, si las repites test por test, generan inconsistencias. Un solo lugar controla navegadores, timeouts y reportes para todo el proyecto."
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
        "questionHtml": "<strong>Autoevaluación</strong> — En el bloque <code>projects</code>, ¿para qué sirve tener entradas separadas para Chrome, Firefox y Mobile?",
        "options": [
          "Permite correr la misma suite de tests contra distintos navegadores/dispositivos sin duplicar el código de los tests.",
          "Cada proyecto necesita su propio archivo de tests; no se pueden compartir.",
          "Solo afecta al reporte final, no a la ejecución real.",
          "Es obligatorio tener al menos 3 proyectos configurados."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>projects</code> es multiplicación gratis: escribes los tests una sola vez y Playwright los ejecuta contra cada configuración de navegador/dispositivo que definas."
      }
    ]
  },
  {
    "id": "s23",
    "num": "23",
    "group": "Avanzado",
    "title": "Anotaciones de Tests",
    "difficulty": "intermediate",
    "description": "Organiza tests en grupos, usa hooks de ciclo de vida y marca tests especiales sin borrar código.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Organizar tests en grupos y usar hooks evita repetir el mismo código de setup en cada test, y marcar tests como skip o fixme documenta el estado real de tu suite sin borrar trabajo."
      },
      {
        "type": "code",
        "block": {
          "label": "TypeScript",
          "langClass": "ts",
          "code": "test.describe('Autenticación', () => {\n  test.beforeAll(async () => { /* una vez antes del grupo */ });\n  test.afterAll(async  () => { /* una vez después del grupo */ });\n  test.beforeEach(async ({ page }) => { await page.goto('/login'); });\n  test.afterEach(async  ({ page }) => { /* limpieza */ });\n\n  test('login exitoso', async ({ page }) => { ... });\n  test.skip('SSO — no implementado', async () => {});\n  test.fixme('reset contraseña — flaky', async () => {});\n});\n\ntest.only('depurar este test', async ({ page }) => { ... });  // solo este\ntest.slow('test pesado', async ({ page }) => { ... });       // triple timeout"
        }
      },
      {
        "type": "quiz",
        "id": "s23",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Cuál es el riesgo real de dejar <code>test.only()</code> en un commit?",
        "options": [
          "Solo ese test se ejecutará en el CI — todos los demás quedan silenciosamente sin correr, dando una falsa sensación de que todo pasa.",
          "Ninguno: Playwright lo detecta y lo ignora automáticamente en CI.",
          "El test correrá más lento que los demás.",
          "Rompe la compilación de TypeScript."
        ],
        "answerIndex": 0,
        "explanationHtml": "<code>test.only</code> es útil mientras depuras un test localmente, pero si llega a main, el CI deja de verificar todo lo demás sin ningún error visible — por eso conviene un linter que lo detecte antes del commit."
      }
    ]
  },
  {
    "id": "s24",
    "num": "24",
    "group": "Avanzado",
    "title": "Comandos y Atajos",
    "difficulty": "beginner",
    "description": "Comandos para ejecutar, filtrar, depurar y reportar tests desde la terminal.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Conocer los flags de la CLI te ahorra minutos cada vez que depuras: filtrar por nombre, ver solo lo que falló, o grabar acciones en vez de escribirlas a mano."
      },
      {
        "type": "shortcuts",
        "items": [
          {
            "keys": "--ui",
            "description": "Interfaz visual"
          },
          {
            "keys": "--headed",
            "description": "Ver navegador"
          },
          {
            "keys": "--debug",
            "description": "Debug paso a paso"
          },
          {
            "keys": "-g \"texto\"",
            "description": "Filtrar por nombre"
          },
          {
            "keys": "--last-failed",
            "description": "Solo los fallidos"
          },
          {
            "keys": "codegen",
            "description": "Grabar acciones"
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
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué hace <code>npx playwright codegen https://mi-app.com</code>?",
        "options": [
          "Optimiza el código existente de los tests.",
          "Genera el archivo playwright.config.ts desde cero.",
          "Ejecuta todos los tests existentes contra esa URL.",
          "Abre un navegador donde grabas tus acciones (clics, escritura) y genera el código de Playwright automáticamente."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>codegen</code> es una herramienta de exploración: interactúas con la app manualmente y Playwright traduce cada acción a código — muy útil para descubrir qué locators usar."
      }
    ]
  },
  {
    "id": "s25",
    "num": "25",
    "group": "Avanzado",
    "title": "Page Object Model (POM)",
    "difficulty": "advanced",
    "description": "Un <strong>Page Object</strong> es una clase que agrupa los locators y las acciones de una página (o componente) en un solo lugar. En vez de escribir <code>page.getByLabel('Email').fill(...)</code> en cada test, el test llama a un método con nombre de negocio como <code>loginPage.login(usuario, clave)</code>.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Repetir los mismos locators en cada test es la razón más común por la que una suite se vuelve imposible de mantener. El patrón Page Object soluciona esto agrupando cada página en una clase reutilizable."
      },
      {
        "type": "code",
        "block": {
          "label": "pages/LoginPage.ts",
          "langClass": "ts",
          "code": "import { type Page, type Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly email: Locator;\n  readonly password: Locator;\n  readonly submitBtn: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    // Los locators se definen una sola vez, aquí\n    this.email = page.getByLabel('Email');\n    this.password = page.getByLabel('Contraseña');\n    this.submitBtn = page.getByRole('button', { name: 'Entrar' });\n  }\n\n  async goto() {\n    await this.page.goto('/login');\n  }\n\n  // El método expresa INTENCIÓN, no pasos técnicos\n  async login(usuario: string, clave: string) {\n    await this.email.fill(usuario);\n    await this.password.fill(clave);\n    await this.submitBtn.click();\n  }\n}"
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
        "html": "Si el diseño cambia y el campo \"Contraseña\" pasa a llamarse \"Clave de acceso\", corriges <strong>un solo locator</strong> en <code>LoginPage.ts</code> — ningún test necesita tocarse."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sin POM — locators repetidos en cada test",
          "langClass": "bad",
          "code": "test('test 1', async ({ page }) => {\n  await page.getByLabel('Email').fill('a@test.com');\n  await page.getByLabel('Contraseña').fill('123');\n  await page.getByRole('button', { name: 'Entrar' }).click();\n});\ntest('test 2', async ({ page }) => {\n  await page.getByLabel('Email').fill('b@test.com');\n  // ...mismos locators, otra vez\n});"
        },
        "good": {
          "label": "✅ Con POM — un solo lugar para mantener",
          "langClass": "good",
          "code": "test('test 1', async ({ page }) => {\n  await new LoginPage(page).login('a@test.com', '123');\n});\ntest('test 2', async ({ page }) => {\n  await new LoginPage(page).login('b@test.com', '456');\n});"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Crea tu propio Page Object",
        "taskHtml": "Convierte esta lógica repetida en un Page Object llamado <code>SearchPage</code> con un método <code>search(termino: string)</code>:\n          <br><br>\n          <code>await page.getByPlaceholder('Buscar...').fill('zapatos');</code><br>\n          <code>await page.getByRole('button', { name: 'Buscar' }).click();</code>",
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
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué gana un test cuando usa un Page Object como <code>loginPage.login(usuario, clave)</code> en vez de escribir los locators directamente?",
        "options": [
          "Es un requisito obligatorio de la API de Playwright para poder usar fixtures.",
          "Playwright genera automáticamente el reporte HTML solo si usas Page Objects.",
          "El test se vuelve más legible y, si el diseño de la página cambia, solo hay que actualizar el Page Object — no cada test.",
          "El test se ejecuta más rápido porque usa menos memoria."
        ],
        "answerIndex": 2,
        "explanationHtml": "Un Page Object centraliza el \"cómo\" (los locators, los pasos técnicos) para que el test solo exprese el \"qué\" (la intención de negocio). Vas a ver este mismo principio aplicado a un proyecto completo en la sección 27, con <code>TodoPage</code>."
      }
    ]
  },
  {
    "id": "s26",
    "num": "26",
    "group": "Avanzado",
    "title": "Fixtures Personalizados",
    "difficulty": "advanced",
    "description": "Un <strong>fixture</strong> personalizado te deja inyectar algo directamente en la firma del test — como un Page Object ya instanciado y con login hecho — sin repetir <code>new LoginPage(page)</code> ni <code>beforeEach</code> en cada archivo. Es la forma en que se organizan los frameworks de Playwright en proyectos reales.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Repetir 'new LoginPage(page)' y la navegación inicial en el beforeEach de cada archivo es exactamente el tipo de duplicación que un fixture personalizado elimina — lo defines una vez y cualquier test lo pide por nombre."
      },
      {
        "type": "code",
        "block": {
          "label": "fixtures/pages.fixture.ts",
          "langClass": "ts",
          "code": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntype MisFixtures = { loginPage: LoginPage };\n\nexport const test = base.extend<MisFixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await loginPage.goto();               // setup — corre ANTES del test\n\n    await use(loginPage);                 // aquí el test recibe el fixture y corre\n\n    // código después de use() = teardown, corre DESPUÉS del test\n  },\n});\n\nexport { expect } from '@playwright/test';"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "tests/login.spec.ts — el test pide el fixture por nombre",
          "langClass": "ts",
          "code": "import { test, expect } from '../fixtures/pages.fixture';\n\ntest('login exitoso', async ({ loginPage, page }) => {\n  // loginPage ya existe y ya navegó — el setup ya pasó\n  await loginPage.login('user@test.com', 'secret123');\n  await expect(page).toHaveURL(/dashboard/);\n});"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "<code>use(valor)</code> es el punto donde el fixture entrega el valor al test. Todo lo que escribas <strong>después</strong> de ese <code>await use(...)</code> corre como teardown automático al terminar el test — incluso si el test falló."
      },
      {
        "type": "compare",
        "title": "",
        "bad": {
          "label": "❌ Sin fixture — repetido en cada archivo",
          "langClass": "bad",
          "code": "test.beforeEach(async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n});\n// ...y otra vez en el siguiente archivo de test"
        },
        "good": {
          "label": "✅ Con fixture — una sola definición",
          "langClass": "good",
          "code": "test('...', async ({ loginPage }) => {\n  // listo para usar, en cualquier archivo\n});"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Fixture con login automático",
        "taskHtml": "Modifica el fixture <code>loginPage</code> para que, además de navegar, haga login automáticamente con <code>demo@test.com</code> / <code>demo123</code> antes de entregárselo al test — así cualquier test que pida <code>{'{'} loginPage {'}'}</code> arranca ya autenticado.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "loginPage: async ({ page }, use) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.goto();\n  await loginPage.login('demo@test.com', 'demo123');  // login ya incluido en el setup\n\n  await use(loginPage);\n},"
        }
      },
      {
        "type": "quiz",
        "id": "s26",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — ¿Qué representa el código que va DESPUÉS de <code>await use(loginPage)</code> dentro de un fixture?",
        "options": [
          "Documentación que Playwright ignora en tiempo de ejecución.",
          "Un segundo fixture alternativo por si el primero falla.",
          "Código que corre antes que el resto del fixture, sin importar su posición.",
          "El teardown: código que Playwright ejecuta automáticamente al terminar el test, incluso si el test falló."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>use(valor)</code> es el punto donde el fixture entrega el valor al test y el test se ejecuta; todo lo que escribas después de ese <code>await</code> corre cuando el test termina — es el lugar natural para cerrar sesiones, limpiar datos o liberar recursos."
      }
    ]
  },
  {
    "id": "s27",
    "num": "27",
    "group": "Práctica",
    "title": "Mini Proyecto Completo",
    "difficulty": "advanced",
    "description": "Un test suite real que conecta todo lo aprendido: setup de sesión, flujo de login, CRUD de tareas y verificación de estado. Usa <a href=\"https://todomvc.com/examples/react/dist/\" style=\"color:var(--cyan)\" target=\"_blank\">TodoMVC React</a> como app de práctica.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Leer características por separado no es lo mismo que combinarlas en un flujo real. Este proyecto conecta un fixture personalizado, un Page Object (<code>TodoPage</code>), locators semánticos y assertions en una sola suite, como en un caso real de trabajo."
      },
      {
        "type": "callout",
        "variant": "info",
        "icon": "🗺️",
        "html": "Este proyecto usa: un <strong>Page Object</strong> (<code>TodoPage</code>, sección 25), un <strong>fixture personalizado</strong> (sección 26) que lo instancia y navega automáticamente, <strong>locators semánticos</strong> y <strong>assertions</strong> encadenadas."
      },
      {
        "type": "code",
        "block": {
          "label": "playwright.config.ts — config del proyecto",
          "langClass": "cfg",
          "code": "import { defineConfig } from '@playwright/test';\nexport default defineConfig({\n  testDir: './tests',\n  use: {\n    baseURL: 'https://todomvc.com/examples/react/dist/',\n    headless: true,\n    screenshot: 'only-on-failure',\n  },\n});"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "pages/TodoPage.ts — el Page Object del proyecto",
          "langClass": "ts",
          "code": "import { type Page, type Locator, expect } from '@playwright/test';\n\nexport class TodoPage {\n  readonly page: Page;\n  readonly newTodoInput: Locator;\n  readonly todoItems: Locator;\n  readonly clearCompletedBtn: Locator;\n  readonly toggleAllCheckbox: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.newTodoInput = page.getByPlaceholder('What needs to be done?');\n    this.todoItems = page.locator('.todo-list li');\n    this.clearCompletedBtn = page.getByRole('button', { name: 'Clear completed' });\n    this.toggleAllCheckbox = page.locator('label[for=\"toggle-all\"]');\n  }\n\n  async goto() {\n    await this.page.goto('/');\n    await expect(this.page).toHaveTitle(/TodoMVC/);\n  }\n\n  async addTodo(titulo: string) {\n    await this.newTodoInput.fill(titulo);\n    await this.newTodoInput.press('Enter');\n  }\n\n  async toggleFirst() {\n    await this.todoItems.first().locator('.toggle').click();\n  }\n\n  async editFirst(nuevoTexto: string) {\n    await this.todoItems.first().dblclick();\n    const edit = this.page.locator('.todo-list li.editing input.edit');\n    await edit.fill(nuevoTexto);\n    await edit.press('Enter');\n  }\n\n  async filterBy(nombre: 'All' | 'Active' | 'Completed') {\n    await this.page.getByRole('link', { name: nombre }).click();\n  }\n}"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "fixtures/todo.fixture.ts — el fixture del proyecto",
          "langClass": "ts",
          "code": "import { test as base } from '@playwright/test';\nimport { TodoPage } from '../pages/TodoPage';\n\ntype MisFixtures = { todo: TodoPage };\n\nexport const test = base.extend<MisFixtures>({\n  todo: async ({ page }, use) => {\n    const todo = new TodoPage(page);\n    await todo.goto();      // setup — cada test arranca con la app ya cargada\n    await use(todo);\n  },\n});\n\nexport { expect } from '@playwright/test';"
        }
      },
      {
        "type": "code",
        "block": {
          "label": "tests/todo.spec.ts — el test describe comportamiento, TodoPage hace el trabajo",
          "langClass": "ts",
          "code": "import { test, expect } from '../fixtures/todo.fixture';\n\ntest.describe('TodoMVC — Gestión de tareas', () => {\n  // ya no hay `let todo` ni beforeEach — el fixture lo resuelve\n\n  test('crear una nueva tarea', async ({ todo, page }) => {\n    await todo.addTodo('Aprender Playwright');\n\n    // Verificar que aparece en la lista\n    await expect(page.getByText('Aprender Playwright')).toBeVisible();\n\n    // Verificar el contador\n    await expect(page.getByText('1 item left')).toBeVisible();\n  });\n\n  test('completar una tarea', async ({ todo, page }) => {\n    await todo.addTodo('Tarea para completar');\n    await todo.toggleFirst();\n\n    await expect(page.locator('.todo-list li.completed')).toHaveCount(1);\n    await expect(page.getByText('0 items left')).toBeVisible();\n  });\n\n  test('filtrar tareas activas y completadas', async ({ todo, page }) => {\n    await todo.addTodo('Tarea 1');\n    await todo.addTodo('Tarea 2');\n    await todo.toggleFirst();\n\n    await todo.filterBy('Active');\n    await expect(page.locator('.todo-list li')).toHaveCount(1);\n    await expect(page.getByText('Tarea 2')).toBeVisible();\n\n    await todo.filterBy('Completed');\n    await expect(page.locator('.todo-list li')).toHaveCount(1);\n    await expect(page.getByText('Tarea 1')).toBeVisible();\n  });\n\n  test('editar una tarea con doble clic', async ({ todo, page }) => {\n    await todo.addTodo('Texto original');\n    await todo.editFirst('Texto actualizado');\n\n    await expect(page.getByText('Texto actualizado')).toBeVisible();\n    await expect(page.getByText('Texto original')).not.toBeVisible();\n  });\n\n  test('eliminar todas las completadas', async ({ todo, page }) => {\n    await todo.addTodo('Completada');\n    await todo.addTodo('Pendiente');\n    await todo.toggleFirst();\n\n    await todo.clearCompletedBtn.click();\n\n    await expect(page.locator('.todo-list li')).toHaveCount(1);\n    await expect(page.getByText('Pendiente')).toBeVisible();\n  });\n});"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio — Amplía el proyecto",
        "taskHtml": "Agrega un sexto test al suite que:\n          <br>1. Cree 3 tareas con títulos distintos\n          <br>2. Complete las 3 usando el checkbox global (doble flecha en la parte superior izquierda, selector: <code>.toggle-all</code>)\n          <br>3. Verifique que el contador muestra <strong>\"0 items left\"</strong>\n          <br>4. Verifique que el botón \"Clear completed\" es visible",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "test('completar todas las tareas de una vez', async ({ todo, page }) => {\n  await todo.addTodo('Tarea A');\n  await todo.addTodo('Tarea B');\n  await todo.addTodo('Tarea C');\n\n  // Reutilizamos el locator ya definido en el Page Object\n  await todo.toggleAllCheckbox.click();\n\n  await expect(page.getByText('0 items left')).toBeVisible();\n  await expect(todo.clearCompletedBtn).toBeVisible();\n  await expect(page.locator('.todo-list li.completed')).toHaveCount(3);\n});"
        }
      },
      {
        "type": "quiz",
        "id": "s27",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — En este proyecto, cada test recibe <code>{ todo, page }</code> como parámetro en vez de crear <code>new TodoPage(page)</code> dentro de un <code>beforeEach</code>. ¿Qué es <code>todo</code> en ese caso?",
        "options": [
          "Una variable global compartida entre todos los archivos de test.",
          "Un alias de <code>page</code> sin ninguna diferencia real.",
          "Un mock que reemplaza la aplicación real durante el test.",
          "El fixture <code>todo</code> definido en <code>fixtures/todo.fixture.ts</code>: ya viene instanciado y ya navegó a la app antes de que el test empiece."
        ],
        "answerIndex": 3,
        "explanationHtml": "Es la combinación de la sección 25 (Page Object) y la sección 26 (Fixtures): el fixture <code>todo</code> encapsula la creación de <code>TodoPage</code> y su <code>goto()</code> inicial, así que cada test arranca directo en el \"qué\" (agregar, completar, filtrar tareas) sin repetir el \"cómo\"."
      }
    ]
  },
  {
    "id": "s28",
    "num": "28",
    "group": "Práctica",
    "title": "Errores Frecuentes y Cómo Solucionarlos",
    "difficulty": "intermediate",
    "description": "Los errores más comunes al aprender Playwright, con el código problemático y la corrección explicada.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Estos seis errores explican la mayoría de los tests ‘flaky’ o silenciosamente rotos que vas a encontrar en cualquier proyecto real. Reconocerlos te ahorra horas de depuración."
      },
      {
        "type": "compare",
        "title": "❶ Usar selector CSS cuando el elemento cambia clase con el diseño",
        "bad": {
          "label": "❌ Frágil",
          "langClass": "bad",
          "code": "// Si renombran la clase CSS, el test rompe\nawait page.locator('.btn-primary-v2').click();\nawait page.locator('div > form > button:nth-child(3)').click();"
        },
        "good": {
          "label": "✅ Robusto",
          "langClass": "good",
          "code": "// El texto y rol del botón raramente cambian\nawait page.getByRole('button', { name: 'Guardar cambios' }).click();"
        }
      },
      {
        "type": "compare",
        "title": "❷ Race condition: actuar antes de que el popup esté listo",
        "bad": {
          "label": "❌ Race condition",
          "langClass": "bad",
          "code": "// El popup puede abrir ANTES de que\n// ejecutes waitForEvent — lo pierdes\nawait page.click('a[target=\"_blank\"]');\nconst popup = await page.waitForEvent('popup'); // tarde"
        },
        "good": {
          "label": "✅ Correcto",
          "langClass": "good",
          "code": "// Promise.all inicia AMBOS antes de await\nconst [popup] = await Promise.all([\n  page.waitForEvent('popup'),   // escucha primero\n  page.click('a[target=\"_blank\"]'),\n]);"
        }
      },
      {
        "type": "compare",
        "title": "❸ Usar timeouts fijos para esperar carga",
        "bad": {
          "label": "❌ Frágil y lento",
          "langClass": "bad",
          "code": "await page.click('#cargar');\n// 3 s en máquina rápida = desperdicio\n// 3 s en CI lento = fallo esporádico\nawait page.waitForTimeout(3000);\nawait expect(page.locator('.lista')).toBeVisible();"
        },
        "good": {
          "label": "✅ Basado en condición",
          "langClass": "good",
          "code": "await page.click('#cargar');\n// Espera exactamente lo necesario\nawait expect(page.locator('.lista')).toBeVisible();\n// El expect reintenta por ti"
        }
      },
      {
        "type": "compare",
        "title": "❹ No usar await en una assertion",
        "bad": {
          "label": "❌ Test pasa siempre (bug silencioso)",
          "langClass": "bad",
          "code": "// Sin await, la assertion NO se ejecuta\n// El test pasa aunque falle la condición\nexpect(page.locator('h1')).toHaveText('Hola');\n// ⬆️ Esto devuelve una Promise sin resolver"
        },
        "good": {
          "label": "✅ Con await",
          "langClass": "good",
          "code": "// Siempre await en assertions de Playwright\nawait expect(page.locator('h1')).toHaveText('Hola');\n// ⬆️ Espera y verifica correctamente"
        }
      },
      {
        "type": "compare",
        "title": "❺ Registrar el handler de dialog después del clic que lo dispara",
        "bad": {
          "label": "❌ El diálogo se cierra solo",
          "langClass": "bad",
          "code": "await page.click('#eliminar'); // dialog aparece\n// Registrar aquí es demasiado tarde\npage.on('dialog', d => d.accept());"
        },
        "good": {
          "label": "✅ Handler antes del clic",
          "langClass": "good",
          "code": "// Registrar ANTES de la acción\npage.once('dialog', d => d.accept());\nawait page.click('#eliminar');"
        }
      },
      {
        "type": "callout",
        "variant": "err",
        "icon": "🚨",
        "html": "<strong>Peligro silencioso:</strong> Si haces commit con <code>test.only()</code> en el código, solo ese test correrá en el CI y todos los demás quedarán sin ejecutarse. Usa <code>--grep</code> en la línea de comandos en su lugar, o instala el plugin ESLint de Playwright que detecta <code>test.only</code>."
      },
      {
        "type": "compare",
        "title": "❻ Usar test.only y olvidarlo en el código",
        "bad": {
          "label": "❌ No hagas commit con esto",
          "langClass": "bad",
          "code": "test.only('mi test', async ({ page }) => {\n  // Si haces commit, el CI solo ejecuta este test\n});"
        },
        "good": {
          "label": "✅ Filtra desde CLI",
          "langClass": "good",
          "code": "# Correr solo un test por nombre\nnpx playwright test -g \"mi test\"\n\n# O usar --debug para ese test\nnpx playwright test -g \"mi test\" --debug"
        }
      },
      {
        "type": "callout",
        "variant": "tip",
        "icon": "💡",
        "html": "Instala <strong>eslint-plugin-playwright</strong> para detectar automáticamente <code>test.only</code>, <code>waitForTimeout</code> hardcodeados y otros anti-patrones en tu código."
      },
      {
        "type": "quiz",
        "id": "s28",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — De los seis errores de esta sección, ¿cuál puede hacer que un test \"pase\" aunque el comportamiento real esté roto?",
        "options": [
          "Olvidar el <code>await</code> antes de una assertion — la Promise nunca se resuelve ni se verifica, y el test pasa igual.",
          "Usar selectores CSS frágiles.",
          "Usar timeouts fijos en vez de esperar una condición.",
          "Dejar <code>test.only()</code> en el código."
        ],
        "answerIndex": 0,
        "explanationHtml": "Sin <code>await</code>, <code>expect(locator).toHaveText(...)</code> devuelve una Promise que nadie espera — el test termina antes de que la verificación real ocurra, y Playwright lo reporta como exitoso. Es el error más peligroso porque no lanza ningún error visible."
      }
    ]
  },
  {
    "id": "s29",
    "num": "29",
    "group": "Práctica",
    "title": "Preguntas Frecuentes de Entrevista",
    "difficulty": "intermediate",
    "description": "Preguntas típicas en una entrevista técnica sobre Playwright, con la respuesta corta que ya deberías poder dar después de esta guía.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Estas son las preguntas que más se repiten en procesos de selección para puestos de automatización. Poder responderlas con seguridad es, en la práctica, la señal de que ya entendiste la herramienta y no solo copiaste ejemplos."
      },
      {
        "type": "code",
        "block": {
          "label": "Preguntas y respuestas cortas",
          "langClass": "ts",
          "code": "// 1. ¿Por qué Playwright y no Selenium?\n//    Auto-waiting integrado (menos tests \"flaky\"), una sola API\n//    para UI + peticiones de red, y mejor tooling: Trace Viewer,\n//    UI Mode, codegen. Selenium requiere waits manuales y más\n//    configuración para llegar al mismo punto.\n\n// 2. ¿Qué es un BrowserContext?\n//    Un perfil de navegador aislado — como una ventana privada.\n//    Permite simular varios usuarios en paralelo. Ver sección 03.\n\n// 3. ¿Cómo funciona el auto-waiting?\n//    Antes de cada acción, Playwright espera a que el elemento\n//    exista, sea visible, esté habilitado y deje de moverse —\n//    sin que el test tenga que pedirlo explícitamente.\n\n// 4. ¿Cuál es el orden de prioridad de locators?\n//    getByRole > getByLabel / getByPlaceholder > getByTestId > CSS > XPath.\n//    Los semánticos primero porque reflejan cómo interactúa un usuario real.\n\n// 5. ¿Qué es un fixture?\n//    Una forma de inyectar dependencias (como un Page Object ya\n//    listo) directamente en la firma del test. Ver sección 26.\n\n// 6. ¿Cómo corre Playwright los tests en paralelo?\n//    Reparte los archivos de test entre varios \"workers\"\n//    (procesos), configurables con `workers` en playwright.config.ts.\n\n// 7. ¿Qué es un Page Object y por qué se usa?\n//    Una clase que agrupa los locators y acciones de una página.\n//    El test expresa intención de negocio, no pasos técnicos. Ver sección 25.\n\n// 8. ¿Cómo evitas depender de un backend real en tus tests?\n//    Con page.route() interceptas la petición y respondes con\n//    datos mockeados — la UI se prueba igual, sin backend. Ver sección 17."
        }
      },
      {
        "type": "callout",
        "variant": "info",
        "icon": "📌",
        "html": "Estructura de carpetas típica en un proyecto de Playwright: <code>tests/</code> (specs), <code>pages/</code> (Page Objects), <code>fixtures/</code> (fixtures personalizados) y <code>playwright.config.ts</code> en la raíz. Ver sección 22."
      },
      {
        "type": "quiz",
        "id": "s29",
        "isTeo": false,
        "questionHtml": "<strong>Autoevaluación</strong> — Un entrevistador te pregunta por qué preferirías Playwright sobre Selenium en un proyecto nuevo. ¿Cuál es la mejor respuesta corta?",
        "options": [
          "Porque Selenium no soporta TypeScript en absoluto.",
          "Auto-waiting integrado (menos tests flaky), una sola API para UI y peticiones de red, y mejor tooling: Trace Viewer, UI Mode y codegen.",
          "Porque Selenium ya no recibe ningún tipo de mantenimiento.",
          "Porque Playwright es el único que puede correr tests en paralelo."
        ],
        "answerIndex": 1,
        "explanationHtml": "Selenium sí soporta TypeScript y sí puede paralelizar con configuración extra, y sigue activamente mantenido — la ventaja real de Playwright es el auto-waiting nativo, la API unificada (UI + request) y herramientas como el Trace Viewer que reducen mucho el tiempo de depuración."
      }
    ]
  },
  {
    "id": "s30",
    "num": "30",
    "group": "Práctica",
    "title": "Banco de Ejercicios Prácticos",
    "difficulty": "intermediate",
    "description": "Ocho ejercicios de código independientes que cubren temas de toda la guía — muchos de ellos no tienen un ejercicio propio dentro de su sección. Intenta resolver cada uno antes de abrir la solución.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Leer código ajeno no es lo mismo que escribirlo desde cero bajo presión. Practicar sin tener la solución a la vista es lo que realmente fija un concepto en la memoria."
      },
      {
        "type": "exercise",
        "title": "Ejercicio 1 (Acciones) — Formulario de registro",
        "taskHtml": "Dado un formulario con un campo etiquetado <strong>\"Nombre completo\"</strong>, otro <strong>\"Email\"</strong>, un checkbox <strong>\"Acepto los términos\"</strong> y un botón <strong>\"Crear cuenta\"</strong>, escribe el código que lo completa y lo envía.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await page.getByLabel('Nombre completo').fill('Ana Torres');\nawait page.getByLabel('Email').fill('ana@correo.com');\nawait page.getByLabel('Acepto los términos').check();\nawait page.getByRole('button', { name: 'Crear cuenta' }).click();"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 2 (Assertions) — Contador del carrito",
        "taskHtml": "Después de agregar un producto, verifica que el elemento con <code>data-testid=\"carrito-contador\"</code> muestra el texto <strong>\"1\"</strong>, y que el botón <strong>\"Ver carrito\"</strong> está habilitado.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await expect(page.getByTestId('carrito-contador')).toHaveText('1');\nawait expect(page.getByRole('button', { name: 'Ver carrito' })).toBeEnabled();"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 3 (Waits) — Cargar más productos",
        "taskHtml": "Un botón <strong>\"Cargar más\"</strong> agrega productos a una lista después de un delay variable. Escribe el código que espera a que existan <strong>al menos 10</strong> elementos con clase <code>.producto</code> — sin usar <code>waitForTimeout</code>.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await page.getByRole('button', { name: 'Cargar más' }).click();\n\n// toHaveCount espera un número EXACTO — para \"al menos N\" se necesita polling\nawait page.waitForFunction(\n  () => document.querySelectorAll('.producto').length >= 10\n);"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 4 (Frames) — Formulario de pago embebido",
        "taskHtml": "Un <code>&lt;iframe id=\"pago-frame\"&gt;</code> contiene un campo con placeholder <strong>\"Número de tarjeta\"</strong>. Escribe el código que lo completa.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await page.frameLocator('#pago-frame')\n  .getByPlaceholder('Número de tarjeta')\n  .fill('4111111111111111');"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 5 (Dialogs) — Confirmar antes de eliminar",
        "taskHtml": "Al hacer clic en <strong>\"Eliminar cuenta\"</strong> aparece un <code>confirm()</code> nativo del navegador. Escribe el código que lo acepta automáticamente.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "// Registrado ANTES del clic que lo dispara\npage.once('dialog', dialog => dialog.accept());\nawait page.getByRole('button', { name: 'Eliminar cuenta' }).click();"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 6 (API Testing) — Crear y verificar un recurso",
        "taskHtml": "Usando el fixture <code>request</code>, crea un producto vía <code>POST /api/productos</code> con <code>{'{'} nombre: 'Taza', precio: 12 {'}'}</code>, verifica que la respuesta tiene status <strong>201</strong>, y que el cuerpo devuelto incluye un <code>id</code>.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "const res = await request.post('/api/productos', {\n  data: { nombre: 'Taza', precio: 12 },\n});\nawait expect(res).toHaveStatus(201);\n\nconst body = await res.json();\nexpect(body.id).toBeDefined();"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 7 (Interceptar Red) — Simular carrito vacío",
        "taskHtml": "Intercepta <code>GET **/api/carrito</code> para que siempre devuelva una lista vacía, navega a <code>/carrito</code>, y verifica que la página muestra el texto <strong>\"Tu carrito está vacío\"</strong>.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "await page.route('**/api/carrito', route => route.fulfill({\n  status: 200,\n  contentType: 'application/json',\n  body: JSON.stringify([]),\n}));\n\nawait page.goto('/carrito');\nawait expect(page.getByText('Tu carrito está vacío')).toBeVisible();"
        }
      },
      {
        "type": "exercise",
        "title": "Ejercicio 8 (Configuración) — Agregar un proyecto móvil",
        "taskHtml": "Agrega un nuevo <code>project</code> a <code>playwright.config.ts</code> llamado <strong>'Mobile Safari'</strong> que use el dispositivo <code>devices['iPhone 14']</code>.",
        "solution": {
          "label": "Solución",
          "langClass": "ts",
          "code": "import { devices } from '@playwright/test';\n\nprojects: [\n  // ...proyectos existentes (Chrome, Firefox, Mobile)\n  { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },\n],"
        }
      }
    ]
  },
  {
    "id": "s31",
    "num": "31",
    "group": "Práctica",
    "title": "Banco de Ejercicios Teóricos",
    "difficulty": "intermediate",
    "description": "Ocho preguntas de opción múltiple sobre conceptos que no se cubrieron en el quiz de ninguna sección — el mismo formato de autoevaluación, pero agrupado como un repaso independiente.",
    "blocks": [
      {
        "type": "callout",
        "variant": "why",
        "icon": "🎯",
        "html": "<strong>¿Por qué importa?</strong> Estas preguntas no dependen de memorizar sintaxis, sino de entender el \"por qué\" detrás de cada herramienta — exactamente el tipo de pregunta que distingue a quien copió un ejemplo de quien entendió el concepto."
      },
      {
        "type": "callout",
        "variant": "info",
        "icon": "📊",
        "html": "0 / 8 respondidas"
      },
      {
        "type": "quiz",
        "id": "teo1",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 1</strong> — ¿Cuál es la diferencia real entre <code>locator.click()</code> y <code>locator.dispatchEvent('click')</code>?",
        "options": [
          "No hay ninguna diferencia práctica entre los dos métodos.",
          "<code>click()</code> simula la interacción real (espera visibilidad, posición y que el elemento esté habilitado); <code>dispatchEvent</code> dispara el evento directamente sin esas verificaciones.",
          "<code>dispatchEvent()</code> es la forma recomendada por Playwright para todos los casos.",
          "<code>click()</code> solo funciona en botones; <code>dispatchEvent()</code> funciona en cualquier elemento."
        ],
        "answerIndex": 1,
        "explanationHtml": "<code>click()</code> pasa por todo el auto-waiting de Playwright antes de actuar. <code>dispatchEvent()</code> es una puerta trasera de bajo nivel, útil solo cuando un elemento no responde a eventos reales de usuario (poco común)."
      },
      {
        "type": "quiz",
        "id": "teo2",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 2</strong> — ¿Qué hace <code>expect.soft()</code> a diferencia de un <code>expect()</code> normal?",
        "options": [
          "Registra el fallo pero deja que el resto del test siga ejecutándose, en vez de detenerlo de inmediato.",
          "Ejecuta la assertion en segundo plano sin bloquear el test.",
          "Es un alias de <code>expect()</code>, sin ninguna diferencia real.",
          "Reintenta la assertion el doble de veces que un <code>expect()</code> normal."
        ],
        "answerIndex": 0,
        "explanationHtml": "Con assertions \"soft\", el test sigue corriendo aunque una falle — útil cuando quieres ver TODOS los problemas de una página en un solo reporte, en vez de detenerte en el primero."
      },
      {
        "type": "quiz",
        "id": "teo3",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 3</strong> — ¿Para qué sirve <code>test.step()</code>?",
        "options": [
          "Convierte un test en varios tests independientes que corren en paralelo.",
          "Pausa el test hasta que alguien presione una tecla, útil para depurar.",
          "Agrupa pasos dentro del mismo test para que aparezcan etiquetados por separado en el reporte y el trace, sin dividirlo en varios tests.",
          "Solo agrega comentarios visibles en el código; no afecta el reporte."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>test.step('nombre', async () =&gt; {'{'} ... {'}'})</code> no cambia el comportamiento del test, pero hace el reporte y el trace mucho más legibles al dividir un test largo en fases con nombre."
      },
      {
        "type": "quiz",
        "id": "teo4",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 4</strong> — ¿Qué problema resuelve <code>globalSetup</code> en <code>playwright.config.ts</code>?",
        "options": [
          "Corre después de cada test individual, como un <code>afterEach</code> pero a nivel global.",
          "Configura únicamente qué navegador se usará, sin ejecutar código propio.",
          "Es obligatorio en todo proyecto de Playwright, sin excepción.",
          "Corre una sola vez antes de toda la suite — ideal para hacer login y guardar el <code>storageState</code> en vez de repetirlo en cada test."
        ],
        "answerIndex": 3,
        "explanationHtml": "<code>globalSetup</code> es el lugar recomendado para preparar cosas costosas (como autenticarse) una única vez, y que cada test arranque ya con ese estado guardado."
      },
      {
        "type": "quiz",
        "id": "teo5",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 5</strong> — ¿Qué es el \"strict mode\" de los locators en Playwright?",
        "options": [
          "Obliga a usar únicamente selectores CSS, nunca locators semánticos.",
          "Si un locator sin filtrar coincide con más de un elemento, Playwright lanza un error en vez de actuar sobre el primero por defecto.",
          "Bloquea cualquier acción hasta que el locator tenga un timeout explícito definido.",
          "Solo aplica a los métodos <code>fill()</code> y <code>click()</code>, no a los demás."
        ],
        "answerIndex": 1,
        "explanationHtml": "El \"strict mode\" es una protección: si tu locator es ambiguo (matchea 2+ elementos), Playwright prefiere fallar ruidosamente antes que adivinar cuál querías — evita bugs silenciosos."
      },
      {
        "type": "quiz",
        "id": "teo6",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 6</strong> — ¿Qué diferencia hay entre <code>locator.waitFor({'{'} state: 'visible' {'}'})</code> y <code>await expect(locator).toBeVisible()</code>?",
        "options": [
          "<code>waitFor()</code> es una espera genérica que no aparece como assertion en el reporte; <code>toBeVisible()</code> además documenta la expectativa y sí aparece como assertion.",
          "Son completamente intercambiables, sin ninguna diferencia real.",
          "<code>waitFor()</code> lanza un error inmediato si el elemento no existe todavía en el DOM.",
          "<code>toBeVisible()</code> no tiene timeout configurable, pero <code>waitFor()</code> sí."
        ],
        "answerIndex": 0,
        "explanationHtml": "Ambos esperan la misma condición por dentro, pero <code>toBeVisible()</code> es una assertion pensada para ser el punto de verificación del test — se reporta como tal cuando falla."
      },
      {
        "type": "quiz",
        "id": "teo7",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 7</strong> — ¿Qué hace <code>expect(async () =&gt; {'{'} ... {'}'}).toPass()</code>?",
        "options": [
          "Marca un test como aprobado sin ejecutar ninguna assertion real.",
          "Solo puede usarse dentro de hooks como <code>beforeEach</code>, nunca dentro de un test.",
          "Reintenta un bloque completo de código (no solo una assertion) hasta que no lance ningún error, o se agote el timeout.",
          "Es la forma de saltarse (skip) un test de forma condicional."
        ],
        "answerIndex": 2,
        "explanationHtml": "<code>toPass()</code> extiende el reintento automático de Playwright a CUALQUIER lógica, no solo a una assertion — útil cuando necesitas varios pasos dentro del mismo reintento."
      },
      {
        "type": "quiz",
        "id": "teo8",
        "isTeo": true,
        "questionHtml": "<strong>Pregunta 8</strong> — ¿Qué es el \"sharding\" (<code>--shard=1/3</code>) en Playwright?",
        "options": [
          "Una forma de encriptar los reportes de test antes de subirlos al CI.",
          "Reduce automáticamente el número de tests, eliminando los que están duplicados.",
          "Solo puede usarse en local; no está soportado en servidores de CI.",
          "Divide la suite completa de tests entre varias máquinas o procesos para acelerar la ejecución en pipelines grandes de CI."
        ],
        "answerIndex": 3,
        "explanationHtml": "Sharding es distinto de <code>workers</code> (paralelismo dentro de UNA máquina): reparte los archivos de test entre MÁQUINAS distintas, cada una corriendo su propio conjunto de workers."
      }
    ]
  }
];
