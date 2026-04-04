import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-11 — Notification Drawer (UR-10)', () => {

  test('TC-11.1 — Notification bell opens the drawer with notification entries', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="notification-bell"]').click();

    const drawer = page.locator('[data-testid="notification-drawer"]');
    await expect(drawer).toBeVisible();

    const items = drawer.locator('[data-testid^="notification-item-"]');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('TC-11.2 — Notification drawer can be closed', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="notification-bell"]').click();
    await expect(page.locator('[data-testid="notification-drawer"]')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.locator('[data-testid="notification-drawer"]')).not.toBeVisible();
  });

});
