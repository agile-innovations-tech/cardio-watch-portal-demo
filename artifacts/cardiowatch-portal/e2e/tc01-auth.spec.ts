import { test, expect } from '@playwright/test';
import { login, LOGIN_EMAIL, LOGIN_PASSWORD } from './helpers';

test.describe('TC-01 — Authentication (UR-01)', () => {

  test('TC-01.1 — Login validation: empty fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('[data-testid="input-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-sign-in"]')).toBeVisible();

    await page.locator('[data-testid="button-sign-in"]').click();

    await expect(page.getByText('Please enter both email and password.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-01.2 — Successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-testid="input-email"]').fill(LOGIN_EMAIL);
    await page.locator('[data-testid="input-password"]').fill(LOGIN_PASSWORD);
    await page.locator('[data-testid="button-sign-in"]').click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Population Dashboard' })).toBeVisible();
  });

  test('TC-01.3 — Unauthenticated users are redirected to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-testid="input-email"]')).toBeVisible();

    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-01.4 — Logout ends session and blocks protected routes', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="user-menu"]').click();
    await page.getByRole('menuitem', { name: 'Sign Out' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-testid="input-email"]')).toBeVisible();

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

});
