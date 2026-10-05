import type { Exercise } from '../../types';

export const exercises: Exercise[] = [
  // ───────────────────────────── PRINCIPIANTE ─────────────────────────────
  {
    id: 'ej-b01',
    num: 'B01',
    title: 'Abrir una página y verificar el título',
    difficulty: 'beginner',
    description:
      'Navega a `https://playwright.dev` y verifica que el título del documento contenga la palabra "Playwright".',
    hint: 'Usa la assertion web-first `expect(page).toHaveTitle(...)` — soporta reintentos automáticos a diferencia de `await page.title()`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar título de playwright.dev', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});`,
  },
  {
    id: 'ej-b02',
    num: 'B02',
    title: 'Verificar texto visible en la página',
    difficulty: 'beginner',
    description:
      'Navega a `https://playwright.dev` y verifica que el encabezado principal contenga el texto "Playwright".',
    hint: 'Usa `page.getByRole("heading", { level: 1 })` y `toBeVisible()`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar encabezado principal', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Playwright');
});`,
  },
  {
    id: 'ej-b03',
    num: 'B03',
    title: 'Hacer clic en un botón',
    difficulty: 'beginner',
    description:
      'Usa la demo de `https://demo.playwright.dev/todomvc`. Escribe una tarea en el campo de texto y presiona Enter para agregarla. Verifica que la tarea aparece en la lista.',
    hint: 'Usa `page.getByPlaceholder(...)` para el campo, `locator.press("Enter")` para confirmar y `getByTestId("todo-title")` para la tarea. En suites reales define `baseURL` en `playwright.config.ts` y usa `page.goto(\'/ruta\')`.',
    solution: `import { test, expect } from '@playwright/test';

test('agregar una tarea en TodoMVC', async ({ page }) => {
  // En una suite real: define baseURL en playwright.config.ts y usa page.goto('/todomvc')
  await page.goto('https://demo.playwright.dev/todomvc');
  const nuevaTarea = page.getByPlaceholder('What needs to be done?');
  await nuevaTarea.fill('Aprender Playwright');
  await nuevaTarea.press('Enter');
  await expect(page.getByTestId('todo-title')).toHaveText('Aprender Playwright');
});`,
  },
  {
    id: 'ej-b04',
    num: 'B04',
    title: 'Llenar formulario de registro y enviarlo',
    difficulty: 'beginner',
    description:
      'Navega a `https://practice.expandtesting.com/register`. Llena los campos Username, Password y Confirm Password con datos válidos. Haz clic en "Register" y verifica que el sitio te redirige al login con el mensaje de éxito.',
    hint: 'Usa `getByLabel("Username")`, `getByLabel("Password", { exact: true })` y `getByLabel("Confirm Password")`. Genera un usuario único por ejecución para que el test sea repetible.',
    solution: `import { test, expect } from '@playwright/test';

test('registro en practice.expandtesting.com', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  // Usuario único por ejecución: el test no depende de datos previos
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
    title: 'Navegar hacia atrás y adelante',
    difficulty: 'beginner',
    description:
      'Visita dos páginas distintas de `https://playwright.dev`, luego usa `goBack()` para regresar y verifica la URL.',
    hint: 'Usa `page.goBack()` y `page.goForward()`. Verifica con `expect(page).toHaveURL(...)`.',
    solution: `import { test, expect } from '@playwright/test';

test('navegación atrás y adelante', async ({ page }) => {
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
    title: 'Tomar una captura de pantalla',
    difficulty: 'beginner',
    description:
      'Navega a cualquier página y toma una captura de pantalla completa. Guárdala como `pagina-completa.png`.',
    hint: 'Pasa `{ fullPage: true }` al método `screenshot()`.',
    solution: `import { test } from '@playwright/test';

test('captura de pantalla completa', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.screenshot({ path: 'pagina-completa.png', fullPage: true });
});`,
  },
  {
    id: 'ej-b07',
    num: 'B07',
    title: 'Esperar a que un elemento sea visible',
    difficulty: 'beginner',
    description:
      'Navega a `https://practice.expandtesting.com/dynamic-loading/1`. Haz clic en "Start" y espera a que el texto final sea visible antes de verificarlo.',
    hint: '`expect(locator).toBeVisible()` ya espera automáticamente (reintenta hasta el timeout). No necesitas `waitForTimeout`.',
    solution: `import { test, expect } from '@playwright/test';

test('esperar elemento asíncrono', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  // La assertion reintenta sola; solo subimos el timeout porque la carga tarda ~5 s
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible({ timeout: 10_000 });
});`,
  },
  {
    id: 'ej-b08',
    num: 'B08',
    title: 'Seleccionar una opción en un dropdown',
    difficulty: 'beginner',
    description:
      'En `https://practice.expandtesting.com/dropdown`, selecciona la opción de valor `50` del desplegable "Elements per Page" y verifica que quedó seleccionada.',
    hint: 'Localiza el `<select>` por su etiqueta con `getByLabel(...)`, usa `locator.selectOption(valor)` y verifica con `expect(locator).toHaveValue(valor)`.',
    solution: `import { test, expect } from '@playwright/test';

test('seleccionar opción en dropdown', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dropdown');
  const perPage = page.getByLabel('Elements per Page');
  await perPage.selectOption('50');
  await expect(perPage).toHaveValue('50');
});`,
  },
  {
    id: 'ej-b09',
    num: 'B09',
    title: 'Marcar y desmarcar checkboxes',
    difficulty: 'beginner',
    description:
      'En `https://practice.expandtesting.com/checkboxes`, verifica que "Checkbox 1" está desmarcado, márcalo y verifica que quedó marcado. Después desmarca "Checkbox 2" (que empieza marcado) y verifica el cambio.',
    hint: 'Usa `locator.check()`, `locator.uncheck()` y las assertions web-first `expect(locator).toBeChecked()` / `expect(locator).not.toBeChecked()`.',
    solution: `import { test, expect } from '@playwright/test';

test('marcar y desmarcar checkboxes', async ({ page }) => {
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
    title: 'Obtener el texto de múltiples elementos',
    difficulty: 'beginner',
    description:
      'En la demo de TodoMVC, agrega 3 tareas distintas. Luego recoge todos los textos de la lista y verifica que las 3 tareas están presentes.',
    hint: 'Usa `getByTestId("todo-title")` y la assertion web-first `toHaveText([...])`, que compara el array completo con reintentos. Evita `allTextContents()` + `expect` simple: no reintenta.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar múltiples tareas', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  const tareas = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
  for (const tarea of tareas) {
    await input.fill(tarea);
    await input.press('Enter');
  }
  await expect(page.getByTestId('todo-title')).toHaveText(tareas);
});`,
  },
  {
    id: 'ej-b11',
    num: 'B11',
    title: 'Verificar la URL actual',
    difficulty: 'beginner',
    description:
      'Haz clic en un enlace de navegación y verifica que la URL cambia al destino esperado usando un matcher de URL.',
    hint: 'Usa `expect(page).toHaveURL(/patron/)` — acepta string, regex o URL completa.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar cambio de URL', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/docs/);
});`,
  },
  {
    id: 'ej-b12',
    num: 'B12',
    title: 'Hover sobre un elemento',
    difficulty: 'beginner',
    description:
      'En `https://practice.expandtesting.com/hovers`, pasa el cursor sobre el primer avatar y verifica que aparece su información oculta ("name: user1").',
    hint: 'Usa `locator.hover()` y luego una assertion web-first: `expect(locator).toBeVisible()`. Localiza con `getByTestId`.',
    solution: `import { test, expect } from '@playwright/test';

test('hover revela contenido', async ({ page }) => {
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
    title: 'Verificar que un elemento NO existe',
    difficulty: 'beginner',
    description:
      'En la demo de TodoMVC sin tareas, verifica que la lista de tareas está vacía (el contador de ítems no es visible).',
    hint: 'Usa `expect(locator).not.toBeVisible()` o `expect(locator).toHaveCount(0)`.',
    solution: `import { test, expect } from '@playwright/test';

