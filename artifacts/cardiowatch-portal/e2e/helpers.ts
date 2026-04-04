import { Page } from '@playwright/test';

export const LOGIN_EMAIL = 'clinician@hospital.org';
export const LOGIN_PASSWORD = 'password123';

export async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.locator('[data-testid="input-email"]').fill(LOGIN_EMAIL);
  await page.locator('[data-testid="input-password"]').fill(LOGIN_PASSWORD);
  await page.locator('[data-testid="button-sign-in"]').click();
  await page.waitForURL('**/dashboard');
}

export async function getFirstPatientId(page: Page): Promise<string> {
  await page.waitForSelector('[data-testid^="button-review-"]');
  const reviewBtn = page.locator('[data-testid^="button-review-"]').first();
  const testId = await reviewBtn.getAttribute('data-testid');
  return testId!.replace('button-review-', '');
}
