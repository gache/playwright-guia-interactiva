import '@testing-library/jest-dom/vitest';

if (typeof IntersectionObserver === 'undefined') {
  // @ts-expect-error jsdom stub
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}
