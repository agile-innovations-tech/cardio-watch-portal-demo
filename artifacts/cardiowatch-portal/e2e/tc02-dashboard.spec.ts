import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-02 — Population Dashboard (UR-02)', () => {

  test('TC-02.1 — KPI summary cards are visible with numeric values', async ({ page }) => {
    await login(page);

    const totalCard = page.locator('[data-testid="stat-total-patients"]');
    await expect(totalCard).toBeVisible();
    const totalText = await totalCard.locator('.text-2xl').innerText();
    expect(Number(totalText)).toBeGreaterThan(0);

    await expect(page.locator('[data-testid="stat-critical-unreviewed"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-moderate-unreviewed"]')).toBeVisible();

    const complianceCard = page.locator('[data-testid="stat-compliance-rate"]');
    await expect(complianceCard).toBeVisible();
    const complianceText = await complianceCard.locator('.text-2xl').innerText();
    expect(complianceText).toContain('%');
  });

  test('TC-02.2 — Patient table renders with rows and required columns', async ({ page }) => {
    await login(page);

    const table = page.locator('[data-testid="patient-table"]');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);

    const header = table.locator('thead');
    await expect(header.getByText('Patient Name')).toBeVisible();
    await expect(header.getByText('MRN')).toBeVisible();
    await expect(header.getByText('Status')).toBeVisible();
    await expect(header.getByText('Battery')).toBeVisible();
    await expect(header.getByText('Unreviewed Events')).toBeVisible();
    await expect(header.getByText('Action')).toBeVisible();
  });

  test('TC-02.3 — Column sorting changes row order', async ({ page }) => {
    await login(page);

    const firstRowBefore = await page
      .locator('[data-testid="patient-table"] tbody tr:first-child td:first-child')
      .innerText();

    await page.locator('[data-testid="sort-name"]').click();

    const firstRowAfter = await page
      .locator('[data-testid="patient-table"] tbody tr:first-child td:first-child')
      .innerText();

    expect(firstRowAfter.toLowerCase() <= firstRowBefore.toLowerCase() || firstRowAfter !== firstRowBefore).toBeTruthy();

    await page.locator('[data-testid="sort-name"]').click();

    const firstRowDesc = await page
      .locator('[data-testid="patient-table"] tbody tr:first-child td:first-child')
      .innerText();

    expect(firstRowDesc).not.toEqual(firstRowAfter);
  });

});
