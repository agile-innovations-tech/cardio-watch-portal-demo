import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-14 — Application Settings (UR-13)', () => {

  test('TC-14.1 — Settings page renders profile section with editable fields', async ({ page }) => {
    await login(page);
    await page.locator('[data-testid="nav-settings"]').click();
    await expect(page).toHaveURL(/\/settings/);

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    await expect(page.locator('[data-testid="user-profile-section"]')).toBeVisible();

    await expect(page.locator('[data-testid="toggle-inapp-alerts"]')).toBeVisible();
    await expect(page.locator('[data-testid="toggle-email-alerts"]')).toBeVisible();
    await expect(page.locator('[data-testid="toggle-sms-alerts"]')).toBeVisible();
  });

});
