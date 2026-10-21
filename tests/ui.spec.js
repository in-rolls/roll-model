import { test, expect } from '@playwright/test';

test('the explorer filters, sorts, exports, and resets synthetic records', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Roll Model — an electoral roll interface demo');
  await expect(page.getByRole('link', { name: 'Roll Model home' })).toBeVisible();
  await expect(page.locator('#result-count')).toHaveText('144 example records found');

  await page.locator('#state-filter').selectOption('Demo State B');
  await page.locator('#year-filter').selectOption('2024');
  await page.locator('#constituency-filter').selectOption('Example Coast');
  await expect(page.locator('#result-count')).toHaveText('12 example records found');

  await page.locator('#search-filter').fill('Example Ward 1');
  await expect(page.locator('#result-count')).toHaveText('4 example records found');
  await page.locator('button[data-sort="age"]').click();
  await expect(page.locator('th[data-key="age"]')).toHaveAttribute('aria-sort', 'ascending');

  const download_event = page.waitForEvent('download');
  await page.locator('#download-button').click();
  const download = await download_event;
  expect(download.suggestedFilename()).toBe('roll-model-synthetic-demo.csv');
  const fs = await import('node:fs/promises');
  const csv = await fs.readFile(await download.path(), 'utf8');
  expect(csv.match(/DEMO-/g)).toHaveLength(4);

  await page.locator('#reset-button').click();
  await expect(page.locator('#result-count')).toHaveText('144 example records found');
});

test('the explorer remains usable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /make records/i })).toBeVisible();
  await page.locator('#state-filter').selectOption('Demo State C');
  await expect(page.locator('#result-count')).toHaveText('48 example records found');
  await expect(page.locator('#results-body tr')).toHaveCount(12);
});
