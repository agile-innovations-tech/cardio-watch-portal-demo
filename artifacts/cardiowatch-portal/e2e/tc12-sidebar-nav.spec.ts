import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-12 — Sidebar Navigation (UR-11)', () => {

  test('TC-12.1 — Sidebar Analytics link navigates to /analytics', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="nav-analytics"]').click();

    await expect(page).toHaveURL(/\/analytics/);
    await expect(page.getByRole('heading', { name: 'Population Analytics' })).toBeVisible();
  });

  test('TC-12.2 — Sidebar Settings link navigates to /settings', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="nav-settings"]').click();

    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('TC-12.3 — Sidebar Dashboard link navigates back to /dashboard', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="nav-analytics"]').click();
    await expect(page).toHaveURL(/\/analytics/);

    await page.locator('[data-testid="nav-dashboard"]').click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Population Dashboard' })).toBeVisible();
  });

});
