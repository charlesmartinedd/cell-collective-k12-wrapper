/**
 * Capture BEAUTIFUL screenshots showing the actual design
 * With Tailwind CSS properly compiled!
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureBeautifulScreenshots() {
  console.log('📸 Capturing BEAUTIFUL screenshots with full CSS...\n');

  const screenshotsDir = path.join(__dirname, 'beautiful-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Load homepage
    console.log('🏠 Loading homepage with beautiful design...');
    await page.goto('http://localhost:5605', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for all CSS to load

    // Capture full homepage
    await page.screenshot({
      path: path.join(screenshotsDir, 'homepage-beautiful.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: homepage-beautiful.png');

    // Capture viewport (above the fold)
    await page.screenshot({
      path: path.join(screenshotsDir, 'homepage-hero.png')
    });
    console.log('  ✅ Captured: homepage-hero.png');

    // Browse Models
    console.log('\n📚 Navigating to Model Browser...');
    await page.locator('text=📚 Browse Models').click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, 'model-browser-beautiful.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: model-browser-beautiful.png');

    // Type in search to show interaction
    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Cell');
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, 'model-browser-search.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: model-browser-search.png');

    // Build Model
    console.log('\n🔬 Navigating to Model Builder...');
    await page.locator('text=🔬 Build Model').click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, 'model-builder-empty.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: model-builder-empty.png');

    // Add components
    console.log('\n➕ Adding components to canvas...');
    await page.locator('text=Gene').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Protein').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Receptor').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, 'model-builder-with-components.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: model-builder-with-components.png');

    // Hover over a card
    console.log('\n🎨 Capturing hover effects...');
    await page.locator('text=🏠 Home').click();
    await page.waitForTimeout(1000);

    const firstCard = await page.locator('.card-interactive').first();
    await firstCard.hover();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, 'homepage-hover-effect.png')
    });
    console.log('  ✅ Captured: homepage-hover-effect.png');

    // Mobile view
    console.log('\n📱 Capturing mobile responsive design...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, 'mobile-homepage.png'),
      fullPage: true
    });
    console.log('  ✅ Captured: mobile-homepage.png');

    console.log('\n' + '='.repeat(60));
    console.log('✨ BEAUTIFUL SCREENSHOTS CAPTURED!');
    console.log('='.repeat(60));
    console.log('\n📁 Location: tests/beautiful-screenshots/');
    console.log('\n📸 Files:');
    console.log('   - homepage-beautiful.png (full page)');
    console.log('   - homepage-hero.png (above fold)');
    console.log('   - model-browser-beautiful.png');
    console.log('   - model-browser-search.png');
    console.log('   - model-builder-empty.png');
    console.log('   - model-builder-with-components.png');
    console.log('   - homepage-hover-effect.png');
    console.log('   - mobile-homepage.png');
    console.log('\n🎨 These screenshots show the ACTUAL beautiful design!');
    console.log('   - Gradient backgrounds');
    console.log('   - Glass morphism header');
    console.log('   - Colorful emoji icons');
    console.log('   - Smooth shadows and rounded corners');
    console.log('   - Professional Apple/Microsoft polish');
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('👁️  Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C when done.\n');

  // Keep browser open
  await new Promise(() => {});
}

captureBeautifulScreenshots().catch(console.error);
