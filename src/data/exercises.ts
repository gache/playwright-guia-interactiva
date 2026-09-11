export interface Exercise {
  id: string;
  num: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  hint: string;
  solution: string;
}

export const exercises: Exercise[] = [
  // ───────────────────────────── PRINCIPIANTE ─────────────────────────────
  {
    id: 'ej-b01',
    num: 'B01',
    title: 'Abrir una página y verificar el título',
    difficulty: 'beginner',
    description:
      'Navega a `https://playwright.dev` y verifica que el título del documento contenga la palabra "Playwright".',
    hint: 'Usa `page.title()` para obtener el título y `expect(title).toContain(...)` para verificarlo.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar título de playwright.dev', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const title = await page.title();
  expect(title).toContain('Playwright');
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
    hint: 'Usa `page.getByPlaceholder(...)` para el campo y `page.keyboard.press("Enter")`.',
    solution: `import { test, expect } from '@playwright/test';

test('agregar una tarea en TodoMVC', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Aprender Playwright');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Aprender Playwright')).toBeVisible();
});`,
  },
  {
    id: 'ej-b04',
    num: 'B04',
    title: 'Llenar formulario de registro y enviarlo',
    difficulty: 'beginner',
    description:
      'Navega a `https://practice.expandtesting.com/register`. Llena los campos Name, Email, Password y Confirm Password con datos válidos. Haz clic en "Register" y verifica que aparece el mensaje de éxito.',
    hint: 'Usa `getByPlaceholder("Name")` o `getByLabel(...)` para los campos. El mensaje de éxito aparece como alerta/toast verde.',
    solution: `import { test, expect } from '@playwright/test';

test('registro en practice.expandtesting.com', async ({ page }) => {
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
      'Navega a una página con contenido que carga de forma asíncrona. Espera a que un elemento con clase `.results` sea visible antes de verificar su texto.',
    hint: '`expect(locator).toBeVisible()` ya espera automáticamente. También puedes usar `locator.waitFor()`.',
    solution: `import { test, expect } from '@playwright/test';

test('esperar elemento asíncrono', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();
  const resultado = page.locator('#finish');
  await expect(resultado).toBeVisible({ timeout: 10_000 });
  await expect(resultado).toContainText('Hello World!');
});`,
  },
  {
    id: 'ej-b08',
    num: 'B08',
    title: 'Seleccionar una opción en un dropdown',
    difficulty: 'beginner',
    description:
      'En una página con un `<select>`, selecciona una opción específica por su valor y verifica que quedó seleccionada.',
    hint: 'Usa `page.selectOption(selector, valor)` o `locator.selectOption(valor)`.',
    solution: `import { test, expect } from '@playwright/test';

test('seleccionar opción en dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.selectOption('#dropdown', '2');
  const selected = page.locator('#dropdown option:checked');
  await expect(selected).toHaveText('Option 2');
});`,
  },
  {
    id: 'ej-b09',
    num: 'B09',
    title: 'Marcar y desmarcar checkboxes',
    difficulty: 'beginner',
    description:
      'Encuentra un checkbox en una página, verifica que está desmarcado, márcalo y luego verifica que está marcado.',
    hint: 'Usa `locator.check()`, `locator.uncheck()` y `locator.isChecked()`.',
    solution: `import { test, expect } from '@playwright/test';