test('lista vacía al inicio', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByTestId('todo-count')).toBeHidden();
});`,
  },
  {
    id: 'ej-b14',
    num: 'B14',
    title: 'Contar elementos en una lista',
    difficulty: 'beginner',
    description:
      'Agrega exactamente 5 tareas en TodoMVC y verifica que hay exactamente 5 elementos en la lista.',
    hint: 'Usa `expect(locator).toHaveCount(n)` para verificar el número exacto de elementos.',
    solution: `import { test, expect } from '@playwright/test';

test('contar 5 tareas', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  for (let i = 1; i <= 5; i++) {
    await input.fill(\`Tarea \${i}\`);
    await input.press('Enter');
  }
  await expect(page.getByTestId('todo-item')).toHaveCount(5);
});`,
  },
  {
    id: 'ej-b15',
    num: 'B15',
    title: 'Hacer doble clic para editar',
    difficulty: 'beginner',
    description:
      'En TodoMVC, agrega una tarea. Haz doble clic en ella para activar el modo edición y cambia su texto.',
    hint: 'Usa `locator.dblclick()`. El campo de edición es un `textbox` con nombre accesible "Edit": `getByRole("textbox", { name: "Edit" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('editar tarea con doble clic', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Texto original');
  await input.press('Enter');

  const item = page.getByTestId('todo-item');
  await item.getByTestId('todo-title').dblclick();
  const edit = item.getByRole('textbox', { name: 'Edit' });
  await edit.fill('Texto editado');
  await edit.press('Enter');

  await expect(item.getByTestId('todo-title')).toHaveText('Texto editado');
});`,
  },
  {
    id: 'ej-b16',
    num: 'B16',
    title: 'Verificar un atributo de elemento',
    difficulty: 'beginner',
    description:
      'En la demo de TodoMVC, verifica que el campo de nueva tarea tiene el `placeholder` correcto y que el enlace de filtro "Active" apunta al `href` esperado.',
    hint: 'Usa `expect(locator).toHaveAttribute("nombre", "valor")`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar atributos', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page.getByPlaceholder('What needs to be done?')).toHaveAttribute('placeholder', 'What needs to be done?');
  // El enlace solo aparece cuando hay tareas: agregamos una primero
  await page.getByPlaceholder('What needs to be done?').fill('Tarea');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByRole('link', { name: 'Active' })).toHaveAttribute('href', '#/active');
});`,
  },
  {
    id: 'ej-b17',
    num: 'B17',
    title: 'Presionar teclas del teclado',
    difficulty: 'beginner',
    description:
      'En un campo de texto, escribe contenido usando `fill`, luego selecciona todo con `Ctrl+A` y bórralo con `Delete`. Verifica que el campo queda vacío.',
    hint: 'Usa `locator.press("ControlOrMeta+A")` (Ctrl en Windows/Linux, Cmd en macOS) y luego `"Delete"`. Para vaciar un campo, `locator.clear()` es aún más directo.',
    solution: `import { test, expect } from '@playwright/test';

test('limpiar campo con teclado', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('texto de prueba');
  // ControlOrMeta funciona en todos los sistemas operativos
  await input.press('ControlOrMeta+A');
  await input.press('Delete');
  await expect(input).toHaveValue('');
});`,
  },
  {
    id: 'ej-b18',
    num: 'B18',
    title: 'Verificar clases CSS de un elemento',
    difficulty: 'beginner',
    description:
      'En TodoMVC, completa una tarea haciendo clic en su checkbox. Verifica que el elemento `<li>` obtiene la clase `completed`.',
    hint: 'Usa `expect(locator).toHaveClass(/completed/)` — acepta regex.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar clase completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Tarea para completar');
  await input.press('Enter');

  const item = page.getByTestId('todo-item');
  await item.getByRole('checkbox', { name: 'Toggle Todo' }).check();
  await expect(item).toHaveClass(/completed/);
});`,
  },
  {
    id: 'ej-b19',
    num: 'B19',
    title: 'Verificar el valor de un input',
    difficulty: 'beginner',
    description:
      'Llena un campo de texto y verifica que su valor es exactamente el texto que ingresaste antes de enviarlo.',
    hint: 'Usa `expect(locator).toHaveValue("texto exacto")`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar valor de input', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Mi tarea importante');
  await expect(input).toHaveValue('Mi tarea importante');
});`,
  },
  {
    id: 'ej-b20',
    num: 'B20',
    title: 'Filtrar tareas completadas',
    difficulty: 'beginner',
    description:
      'En TodoMVC, agrega 3 tareas, completa 2. Haz clic en el filtro "Completed" y verifica que solo aparecen las 2 completadas.',
    hint: 'Los filtros son enlaces: `getByRole("link", { name: "Completed" })`. Luego cuenta los `.todo-list li`.',
    solution: `import { test, expect } from '@playwright/test';

test('filtrar tareas completadas', async ({ page }) => {
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
    title: 'Scroll hasta un elemento',
    difficulty: 'beginner',
    description:
      'Navega a una página larga. Haz scroll hasta un elemento que esté fuera del viewport y verifica que es visible.',
    hint: 'Usa `locator.scrollIntoViewIfNeeded()` y luego `expect(locator).toBeInViewport()`.',
    solution: `import { test, expect } from '@playwright/test';

test('scroll hasta elemento', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const footer = page.getByRole('contentinfo');
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();
});`,
  },
  {
    id: 'ej-b22',
    num: 'B22',
    title: 'Captura de pantalla de un elemento',
    difficulty: 'beginner',
    description:
      'Toma una captura de pantalla solo del encabezado de la página (no de toda la página) y guárdala como `header.png`.',
    hint: 'Usa `locator.screenshot({ path: "..." })` sobre el locator del elemento, p. ej. `getByRole("navigation", { name: "Main" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('captura de un elemento', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const header = page.getByRole('navigation', { name: 'Main' });
  await expect(header).toBeVisible();
  await header.screenshot({ path: 'header.png' });
});`,
  },

  // ─────────────────────────── INTERMEDIO ────────────────────────────────
  {
    id: 'ej-i01',
    num: 'I01',
    title: 'Manejar múltiples tabs',
    difficulty: 'intermediate',
    description:
      'Haz clic en un enlace que abre una nueva pestaña. Captura la nueva página con `context.waitForEvent("page")` y verifica su URL.',
    hint: 'Escucha el evento `"page"` en el contexto ANTES de hacer clic en el enlace.',
    solution: `import { test, expect } from '@playwright/test';

test('manejar nueva pestaña', async ({ page, context }) => {
  await page.goto('https://practice.expandtesting.com/windows');
  // Registrar la espera ANTES del clic que abre la pestaña
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
    title: 'Interceptar peticiones HTTP',
    difficulty: 'intermediate',
    description:
      'Escucha las peticiones de red de tu app y registra sus URLs. Verifica que se realizó una petición `GET` al endpoint `/api/todos` al cargar la página.',
    hint: 'Crea la promesa con `page.waitForRequest(...)` ANTES de la acción que dispara la llamada y `await` después. Evita `waitForLoadState("networkidle")`: es frágil con polling o websockets.',
    solution: `import { test, expect } from '@playwright/test';

test('interceptar peticiones', async ({ page }) => {
  const urls: string[] = [];
  page.on('request', req => urls.push(req.url()));

  // Registrar la espera ANTES de navegar, para no perder la petición
  const todosRequest = page.waitForRequest('**/api/todos');
  await page.goto('https://mi-app.ejemplo.com/todos');
  const request = await todosRequest;

  expect(request.method()).toBe('GET');
  expect(urls.some(url => url.includes('/api/todos'))).toBe(true);
});`,
  },
  {
    id: 'ej-i03',
    num: 'I03',
    title: 'Mockear una respuesta HTTP',
    difficulty: 'intermediate',
    description:
      'Intercepta la llamada a un endpoint de API y devuelve datos simulados. Verifica que la página muestra los datos del mock.',
    hint: 'Usa `page.route(url, handler)` y en el handler llama `route.fulfill({ json: {...} })`.',
    solution: `import { test, expect } from '@playwright/test';

test('mockear respuesta de API', async ({ page }) => {
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
    title: 'Manejar diálogos del navegador',
    difficulty: 'intermediate',
    description:
      'En `https://practice.expandtesting.com/js-dialogs` hay un botón que muestra un `alert`. Configura un manejador que acepte el diálogo, verifica el mensaje y comprueba la respuesta que muestra la página.',
    hint: 'Registra el manejador con `page.once("dialog", ...)` ANTES del clic: el clic no termina hasta que el diálogo se resuelve, así que no puedes esperarlo después con `waitForEvent`. Dentro del manejador lee `dialog.message()` y llama `dialog.accept()`.',
    solution: `import { test, expect } from '@playwright/test';

test('aceptar alert del navegador', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/js-dialogs');

  // Registrar el manejador ANTES de la acción que abre el diálogo
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
    title: 'Subir un archivo',
    difficulty: 'intermediate',
    description:
      'En `https://practice.expandtesting.com/upload`, sube un archivo de prueba (sin depender de ningún archivo en disco) y verifica que la página confirma la subida con el nombre del archivo.',
    hint: 'Usa `locator.setInputFiles(...)`. Puedes pasar un objeto `{ name, mimeType, buffer }` y evitar depender de un archivo en disco.',
    solution: `import { test, expect } from '@playwright/test';

test('subir archivo', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/upload');
  await page.getByTestId('file-input').setInputFiles({
    name: 'fixture.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('contenido de prueba'),
  });
  await page.getByTestId('file-submit').click();

  await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
  // El servidor antepone un prefijo al nombre: usamos una regex
  await expect(page.getByText(/fixture\\.txt/)).toBeVisible();
});`,
  },
  {
    id: 'ej-i06',
    num: 'I06',
    title: 'Arrastrar y soltar (drag & drop)',
    difficulty: 'intermediate',
    description:
      'En una página con dos cajas arrastrables (A y B), arrastra A sobre B y verifica que intercambiaron su contenido. (La página se construye con `page.setContent` para que el test no dependa de un sitio externo.)',
    hint: 'Usa `locator.dragTo(target)` para un drag & drop simple entre dos locators.',
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
    title: 'Trabajar con iframes',
    difficulty: 'intermediate',
    description:
      'Dada una página con un `<iframe>` que contiene un formulario, accede a su contenido con un frame locator, rellena un campo dentro del iframe y verifica el resultado. (Se construye la página con `page.setContent`, así el test no depende de ningún sitio externo.)',
    hint: 'Usa `page.frameLocator("iframe")` (o mejor `page.frameLocator("#id")`) y opera sobre él con los mismos locators (`getByLabel`, `getByRole`...). Los frame locators reintentan solos.',
    solution: `import { test, expect } from '@playwright/test';

test('interactuar con iframe', async ({ page }) => {
  await page.setContent(\`
    <h1>Página anfitriona</h1>
    <iframe id="pago-frame" srcdoc="
      <label>Nombre <input id='n'></label>
      <button onclick='document.getElementById(&quot;out&quot;).textContent = document.getElementById(&quot;n&quot;).value'>Enviar</button>
      <p id='out'></p>"></iframe>
  \`);

  const frame = page.frameLocator('#pago-frame');
  await frame.getByLabel('Nombre').fill('Ana García');
  await frame.getByRole('button', { name: 'Enviar' }).click();

  await expect(frame.locator('#out')).toHaveText('Ana García');
  await expect(page.getByRole('heading')).toHaveText('Página anfitriona');
});`,
  },
  {
    id: 'ej-i08',
    num: 'I08',
    title: 'Implementar Page Object Model básico',
    difficulty: 'intermediate',
    description:
      'Crea una clase `TodoPage` que encapsule la demo TodoMVC: locators como propiedades y acciones `addTask(text)` y `completeTask(text)`. Escribe un test que use la clase y verifique con assertions web-first (las assertions viven en el test, no en el POM).',
    hint: 'La clase recibe `page` en el constructor y define los locators UNA vez como `readonly`. Los métodos hacen acciones; el test hace las assertions con `expect(todo.items)...`.',
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

test('POM básico', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.goto();
  await todo.addTask('Primera');
  await todo.addTask('Segunda');
  await todo.completeTask('Primera');

  await expect(todo.items).toHaveCount(2);
  await expect(todo.items.first()).toHaveClass(/completed/);
});`,
  },
  {
    id: 'ej-i09',
    num: 'I09',
    title: 'Esperas condicionales con waitFor',
    difficulty: 'intermediate',
    description:
      'En `https://practice.expandtesting.com/dynamic-loading/2`, tras pulsar "Start" primero aparece un loader, luego desaparece y aparece el contenido. Espera cada transición explícitamente.',
    hint: 'Usa assertions web-first sobre el loader: `expect(loader).toBeVisible()` y luego `expect(loader).toBeHidden()`. (`locator.waitFor({ state })` también sirve cuando no necesitas assertion.)',
    solution: `import { test, expect } from '@playwright/test';

test('esperar transición loader → contenido', async ({ page }) => {
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
    title: 'Simular dispositivo móvil',
    difficulty: 'intermediate',
    description:
      'Ejecuta un test simulando un iPhone 12. Verifica que la página muestra el botón del menú hamburguesa (barra de navegación colapsada).',
    hint: 'Usa `test.use({ ...devices["iPhone 12"] })` a nivel de archivo o `describe`: Playwright crea el contexto por ti y lo cierra solo. En un proyecto real, defínelo como `project` en la config.',
    solution: `import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test('vista móvil iPhone 12', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('button', { name: 'Toggle navigation bar' })).toBeVisible();
});`,
  },
  {
    id: 'ej-i11',
    num: 'I11',
    title: 'Manejar autenticación HTTP Basic',
    difficulty: 'intermediate',
    description:
      'Accede a `https://practice.expandtesting.com/basic-auth`, protegida con HTTP Basic Auth (usuario y contraseña publicados en el propio sitio: `admin` / `admin`). Verifica el mensaje de bienvenida.',
    hint: 'Usa `test.use({ httpCredentials: { username, password } })`. En proyectos reales, lee las credenciales de variables de entorno, nunca del código.',
    solution: `import { test, expect } from '@playwright/test';

// Credenciales públicas de práctica. En un proyecto real: process.env.BASIC_USER / BASIC_PASS
test.use({
  httpCredentials: {
    username: process.env.BASIC_USER ?? 'admin',
    password: process.env.BASIC_PASS ?? 'admin',
  },
});

test('autenticación HTTP Basic', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/basic-auth');
  await expect(page.getByText('Congratulations! You must have the proper credentials.')).toBeVisible();
});`,
  },
  {
    id: 'ej-i12',
    num: 'I12',
    title: 'Parametrizar tests con un bucle',
    difficulty: 'intermediate',
    description:
      'Genera un test por cada una de 5 URLs distintas: cada uno verifica que la página responde con status 200 y muestra un `<h1>`. (Playwright no tiene `test.each`: se parametriza con un bucle que declara los tests.)',
    hint: 'Recorre un array con `for (const url of urls) { test(`...${url}`, ...) }`. El título de cada test debe ser único e incluir el parámetro.',
    solution: `import { test, expect } from '@playwright/test';

const urls = [
  'https://playwright.dev',
  'https://playwright.dev/docs/intro',
  'https://playwright.dev/docs/api/class-page',
  'https://playwright.dev/docs/locators',
  'https://playwright.dev/docs/test-assertions',
];

for (const url of urls) {
  test(\`página \${url} responde 200 y tiene encabezado\`, async ({ page }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}`,
  },
  {
    id: 'ej-i13',
    num: 'I13',
    title: 'Usar beforeEach y afterEach',
    difficulty: 'intermediate',
    description:
      'Crea una suite de tests para TodoMVC donde `beforeEach` navega y agrega una tarea base, y `afterEach` verifica que no quedaron errores en consola.',
    hint: '`test.beforeEach` y `test.afterEach` reciben el mismo objeto `{ page }` que los tests. Registra `page.on("console", ...)` en `beforeEach` y comprueba el array en `afterEach`.',
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
    await input.fill('Tarea base');
    await input.press('Enter');
  });

  test.afterEach(() => {
    expect(consoleErrors, 'No debe haber errores en consola').toEqual([]);
  });

  test('la tarea base está visible', async ({ page }) => {
    await expect(page.getByTestId('todo-title')).toHaveText('Tarea base');
  });

  test('se puede completar la tarea base', async ({ page }) => {
    const item = page.getByTestId('todo-item');
    await item.getByRole('checkbox', { name: 'Toggle Todo' }).check();
    await expect(item).toHaveClass(/completed/);
  });
});`,
  },
  {
    id: 'ej-i14',
    num: 'I14',
    title: 'Leer y escribir localStorage',
    difficulty: 'intermediate',
    description:
      'Antes de cargar la página, pre-popula el `localStorage` con datos de sesión. Verifica que la página los lee y muestra el usuario como si estuviera autenticado.',
    hint: 'Usa `page.addInitScript(() => { localStorage.setItem(key, value) })` antes de `page.goto()`.',
    solution: `import { test, expect } from '@playwright/test';

