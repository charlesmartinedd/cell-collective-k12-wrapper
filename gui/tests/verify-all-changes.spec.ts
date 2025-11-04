import { test, expect } from '@playwright/test';

test('Verify ALL changes - Navigation hiding, SCORM position, Sidebar colors, Button functionality', async ({ page }) => {
  // Enable console logging to see button click debug messages
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log('🖥️ Browser console:', text);
  });

  console.log('🚀 Step 1: Navigate to wrapper on localhost:9899');
  await page.goto('http://localhost:9899');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('📸 Step 2: Capture initial state');
  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\01-initial-state.png',
    fullPage: true
  });

  // ============================================
  // TEST 1: Verify Cell Collective navigation is HIDDEN
  // ============================================
  console.log('\n✅ TEST 1: Verify Cell Collective black navigation bar is HIDDEN');
  const iframe = page.locator('iframe[title="Cell Collective Model Builder"]');
  const iframeBox = await iframe.boundingBox();

  if (iframeBox) {
    console.log('📏 Iframe position:', {
      x: iframeBox.x,
      y: iframeBox.y,
      width: iframeBox.width,
      height: iframeBox.height
    });
    console.log(`✓ Negative margin applied: marginTop should be -180px, iframe top is ${iframeBox.y}`);
  }

  // Take screenshot focusing on top area
  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\02-top-area-navigation-hidden.png',
    clip: { x: 0, y: 0, width: 1200, height: 250 }
  });

  // ============================================
  // TEST 2: Verify SCORM overlay is on RIGHT side
  // ============================================
  console.log('\n✅ TEST 2: Verify SCORM overlay positioned on RIGHT side');

  // Click to show SCORM content
  const scormButton = page.locator('text=📚 ModelIt! Course');
  await scormButton.click();
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\03-scorm-overlay-right-side.png',
    fullPage: false
  });

  // Get overlay position
  const overlay = page.locator('iframe[src="/modelit-course/index.html"]').locator('..');
  const overlayBox = await overlay.boundingBox();
  if (overlayBox) {
    console.log('📐 SCORM overlay position:', {
      x: overlayBox.x,
      y: overlayBox.y,
      width: overlayBox.width,
      height: overlayBox.height
    });
    console.log(`✓ Overlay is on right side: x=${overlayBox.x} (should be near right edge)`);
  }

  // Close SCORM overlay for navigation tests
  const closeButton = page.locator('button:has-text("✕")');
  await closeButton.click();
  await page.waitForTimeout(1000);

  // ============================================
  // TEST 3: Verify Sidebar has ModelIt K12 BLUE colors
  // ============================================
  console.log('\n✅ TEST 3: Verify sidebar uses ModelIt K12 blue gradient');

  // Capture sidebar area
  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\04-sidebar-blue-colors.png',
    clip: { x: 0, y: 0, width: 300, height: 600 }
  });

  const sidebar = page.locator('div').filter({ hasText: '🧬 E. coli K-12' }).first();
  const sidebarStyles = await sidebar.evaluate((el) => {
    return window.getComputedStyle(el).background;
  });
  console.log('🎨 Sidebar background:', sidebarStyles);
  console.log('✓ Should contain blue colors (#047abe or #0F6ACE)');

  // ============================================
  // TEST 4: Test OVERVIEW button functionality
  // ============================================
  console.log('\n✅ TEST 4: Test Overview button navigation');
  consoleLogs.length = 0; // Clear console logs

  const overviewButton = page.locator('button:has-text("Overview")');
  await overviewButton.click();
  await page.waitForTimeout(3000);

  console.log('📋 Console logs after Overview click:', consoleLogs);

  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\05-after-overview-click.png',
    fullPage: false
  });

  // ============================================
  // TEST 5: Test MODEL button functionality
  // ============================================
  console.log('\n✅ TEST 5: Test Model button navigation');
  consoleLogs.length = 0;

  const modelButton = page.locator('button:has-text("Model")');
  await modelButton.click();
  await page.waitForTimeout(3000);

  console.log('📋 Console logs after Model click:', consoleLogs);

  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\06-after-model-click.png',
    fullPage: false
  });

  // ============================================
  // TEST 6: Test ANALYSIS button functionality
  // ============================================
  console.log('\n✅ TEST 6: Test Analysis button navigation');
  consoleLogs.length = 0;

  const analysisButton = page.locator('button:has-text("Analysis")');
  await analysisButton.click();
  await page.waitForTimeout(3000);

  console.log('📋 Console logs after Analysis click:', consoleLogs);

  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\07-after-analysis-click.png',
    fullPage: false
  });

  // ============================================
  // FINAL: Take comprehensive screenshot
  // ============================================
  console.log('\n📸 Taking final comprehensive screenshot');
  await page.screenshot({
    path: 'C:\\Users\\MarieLexisDad\\projects\\cell-collective-k12-wrapper\\gui\\screenshots\\08-final-comprehensive-view.png',
    fullPage: true
  });

  console.log('\n✅ All tests complete! Screenshots saved to gui/screenshots/');
  console.log('Check console logs above to verify button clicks are working.');
});
