import type { RoadmapStage } from '../../types';

export const roadmapStages: RoadmapStage[] = [
  {
    "dot": "1",
    "title": "Fondamentaux",
    "range": "Sections 01–03",
    "descriptionHtml": "Installez Playwright, écrivez votre premier test en TypeScript, et comprenez ce que sont Browser et BrowserContext. À la fin de cette étape, vous pouvez exécuter un test simple du début à la fin."
  },
  {
    "dot": "2",
    "title": "Interaction",
    "range": "Sections 04–06",
    "descriptionHtml": "Naviguez, sélectionnez des éléments avec des locators sémantiques et exécutez des actions (clics, formulaires, survol). C'est 80% de ce que vous écrirez dans des tests réels."
  },
  {
    "dot": "3",
    "title": "Validation",
    "range": "Sections 07–08",
    "descriptionHtml": "Vérifiez que l'application fait ce qu'elle doit avec des assertions, et comprenez quand (presque jamais) des attentes manuelles sont nécessaires."
  },
  {
    "dot": "4",
    "title": "Avancé",
    "range": "Sections 09–26",
    "descriptionHtml": "Cas particuliers : iframes, popups, fichiers, cookies, tests d'API, interception et mock de requêtes réseau, émulation d'appareils, tracing, configuration du projet, et les patterns Page Object Model et Fixtures Personnalisées. Revenez à ces sections quand vous en avez besoin — inutile de toutes les mémoriser d'un coup."
  },
  {
    "dot": "✓",
    "title": "Pratique",
    "range": "Sections 27–31",
    "descriptionHtml": "Un mini-projet réel qui relie tout ce qui précède, une révision des erreurs les plus courantes au début, les questions d'entretien les plus fréquentes, et deux banques d'exercices — une pratique (code) et une théorique (choix multiple) — pour mettre à l'épreuve tout ce qui a été appris."
  }
];
