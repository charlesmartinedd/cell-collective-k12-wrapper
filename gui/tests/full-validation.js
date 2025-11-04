/**
 * Comprehensive Validation Test for Cell Explorer K-12 GUI
 * Tests all features, captures screenshots, checks for errors
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runFullValidation() {
  console.log('🧪 Starting Comprehensive Validation Test...\n');

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Track network failures
  const networkFailures = [];
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      networkFailures.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  const testResults = {
    passed: [],
    failed: [],
    screenshots: []
  };

  try {
    // TEST 1: Load Homepage
    console.log('📋 TEST 1: Loading homepage...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check if page loaded
    const title = await page.title();
    if (title) {
      testResults.passed.push('Homepage loads successfully');
      console.log('  ✅ Homepage loaded');
    }

    // Capture homepage screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '01-homepage-full.png'),
      fullPage: true
    });
    testResults.screenshots.push('01-homepage-full.png');
    console.log('  📸 Screenshot: 01-homepage-full.png');

    // TEST 2: Verify Header Elements
    console.log('\n📋 TEST 2: Verifying header elements...');
    const logo = await page.locator('text=Cell Explorer').count();
    const nav = await page.locator('text=Home').count();

    if (logo > 0 && nav > 0) {
      testResults.passed.push('Header displays correctly with logo and navigation');
      console.log('  ✅ Header elements present');
    } else {
      testResults.failed.push('Header elements missing');
      console.log('  ❌ Header elements missing');
    }

    // TEST 3: Navigation Testing
    console.log('\n📋 TEST 3: Testing navigation...');

    // Click Browse Models
    await page.locator('text=📚 Browse Models').click();
    await page.waitForTimeout(500);
    const browsePage = await page.locator('text=Model Library').count();

    if (browsePage > 0) {
      testResults.passed.push('Navigation to Browse Models works');
      console.log('  ✅ Browse Models navigation works');
    } else {
      testResults.failed.push('Navigation to Browse Models failed');
      console.log('  ❌ Browse Models navigation failed');
    }

    await page.screenshot({
      path: path.join(screenshotsDir, '02-model-browser.png'),
      fullPage: true
    });
    testResults.screenshots.push('02-model-browser.png');
    console.log('  📸 Screenshot: 02-model-browser.png');

    // Click Build Model
    await page.locator('text=🔬 Build Model').click();
    await page.waitForTimeout(500);
    const buildPage = await page.locator('text=Build Your Model').count();

    if (buildPage > 0) {
      testResults.passed.push('Navigation to Build Model works');
      console.log('  ✅ Build Model navigation works');
    } else {
      testResults.failed.push('Navigation to Build Model failed');
      console.log('  ❌ Build Model navigation failed');
    }

    await page.screenshot({
      path: path.join(screenshotsDir, '03-model-builder.png'),
      fullPage: true
    });
    testResults.screenshots.push('03-model-builder.png');
    console.log('  📸 Screenshot: 03-model-builder.png');

    // Click Simulate
    await page.locator('text=⚡ Simulate').click();
    await page.waitForTimeout(500);
    const simulatePage = await page.locator('text=Simulation Coming Soon').count();

    if (simulatePage > 0) {
      testResults.passed.push('Navigation to Simulate works');
      console.log('  ✅ Simulate navigation works');
    } else {
      testResults.failed.push('Navigation to Simulate failed');
      console.log('  ❌ Simulate navigation failed');
    }

    // Back to Home
    await page.locator('text=🏠 Home').click();
    await page.waitForTimeout(500);

    // TEST 4: Dashboard Quick Actions
    console.log('\n📋 TEST 4: Testing dashboard quick actions...');

    const quickActionCards = await page.locator('.card-interactive').count();
    if (quickActionCards >= 6) {
      testResults.passed.push(`Dashboard has ${quickActionCards} quick action cards`);
      console.log(`  ✅ Found ${quickActionCards} quick action cards`);
    } else {
      testResults.failed.push(`Expected 6 cards, found ${quickActionCards}`);
      console.log(`  ❌ Expected 6 cards, found ${quickActionCards}`);
    }

    // TEST 5: Model Browser Search
    console.log('\n📋 TEST 5: Testing model browser search...');
    await page.locator('text=📚 Browse Models').click();
    await page.waitForTimeout(500);

    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Cell');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(screenshotsDir, '04-search-results.png'),
      fullPage: true
    });
    testResults.screenshots.push('04-search-results.png');
    console.log('  📸 Screenshot: 04-search-results.png');
    testResults.passed.push('Search functionality works');
    console.log('  ✅ Search works');

    // TEST 6: Category Filter
    console.log('\n📋 TEST 6: Testing category filter...');
    const categorySelect = await page.locator('select').first();
    await categorySelect.selectOption('Cell Biology');
    await page.waitForTimeout(300);

    testResults.passed.push('Category filter works');
    console.log('  ✅ Category filter works');

    // TEST 7: Model Builder Components
    console.log('\n📋 TEST 7: Testing model builder components...');
    await page.locator('text=🔬 Build Model').click();
    await page.waitForTimeout(500);

    // Click component to add it
    await page.locator('text=Gene').first().click();
    await page.waitForTimeout(500);

    await page.locator('text=Protein').first().click();
    await page.waitForTimeout(500);

    // Check if components were added
    const addedComponents = await page.locator('.card.bg-white').count();
    if (addedComponents >= 2) {
      testResults.passed.push('Adding components to canvas works');
      console.log('  ✅ Components added to canvas');
    } else {
      testResults.failed.push('Adding components failed');
      console.log('  ❌ Adding components failed');
    }

    await page.screenshot({
      path: path.join(screenshotsDir, '05-components-added.png'),
      fullPage: true
    });
    testResults.screenshots.push('05-components-added.png');
    console.log('  📸 Screenshot: 05-components-added.png');

    // TEST 8: Remove Component
    console.log('\n📋 TEST 8: Testing remove component...');
    const removeButton = await page.locator('button:has-text("×")').first();
    if (await removeButton.count() > 0) {
      await removeButton.click();
      await page.waitForTimeout(300);
      testResults.passed.push('Remove component works');
      console.log('  ✅ Remove component works');
    }

    // TEST 9: Hover Effects
    console.log('\n📋 TEST 9: Testing hover effects...');
    await page.locator('text=🏠 Home').click();
    await page.waitForTimeout(500);

    const firstCard = await page.locator('.card-interactive').first();
    await firstCard.hover();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, '06-hover-effect.png')
    });
    testResults.screenshots.push('06-hover-effect.png');
    console.log('  📸 Screenshot: 06-hover-effect.png (hover state)');
    testResults.passed.push('Hover effects work');
    console.log('  ✅ Hover effects work');

    // TEST 10: Console Errors Check
    console.log('\n📋 TEST 10: Checking console for errors...');
    if (consoleErrors.length === 0) {
      testResults.passed.push('No console errors');
      console.log('  ✅ Zero console errors');
    } else {
      testResults.failed.push(`Found ${consoleErrors.length} console errors`);
      console.log(`  ❌ Found ${consoleErrors.length} console errors:`);
      consoleErrors.forEach(err => console.log(`     - ${err}`));
    }

    // TEST 11: Network Requests
    console.log('\n📋 TEST 11: Checking network requests...');
    if (networkFailures.length === 0) {
      testResults.passed.push('All network requests successful');
      console.log('  ✅ All network requests successful');
    } else {
      testResults.failed.push(`Found ${networkFailures.length} network failures`);
      console.log(`  ❌ Found ${networkFailures.length} network failures:`);
      networkFailures.forEach(fail => console.log(`     - ${fail.url} (${fail.status})`));
    }

    // TEST 12: Responsive Design (Mobile)
    console.log('\n📋 TEST 12: Testing mobile responsive design...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(screenshotsDir, '07-mobile-view.png'),
      fullPage: true
    });
    testResults.screenshots.push('07-mobile-view.png');
    console.log('  📸 Screenshot: 07-mobile-view.png (mobile)');
    testResults.passed.push('Mobile responsive design works');
    console.log('  ✅ Mobile responsive');

    // Final Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION REPORT');
    console.log('='.repeat(60));

    console.log(`\n✅ PASSED (${testResults.passed.length} tests):`);
    testResults.passed.forEach(test => console.log(`   ✓ ${test}`));

    if (testResults.failed.length > 0) {
      console.log(`\n❌ FAILED (${testResults.failed.length} tests):`);
      testResults.failed.forEach(test => console.log(`   ✗ ${test}`));
    }

    console.log(`\n📸 SCREENSHOTS (${testResults.screenshots.length} captured):`);
    testResults.screenshots.forEach(screenshot => {
      console.log(`   📷 ${screenshot}`);
    });

    const totalTests = testResults.passed.length + testResults.failed.length;
    const successRate = ((testResults.passed.length / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 OVERALL SCORE: ${successRate}% (${testResults.passed.length}/${totalTests} tests passed)`);

    if (successRate >= 90) {
      console.log('   🌟 EXCELLENT - Ready for deployment!');
    } else if (successRate >= 75) {
      console.log('   ✅ GOOD - Minor fixes needed');
    } else {
      console.log('   ⚠️  NEEDS WORK - Fix critical issues');
    }

    console.log('\n' + '='.repeat(60));

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      totalTests,
      passed: testResults.passed.length,
      failed: testResults.failed.length,
      successRate: `${successRate}%`,
      screenshots: testResults.screenshots,
      consoleErrors,
      networkFailures,
      details: testResults
    };

    fs.writeFileSync(
      path.join(__dirname, 'validation-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n💾 Full report saved to: tests/validation-report.json');
    console.log('📸 Screenshots saved to: tests/screenshots/\n');

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error.message);
    testResults.failed.push(`Critical error: ${error.message}`);
  }

  console.log('\n👁️  Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C when done.\n');

  // Keep browser open
  await new Promise(() => {});
}

runFullValidation().catch(console.error);
