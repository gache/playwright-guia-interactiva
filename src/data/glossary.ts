import type { GlossaryTerm } from '../types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    "term": "Locator",
    "definitionHtml": "Una receta para encontrar un elemento en la página cuando se necesite — no busca de inmediato, sino cada vez que lo usas. Ver sección 05."
  },
  {
    "term": "Fixture",
    "definitionHtml": "Un objeto que Playwright te entrega listo para usar en cada test, como <code>page</code> o <code>request</code>, sin que tengas que crearlo tú. Ver sección 26 para crear los tuyos."
  },
  {
    "term": "Assertion (expect)",
    "definitionHtml": "Una verificación que hace fallar el test si no se cumple — en Playwright, reintenta sola durante unos segundos antes de darse por vencida. Ver sección 07."
  },
  {
    "term": "Auto-waiting",
    "definitionHtml": "El comportamiento por defecto de Playwright de esperar a que un elemento esté visible, habilitado y estable antes de actuar sobre él."
  },
  {
    "term": "Headless",
    "definitionHtml": "Ejecutar el navegador sin interfaz visual (sin ventana) — más rápido, ideal para CI. Lo opuesto es \"headed\"."
  },
  {
    "term": "BrowserContext",
    "definitionHtml": "Un perfil de navegación aislado, como una ventana de incógnito, con sus propias cookies y sesión. Ver sección 03."
  },
  {
    "term": "Flaky test",
    "definitionHtml": "Un test que a veces pasa y a veces falla sin que el código haya cambiado — casi siempre por esperas mal hechas (timeouts fijos, race conditions)."
  },
  {
    "term": "Race condition",
    "definitionHtml": "Cuando dos eventos compiten por ocurrir primero (por ejemplo, un popup que se abre antes de que empieces a escucharlo) y el resultado depende de quién \"gana\"."
  },
  {
    "term": "Selector semántico",
    "definitionHtml": "Un locator basado en el significado del elemento (su rol, su etiqueta, su texto) en vez de en detalles de implementación como clases CSS. Ver sección 05."
  },
  {
    "term": "data-testid",
    "definitionHtml": "Un atributo HTML que el equipo de desarrollo agrega solo para que los tests lo usen como selector — estable porque nadie más depende de él."
  },
  {
    "term": "Page Object",
    "definitionHtml": "Una clase que agrupa los locators y acciones de una página, en vez de repetirlos en cada test. Ver sección 25 (y aplicado a un proyecto completo en la sección 27)."
  },
  {
    "term": "CI (Integración Continua)",
    "definitionHtml": "Un sistema automatizado (como GitHub Actions) que corre tus tests cada vez que se sube código nuevo, antes de fusionarlo."
  },
  {
    "term": "Trace",
    "definitionHtml": "Una grabación paso a paso de un test (screenshots, red, DOM) que puedes reproducir visualmente después de que falle. Ver sección 21."
  },
  {
    "term": "Storage State",
    "definitionHtml": "Una \"foto\" guardada de cookies + localStorage que te permite arrancar un test ya autenticado, sin repetir el login. Ver sección 14."
  },
  {
    "term": "Snapshot / Visual regression",
    "definitionHtml": "Comparar una captura de pantalla actual contra una guardada como referencia para detectar cambios visuales no intencionados. Ver sección 20."
  },
  {
    "term": "Mock (peticiones de red)",
    "definitionHtml": "Reemplazar la respuesta real de una petición HTTP por una inventada y controlada por ti, usando <code>page.route()</code>. Ver sección 17."
  },
  {
    "term": "Polling",
    "definitionHtml": "Revisar una condición repetidamente cada cierto tiempo hasta que se cumpla o se agote el timeout — así funciona <code>waitForFunction</code> por dentro."
  }
];
