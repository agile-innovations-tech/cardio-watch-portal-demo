import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-09 — Patient Settings Tab (UR-08)', () => {

  test('TC-09.1 — Settings tab renders threshold and configuration controls', async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));

    await page.getByRole('tab', { name: 'Settings' }).click();

    await expect(page.locator('[data-testid="input-brady-threshold"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-tachy-threshold"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-af-sensitivity"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-pause-threshold"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-save-settings"]')).toBeVisible();
  });

});
