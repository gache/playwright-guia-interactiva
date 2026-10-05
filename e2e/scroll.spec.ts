import { test, expect } from '@playwright/test';
import { scrollSettled } from './helpers';

test('opening the exercises from the sidebar leaves the section header at the top, not in the middle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.locator('#sidebar a[href="#ejercicios"]').click();
  const section = page.locator('#ejercicios');
  await expect(section).toHaveClass(/open/);

  // The reveal runs ~420 ms after the click: wait for the scroll position to settle
  const top = () => section.evaluate(el => Math.round(el.getBoundingClientRect().top));
  await expect.poll(top, { timeout: 5000 }).toBeLessThan(120);
  await scrollSettled(page); // it must STAY at the top once the delayed reveal has run
  expect(await top()).toBeGreaterThanOrEqual(-5);
  expect(await top()).toBeLessThan(120);
});
