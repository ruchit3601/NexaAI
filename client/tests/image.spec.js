import { test, expect } from '@playwright/test';

test('Image page generates and displays an image on success', async ({ page }) => {
  await page.route('**/api/image/generate', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ image: 'https://image.pollinations.ai/prompt/test?seed=1' }),
    });
  });

  await page.goto('/image');
  await page.getByPlaceholder('Describe your dream image...').fill('a red bicycle');
  await page.locator('Form button').click();
  await expect(page.locator('img[alt="a red bicycle"]')).toBeVisible();
});

test('Image page shows error on failed generation', async ({ page }) => {
  await page.route('**/api/image/generate', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Image generation failed' }),
    });
  });

  await page.goto('/image');
  await page.getByPlaceholder('Describe your dream image...').fill('a red bicycle');
  await page.locator('Form button').click();
  await expect(page.getByText(/Image generation failed/)).toBeVisible();
});