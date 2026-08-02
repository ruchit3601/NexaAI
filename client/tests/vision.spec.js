import {test ,expect} from '@playwright/test';

test('Vision page shows description after successful upload', async ({ page }) => {
    await page.route('**/api/vision/analyze', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'appication/json',
            body: JSON.stringify({description: 'A beautiful Mountain Covered in Snow'}),
        });
    }) ;
    await page.goto('/vision');
    await page.setInputFiles('input[type="file"]', {
        name: 'test.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image content'),
    });
    await page.getByRole('button', {name: /analyze/i}).click();
    await expect(page.getByText(/A beautiful Mountain Covered in Snow/)).toBeVisible();
});


test('Vision page shows error on failed analysis', async ({ page }) => {
  await page.route('**/api/vision/analyze', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Failed to analyze image' }),
    });
  });

  await page.goto('/vision');
  await page.setInputFiles('input[type="file"]', {
    name: 'test.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake-png-bytes'),
  });
  await page.getByRole('button', { name: /analyze/i }).click();
  await expect(page.getByText(/Failed to analyze image/)).toBeVisible();
});
