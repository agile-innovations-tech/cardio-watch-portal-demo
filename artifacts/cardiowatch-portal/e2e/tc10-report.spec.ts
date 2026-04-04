import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-10 — Report Generation (UR-09)', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));
  });

  test('TC-10.1 — Generate Report button opens the report modal with form fields', async ({ page }) => {
    await page.locator('[data-testid="button-generate-report"]').click();

    const modal = page.locator('[data-testid="report-modal"]');
    await expect(modal).toBeVisible();

    await expect(modal.getByRole('heading', { name: 'Generate Clinical Report' })).toBeVisible();
    await expect(page.locator('[data-testid="select-report-period"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkbox-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkbox-event-log"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-recipient"]')).toBeVisible();
  });

  test('TC-10.2 — Report modal can be dismissed via Cancel button', async ({ page }) => {
    await page.locator('[data-testid="button-generate-report"]').click();
    await expect(page.locator('[data-testid="report-modal"]')).toBeVisible();

    await page.locator('[data-testid="button-cancel-report"]').click();

    await expect(page.locator('[data-testid="report-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="button-generate-report"]')).toBeVisible();
  });

  test('TC-10.3 — Submitting the report form shows a success notification', async ({ page }) => {
    await page.locator('[data-testid="button-generate-report"]').click();
    await expect(page.locator('[data-testid="report-modal"]')).toBeVisible();

    await page.locator('[data-testid="button-generate"]').click();

    await expect(page.getByText(/report generated successfully/i)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="report-modal"]')).not.toBeVisible({ timeout: 5000 });
  });

});
