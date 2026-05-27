import { test, expect } from '@playwright/test';

test('User should be able to go to booking page', async ({ page }) => {
  await page.goto('/#booking');

  await expect(page).toHaveTitle('Restful-booker-platform demo');
});

//npx playwright test --project=ui-chromium