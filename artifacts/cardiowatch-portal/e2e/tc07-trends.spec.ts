import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-07 — Trends Tab (UR-06)', () => {

  test('TC-07.1 — Trends tab renders without error and shows chart content', async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));

    await page.getByRole('tab', { name: 'Trends' }).click();

    await expect(page.getByText('Trend Analysis')).toBeVisible();
    await expect(page.locator('[data-testid="select-date-range"]')).toBeVisible();

    const svgElements = page.locator('svg.recharts-surface');
    await expect(svgElements.first()).toBeVisible();
  });

});
