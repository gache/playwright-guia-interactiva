import type { RoadmapStage } from '../../types';

export const roadmapStages: RoadmapStage[] = [
  {
    "dot": "1",
    "title": "Fundamentos",
    "range": "Secciones 01–03",
    "descriptionHtml": "Instala Playwright, escribe tu primer test en TypeScript, y entiende qué son Browser y BrowserContext. Al terminar esta etapa puedes correr un test simple de principio a fin."
  },
  {
    "dot": "2",
    "title": "Interacción",
    "range": "Secciones 04–06",
    "descriptionHtml": "Navega, selecciona elementos con locators semánticos y ejecuta acciones (clics, formularios, hover). Es el 80% de lo que escribirás en tests reales."
  },
  {
    "dot": "3",
    "title": "Validación",
    "range": "Secciones 07–08",
    "descriptionHtml": "Verifica que la app hace lo que debe con assertions, y entiende cuándo (casi nunca) hacen falta esperas manuales."
  },
  {
    "dot": "4",
    "title": "Avanzado",
    "range": "Secciones 09–26",
    "descriptionHtml": "Casos especiales: iframes, popups, archivos, cookies, API testing, interceptar y mockear peticiones de red, emulación de dispositivos, tracing, configuración del proyecto, y los patrones Page Object Model y Fixtures Personalizados. Vuelve a estas secciones cuando las necesites — no hace falta memorizarlas todas de una vez."
  },
  {
    "dot": "✓",
    "title": "Práctica",
    "range": "Secciones 27–31",
    "descriptionHtml": "Un mini proyecto real que conecta todo lo anterior, un repaso de los errores más comunes al empezar, las preguntas de entrevista que más se repiten, y dos bancos de ejercicios — uno práctico (código) y otro teórico (opción múltiple) — para poner a prueba todo lo aprendido."
  }
];