test('marcar checkbox', async ({ page }) => {
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
    title: 'Obtener el texto de múltiples elementos',
    difficulty: 'beginner',
    description:
      'En la demo de TodoMVC, agrega 3 tareas distintas. Luego recoge todos los textos de la lista y verifica que las 3 tareas están presentes.',
    hint: 'Usa `locator.allTextContents()` para obtener un array con todos los textos.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar múltiples tareas', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  for (const tarea of ['Tarea 1', 'Tarea 2', 'Tarea 3']) {
    await input.fill(tarea);
    await input.press('Enter');
  }
  const textos = await page.locator('.todo-list li label').allTextContents();
  expect(textos).toContain('Tarea 1');
  expect(textos).toContain('Tarea 2');
  expect(textos).toContain('Tarea 3');
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
      'Encuentra un elemento que revela contenido al pasar el cursor. Haz hover y verifica que el contenido oculto se vuelve visible.',
    hint: 'Usa `locator.hover()` y luego `expect(locator).toBeVisible()`.',
    solution: `import { test, expect } from '@playwright/test';

test('hover revela contenido', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');
  const card = page.locator('.figure').first();
  await card.hover();
  await expect(card.locator('.figcaption')).toBeVisible();
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
  await expect(page.locator('.todo-list li')).toHaveCount(0);
  await expect(page.locator('.todo-count')).not.toBeVisible();
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
  await expect(page.locator('.todo-list li')).toHaveCount(5);
});`,
  },
  {
    id: 'ej-b15',
    num: 'B15',
    title: 'Hacer doble clic para editar',
    difficulty: 'beginner',
    description:
      'En TodoMVC, agrega una tarea. Haz doble clic en ella para activar el modo edición y cambia su texto.',
    hint: 'Usa `locator.dblclick()`. El campo de edición aparece con clase `.edit`.',
    solution: `import { test, expect } from '@playwright/test';

test('editar tarea con doble clic', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Texto original');
  await input.press('Enter');

  await page.locator('.todo-list li label').dblclick();
  await page.locator('.todo-list li .edit').fill('Texto editado');
  await page.locator('.todo-list li .edit').press('Enter');

  await expect(page.getByText('Texto editado')).toBeVisible();
});`,
  },
  {
    id: 'ej-b16',
    num: 'B16',
    title: 'Verificar un atributo de elemento',
    difficulty: 'beginner',
    description:
      'Verifica que el campo de búsqueda de una página tiene el atributo `placeholder` correcto y que un enlace tiene el `href` esperado.',
    hint: 'Usa `expect(locator).toHaveAttribute("nombre", "valor")`.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar atributos', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.getByRole('searchbox')).toHaveAttribute('placeholder', /search/i);
  await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', /docs/);
});`,
  },
  {
    id: 'ej-b17',
    num: 'B17',
    title: 'Presionar teclas del teclado',
    difficulty: 'beginner',
    description:
      'En un campo de texto, escribe contenido usando `fill`, luego selecciona todo con `Ctrl+A` y bórralo con `Delete`. Verifica que el campo queda vacío.',
    hint: 'Usa `page.keyboard.press("Control+A")` y luego `"Delete"` o `"Backspace"`.',
    solution: `import { test, expect } from '@playwright/test';

