import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-13 — Analytics Page (UR-12)', () => {

  test('TC-13.1 — Analytics page renders metrics and chart visualizations', async ({ page }) => {
    await login(page);
    await page.locator('[data-testid="nav-analytics"]').click();
    await expect(page).toHaveURL(/\/analytics/);

    await expect(page.getByRole('heading', { name: 'Population Analytics' })).toBeVisible();

    await expect(page.locator('[data-testid="metric-patient-days"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-total-events"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-confirmed"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-dismissed"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-turnaround"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-compliance"]')).toBeVisible();

    await expect(page.locator('[data-testid="chart-event-volume"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-classification"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-turnaround-dist"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-compliance-by-patient"]')).toBeVisible();
  });

});
