import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-14 — Application Settings (UR-13)', () => {

  test('TC-14.1 — Settings page renders profile section with editable fields', async ({ page }, testInfo) => {
    await login(page);
    await page.locator('[data-testid="nav-settings"]').click();
    await expect(page).toHaveURL(/\/settings/);

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    try {
        await expect(page.locator('[data-testid="user-profile-section"]')).toBeVisible();

        await expect(page.locator('[data-testid="toggle-inapp-alerts"]')).toBeVisible();
        await expect(page.locator('[data-testid="toggle-email-alerts"]')).toBeVisible();
        await expect(page.locator('[data-testid="toggle-sms-alerts"]')).toBeVisible();

        // This assertion is designed to fail to demonstrate a test failure that can be reported to Xray
        await expect(page.locator('[data-testid="toggle-mobile-alerts"]')).toBeVisible();
    }
    catch (error) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach('failure-screenshot.png', {
        body: screenshot,
        contentType: 'image/png',
      });
      throw error;
    }
  });

});
