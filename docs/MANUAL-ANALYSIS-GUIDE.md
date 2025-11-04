# Manual Dashboard Analysis Guide

Use this guide if automated scraping doesn't work due to authentication or iframe restrictions.

## Step 1: Access Dashboard

1. Open Chrome/Edge browser
2. Navigate to: https://research.cellcollective.org/research/dashboard/
3. Log in with your credentials
4. Open DevTools (F12)

## Step 2: Inspect DOM Structure

### Find Main Containers

Run in Console:
```javascript
// Find all major containers
document.querySelectorAll('[class*="container"], [class*="wrapper"], main, [id*="main"]').forEach(el => {
    console.log({
        tag: el.tagName,
        id: el.id,
        classes: Array.from(el.classList),
        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList)[0]}`
    });
});
```

### Find Header Elements to Hide

Run in Console:
```javascript
// Find header and navigation elements
document.querySelectorAll('header, [class*="header"], [class*="Header"], nav').forEach(el => {
    console.log('HIDE:', {
        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
        text: el.innerText?.substring(0, 50)
    });
});
```

### Find Canvas/Model Area to Keep

Run in Console:
```javascript
// Find canvas or SVG for model building
console.log('Canvas elements:', document.querySelectorAll('canvas'));
console.log('SVG elements:', document.querySelectorAll('svg'));

// Find model workspace
document.querySelectorAll('[class*="model"], [class*="canvas"], [class*="workspace"], [class*="graph"]').forEach(el => {
    console.log('KEEP:', {
        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
        dimensions: {width: el.offsetWidth, height: el.offsetHeight}
    });
});
```

## Step 3: Test Iframe Compatibility

Run in Console:
```javascript
// Check response headers
fetch(window.location.href)
    .then(response => {
        console.log('X-Frame-Options:', response.headers.get('x-frame-options'));
        console.log('CSP:', response.headers.get('content-security-policy'));
    });

// Try to load in iframe
const testIframe = document.createElement('iframe');
testIframe.src = window.location.href;
testIframe.style.width = '500px';
testIframe.style.height = '500px';
document.body.appendChild(testIframe);

setTimeout(() => {
    try {
        console.log('Iframe loaded successfully!');
        console.log('Iframe document:', testIframe.contentDocument);
    } catch (e) {
        console.error('Iframe blocked:', e.message);
    }
}, 3000);
```

## Step 4: Find Control Buttons

Run in Console:
```javascript
// Find all buttons and their actions
document.querySelectorAll('button, [role="button"]').forEach(el => {
    const text = el.innerText || el.textContent;
    if (text.length < 50) {
        console.log({
            text: text.trim(),
            selector: el.id ? `#${el.id}` : `.${el.className.split(' ')[0]}`,
            onclick: el.onclick ? 'Has handler' : 'No handler'
        });
    }
});
```

## Step 5: Monitor Network Requests

1. Go to DevTools > Network tab
2. Click "New Model" button (or similar)
3. Watch for API calls
4. Right-click any API call > Copy > Copy as fetch

Document the API endpoints:
```javascript
// Example API call structure
fetch('https://research.cellcollective.org/api/models', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Note authentication headers
    },
    body: JSON.stringify({
        // Note request body structure
    })
});
```

## Step 6: Test Model Creation

1. Click "New Model" button
2. Note what happens:
   - New page? New modal? Inline editor?
   - What elements appear/disappear?
3. Take screenshots
4. Note selectors of new elements

Run in Console after clicking "New Model":
```javascript
// Analyze model builder interface
console.log({
    current_url: window.location.href,
    toolbars: document.querySelectorAll('[class*="toolbar"], [class*="tools"]'),
    canvas: document.querySelector('canvas'),
    svg: document.querySelector('svg'),
    component_palette: document.querySelectorAll('[class*="component"], [class*="palette"]')
});
```

## Step 7: Export Findings

Copy all console output to:
`projects/cell-collective-k12-wrapper/analysis/manual_findings.txt`

Take screenshots and save to:
`projects/cell-collective-k12-wrapper/screenshots/`

Name screenshots:
- `manual_01_dashboard.png`
- `manual_02_model_builder.png`
- `manual_03_simulation.png`
- etc.

## Step 8: Document CSS Selectors

Create a list of:

**Elements to HIDE:**
```css
/* Example - replace with actual selectors */
.header-main { display: none !important; }
.user-profile-menu { display: none !important; }
.admin-controls { display: none !important; }
```

**Elements to KEEP:**
```css
/* Example - replace with actual selectors */
.model-canvas { display: block !important; }
.simulation-viewer { display: block !important; }
```

## Step 9: Test JavaScript Controls

Try to programmatically trigger actions:

```javascript
// Try to create a new model programmatically
// Look for global objects or functions
console.log('Window objects:', Object.keys(window).filter(k => k.includes('model') || k.includes('cell')));

// Try common patterns
if (window.app) console.log('Found window.app:', window.app);
if (window.Model) console.log('Found window.Model:', window.Model);
if (window.CellCollective) console.log('Found window.CellCollective:', window.CellCollective);
```

## Results Template

Document findings in this format:

```markdown
## Manual Analysis Results

**Date:** [Date]
**Analyst:** [Name]

### Iframe Compatibility
- Can load in iframe: [Yes/No]
- Restrictions: [List]

### Key Selectors

**To Hide:**
1. Header: `[selector]`
2. User menu: `[selector]`
3. Admin panel: `[selector]`

**To Keep:**
1. Model canvas: `[selector]`
2. Simulation viewer: `[selector]`

### API Endpoints
- Create model: `POST /api/models`
- Run simulation: `POST /api/simulate`

### JavaScript Objects
- Global objects: `window.CellCollective`, `window.Model`

### Screenshots
See screenshots folder for visual documentation.
```
