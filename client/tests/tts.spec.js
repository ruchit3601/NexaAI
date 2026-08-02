import { test, expect } from '@playwright/test';

test('TTS page loads with input and speak button', async ({ page }) => {
  await page.goto('/tts');
  await expect(page.getByPlaceholder('Type something to hear it spoken...')).toBeVisible();
  await expect(page.getByRole('button', { name: /speak/i })).toBeVisible();
});

test('TTS speak button is disabled with empty input', async ({ page }) => {
  await page.goto('/tts');
  await expect(page.getByRole('button', { name: /speak/i })).toBeDisabled();
});

test('TTS speak button enables once text is entered', async ({ page }) => {
  await page.goto('/tts');
  await page.getByPlaceholder('Type something to hear it spoken...').fill('Hello world');
  await expect(page.getByRole('button', { name: /speak/i })).toBeEnabled();
});