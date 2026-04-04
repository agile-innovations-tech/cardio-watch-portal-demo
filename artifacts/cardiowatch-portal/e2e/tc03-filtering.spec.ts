import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TC-03 — Patient Prioritization / Filtering (UR-03)', () => {

  test('TC-03.1 — Search by name filters patient table', async ({ page }) => {
    await login(page);

    const firstName = await page
      .locator('[data-testid="patient-table"] tbody tr:first-child td:first-child')
      .innerText();

    const searchPrefix = firstName.substring(0, 4);
    await page.locator('[data-testid="search-bar"]').fill(searchPrefix);

    const rows = page.locator('[data-testid="patient-table"] tbody tr');
    await expect(rows.first()).toBeVisible();

    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(rowCount, 5); i++) {
      const name = await rows.nth(i).locator('td:first-child').innerText();
      expect(name.toLowerCase()).toContain(searchPrefix.toLowerCase());
    }
  });

  test('TC-03.2 — Severity filter: Critical shows only patients with critical events', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="filter-severity"]').click();
    await page.getByRole('option', { name: 'Critical' }).click();

    const rows = page.locator('[data-testid="patient-table"] tbody tr');
    const count = await rows.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const cellText = await rows.nth(i).locator('td').nth(7).innerText();
        expect(cellText).toContain('Critical');
      }
    }
  });

  test('TC-03.3 — Status filter: Active shows only Active patients', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="filter-status"]').click();
    await page.getByRole('option', { name: 'Active' }).click();

    const rows = page.locator('[data-testid="patient-table"] tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const statusCell = await rows.nth(i).locator('td').nth(4).innerText();
      expect(statusCell).toContain('Active');
    }
  });

  test('TC-03.4 — Search with no matches shows empty-state message', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="search-bar"]').fill('ZZZZZXXX999');

    await expect(page.getByText('No patients found matching the current filters.')).toBeVisible();

    const rows = page.locator('[data-testid="patient-table"] tbody tr[data-testid^="row-patient-"]');
    expect(await rows.count()).toBe(0);
  });

});
