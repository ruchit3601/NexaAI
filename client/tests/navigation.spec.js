import { test, expect } from '@playwright/test';

test('homepage loads and displays all module cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('AI Tools Lab')).toBeVisible();
  await expect(page.getByText('Document Q&A')).toBeVisible();
  await expect(page.getByText('Image Generation')).toBeVisible();
  await expect(page.getByText('Speech to Text')).toBeVisible();
  await expect(page.getByText('Text to Speech')).toBeVisible();
  await expect(page.getByText('Vision')).toBeVisible();
});

test('clicking a module card navigates to its page', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Document Q&A').click();
  await expect(page).toHaveURL(/\/rag/);
  await expect(page.getByText('Back to Lab')).toBeVisible();
});

test('back to lab returns to homepage', async ({ page }) => {
  await page.goto('/rag');
  await page.getByText('Back to Lab').click();
  await expect(page).toHaveURL('/');
});