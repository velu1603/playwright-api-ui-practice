import { test, expect } from '@playwright/test';

test('user should open login page', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveTitle(/Login/);
});

//npx playwright test --project=ui-chromium