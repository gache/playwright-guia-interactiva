import type { Page } from '@playwright/test';

/** Resolves once the page has stopped scrolling (scrollY unchanged for ~300 ms) — no fixed sleeps. */
export function scrollSettled(page: Page) {
  return page.evaluate(() => new Promise<void>(resolve => {
    let last = window.scrollY, stable = 0;
    const timer = setInterval(() => {
      stable = window.scrollY === last ? stable + 1 : 0;
      last = window.scrollY;
      if (stable >= 3) { clearInterval(timer); resolve(); }
    }, 100);
  }));
}
