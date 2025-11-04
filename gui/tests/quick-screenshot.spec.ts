import { test } from '@playwright/test';

test('Quick screenshot of updated interface', async ({ page }) => {
  console.log('🚀 Loading updated wrapper...');
  await page.goto('http://localhost:9899');
  await page.waitForTimeout(5000);

  console.log('📸 Capturing screenshot...');
  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\FINAL-updated-interface.png',
    fullPage: true
  });

  console.log('✅ Screenshot saved!');
});
