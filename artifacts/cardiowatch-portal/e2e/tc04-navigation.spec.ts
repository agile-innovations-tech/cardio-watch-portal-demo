import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-04 — Patient Navigation (UR-11)', () => {

  test('TC-04.1 — Review button navigates to patient detail page', async ({ page }) => {
    await login(page);

    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();

    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));

    await expect(page.locator('h1').first()).toBeVisible();
  });

});
