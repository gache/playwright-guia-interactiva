# Playwright — Guía de Estudio Interactiva

Guía completa para aprender **Playwright con TypeScript** desde cero, en español.

## ¿Qué incluye?

- **31 secciones** organizadas en 3 niveles (Principiante · Intermedio · Avanzado)
- **29 quizzes** por sección con retroalimentación inmediata
- **Glosario** de términos clave
- **66 ejercicios prácticos** con soluciones
- **Ruta de aprendizaje** guiada
- Progreso persistente en `localStorage`

## Stack

- React 18 + TypeScript
- Vite
- CSS custom properties (tema oscuro)
- Vitest + React Testing Library (unit/component)
- Playwright (e2e de la propia guía y verificación de los ejercicios)

## Desarrollo

```bash
npm install
npm run dev
```

## Tests y verificación

| Comando | Qué comprueba |
| --- | --- |
| `npm test` | Unit/component tests y **calidad de los ejercicios** (sintaxis, anti-patrones de la guía oficial, paridad ES/FR) |
| `npm run test:e2e` | Tests end-to-end de la guía (compila y sirve el bundle de producción; Chromium y WebKit) |
| `npm run verify:exercises:offline` | Compila, tipa y **ejecuta las soluciones de los ejercicios** contra un servidor mock local (apps ficticias), más A04/A09/A11 y el YAML de CI |
| `npm run verify:exercises` | Lo anterior + las soluciones que apuntan a sitios públicos (`practice.expandtesting.com`, `playwright.dev`, `demo.playwright.dev`) |

`verify:exercises` corre cada lunes en GitHub Actions (`.github/workflows/verify-exercises.yml`): los sitios públicos pueden cambiar o caerse, así que no bloquean los PR. `npm run test:e2e` y `verify:exercises:offline` sí corren en cada PR (`ci.yml`).

## Build

```bash
npm run build
```

El contenido en francés se carga como un chunk aparte solo al cambiar de idioma.

## Ejercicios: qué esperar

Cada tarjeta indica contra qué se ejecuta su solución: **Sitio real** (sitio público de práctica), **Autocontenido** (construye su propia página con `page.setContent`), **App de ejemplo** (URLs ficticias que debes adaptar) o **Config / CI**. Puedes marcarlos como hechos, autoevaluarte con una checklist de buenas prácticas y descargar la solución como `.spec.ts`.
