import { test, expect } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-06 — ECG Viewer (UR-05)', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));
    await page.getByRole('tab', { name: 'ECG Viewer' }).click();
    await expect(page.locator('[data-testid="ecg-waveform"]')).toBeVisible();
  });

  test('TC-06.1 — ECG Viewer tab renders the waveform SVG', async ({ page }) => {
    await expect(page.locator('[data-testid="ecg-waveform"]')).toBeVisible();
    await expect(page.locator('[data-testid="ecg-time-axis"]')).toBeVisible();
    await expect(page.locator('[data-testid="ecg-amplitude-axis"]')).toBeVisible();
  });

  test('TC-06.2 — Speed control changes the displayed speed annotation', async ({ page }) => {
    await page.locator('[data-testid="select-playback-speed"]').click();
    await page.getByRole('option', { name: '12.5 mm/s' }).click();

    const timeAxis = page.locator('[data-testid="ecg-time-axis"]');
    await expect(timeAxis).toContainText('12.5');
  });

  test('TC-06.3 — Gain control changes the displayed amplitude annotation', async ({ page }) => {
    await page.locator('[data-testid="select-gain"]').click();
    await page.getByRole('option', { name: '20 mm/mV' }).click();

    const ampAxis = page.locator('[data-testid="ecg-amplitude-axis"]');
    await expect(ampAxis).toContainText('20');
  });

  test('TC-06.4 — Annotations toggle changes the waveform display state', async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle-annotations"]');
    await expect(toggle).toBeVisible();

    const initialState = await toggle.getAttribute('data-state');
    await toggle.click();
    const newState = await toggle.getAttribute('data-state');
    expect(newState).not.toEqual(initialState);
  });

  test('TC-06.5 — Zoom buttons are present and clickable', async ({ page }) => {
    await expect(page.locator('[data-testid="button-zoom-in"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-zoom-out"]')).toBeVisible();

    await page.locator('[data-testid="button-zoom-in"]').click();
    await page.locator('[data-testid="button-zoom-out"]').click();
    await expect(page.locator('[data-testid="ecg-waveform"]')).toBeVisible();
  });

});
