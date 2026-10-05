/**
 * Collapsed accordion panels must not be reachable by keyboard or screen readers.
 * `inert` removes the whole subtree from the tab order and the accessibility tree.
 * (React 18's types don't know the attribute yet, so it is spread as plain props.)
 */
export const inertWhen = (inactive: boolean): Record<string, string> => (inactive ? { inert: '' } : {});