test('pre-poblar localStorage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', token: 'abc123' }));
  });

  await page.goto('https://mi-app.ejemplo.com');
  // La app lee el token y muestra al usuario:
  await expect(page.getByText('Test User')).toBeVisible();
});`,
  },
  {
    id: 'ej-i15',
    num: 'I15',
    title: 'Verificar respuesta de API con waitForResponse',
    difficulty: 'intermediate',
    description:
      'En la app de notas de `practice.expandtesting.com`, crea un usuario único por API, haz login por la interfaz y espera la respuesta del endpoint de login. Verifica que el status es 200 y que el body JSON contiene las propiedades esperadas.',
    hint: 'Prepara los datos con `request` (API) en lugar de la UI. Crea `page.waitForResponse(...)` ANTES del clic que dispara la llamada y `await` después. Verifica con `response.status()` y `await response.json()`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar respuesta de la API de login', async ({ page, request }) => {
  // Datos de prueba únicos creados por API: el test es independiente y repetible
  const email = \`qa-\${Date.now()}@example.com\`;
  const password = 'Test1234!';
  const created = await request.post('https://practice.expandtesting.com/notes/api/users/register', {
    data: { name: 'QA User', email, password },
  });
  expect(created.status()).toBe(201);

  await page.goto('https://practice.expandtesting.com/notes/app/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);

  // La espera se crea ANTES de la acción que dispara la llamada
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
    title: 'Locators encadenados y filtros',
    difficulty: 'intermediate',
    description:
      'En una tabla HTML, encuentra la fila que contiene el nombre "Ana García" y haz clic en el botón "Editar" de esa fila específica.',
    hint: 'Usa `page.getByRole("row").filter({ hasText: "Ana García" }).getByRole("button", { name: "Editar" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('locator encadenado en tabla', async ({ page }) => {
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
    title: 'Usar fixtures personalizados',
    difficulty: 'intermediate',
    description:
      'Crea un fixture `authenticatedPage` que navegue y haga login automáticamente. Úsalo en múltiples tests para no repetir el flujo de autenticación.',
    hint: 'Extiende `test` con `base.extend({ myFixture: async ({ page }, use) => { ... await use(page); } })`. Lee las credenciales de variables de entorno.',
    solution: `import { test as base, expect, type Page } from '@playwright/test';

// Credenciales públicas de práctica; en un proyecto real vienen de process.env
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

test('ver el área segura autenticado', async ({ loggedPage }) => {
  await expect(loggedPage.getByRole('heading', { level: 1 })).toContainText('Secure Area');
});

test('cerrar sesión desde el área segura', async ({ loggedPage }) => {
  await loggedPage.getByRole('link', { name: 'Logout' }).click();
  await expect(loggedPage).toHaveURL(/\\/login/);
});`,
  },
  {
    id: 'ej-i18',
    num: 'I18',
    title: 'Manejar cookies de sesión',
    difficulty: 'intermediate',
    description:
      'Guarda las cookies después de un login exitoso. En un segundo contexto, carga esas cookies y verifica que el usuario sigue autenticado sin repetir el login.',
    hint: 'Usa `context.storageState()` para guardar y `browser.newContext({ storageState })` para restaurar (incluye cookies y localStorage). Evita pasar cookies a mano si no es necesario.',
    solution: `import { test, expect } from '@playwright/test';

test('persistir sesión sin repetir login', async ({ browser }) => {
  // Contexto 1: login → guardar el estado de sesión
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.goto('https://practice.expandtesting.com/login');
  await page1.getByLabel('Username').fill('practice');
  await page1.getByLabel('Password', { exact: true }).fill('SuperSecretPassword!');
  await page1.getByRole('button', { name: 'Login' }).click();
  await expect(page1).toHaveURL(/\\/secure/);
  const storageState = await ctx1.storageState();
  await ctx1.close();

  // Contexto 2: restaurar → acceso directo sin login
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
    title: 'Soft assertions — no abortar en el primer fallo',
    difficulty: 'intermediate',
    description:
      'Usa soft assertions para verificar múltiples propiedades de un formulario. Al final del test, todos los fallos se reportan juntos en lugar de abortar al primero.',
    hint: 'Usa `expect.soft(locator).matcher()`. El test continúa aunque fallen. Al final, Playwright reporta todos.',
    solution: `import { test, expect } from '@playwright/test';

test('soft assertions en formulario de registro', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/register');

  await expect.soft(page.getByLabel('Username')).toBeVisible();
  await expect.soft(page.getByLabel('Username')).toBeEnabled();
  await expect.soft(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
  await expect.soft(page.getByLabel('Confirm Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByRole('button', { name: 'Register' })).toBeVisible();

  // El test falla al final si alguna soft assertion falló, listando todos los fallos
});`,
  },
  {
    id: 'ej-i20',
    num: 'I20',
    title: 'Ejecutar JavaScript en la página',
    difficulty: 'intermediate',
    description:
      'Usa `page.evaluate()` para ejecutar código JavaScript directamente en el contexto de la página y obtener información que no está en el DOM (p. ej., una variable global o el resultado de un cálculo).',
    hint: '`page.evaluate(fn)` ejecuta `fn` en el browser y devuelve el resultado serializado. Úsalo solo cuando no exista un locator o assertion para lo que necesitas.',
    solution: `import { test, expect } from '@playwright/test';

test('ejecutar JS en el browser', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
  expect(devicePixelRatio).toBeGreaterThan(0);

  // Se puede pasar un argumento serializable al navegador
  const suma = await page.evaluate(([a, b]) => a + b, [2, 3]);
  expect(suma).toBe(5);
});`,
  },
  {
    id: 'ej-i21',
    num: 'I21',
    title: 'Tomar capturas de pantalla comparativas',
    difficulty: 'intermediate',
    description:
      'Usa el matcher `toHaveScreenshot()` para hacer una comparación visual de un componente. La primera vez crea el snapshot base; las siguientes detectan diferencias.',
    hint: 'Primera ejecución: `npx playwright test --update-snapshots` crea el baseline. Después, corre normal. Genera siempre los baselines en el mismo OS/browser que CI (p. ej. Docker): el render cambia entre plataformas.',
    solution: `import { test, expect } from '@playwright/test';

test('visual regression del header', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveScreenshot('header-baseline.png', {
    maxDiffPixels: 10,
  });
});`,
  },
  {
    id: 'ej-i22',
    num: 'I22',
    title: 'Abortar y redirigir peticiones',
    difficulty: 'intermediate',
    description:
      'Bloquea todas las peticiones de imágenes para acelerar la carga de la página. Verifica que la página carga igual de bien sin imágenes.',
    hint: 'Usa `page.route("**/*", ...)` y decide por `route.request().resourceType()`: es más robusto que listar extensiones. Comprueba el bloqueo con el evento `requestfailed`.',
    solution: `import { test, expect } from '@playwright/test';

test('bloquear imágenes para acelerar carga', async ({ page }) => {
  const blocked: string[] = [];
  page.on('requestfailed', req => {
    if (req.resourceType() === 'image') blocked.push(req.url());
  });

  await page.route('**/*', route =>
    route.request().resourceType() === 'image' ? route.abort() : route.continue()
  );

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // La página funciona sin imágenes y realmente se bloquearon
  await expect.poll(() => blocked.length).toBeGreaterThan(0);
});`,
  },

  // ─────────────────────────── AVANZADO ──────────────────────────────────
  {
    id: 'ej-a01',
    num: 'A01',
    title: 'Autenticación persistente con storageState',
    difficulty: 'advanced',
    description:
      'Crea un proyecto `setup` que hace login una sola vez y guarda el estado de autenticación en disco. Los demás proyectos dependen de él y reutilizan ese estado sin repetir el login.',
    hint: 'Recomendado por Playwright en lugar de `globalSetup`: un proyecto `setup` con `dependencies`. Guarda con `page.context().storageState({ path })`, usa `storageState` en el proyecto principal y añade el archivo a `.gitignore`.',
    solution: `// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json'; // añadir a .gitignore

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
  forbidOnly: !!process.env.CI,           // falla si queda un test.only en CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://practice.expandtesting.com',
    trace: 'on-first-retry',               // trace viewer: lo recomendado para depurar en CI
  },
  projects: [
    { name: 'setup', testMatch: /auth\\.setup\\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    // Añade firefox y webkit igual que chromium para probar en todos los navegadores
  ],
});`,
  },
  {
    id: 'ej-a02',
    num: 'A02',
    title: 'Page Object Model completo con herencia',
    difficulty: 'advanced',
    description:
      'Implementa un POM completo con: `BasePage` (métodos comunes), `LoginPage extends BasePage`, `DashboardPage extends BasePage`. Escribe tests E2E que usen las tres clases.',
    hint: 'La `BasePage` guarda `this.page` y define helpers comunes. Las páginas hijas definen sus locators como propiedades `readonly` y solo exponen acciones; las assertions van en el test.',
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

test('login y logout E2E con POM', async ({ page }) => {
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
    title: 'Sharding de tests para CI paralelo',
    difficulty: 'advanced',
    description:
      'Configura tu proyecto para ejecutar tests en 4 shards paralelos en CI. Escribe el pipeline de GitHub Actions que combina los reportes de todos los shards.',
    hint: 'Usa `--shard=1/4`... en una matrix de GitHub Actions. Configura el reporter `blob` en CI para poder combinarlos después con `merge-reports`, y sube el reporte también cuando fallen los tests (`if: ${{ !cancelled() }}`).',
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
    title: 'Mock completo de API con HAR recording',
    difficulty: 'advanced',
    description:
      'Graba las peticiones de red de tu app en un archivo HAR. Luego reproduce ese HAR en tests offline, sin necesidad del servidor real.',
    hint: 'Graba con `page.routeFromHAR(path, { update: true })` y reproduce con `page.routeFromHAR(path, { url, update: false })`. Controla el modo con una variable de entorno, no editando el código.',
    solution: `import { test, expect } from '@playwright/test';

// Grabar: UPDATE_HAR=1 npx playwright test  ·  Reproducir: npx playwright test
const update = !!process.env.UPDATE_HAR;

test('reproducir HAR grabado', async ({ page }) => {
  await page.routeFromHAR('./fixtures/api-responses.har', {
    url: '**/api/**',
    update,
  });

  await page.goto('https://mi-app.ejemplo.com');
  // La app usa las respuestas del HAR en lugar del servidor real
  await expect(page.getByText('Datos desde HAR')).toBeVisible();
});`,
  },
  {
    id: 'ej-a05',
    num: 'A05',
    title: 'Tests de accesibilidad con axe-playwright',
    difficulty: 'advanced',
    description:
      'Integra `axe-playwright` para hacer un audit de accesibilidad WCAG 2.1 AA en cada página principal de tu app. Falla el test si hay violaciones de severidad "critical" o "serious".',
    hint: 'Instala `axe-playwright`, importa `injectAxe` y `checkA11y`. Filtra por severidad con `includedImpacts: ["critical", "serious"]` y por reglas con `axeOptions.runOnly`.',
    solution: `import { test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const PAGES = ['/', '/login', '/dashboard', '/profile'];

for (const path of PAGES) {
  test(\`accesibilidad WCAG 2.1 AA — \${path}\`, async ({ page }) => {
    await page.goto(\`https://mi-app.ejemplo.com\${path}\`);
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
    title: 'Simular condiciones de red lentas',
    difficulty: 'advanced',
    description:
      'Simula una conexión 3G lenta (750 kbps, latencia 100ms). Verifica que la página muestra un skeleton/loader durante la carga y que la app sigue siendo usable.',
    hint: 'Playwright no tiene `page.emulateNetworkConditions`: usa una sesión CDP (`context.newCDPSession(page)`) con `Network.emulateNetworkConditions`. Solo funciona en Chromium, así que salta el test en otros browsers.',
    solution: `import { test, expect } from '@playwright/test';

test('UI con red 3G lenta', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP solo está disponible en Chromium');

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8, // 750 kbps
    uploadThroughput: (250 * 1024) / 8,   // 250 kbps
    latency: 100,
  });

  // 'commit' devuelve en cuanto llega la respuesta: así vemos el estado de carga
  await page.goto('https://mi-app.ejemplo.com', { waitUntil: 'commit' });

  await expect(page.getByTestId('skeleton').first()).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('skeleton')).toHaveCount(0);
});`,
  },
  {
    id: 'ej-a07',
    num: 'A07',
    title: 'Tests con múltiples usuarios simultáneos',
    difficulty: 'advanced',
    description:
      'Simula una colaboración en tiempo real: Usuario A y Usuario B abren la misma página. A escribe algo y B verifica que lo ve en tiempo real (WebSocket/polling).',
    hint: 'Usa `browser.newContext()` para crear dos contextos independientes, cada uno con su propio usuario autenticado.',
    solution: `import { test, expect } from '@playwright/test';

test('colaboración en tiempo real', async ({ browser }) => {
  // Crear dos sesiones independientes
  const ctxA = await browser.newContext({ storageState: 'auth-userA.json' });
  const ctxB = await browser.newContext({ storageState: 'auth-userB.json' });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  await pageA.goto('https://mi-app.ejemplo.com/doc/123');
  await pageB.goto('https://mi-app.ejemplo.com/doc/123');

  // Usuario A escribe
  await pageA.getByRole('textbox').fill('Hola desde A');

  // Usuario B ve la actualización
  await expect(pageB.getByText('Hola desde A')).toBeVisible({ timeout: 5_000 });

  await ctxA.close();
  await ctxB.close();
});`,
  },
  {
    id: 'ej-a08',
    num: 'A08',
    title: 'Interceptar y modificar respuestas GraphQL',
    difficulty: 'advanced',
    description:
      'Intercepta una mutación GraphQL específica. Modifica la respuesta para simular un error del servidor y verifica que la UI muestra el mensaje de error correcto.',
    hint: 'Usa `page.route("**/graphql", ...)` y en el handler inspecciona `request.postDataJSON()` para identificar la operación.',
    solution: `import { test, expect } from '@playwright/test';

test('simular error en mutación GraphQL', async ({ page }) => {
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
    title: 'Reintentos (retries) y detección de flakiness',
    difficulty: 'advanced',
    description:
      'Configura `retries: 2` en el proyecto y escribe un test que falla en los dos primeros intentos y pasa en el tercero (simulando flakiness). Verifica que el mecanismo funciona y recuerda: un retry que "salva" un test es una señal para investigar, no una solución.',
    hint: 'Lee `testInfo.retry` (0 en el primer intento) en lugar de un contador global: es estado de Playwright, no de tu módulo. El reporte marca estos tests como "flaky".',
    solution: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: { trace: 'on-first-retry' }, // la traza solo se graba al reintentar
});

// flaky.spec.ts
import { test, expect } from '@playwright/test';

test('falla 2 veces, pasa a la 3a', async ({ page }, testInfo) => {
  // Simulación de fallo intermitente (en tests reales sería una condición de carrera)
  expect(testInfo.retry, 'fallo simulado').toBeGreaterThanOrEqual(2);

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});`,
  },
  {
    id: 'ej-a10',
    num: 'A10',
    title: 'WebSocket: verificar mensajes en tiempo real',
    difficulty: 'advanced',
    description:
      'Monitorea un WebSocket con los eventos de Playwright (sin CDP) y verifica que la app recibe el mensaje esperado del servidor.',
    hint: 'Usa `page.waitForEvent("websocket")` y luego `ws.waitForEvent("framereceived", predicate)`. Crea las esperas ANTES de navegar.',
    solution: `import { test, expect } from '@playwright/test';

test('monitorear mensajes WebSocket', async ({ page }) => {
  // Esperar el WebSocket ANTES de navegar
  const wsPromise = page.waitForEvent('websocket');
  await page.goto('https://mi-app-ws.ejemplo.com');
  const ws = await wsPromise;

  const frame = await ws.waitForEvent('framereceived', {
    predicate: f => String(f.payload).includes('connected'),
    timeout: 10_000,
  });
  expect(JSON.parse(String(frame.payload))).toMatchObject({ status: 'connected' });

  // La UI también refleja el estado
  await expect(page.getByTestId('connection-status')).toHaveText('connected');
});`,
  },
  {
    id: 'ej-a11',
    num: 'A11',
    title: 'Reporte HTML personalizado con metadata',
    difficulty: 'advanced',
    description:
      'Crea un reporter personalizado que extienda `Reporter` de Playwright. Genera un JSON con métricas de cada test: duración, intentos, status, y un screenshot del fallo si existe.',
    hint: 'Implementa la clase con `onTestEnd(test, result)`. Guarda un `result.attachments` para screenshots en fallo.',
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
    console.log(\`Reporte guardado: test-metrics.json (\${this.results.length} tests)\`);
  }
}

export default MetricsReporter;
// playwright.config.ts: reporter: [['list'], ['./metrics-reporter.ts']]
// Y usa \`screenshot: "only-on-failure"\` para que existan capturas de fallo`,
  },
  {
    id: 'ej-a12',
    num: 'A12',
    title: 'Locators avanzados con filter y nth',
    difficulty: 'advanced',
    description:
      'Dada una lista de tarjetas de productos con precio y botón "Agregar", usa locators encadenados para encontrar la tarjeta más barata (primer ítem del sort) y hacer clic en su botón.',
    hint: 'Espera la respuesta del orden con `waitForResponse` (creada ANTES de `selectOption`) y localiza las tarjetas con `getByTestId`. Evita `waitForLoadState("networkidle")`.',
    solution: `import { test, expect } from '@playwright/test';

test('agregar el producto más barato', async ({ page }) => {
  await page.goto('https://mi-tienda.ejemplo.com/productos');

  // Ordenar y esperar la respuesta de la API que devuelve el nuevo orden
  const sorted = page.waitForResponse(res => res.url().includes('/api/productos') && res.url().includes('sort=price-asc') && res.ok());
  await page.getByRole('combobox', { name: /ordenar/i }).selectOption('price-asc');
  await sorted;

  // El primero de la lista ordenada es el más barato
  const cheapest = page.getByTestId('product-card').first();
  const price = await cheapest.getByTestId('price').innerText();
  await cheapest.getByRole('button', { name: /agregar/i }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await expect(page.getByTestId('cart-summary')).toContainText(price);
});`,
  },
  {
    id: 'ej-a13',
    num: 'A13',
    title: 'Performance: medir métricas Web Vitals',
    difficulty: 'advanced',
    description:
      'Mide el LCP (Largest Contentful Paint) y el CLS (Cumulative Layout Shift) de tu home page. Falla el test si LCP > 2500ms o CLS > 0.1.',
    hint: 'Instala los `PerformanceObserver` con `page.addInitScript` ANTES de navegar y lee los valores con `expect.poll`: sin `setTimeout` ni `networkidle`. Los umbrales dependen del entorno; úsalos como presupuesto, no como medida exacta.',
    solution: `import { test, expect } from '@playwright/test';

test('Web Vitals: LCP y CLS', async ({ page }) => {
  // Los observers se registran antes de que cargue la página
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

  await page.goto('https://mi-app.ejemplo.com');

  // Esperar a que exista un LCP, sin sleeps fijos
  await expect.poll(() => page.evaluate(() => (window as any).__vitals.lcp)).toBeGreaterThan(0);

  const vitals = await page.evaluate(() => (window as any).__vitals as { lcp: number; cls: number });
  expect(vitals.lcp, 'LCP').toBeLessThan(2500);
  expect(vitals.cls, 'CLS').toBeLessThan(0.1);
});`,
  },
  {
    id: 'ej-a14',
    num: 'A14',
    title: 'Crear un helper de test reutilizable',
    difficulty: 'advanced',
    description:
      'Crea un helper `createUser(page, overrides?)` que rellena y envía el formulario de registro con datos aleatorios. Acepta overrides opcionales para personalizar campos. Retorna los datos del usuario creado.',
    hint: 'Usa una librería como `@faker-js/faker` para datos aleatorios. El helper retorna el objeto con los datos usados.',
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

// Uso en test:
// const user = await createUser(page, { name: 'Admin Especial' });
// expect(user.email).toContain('@test.ejemplo.com');`,
  },
  {
    id: 'ej-a15',
    num: 'A15',
    title: 'Test de PWA: offline y service worker',
    difficulty: 'advanced',
    description:
      'Verifica que tu PWA funciona offline. Carga la app, espera al service worker, pasa el contexto a modo offline, recarga y verifica que el service worker sirve el contenido cacheado.',
    hint: 'Usa `context.setOffline(true)` (API nativa, sin CDP) después de la primera carga y `await navigator.serviceWorker.ready` para esperar al SW.',
    solution: `import { test, expect } from '@playwright/test';

test('PWA funciona offline', async ({ page, context }) => {
  // 1. Cargar la app y esperar a que el service worker esté activo
  await page.goto('https://mi-pwa.ejemplo.com');
  await page.evaluate(() => navigator.serviceWorker.ready);

  // 2. Pasar a offline y recargar: debe servir la caché
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByText('Sin conexión')).toBeHidden();

  // 3. Volver online
  await context.setOffline(false);
});`,
  },
  {
    id: 'ej-a16',
    num: 'A16',
    title: 'Playwright component testing (experimental)',
    difficulty: 'advanced',
    description:
      'Usa Playwright Component Testing para montar un componente React aislado. Verifica sus props, estado y eventos sin necesidad de levantar toda la app.',
    hint: 'Instala `@playwright/experimental-ct-react`. Los tests usan `mount()` y las mismas assertions web-first. Para eventos, pasa un callback y verifícalo con `expect.poll` o con una promesa.',
    solution: `// button.spec.tsx (component testing)
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('Button renderiza con texto y dispara onClick', async ({ mount }) => {
  let clicks = 0;
  const component = await mount(
    <Button label="Guardar" onClick={() => { clicks++; }} />
  );

  await expect(component).toContainText('Guardar');
  await component.click();
  await expect.poll(() => clicks).toBe(1);
});

test('Button deshabilitado no es interactivo', async ({ mount }) => {
  const component = await mount(<Button label="Guardar" disabled />);

  // Un usuario real no puede pulsarlo: basta con verificar el estado (nada de click con force)
  await expect(component).toBeDisabled();
});`,
  },
  {
    id: 'ej-a17',
    num: 'A17',
    title: 'Modificar headers de peticiones',
    difficulty: 'advanced',
    description:
      'Intercepta todas las peticiones a tu API e inyecta un header de autenticación personalizado (`X-API-Key`). Verifica que las peticiones llegan con el header correcto.',
    hint: 'En `page.route()`, usa `route.continue({ headers: { ...request.headers(), "X-API-Key": valor } })`. Lee la clave de una variable de entorno y espera a que ocurra la petición con `expect.poll`, no con `networkidle`.',
    solution: `import { test, expect } from '@playwright/test';

test('inyectar header de autenticación', async ({ page }) => {
  const apiKey = process.env.API_KEY ?? 'test-key';
  const injected: Record<string, string>[] = [];

  await page.route('**/api/**', async (route, request) => {
    const headers = { ...request.headers(), 'x-api-key': apiKey };
    injected.push(headers);
    await route.continue({ headers });
  });

  await page.goto('https://mi-app.ejemplo.com');

  // Esperar a que se intercepte al menos una llamada a la API
  await expect.poll(() => injected.length).toBeGreaterThan(0);
  expect(injected[0]['x-api-key']).toBe(apiKey);
});`,
  },
  {
    id: 'ej-a18',
    num: 'A18',
    title: 'Uso avanzado de expect.poll',
    difficulty: 'advanced',
    description:
      'Usa `expect.poll()` para verificar el estado de una operación asíncrona larga que no refleja en el DOM directamente. Escucha llamadas a la API cada 500ms hasta que el resultado sea el esperado.',
    hint: '`expect.poll(async () => ..., { intervals, timeout })`. Dentro, usa `page.request.get(...)` (comparte cookies con la página) en vez de `page.evaluate(fetch)`.',
    solution: `import { test, expect } from '@playwright/test';

test('esperar resultado con expect.poll', async ({ page }) => {
  await page.goto('https://mi-app.ejemplo.com/jobs');
  await page.getByRole('button', { name: 'Iniciar proceso' }).click();

  const jobIdLocator = page.getByTestId('job-id');
  await expect(jobIdLocator).not.toBeEmpty();
  const jobId = await jobIdLocator.innerText();

  // Consultar la API periódicamente hasta que el job termine
  await expect.poll(
    async () => {
      const res = await page.request.get(new URL(\`/api/jobs/\${jobId}/status\`, page.url()).href);
      return (await res.json()).status;
    },
    { intervals: [500, 1000, 2000], timeout: 30_000, message: 'El job no completó a tiempo' }
  ).toBe('completed');
});`,
  },
  {
    id: 'ej-a19',
    num: 'A19',
    title: 'Pipeline CI/CD completo con caché',
    difficulty: 'advanced',
    description:
      'Escribe un workflow completo de GitHub Actions para Playwright con: caché de browsers, matriz de browsers (chromium/firefox/webkit), artifacts con reportes HTML, y notificación en Slack al fallar.',
    hint: 'Cachea la carpeta `~/.cache/ms-playwright`. Los artifacts van al `playwright-report/` directory. El Slack webhook va en secrets.',
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
            {"text": "Playwright \${{ matrix.browser }} falló en \${{ github.ref_name }} — \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}"}
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`,
  },
  {
    id: 'ej-a20',
    num: 'A20',
    title: 'Helper de escenarios con test.step',
    difficulty: 'advanced',
    description:
      'Crea un helper `runScenario(page, steps)` donde `steps` es un array de pasos con nombre. Cada paso debe aparecer como `test.step` en el reporte HTML/trace, registrar su duración y NO ocultar los fallos (si un paso falla, el test falla).',
    hint: 'Envuelve cada paso en `test.step(name, fn)`: Playwright ya mide su duración y muestra el árbol en el reporte. No captures errores con `try/catch` a menos que los vuelvas a lanzar.',
    solution: `import { test, expect, type Page } from '@playwright/test';

interface Step {
  name: string;
  run: (page: Page) => Promise<void>;
}

export async function runScenario(page: Page, steps: Step[]) {
  for (const step of steps) {
    const start = Date.now();
    // test.step aparece en el reporte y en el trace; si falla, el test falla
    await test.step(step.name, () => step.run(page));
    test.info().annotations.push({
      type: 'step-duration',
      description: \`\${step.name}: \${Date.now() - start}ms\`,
    });
  }
}

// Uso:
test('flujo de login y dashboard', async ({ page }) => {
  await runScenario(page, [
    { name: 'Login', run: async p => { await p.goto('https://mi-app.ejemplo.com/login'); /* ... */ } },
    { name: 'Ver dashboard', run: async p => { await expect(p.getByText('Home')).toBeVisible(); } },
  ]);
});`,
  },
  {
    id: 'ej-a21',
    num: 'A21',
    title: 'Verificar SEO y meta tags',
    difficulty: 'advanced',
    description:
      'Escribe un test que verifica las meta tags SEO críticas de cada página: `title`, `description`, `og:title`, `og:image`, `canonical`. Usa un fixture que itera sobre las páginas del sitemap.',
    hint: 'Usa assertions web-first sobre el `<meta>`: `expect(locator).toHaveAttribute("content", /regex/)` reintenta y da mejor mensaje de error que leer el valor y comparar a mano. `expect(page).toHaveTitle(regex)` para el título.',
    solution: `import { test, expect } from '@playwright/test';

const PAGES = [
  { url: '/', minTitleLen: 20, hasOG: true },
  { url: '/blog', minTitleLen: 10, hasOG: false },
  { url: '/contacto', minTitleLen: 10, hasOG: false },
];

for (const p of PAGES) {
  test(\`SEO meta tags — \${p.url}\`, async ({ page }) => {
    await page.goto(\`https://mi-sitio.ejemplo.com\${p.url}\`);

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
    title: 'Automatizar el flujo de pago con intercepción',
    difficulty: 'advanced',
    description:
      'Simula el flujo completo de checkout de un e-commerce. Intercepta la llamada al procesador de pagos y devuelve un pago exitoso simulado sin cobrar tarjeta real. Verifica el email de confirmación en la respuesta de la API.',
    hint: 'Intercepta el POST al endpoint de pago con `page.route`. Retorna la estructura de respuesta que tu app espera del procesador.',
    solution: `import { test, expect } from '@playwright/test';

test('checkout completo con pago simulado', async ({ page }) => {
  // Mock del procesador de pago (Stripe/PayPal/etc): nunca se cobra una tarjeta real
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

  await page.goto('https://mi-tienda.ejemplo.com');
  await page.getByTestId('product-card').first().getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('link', { name: 'Carrito' }).click();
  await page.getByRole('button', { name: 'Pagar' }).click();

  await page.getByLabel('Email').fill('cliente@test.com');
  await page.getByLabel('Número de tarjeta').fill('4242 4242 4242 4242');
  await page.getByLabel('Fecha').fill('12/26');
  await page.getByLabel('CVC').fill('123');

  // Verificar también lo que la app ENVÍA al procesador
  const paymentRequest = page.waitForRequest('**/api/payments/process');
  await page.getByRole('button', { name: 'Confirmar pago' }).click();
  expect((await paymentRequest).postDataJSON()).toMatchObject({ email: 'cliente@test.com' });

  await expect(page).toHaveURL(/confirmacion/);
  await expect(page.getByText('Pago exitoso')).toBeVisible();
  await expect(page.getByText('cliente@test.com')).toBeVisible();
});`,
  },
];
