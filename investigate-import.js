/**
 * Investigate Cell Collective Import Functionality
 * What file types can be imported for logical models?
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function investigateImport() {
  console.log('🔍 Investigating Cell Collective import functionality...\n');

  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Go to model creation page
  console.log('📄 Navigating to model creation...');
  await page.goto('https://research.cellcollective.org/model/create', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(3000);

  // Take screenshot of create page
  await page.screenshot({
    path: './exploration-output/screenshots/model-create-detailed.png',
    fullPage: true
  });
  console.log('📸 Screenshot captured: model-create-detailed.png');

  // Look for import functionality
  const importInfo = await page.evaluate(() => {
    // Find file input elements
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));

    const importData = fileInputs.map(input => ({
      id: input.id,
      name: input.name,
      accept: input.accept, // This tells us accepted file types!
      multiple: input.multiple,
      className: input.className,
      parent: input.parentElement.className
    }));

    // Find any "import" related buttons or links
    const importButtons = Array.from(document.querySelectorAll('button, a'))
      .filter(el => {
        const text = el.textContent.toLowerCase();
        return text.includes('import') || text.includes('upload') || text.includes('load');
      })
      .map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        className: el.className,
        id: el.id
      }));

    return {
      fileInputs: importData,
      importButtons: importButtons
    };
  });

  console.log('\n📋 Import Information Found:');
  console.log(JSON.stringify(importInfo, null, 2));

  // Try clicking on "import" or "new model" options
  try {
    // Look for navigation to import page
    const importLinks = await page.locator('text=/import/i, text=/upload/i, text=/load/i').all();

    if (importLinks.length > 0) {
      console.log(`\n🔗 Found ${importLinks.length} import-related links/buttons`);

      // Click the first one to see what happens
      await importLinks[0].click();
      await page.waitForTimeout(2000);

      // Capture screenshot after clicking
      await page.screenshot({
        path: './exploration-output/screenshots/import-page.png',
        fullPage: true
      });
      console.log('📸 Screenshot captured: import-page.png');

      // Check for file inputs again
      const importPageInfo = await page.evaluate(() => {
        const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
        return fileInputs.map(input => ({
          accept: input.accept,
          id: input.id,
          name: input.name
        }));
      });

      console.log('\n📋 File inputs on import page:');
      console.log(JSON.stringify(importPageInfo, null, 2));
    }
  } catch (error) {
    console.log(`ℹ️  Could not navigate to import: ${error.message}`);
  }

  // Save investigation results
  const report = {
    timestamp: new Date().toISOString(),
    importInfo: importInfo,
    notes: 'Investigated import functionality for logical models'
  };

  fs.writeFileSync(
    './exploration-output/data/import-investigation.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n💾 Investigation results saved to: import-investigation.json');
  console.log('\n👁️  Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C when done.\n');

  // Keep browser open
  await new Promise(() => {});
}

investigateImport().catch(console.error);
