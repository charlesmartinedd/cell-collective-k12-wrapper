/**
 * Cell Collective Research Platform Explorer
 *
 * Comprehensive site analysis using Playwright:
 * - Screenshots of all major pages
 * - Network traffic capture (API endpoints, data structures)
 * - DOM structure analysis
 * - JavaScript bundle inspection
 * - Feature documentation
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://research.cellcollective.org';
const OUTPUT_DIR = './exploration-output';
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');
const DATA_DIR = path.join(OUTPUT_DIR, 'data');

// Ensure output directories exist
[OUTPUT_DIR, SCREENSHOTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Pages to explore
const PAGES_TO_EXPLORE = [
  { name: 'home', path: '/' },
  { name: 'models', path: '/models' },
  { name: 'model-create', path: '/model/create' },
  { name: 'model-example', path: '/model/1' }, // Will try to find an actual model
  { name: 'about', path: '/about' },
  { name: 'help', path: '/help' },
  { name: 'documentation', path: '/documentation' },
];

// Storage for captured data
const explorationData = {
  pages: {},
  apiEndpoints: [],
  networkRequests: [],
  features: [],
  components: [],
  metadata: {
    exploredAt: new Date().toISOString(),
    baseUrl: BASE_URL
  }
};

async function exploreSite() {
  console.log('🚀 Starting Cell Collective Research Platform exploration...\n');

  // Launch browser with DevTools
  const browser = await chromium.launch({
    headless: false, // Use headed mode to see what's happening
    devtools: true,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  // Capture network traffic
  const networkLog = [];
  page.on('request', request => {
    networkLog.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      headers: request.headers()
    });
  });

  page.on('response', async response => {
    const request = response.request();
    const contentType = response.headers()['content-type'] || '';

    // Capture API responses (JSON data)
    if (contentType.includes('application/json')) {
      try {
        const body = await response.json();
        explorationData.apiEndpoints.push({
          url: response.url(),
          method: request.method(),
          status: response.status(),
          data: body
        });
        console.log(`📡 API Call: ${request.method()} ${response.url()}`);
      } catch (e) {
        // Not valid JSON
      }
    }

    networkLog.push({
      type: 'response',
      url: response.url(),
      status: response.status(),
      contentType: contentType,
      size: response.headers()['content-length']
    });
  });

  // Explore each page
  for (const pageInfo of PAGES_TO_EXPLORE) {
    console.log(`\n📄 Exploring: ${pageInfo.name} (${pageInfo.path})`);

    try {
      const fullUrl = BASE_URL + pageInfo.path;
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for dynamic content to load
      await page.waitForTimeout(3000);

      // Take full page screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}-full.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      console.log(`  📸 Screenshot: ${screenshotPath}`);

      // Take viewport screenshot
      const viewportPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}-viewport.png`);
      await page.screenshot({ path: viewportPath });

      // Extract page structure
      const pageStructure = await page.evaluate(() => {
        // Get all interactive elements
        const buttons = Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent.trim(),
          className: btn.className,
          id: btn.id
        }));

        const links = Array.from(document.querySelectorAll('a')).map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          className: link.className
        }));

        const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          id: input.id
        }));

        // Get navigation structure
        const navElements = Array.from(document.querySelectorAll('nav, [role="navigation"]')).map(nav => ({
          html: nav.innerHTML.substring(0, 500) // Truncate for safety
        }));

        // Get main sections
        const sections = Array.from(document.querySelectorAll('section, main, [role="main"]')).map(section => ({
          tag: section.tagName,
          id: section.id,
          className: section.className
        }));

        return {
          title: document.title,
          url: window.location.href,
          buttons,
          links: links.slice(0, 50), // Limit to first 50 links
          inputs,
          navElements,
          sections,
          bodyClasses: document.body.className
        };
      });

      explorationData.pages[pageInfo.name] = pageStructure;
      console.log(`  ✅ Captured structure: ${pageStructure.buttons.length} buttons, ${pageStructure.inputs.length} inputs`);

      // Look for specific features on certain pages
      if (pageInfo.name === 'model-create') {
        console.log('  🔍 Analyzing model creation interface...');
        const modelFeatures = await page.evaluate(() => {
          // Look for model builder tools
          const tools = Array.from(document.querySelectorAll('[data-tool], [class*="tool"], [class*="palette"]')).map(el => ({
            className: el.className,
            dataAttributes: Object.keys(el.dataset)
          }));

          return { tools };
        });
        explorationData.features.push({
          page: 'model-create',
          features: modelFeatures
        });
      }

    } catch (error) {
      console.log(`  ❌ Error exploring ${pageInfo.name}: ${error.message}`);
      explorationData.pages[pageInfo.name] = { error: error.message };
    }
  }

  // Save network log
  explorationData.networkRequests = networkLog;

  // Save all exploration data
  const dataPath = path.join(DATA_DIR, 'exploration-data.json');
  fs.writeFileSync(dataPath, JSON.stringify(explorationData, null, 2));
  console.log(`\n💾 Saved exploration data: ${dataPath}`);

  // Generate summary report
  const summary = generateSummary(explorationData);
  const summaryPath = path.join(OUTPUT_DIR, 'SUMMARY.md');
  fs.writeFileSync(summaryPath, summary);
  console.log(`📊 Generated summary: ${summaryPath}`);

  console.log('\n✅ Exploration complete!');
  console.log(`\nResults saved to: ${OUTPUT_DIR}`);

  // Keep browser open for manual inspection
  console.log('\n👁️  Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C when done to close.\n');

  // Wait indefinitely (user will close manually)
  await new Promise(() => {});
}

function generateSummary(data) {
  const apiCount = data.apiEndpoints.length;
  const pagesExplored = Object.keys(data.pages).length;
  const totalRequests = data.networkRequests.length;

  let summary = `# Cell Collective Research Platform - Exploration Summary\n\n`;
  summary += `**Explored:** ${data.metadata.exploredAt}\n\n`;
  summary += `## Overview\n\n`;
  summary += `- **Pages Explored:** ${pagesExplored}\n`;
  summary += `- **API Endpoints Discovered:** ${apiCount}\n`;
  summary += `- **Total Network Requests:** ${totalRequests}\n\n`;

  summary += `## Pages\n\n`;
  for (const [pageName, pageData] of Object.entries(data.pages)) {
    if (pageData.error) {
      summary += `### ${pageName} ❌\n\n`;
      summary += `Error: ${pageData.error}\n\n`;
    } else {
      summary += `### ${pageName}\n\n`;
      summary += `- **Title:** ${pageData.title}\n`;
      summary += `- **URL:** ${pageData.url}\n`;
      summary += `- **Buttons:** ${pageData.buttons.length}\n`;
      summary += `- **Links:** ${pageData.links.length}\n`;
      summary += `- **Input Fields:** ${pageData.inputs.length}\n`;
      summary += `- **Sections:** ${pageData.sections.length}\n\n`;
    }
  }

  summary += `## API Endpoints\n\n`;
  if (apiCount > 0) {
    const endpoints = [...new Set(data.apiEndpoints.map(e => `${e.method} ${e.url}`))];
    endpoints.forEach(endpoint => {
      summary += `- ${endpoint}\n`;
    });
  } else {
    summary += `No API endpoints captured (may be using WebSocket or non-JSON APIs)\n`;
  }

  summary += `\n## Network Activity\n\n`;
  const resourceTypes = {};
  data.networkRequests.forEach(req => {
    if (req.resourceType) {
      resourceTypes[req.resourceType] = (resourceTypes[req.resourceType] || 0) + 1;
    }
  });

  summary += `### Resource Types\n\n`;
  for (const [type, count] of Object.entries(resourceTypes)) {
    summary += `- **${type}:** ${count}\n`;
  }

  summary += `\n## Next Steps\n\n`;
  summary += `1. Review screenshots in \`screenshots/\` directory\n`;
  summary += `2. Analyze API endpoints in \`data/exploration-data.json\`\n`;
  summary += `3. Design K-12 wrapper based on discovered features\n`;
  summary += `4. Build modular component system\n`;

  return summary;
}

// Run exploration
exploreSite().catch(console.error);
