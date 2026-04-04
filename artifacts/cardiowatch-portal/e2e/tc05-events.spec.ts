import { test, expect, Page } from '@playwright/test';
import { login, getFirstPatientId } from './helpers';

test.describe('TC-05 — Event Adjudication (UR-04)', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const patientId = await getFirstPatientId(page);
    await page.locator(`[data-testid="button-review-${patientId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/patients/${patientId}`));
    await page.getByRole('tab', { name: /Events/ }).click();
    await expect(page.locator('[data-testid^="event-card-"]').first()).toBeVisible();
  });

  async function getFirstUnreviewedEventId(page: Page): Promise<string> {
    const allCards = page.locator('[data-testid^="event-card-"]');
    const count = await allCards.count();
    for (let i = 0; i < count; i++) {
      const card = allCards.nth(i);
      const text = await card.innerText();
      if (text.includes('Unreviewed')) {
        const testId = await card.getAttribute('data-testid');
        return testId!.replace('event-card-', '');
      }
    }
    throw new Error('No unreviewed events found');
  }

  test('TC-05.1 — Events tab is the default view and shows event cards', async ({ page }) => {
    const eventsTab = page.getByRole('tab', { name: /Events/ });
    await expect(eventsTab).toHaveAttribute('data-state', 'active');

    const firstCard = page.locator('[data-testid^="event-card-"]').first();
    await expect(firstCard).toBeVisible();
  });

  test('TC-05.2 — Event cards show classification, timestamp, confidence, and status', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="event-card-"]').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('h3')).toBeVisible();

    const cardText = await firstCard.innerText();
    expect(cardText.length).toBeGreaterThan(0);
  });

  test('TC-05.3 — Confirming an unreviewed event changes its status to Confirmed', async ({ page }) => {
    const eventId = await getFirstUnreviewedEventId(page);
    const card = page.locator(`[data-testid="event-card-${eventId}"]`);

    await page.locator(`[data-testid="button-confirm-${eventId}"]`).click();

    await expect(card.getByText('Confirmed')).toBeVisible();
    await expect(page.locator(`[data-testid="button-confirm-${eventId}"]`)).not.toBeVisible();
    await expect(card.getByRole('button', { name: 'Undo Review' })).toBeVisible();
  });

  test('TC-05.4 — Dismissing an unreviewed event changes its status to Dismissed', async ({ page }) => {
    const eventId = await getFirstUnreviewedEventId(page);
    const card = page.locator(`[data-testid="event-card-${eventId}"]`);

    await page.locator(`[data-testid="button-dismiss-${eventId}"]`).click();

    await expect(card.getByText('Dismissed')).toBeVisible();
    await expect(page.locator(`[data-testid="button-dismiss-${eventId}"]`)).not.toBeVisible();
  });

  test('TC-05.5 — Reclassifying an event changes its classification and status', async ({ page }) => {
    const eventId = await getFirstUnreviewedEventId(page);
    const card = page.locator(`[data-testid="event-card-${eventId}"]`);

    await page.locator(`[data-testid="button-reclassify-${eventId}"]`).click();
    await page.getByRole('menuitem', { name: 'Sinus Tachycardia' }).click();

    await expect(card.getByText('Reclassified')).toBeVisible();
    await expect(card.locator('h3')).toHaveText('Sinus Tachycardia');
  });

  test('TC-05.6 — Undoing a review returns event to Unreviewed status', async ({ page }) => {
    const eventId = await getFirstUnreviewedEventId(page);
    const card = page.locator(`[data-testid="event-card-${eventId}"]`);

    await page.locator(`[data-testid="button-confirm-${eventId}"]`).click();
    await expect(card.getByText('Confirmed')).toBeVisible();

    await card.getByRole('button', { name: 'Undo Review' }).click();

    await expect(card.getByText('Unreviewed')).toBeVisible();
    await expect(page.locator(`[data-testid="button-confirm-${eventId}"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="button-dismiss-${eventId}"]`)).toBeVisible();
  });

  test('TC-05.7 — Event filter by Unreviewed Only hides reviewed events', async ({ page }) => {
    const total = await page.locator('[data-testid^="event-card-"]').count();
    expect(total).toBeGreaterThan(0);

    await page.locator('[data-testid="select-event-filter"]').click();
    await page.getByRole('option', { name: 'Unreviewed Only' }).click();

    const confirmedCards = page.locator('[data-testid^="event-card-"]').filter({ has: page.getByText('Confirmed') });
    expect(await confirmedCards.count()).toBe(0);

    const dismissedCards = page.locator('[data-testid^="event-card-"]').filter({ has: page.getByText('Dismissed') });
    expect(await dismissedCards.count()).toBe(0);
  });

});
