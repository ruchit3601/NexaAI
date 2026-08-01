import { test, expect } from '@playwright/test';

test('RAG page shows upload success state', async ({ page }) => {
  await page.route('**/api/rag/upload', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ docId: 'test-doc-123', chunksStored: 4 }),
    });
  });

  await page.goto('/rag');
  await page.setInputFiles('input[type="file"]', {
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 fake content'),
  });

  await expect(page.getByText(/Stored 4 chunks/)).toBeVisible();
});

test('RAG page shows error state on failed upload', async ({ page }) => {
  await page.route('**/api/rag/upload', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Failed to process document' }),
    });
  });

  await page.goto('/rag');
  await page.setInputFiles('input[type="file"]', {
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 fake content'),
  });

  await expect(page.getByText(/Failed to process document/)).toBeVisible();
});