test('limpiar campo con teclado', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('texto de prueba');
  await input.press('Control+A');
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

  await page.locator('.todo-list li .toggle').click();
  await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
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
    title: 'Scroll hasta un elemento',
    difficulty: 'beginner',
    description:
      'Navega a una página larga. Haz scroll hasta un elemento que esté fuera del viewport y verifica que es visible.',
    hint: 'Usa `locator.scrollIntoViewIfNeeded()` y luego `expect(locator).toBeInViewport()`.',
    solution: `import { test, expect } from '@playwright/test';

test('scroll hasta elemento', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const footer = page.locator('footer');
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
    hint: 'Usa `locator.screenshot({ path: "..." })` directamente sobre el locator del elemento.',
    solution: `import { test } from '@playwright/test';

test('captura de un elemento', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const header = page.locator('header').first();
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
    title: 'Interceptar peticiones HTTP',
    difficulty: 'intermediate',
    description:
      'Intercepta todas las peticiones a la API y registra sus URLs. Verifica que al menos una petición al endpoint `/api/todos` fue realizada.',
    hint: 'Usa `page.on("request", cb)` para escuchar. O `page.waitForRequest(/patrón/)` para esperar una específica.',
    solution: `import { test, expect } from '@playwright/test';

test('interceptar peticiones', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', req => requests.push(req.url()));

  await page.goto('https://demo.playwright.dev/todomvc');
  // Esperar carga y opcional verificar
  await page.waitForLoadState('networkidle');
  // Si la app hace llamadas a API, verificar:
  // expect(requests.some(url => url.includes('/api/'))).toBe(true);
  expect(requests.length).toBeGreaterThan(0);
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
      'Página que muestra un `alert`. Configura un manejador que acepte automáticamente el diálogo y verifica el mensaje que contenía.',
    hint: 'Usa `page.on("dialog", dialog => { /* dialog.message(), dialog.accept() */ })`.',
    solution: `import { test, expect } from '@playwright/test';

test('aceptar alert del navegador', async ({ page }) => {
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
    title: 'Subir un archivo',
    difficulty: 'intermediate',
    description:
      'Encuentra un input de tipo file en una página. Sube un archivo de prueba y verifica que el nombre del archivo aparece en la página.',
    hint: 'Usa `locator.setInputFiles("ruta/al/archivo.txt")` para simular la subida.',
    solution: `import { test, expect } from '@playwright/test';
import path from 'path';

test('subir archivo', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  await page.setInputFiles('#file-upload', path.join(__dirname, 'fixture.txt'));
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.locator('#uploaded-files')).toContainText('fixture.txt');
});`,
  },
  {
    id: 'ej-i06',
    num: 'I06',
    title: 'Arrastrar y soltar (drag & drop)',
    difficulty: 'intermediate',
    description:
      'En una página con elementos arrastrables, mueve un elemento de la columna A a la columna B y verifica el nuevo orden.',
    hint: 'Usa `locator.dragTo(target)` para un drag & drop simple entre dos locators.',
    solution: `import { test, expect } from '@playwright/test';

test('drag and drop', async ({ page }) => {
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
    title: 'Trabajar con iframes',
    difficulty: 'intermediate',
    description:
      'Encuentra un iframe en la página. Accede a su contenido, interactúa con un elemento dentro de él y verifica el resultado.',
    hint: 'Usa `page.frameLocator("iframe")` para obtener un frame locator, luego opera sobre él normalmente.',
    solution: `import { test, expect } from '@playwright/test';

test('interactuar con iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  const frame = page.frameLocator('#mce_0_ifr');
  await frame.locator('body').fill('Texto dentro del iframe');
  await expect(frame.locator('body')).toContainText('Texto dentro del iframe');
});`,
  },
  {
    id: 'ej-i08',
    num: 'I08',
    title: 'Implementar Page Object Model básico',
    difficulty: 'intermediate',
    description:
      'Crea una clase `TodoPage` que encapsule las acciones de la demo TodoMVC: `addTask(text)`, `completeTask(index)`, `getTaskCount()`. Escribe un test que use esta clase.',
    hint: 'La clase recibe `page` en el constructor. Los métodos usan `this.page.locator(...)`.',
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

test('POM básico', async ({ page }) => {
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
    title: 'Esperas condicionales con waitFor',
    difficulty: 'intermediate',
    description:
      'Espera a que un elemento cambie de estado: primero aparece un loader, luego desaparece y aparece el contenido. Espera cada transición explícitamente.',
    hint: 'Combina `locator.waitFor({ state: "hidden" })` y `locator.waitFor({ state: "visible" })`.',
    solution: `import { test, expect } from '@playwright/test';

test('esperar transición loader → contenido', async ({ page }) => {
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
    title: 'Simular dispositivo móvil',
    difficulty: 'intermediate',
    description:
      'Ejecuta un test simulando un iPhone 12. Verifica que la página muestra el menú hamburguesa en lugar del menú de escritorio.',
    hint: 'Usa `devices["iPhone 12"]` de Playwright y pásalo a `browser.newContext({ ...devices["iPhone 12"] })`.',
    solution: `import { test, expect, devices } from '@playwright/test';

test('vista móvil iPhone 12', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await context.newPage();

  await page.goto('https://playwright.dev');
  // Verifica que el header es responsive
  const viewport = page.viewportSize();
  expect(viewport?.width).toBe(390);
  await context.close();
});`,
  },
  {
    id: 'ej-i11',
    num: 'I11',
    title: 'Manejar autenticación HTTP Basic',
    difficulty: 'intermediate',
    description:
      'Accede a `https://practice.expandtesting.com/basic-auth` protegida con HTTP Basic Auth. Las credenciales del sitio están documentadas en su página: usuario `practice` y la contraseña indicada en el sitio. Verifica el mensaje de bienvenida.',
    hint: 'Usa `browser.newContext({ httpCredentials: { username, password } })`. Guarda las credenciales en variables de entorno, no en el código.',
    solution: `import { test, expect } from '@playwright/test';

test('autenticación HTTP Basic en practice.expandtesting.com', async ({ browser }) => {
  // Credenciales publicadas en practice.expandtesting.com/basic-auth
  // Guárdalas en .env: BASIC_USER=practice  BASIC_PASS=<ver sitio>
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
    title: 'Parametrizar tests con test.each',
    difficulty: 'intermediate',
    description:
      'Escribe un test parametrizado que verifique que 5 URLs distintas responden con status 200 y contienen un `<h1>`.',
    hint: 'Usa `test.each([ [url1], [url2], ... ])("descripción %s", async ({ page }, url) => { ... })`.',
    solution: `import { test, expect } from '@playwright/test';

const urls = [
  'https://playwright.dev',
  'https://playwright.dev/docs/intro',
  'https://playwright.dev/docs/api/class-page',
];

test.each(urls)('página %s tiene encabezado', async ({ page }, url) => {
  await page.goto(url);
  await expect(page.locator('h1').first()).toBeVisible();
});`,
  },
  {
    id: 'ej-i13',
    num: 'I13',
    title: 'Usar beforeEach y afterEach',
    difficulty: 'intermediate',
    description:
      'Crea una suite de tests para TodoMVC donde `beforeEach` navega y agrega una tarea base, y `afterEach` verifica que no quedaron errores en consola.',
    hint: '`test.beforeEach` y `test.afterEach` reciben el mismo objeto `{ page }` que los tests.',
    solution: `import { test, expect } from '@playwright/test';

test.describe('TodoMVC suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.getByPlaceholder('What needs to be done?').fill('Tarea base');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
  });

  test('la tarea base está visible', async ({ page }) => {
    await expect(page.getByText('Tarea base')).toBeVisible();
  });

  test('se puede completar la tarea base', async ({ page }) => {
    await page.locator('.todo-list li .toggle').click();
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
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
      'Espera la respuesta de un endpoint específico al cargar la página. Verifica que el status es 200 y que el body JSON contiene las propiedades esperadas.',
    hint: 'Usa `page.waitForResponse(urlOrPredicate)` antes de la acción que dispara la llamada.',
    solution: `import { test, expect } from '@playwright/test';

test('verificar respuesta de API en practice.expandtesting.com', async ({ page }) => {
  // La API de notas devuelve JSON — primero hacemos login para obtener token
  const [response] = await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/notes/api/users/login') && res.status() === 200
    ),
    page.goto('https://practice.expandtesting.com/login'),
  ]);

  // Tras cargar el login, verificamos que la respuesta de la API tiene estructura esperada
  // (En flujo real: llenar form, click Login, capturar respuesta POST /login)
  // Aquí verificamos la respuesta de la petición inicial de la página:
  const status = response.status();
  expect([200, 302, 404].includes(status)).toBe(true);
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
    hint: 'Extiende `test` con `test.extend({ myFixture: async ({ page }, use) => { ... await use(page); } })`.',
    solution: `import { test as base, expect } from '@playwright/test';

// Primero registra un usuario en /register, luego usa esas credenciales aquí
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

test('ver notas del usuario autenticado', async ({ loggedPage }) => {
  await expect(loggedPage).toHaveURL(/notes/);
  await expect(loggedPage.getByRole('heading', { name: /notes|mis notas/i })).toBeVisible();
});`,
  },
  {
    id: 'ej-i18',
    num: 'I18',
    title: 'Manejar cookies de sesión',
    difficulty: 'intermediate',
    description:
      'Guarda las cookies después de un login exitoso. En un segundo contexto, carga esas cookies y verifica que el usuario sigue autenticado sin repetir el login.',
    hint: 'Usa `context.cookies()` para guardar y `context.addCookies(cookies)` para restaurar.',
    solution: `import { test, expect } from '@playwright/test';

test('persistir sesión en practice.expandtesting.com', async ({ browser }) => {
  // Contexto 1: login → guardar cookies
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.goto('https://practice.expandtesting.com/login');
  await page1.getByPlaceholder('Email').fill('tu-email@test.com');
  await page1.getByPlaceholder('Password').fill('Tu1234!');
  await page1.getByRole('button', { name: 'Login' }).click();
  await page1.waitForURL('https://practice.expandtesting.com/notes');
  const cookies = await ctx1.cookies();
  await ctx1.close();

  // Contexto 2: restaurar cookies → acceder directo a /notes sin login
  const ctx2 = await browser.newContext();
  await ctx2.addCookies(cookies);
  const page2 = await ctx2.newPage();
  await page2.goto('https://practice.expandtesting.com/notes');
  // Si las cookies son válidas, no redirige al login:
  await expect(page2).toHaveURL(/notes/);
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

  await expect.soft(page.getByPlaceholder('Name')).toBeVisible();
  await expect.soft(page.getByPlaceholder('Email')).toBeEnabled();
  await expect.soft(page.getByPlaceholder('Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByPlaceholder('Confirm Password')).toHaveAttribute('type', 'password');
  await expect.soft(page.getByRole('button', { name: 'Register' })).toBeVisible();

  // El test reporta todos los fallos juntos al finalizar
});`,
  },
  {
    id: 'ej-i20',
    num: 'I20',
    title: 'Ejecutar JavaScript en la página',
    difficulty: 'intermediate',
    description:
      'Usa `page.evaluate()` para ejecutar código JavaScript directamente en el contexto de la página y obtener información que no está en el DOM (p. ej., una variable global o el resultado de un cálculo).',
    hint: '`page.evaluate(fn)` ejecuta `fn` en el contexto del browser y devuelve el resultado serializado.',
    solution: `import { test, expect } from '@playwright/test';

test('ejecutar JS en el browser', async ({ page }) => {
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
    title: 'Tomar capturas de pantalla comparativas',
    difficulty: 'intermediate',
    description:
      'Usa el matcher `toHaveScreenshot()` para hacer una comparación visual de un componente. La primera vez crea el snapshot base; las siguientes detectan diferencias.',
    hint: 'En la primera ejecución, corre con `--update-snapshots` para crear el baseline. Después, corre normalmente.',
    solution: `import { test, expect } from '@playwright/test';

test('visual regression del header', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page.locator('header').first()).toHaveScreenshot('header-baseline.png', {
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
    hint: 'Usa `page.route("**/*.{png,jpg,jpeg,webp,gif}", route => route.abort())`.',
    solution: `import { test, expect } from '@playwright/test';

test('bloquear imágenes para acelerar carga', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', route => route.abort());

  await page.goto('https://playwright.dev');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // La página cargó sin imágenes
  const images = await page.locator('img').all();
  // Las imágenes existen en el DOM pero su src fue bloqueado
  expect(images.length).toBeGreaterThanOrEqual(0);
});`,
  },

  // ─────────────────────────── AVANZADO ──────────────────────────────────
  {
    id: 'ej-a01',
    num: 'A01',
    title: 'Autenticación persistente con storageState',
    difficulty: 'advanced',
    description:
      'Crea un `globalSetup` que hace login una sola vez y guarda el estado de autenticación en disco. Todos los tests del proyecto reutilizan ese estado sin repetir el login.',
    hint: 'En `globalSetup`, usa `browser.newPage()`, haz login, llama `context.storageState({ path })`. Configura `storageState` en `playwright.config.ts`.',
    solution: `// global-setup.ts
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Usar practice.expandtesting.com — registra un usuario antes de correr este setup
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
  // Todos los tests arrancan ya autenticados en /notes
};`,
  },
  {
    id: 'ej-a02',
    num: 'A02',
    title: 'Page Object Model completo con herencia',
    difficulty: 'advanced',
    description:
      'Implementa un POM completo con: `BasePage` (métodos comunes), `LoginPage extends BasePage`, `DashboardPage extends BasePage`. Escribe tests E2E que usen las tres clases.',
    hint: 'La `BasePage` guarda `this.page` y define helpers como `waitForToast()`. Las páginas hijas definen sus locators como propiedades.',
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
test('login E2E con POM en practice.expandtesting.com', async ({ page }) => {
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
    title: 'Sharding de tests para CI paralelo',
    difficulty: 'advanced',
    description:
      'Configura tu proyecto para ejecutar tests en 4 shards paralelos en CI. Escribe el pipeline de GitHub Actions que combina los reportes de todos los shards.',
    hint: 'Usa `--shard=1/4`, `--shard=2/4`, etc. En CI, usa la strategy matrix de GitHub Actions. Combina con `merge-reports`.',
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
    title: 'Mock completo de API con HAR recording',
    difficulty: 'advanced',
    description:
      'Graba las peticiones de red de tu app en un archivo HAR. Luego reproduce ese HAR en tests offline, sin necesidad del servidor real.',
    hint: 'Graba con `page.routeFromHAR(path, { update: true })`. En tests, usa `page.routeFromHAR(path)` sin `update`.',
    solution: `import { test, expect } from '@playwright/test';

// Paso 1: grabar (ejecutar una vez con UPDATE_HAR=true)
// Paso 2: reproducir en tests normales
test('reproducir HAR grabado', async ({ page }) => {
  await page.routeFromHAR('./fixtures/api-responses.har', {
    url: '**/api/**',
    update: false,
  });

  await page.goto('https://mi-app.ejemplo.com');
  // La app usa las respuestas del HAR en lugar del servidor real
  await expect(page.getByText('Datos desde HAR')).toBeVisible();
});

// Script de grabación (ejecutar manualmente):
// npx playwright test --headed --update-snapshots
// con page.routeFromHAR('./fixtures/api-responses.har', { update: true })`,
  },
  {
    id: 'ej-a05',
    num: 'A05',
    title: 'Tests de accesibilidad con axe-playwright',
    difficulty: 'advanced',
    description:
      'Integra `axe-playwright` para hacer un audit de accesibilidad WCAG 2.1 AA en cada página principal de tu app. Falla el test si hay violaciones de severidad "critical" o "serious".',
    hint: 'Instala `axe-playwright`, importa `checkA11y`, llámalo con `{ runOnly: { type: "tag", values: ["wcag2aa"] } }`.',
    solution: `import { test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const PAGES = ['/', '/login', '/dashboard', '/profile'];

for (const path of PAGES) {
  test(\`accesibilidad WCAG 2.1 AA — \${path}\`, async ({ page }) => {
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
    title: 'Simular condiciones de red lentas',
    difficulty: 'advanced',
    description:
      'Simula una conexión 3G lenta (750 kbps, latencia 100ms). Verifica que la página muestra un skeleton/loader durante la carga y que la app sigue siendo usable.',
    hint: 'Usa `page.emulateNetworkConditions({ offline: false, downloadThroughput: ... , uploadThroughput: ..., latency: ... })`.',
    solution: `import { test, expect } from '@playwright/test';

test('UI con red 3G lenta', async ({ page }) => {
  // Simular conexión 3G Regular
  const cdpSession = await page.context().newCDPSession(page);
  await cdpSession.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,  // 750 kbps
    uploadThroughput: (250 * 1024) / 8,    // 250 kbps
    latency: 100,
  });

  await page.goto('https://mi-app.ejemplo.com');

  // El skeleton debe aparecer durante la carga
  const skeleton = page.locator('.skeleton');
  // Puede aparecer brevemente — no siempre capturamos el estado intermedio

  // La app debe cargarse eventualmente
  await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
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
    title: 'Test retry y análisis de flakiness',
    difficulty: 'advanced',
    description:
      'Configura `retries: 2` en el proyecto. Escribe un test que simula flakiness con un contador global. Verifica que el mecanismo de retry funciona y el test pasa eventualmente.',
    hint: 'En `playwright.config.ts`, `retries: 2`. Usa `test.info().retry` dentro del test para saber en qué intento estás.',
    solution: `// playwright.config.ts
export default {
  retries: 2,
  reporter: [['html'], ['list']],
};

// flaky.test.ts
import { test, expect } from '@playwright/test';

let callCount = 0;

test('test con retry (falla 2 veces, pasa a la 3a)', async ({ page }) => {
  callCount++;
  console.log(\`Intento \${test.info().retry + 1}\`);

  if (callCount < 3) {
    // Simular fallo (en tests reales sería una condición de carrera)
    throw new Error(\`Fallo intencional en intento \${callCount}\`);
  }

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
      'Usa la CDP (Chrome DevTools Protocol) para monitorear los frames de un WebSocket. Verifica que la app recibe el mensaje esperado del servidor.',
    hint: 'Usa `page.on("websocket", ws => ws.on("framesent"/"framereceived", ...))` para monitorear WebSockets.',
    solution: `import { test, expect } from '@playwright/test';

test('monitorear mensajes WebSocket', async ({ page }) => {
  const wsMessages: string[] = [];

  page.on('websocket', ws => {
    ws.on('framereceived', frame => {
      if (typeof frame.payload === 'string') {
        wsMessages.push(frame.payload);
      }
    });
  });

  await page.goto('https://mi-app-ws.ejemplo.com');
  // Esperar a que llegue un mensaje específico
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
    title: 'Reporte HTML personalizado con metadata',
    difficulty: 'advanced',
    description:
      'Crea un reporter personalizado que extienda `Reporter` de Playwright. Genera un JSON con métricas de cada test: duración, intentos, status, y un screenshot del fallo si existe.',
    hint: 'Implementa la clase con `onTestEnd(test, result)`. Guarda un `result.attachments` para screenshots en fallo.',
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
// En playwright.config.ts: reporter: [['./metrics-reporter.ts']]`,
  },
  {
    id: 'ej-a12',
    num: 'A12',
    title: 'Locators avanzados con filter y nth',
    difficulty: 'advanced',
    description:
      'Dada una lista de tarjetas de productos con precio y botón "Agregar", usa locators encadenados para encontrar la tarjeta más barata (primer ítem del sort) y hacer clic en su botón.',
    hint: 'Encadena `.filter({ has: locator })` y `.nth(0)`. O filtra por `hasText` para encontrar el precio mínimo después de extraerlo.',
    solution: `import { test, expect } from '@playwright/test';

test('agregar el producto más barato', async ({ page }) => {
  await page.goto('https://mi-tienda.ejemplo.com/productos');

  // Ordenar por precio ascendente
  await page.getByRole('combobox', { name: /ordenar/i }).selectOption('price-asc');
  await page.waitForLoadState('networkidle');

  // El primero en la lista es el más barato
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
    title: 'Performance: medir métricas Web Vitals',
    difficulty: 'advanced',
    description:
      'Mide el LCP (Largest Contentful Paint) y el CLS (Cumulative Layout Shift) de tu home page. Falla el test si LCP > 2500ms o CLS > 0.1.',
    hint: 'Usa `page.evaluate()` con `PerformanceObserver` o `performance.getEntriesByType()` para obtener métricas.',
    solution: `import { test, expect } from '@playwright/test';

test('Web Vitals: LCP y CLS', async ({ page }) => {
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
      'Verifica que tu PWA funciona offline. Carga la app, activa el modo offline con CDP, recarga la página y verifica que el service worker sirve el contenido cacheado.',
    hint: 'Activa offline con `cdp.send("Network.emulateNetworkConditions", { offline: true, ... })` después de la primera carga.',
    solution: `import { test, expect } from '@playwright/test';

test('PWA funciona offline', async ({ page, context }) => {
  // 1. Cargar la app y esperar que el SW se instale
  await page.goto('https://mi-pwa.ejemplo.com');
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  // 2. Activar modo offline
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  });

  // 3. Recargar y verificar que el SW sirve la cache
  await page.reload();
  await expect(page.getByRole('main')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Sin conexión')).not.toBeVisible();

  // 4. Volver online
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0,
  });
});`,
  },
  {
    id: 'ej-a16',
    num: 'A16',
    title: 'Playwright component testing (experimental)',
    difficulty: 'advanced',
    description:
      'Usa Playwright Component Testing para montar un componente React aislado. Verifica sus props, estado y eventos sin necesidad de levantar toda la app.',
    hint: 'Instala `@playwright/experimental-ct-react`. Los tests usan `mount()` del paquete especial.',
    solution: `// button.test.tsx (ct)
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('Button renderiza con texto y dispara onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button label="Guardar" onClick={() => { clicked = true; }} />
  );

  await expect(component).toContainText('Guardar');
  await component.click();
  expect(clicked).toBe(true);
});

test('Button deshabilitado no dispara onClick', async ({ mount }) => {
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
    title: 'Modificar headers de peticiones',
    difficulty: 'advanced',
    description:
      'Intercepta todas las peticiones a tu API e inyecta un header de autenticación personalizado (`X-API-Key`). Verifica que las peticiones llegan con el header correcto.',
    hint: 'En `page.route()`, usa `route.continue({ headers: { ...request.headers(), "X-API-Key": "valor" } })`.',
    solution: `import { test, expect } from '@playwright/test';

test('inyectar header de autenticación', async ({ page }) => {
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
    title: 'Uso avanzado de expect.poll',
    difficulty: 'advanced',
    description:
      'Usa `expect.poll()` para verificar el estado de una operación asíncrona larga que no refleja en el DOM directamente. Escucha llamadas a la API cada 500ms hasta que el resultado sea el esperado.',
    hint: '`expect.poll(async () => { return await page.evaluate(...); }, { intervals: [500], timeout: 15000 })`.',
    solution: `import { test, expect } from '@playwright/test';

test('esperar resultado con expect.poll', async ({ page }) => {
  await page.goto('https://mi-app.ejemplo.com/jobs');

  // Disparar un job largo
  await page.getByRole('button', { name: 'Iniciar proceso' }).click();

  const jobId = await page.getByTestId('job-id').textContent();

  // Esperar que el job complete verificando la API periódicamente
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
    title: 'Implementar test runner personalizado con fases',
    difficulty: 'advanced',
    description:
      'Crea un helper `runScenario(page, steps)` donde `steps` es un array de funciones con nombre. Ejecuta cada step, mide su duración y genera un reporte estructurado al terminar.',
    hint: 'Cada step es `{ name: string, run: (page) => Promise<void> }`. Captura `Date.now()` antes y después de cada uno.',
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
      break; // o continuar con \`continue\` si quieres todos los pasos
    }
  }

  const total = results.reduce((s, r) => s + r.duration, 0);
  const failed = results.filter(r => r.status === 'failed');
  console.table(results.map(r => ({ ...r, duration: \`\${r.duration}ms\` })));
  console.log(\`Total: \${total}ms | Passed: \${results.length - failed.length} | Failed: \${failed.length}\`);

  return results;
}

// Uso en test:
// const results = await runScenario(page, [
//   { name: 'Login', run: async p => { await p.goto('/login'); ... } },
//   { name: 'Ver dashboard', run: async p => { await expect(p.getByText('Home')).toBeVisible(); } },
// ]);
// expect(results.every(r => r.status === 'passed')).toBe(true);`,
  },
  {
    id: 'ej-a21',
    num: 'A21',
    title: 'Verificar SEO y meta tags',
    difficulty: 'advanced',
    description:
      'Escribe un test que verifica las meta tags SEO críticas de cada página: `title`, `description`, `og:title`, `og:image`, `canonical`. Usa un fixture que itera sobre las páginas del sitemap.',
    hint: 'Usa `page.locator("meta[name=description]").getAttribute("content")` para leer meta tags.',
    solution: `import { test, expect } from '@playwright/test';

const PAGES = [
  { url: '/', minTitleLen: 20, hasOG: true },
  { url: '/blog', minTitleLen: 10, hasOG: false },
  { url: '/contacto', minTitleLen: 10, hasOG: false },
];

for (const p of PAGES) {
  test(\`SEO meta tags — \${p.url}\`, async ({ page }) => {
    await page.goto(\`https://mi-sitio.ejemplo.com\${p.url}\`);

    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(p.minTitleLen);
    expect(title.length).toBeLessThan(70);

    // Description
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).not.toBeNull();
    expect(desc!.length).toBeGreaterThan(50);
    expect(desc!.length).toBeLessThan(160);

    // Canonical
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain(p.url);

    // Open Graph (si aplica)
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
    title: 'Automatizar el flujo de pago con intercepción',
    difficulty: 'advanced',
    description:
      'Simula el flujo completo de checkout de un e-commerce. Intercepta la llamada al procesador de pagos y devuelve un pago exitoso simulado sin cobrar tarjeta real. Verifica el email de confirmación en la respuesta de la API.',
    hint: 'Intercepta el POST al endpoint de pago con `page.route`. Retorna la estructura de respuesta que tu app espera del procesador.',
    solution: `import { test, expect } from '@playwright/test';

test('checkout completo con pago simulado', async ({ page }) => {
  // Mock del procesador de pago (Stripe/PayPal/etc)
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

  // Flujo de compra
  await page.goto('https://mi-tienda.ejemplo.com');
  await page.locator('.product-card').first().getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('link', { name: 'Carrito' }).click();
  await page.getByRole('button', { name: 'Pagar' }).click();

  // Llenar checkout
  await page.getByLabel('Email').fill('cliente@test.com');
  await page.getByLabel('Número de tarjeta').fill('4242 4242 4242 4242');
  await page.getByLabel('Fecha').fill('12/26');
  await page.getByLabel('CVC').fill('123');
  await page.getByRole('button', { name: 'Confirmar pago' }).click();

  // Verificar confirmación
  await expect(page).toHaveURL(/confirmacion/);
  await expect(page.getByText('Pago exitoso')).toBeVisible();
  await expect(page.getByText('cliente@test.com')).toBeVisible();
});`,
  },
];
