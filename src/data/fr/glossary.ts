import type { GlossaryTerm } from '../../types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    "term": "Locator",
    "definitionHtml": "Une recette pour trouver un élément sur la page au moment où c'est nécessaire — elle ne cherche pas immédiatement, mais chaque fois que vous l'utilisez. Voir section 05."
  },
  {
    "term": "Fixture",
    "definitionHtml": "Un objet que Playwright vous fournit prêt à l'emploi dans chaque test, comme <code>page</code> ou <code>request</code>, sans que vous ayez à le créer vous-même. Voir section 26 pour créer les vôtres."
  },
  {
    "term": "Assertion (expect)",
    "definitionHtml": "Une vérification qui fait échouer le test si elle n'est pas satisfaite — dans Playwright, elle réessaie automatiquement pendant quelques secondes avant d'abandonner. Voir section 07."
  },
  {
    "term": "Auto-waiting",
    "definitionHtml": "Le comportement par défaut de Playwright consistant à attendre qu'un élément soit visible, activé et stable avant d'agir dessus."
  },
  {
    "term": "Headless",
    "definitionHtml": "Exécuter le navigateur sans interface visuelle (sans fenêtre) — plus rapide, idéal pour la CI. Le contraire est le mode \"headed\"."
  },
  {
    "term": "BrowserContext",
    "definitionHtml": "Un profil de navigation isolé, comme une fenêtre de navigation privée, avec ses propres cookies et sa propre session. Voir section 03."
  },
  {
    "term": "Flaky test",
    "definitionHtml": "Un test qui passe parfois et échoue parfois sans que le code ait changé — presque toujours à cause d'attentes mal gérées (timeouts fixes, race conditions)."
  },
  {
    "term": "Race condition",
    "definitionHtml": "Quand deux événements sont en compétition pour se produire en premier (par exemple, une popup qui s'ouvre avant que vous ne commenciez à l'écouter) et que le résultat dépend de celui qui \"gagne\"."
  },
  {
    "term": "Sélecteur sémantique",
    "definitionHtml": "Un locator basé sur le sens de l'élément (son rôle, son étiquette, son texte) plutôt que sur des détails d'implémentation comme les classes CSS. Voir section 05."
  },
  {
    "term": "data-testid",
    "definitionHtml": "Un attribut HTML que l'équipe de développement ajoute uniquement pour que les tests l'utilisent comme sélecteur — stable car personne d'autre n'en dépend."
  },
  {
    "term": "Page Object",
    "definitionHtml": "Une classe qui regroupe les locators et actions d'une page, au lieu de les répéter dans chaque test. Voir section 25 (et appliqué à un projet complet en section 27)."
  },
  {
    "term": "CI (Intégration Continue)",
    "definitionHtml": "Un système automatisé (comme GitHub Actions) qui exécute vos tests à chaque nouveau code envoyé, avant de le fusionner."
  },
  {
    "term": "Trace",
    "definitionHtml": "Un enregistrement pas à pas d'un test (captures d'écran, réseau, DOM) que vous pouvez rejouer visuellement après un échec. Voir section 21."
  },
  {
    "term": "Storage State",
    "definitionHtml": "Une \"photo\" enregistrée des cookies + localStorage qui vous permet de démarrer un test déjà authentifié, sans répéter la connexion. Voir section 14."
  },
  {
    "term": "Snapshot / Visual regression",
    "definitionHtml": "Comparer une capture d'écran actuelle à une référence enregistrée pour détecter des changements visuels non intentionnels. Voir section 20."
  },
  {
    "term": "Mock (requêtes réseau)",
    "definitionHtml": "Remplacer la réponse réelle d'une requête HTTP par une réponse inventée et contrôlée par vous, avec <code>page.route()</code>. Voir section 17."
  },
  {
    "term": "Polling",
    "definitionHtml": "Vérifier une condition de manière répétée à intervalles réguliers jusqu'à ce qu'elle soit satisfaite ou que le timeout expire — c'est ainsi que fonctionne <code>waitForFunction</code> en interne."
  }
];
