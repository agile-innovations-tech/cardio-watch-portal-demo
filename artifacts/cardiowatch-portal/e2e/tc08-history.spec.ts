import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-08 — History Tab (UR-07)', () => {

  test('TC-08.1 — History tab renders audit log entries', async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));

    await page.getByRole('tab', { name: 'History' }).click();

    const historyList = page.locator('[data-testid="history-list"]');
    await expect(historyList).toBeVisible();

    const entries = historyList.locator('> div, > li');
    await expect(entries.first()).toBeVisible();
    expect(await entries.count()).toBeGreaterThan(0);
  });

});
