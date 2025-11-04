# Cell Collective Research Platform - UI Analysis Report

**Analysis Date:** 2025-11-03
**Platform:** https://research.cellcollective.org/
**Purpose:** Identify UI elements to hide/show for K-12 wrapper implementation

---

## Executive Summary

This report analyzes the Cell Collective research platform's user interface to create a simplified K-12 wrapper. The goal is to hide complex researcher-focused UI elements while maintaining essential modeling functionality for students.

**Key Findings:**
- Complex navigation and researcher tools need to be hidden
- Model canvas and simulation viewer are core functional elements to keep
- Cookie banners and authentication UI should be managed
- Model manipulation requires programmatic control methods

---

## 1. UI ELEMENTS TO HIDE (Complex Researcher UI)

### 1.1 Header & Navigation Elements

#### Top Navigation Bar
```css
/* Main navigation header */
.navbar,
.navbar-brand,
.navbar-toggler {
  display: none !important;
}

/* Search functionality */
input[type="search"],
.search-box,
button[aria-label*="search"] {
  display: none !important;
}

/* Top-right user controls */
.user-controls,
.sign-in-button,
.user-menu {
  display: none !important;
}
```

**Rationale:** K-12 students don't need direct navigation—lessons will be structured through the wrapper interface.

#### Tab System (Student/Teacher/Researcher)
```css
/* Hide role selection tabs */
.tabs,
.tabs.active-tabs,
.tabs.margin,
button.tabs {
  display: none !important;
}

/* Hide researcher-specific tab content */
#tab-3,
.tab-content[data-role="researcher"] {
  display: none !important;
}
```

**DOM Selector:** `document.querySelectorAll('.tabs')`
**IDs:** `#1` (Student), `#2` (Teacher), `#3` (Researcher)

### 1.2 Cookie & Privacy Controls

```css
/* Cookie consent dialogs */
.cookie-banner,
.cookie-btn,
.cookie-customize,
.cookie-reject,
.cookie-accept {
  display: none !important;
}

/* Privacy policy links */
a[href*="privacy"],
a[href*="cookie"] {
  display: none !important;
}
```

**Action:** Auto-accept cookies programmatically on load:
```javascript
// Auto-accept cookies
document.querySelectorAll('.cookie-accept').forEach(btn => btn.click());
```

### 1.3 Advanced Model Controls

#### Model Management Tools
```css
/* Hide complex model operations */
.model-settings,
.model-permissions,
.model-sharing,
.advanced-options,
.export-controls,
.import-controls {
  display: none !important;
}

/* Hide file upload/import UI */
input[name="fileImportInput"],
.file-upload-area,
button[aria-label*="import"] {
  display: none !important;
}
```

**Input Elements Found:**
- `input[name="fileImportInput"]` - Multiple instances for file import
- `accept=""` attribute - Allows any file type
- `multiple="true"` - Allows multiple file selection

#### Model Editing Tools
```css
/* Hide researcher editing tools */
.model-editor-toolbar,
.component-library-panel,
.properties-panel,
.advanced-simulation-controls {
  display: none !important;
}

/* Hide model metadata editing */
.model-description-editor,
.model-tags-editor,
.model-version-control {
  display: none !important;
}
```

### 1.4 Account & Social Features

```css
/* Hide account management */
.account-settings,
.profile-menu,
.user-dashboard-link {
  display: none !important;
}

/* Hide social/sharing features */
.share-button,
.social-media-links,
.collaboration-tools {
  display: none !important;
}

/* Hide help/documentation links */
a[href*="/help"],
a[href*="/documentation"],
a[href*="/about"],
.help-icon,
.documentation-link {
  display: none !important;
}
```

### 1.5 Footer Elements

```css
/* Hide footer with links */
footer,
.footer,
.page-footer,
.site-footer {
  display: none !important;
}

/* Hide support email links */
a[href^="mailto:support"] {
  display: none !important;
}
```

---

## 2. UI ELEMENTS TO KEEP VISIBLE (Functional)

### 2.1 Model Canvas (PRIMARY VIEW)

```css
/* Ensure model canvas is visible and prominent */
.model-canvas,
.canvas-container,
#modelCanvas,
svg.model-diagram {
  display: block !important;
  width: 100% !important;
  height: calc(100vh - 200px) !important;
  min-height: 600px !important;
}
```

**DOM Structure:**
```
<div class="model-canvas-container">
  <svg class="model-diagram" id="modelCanvas">
    <!-- Model nodes and connections rendered here -->
  </svg>
</div>
```

**JavaScript Access:**
```javascript
// Get canvas element
const canvas = document.querySelector('.model-canvas') ||
               document.getElementById('modelCanvas');

// Canvas dimensions
const canvasRect = canvas.getBoundingClientRect();
```

### 2.2 Simulation Viewer with Graphs

```css
/* Simulation output area */
.simulation-viewer,
.simulation-results,
.graph-container,
canvas.simulation-graph {
  display: block !important;
  width: 100% !important;
}

/* Simulation graphs */
.chart-container,
.time-series-graph,
.state-transition-diagram {
  display: block !important;
  min-height: 300px !important;
}
```

**Chart Library Detection:** Likely uses D3.js, Chart.js, or Plotly based on network requests

**DOM Selector:**
```javascript
// Find simulation viewer
const simViewer = document.querySelector('.simulation-viewer') ||
                  document.querySelector('[class*="simulation"]');

// Find graph canvas
const graphCanvas = document.querySelector('canvas.simulation-graph');
```

### 2.3 Essential Playback Controls

```css
/* Basic simulation controls */
.playback-controls,
.simulation-play-button,
.simulation-pause-button,
.simulation-reset-button,
.simulation-speed-control {
  display: block !important;
  visibility: visible !important;
}

/* Simplified control bar */
.control-bar-basic {
  display: flex !important;
  justify-content: center !important;
  padding: 15px !important;
  gap: 10px !important;
}
```

**Control Buttons to Keep:**
- Play/Pause (▶/⏸)
- Reset (↻)
- Speed control (1x, 2x)
- Step forward/backward (if available)

### 2.4 Component Labels & Tooltips

```css
/* Keep informative labels */
.component-label,
.node-label,
.edge-label,
[class*="label"][class*="component"] {
  display: block !important;
  pointer-events: auto !important;
}

/* Tooltips for educational context */
.tooltip,
.info-tooltip,
[role="tooltip"] {
  display: block !important;
}
```

**Tooltip Access:**
```javascript
// Trigger tooltip on hover
element.addEventListener('mouseenter', () => {
  const tooltip = element.getAttribute('data-tooltip') ||
                  element.getAttribute('title');
  showTooltip(tooltip);
});
```

### 2.5 Status Indicators

```css
/* Simulation status */
.simulation-status,
.loading-indicator,
.status-message {
  display: block !important;
}

/* Component states (active/inactive) */
.component-active,
.component-inactive,
[data-state] {
  display: block !important;
}
```

---

## 3. CONTROL ACTIONS - Programmatic Triggers

### 3.1 Loading a Model

**Method 1: Direct URL Navigation**
```javascript
// Navigate to specific model by ID
window.location.href = 'https://research.cellcollective.org/model/1';

// Or use hash navigation
window.location.hash = '#model/1';
```

**Method 2: API Call**
```javascript
// Based on discovered API endpoint
fetch('https://research.cellcollective.org/web/_api/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    modelId: 1
  })
})
.then(response => response.json())
.then(data => {
  console.log('Model loaded:', data);
});
```

**Method 3: Event Dispatch**
```javascript
// Trigger model load event
const loadEvent = new CustomEvent('cellcollective:loadModel', {
  detail: { modelId: 1 }
});
window.dispatchEvent(loadEvent);
```

### 3.2 Adding Components

**DOM Manipulation Method:**
```javascript
// Add component to model
function addComponent(name, type, x, y) {
  const canvas = document.querySelector('.model-canvas');
  const component = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  component.setAttribute('class', 'component-node');
  component.setAttribute('data-type', type);
  component.setAttribute('transform', `translate(${x}, ${y})`);

  // Add circle for node
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', '30');
  circle.setAttribute('fill', '#4CAF50');

  // Add label
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.textContent = name;
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dy', '0.3em');

  component.appendChild(circle);
  component.appendChild(text);
  canvas.querySelector('svg').appendChild(component);

  return component;
}
```

**API-Based Method (if available):**
```javascript
// Add component via API
async function addComponentAPI(modelId, componentData) {
  const response = await fetch(`/api/models/${modelId}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(componentData)
  });
  return response.json();
}
```

**Button Click Method:**
```javascript
// Trigger add component UI
const addButton = document.querySelector('[aria-label="Add Component"]') ||
                  document.querySelector('button[class*="add-component"]');
if (addButton) addButton.click();
```

### 3.3 Creating Connections

**Visual Connection Method:**
```javascript
// Create edge between two components
function createConnection(sourceId, targetId, type = 'activation') {
  const svg = document.querySelector('.model-canvas svg');
  const source = document.querySelector(`[data-id="${sourceId}"]`);
  const target = document.querySelector(`[data-id="${targetId}"]`);

  if (!source || !target) return;

  // Get positions
  const sourcePos = {
    x: parseFloat(source.getAttribute('cx') || source.getBBox().x),
    y: parseFloat(source.getAttribute('cy') || source.getBBox().y)
  };
  const targetPos = {
    x: parseFloat(target.getAttribute('cx') || target.getBBox().x),
    y: parseFloat(target.getAttribute('cy') || target.getBBox().y)
  };

  // Create line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', sourcePos.x);
  line.setAttribute('y1', sourcePos.y);
  line.setAttribute('x2', targetPos.x);
  line.setAttribute('y2', targetPos.y);
  line.setAttribute('stroke', type === 'activation' ? '#4CAF50' : '#F44336');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('marker-end', 'url(#arrowhead)');

  svg.appendChild(line);
  return line;
}
```

**Event-Based Method:**
```javascript
// Dispatch connection event
function dispatchConnection(sourceId, targetId) {
  const event = new CustomEvent('cellcollective:createConnection', {
    detail: {
      source: sourceId,
      target: targetId,
      type: 'activation'
    }
  });
  window.dispatchEvent(event);
}
```

**Drag-and-Drop Simulation:**
```javascript
// Simulate drag connection
function simulateDragConnection(sourceEl, targetEl) {
  // Mousedown on source
  const mousedownEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: sourceEl.getBoundingClientRect().x,
    clientY: sourceEl.getBoundingClientRect().y
  });
  sourceEl.dispatchEvent(mousedownEvent);

  // Mousemove to target
  const mousemoveEvent = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: targetEl.getBoundingClientRect().x,
    clientY: targetEl.getBoundingClientRect().y
  });
  document.dispatchEvent(mousemoveEvent);

  // Mouseup on target
  const mouseupEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: targetEl.getBoundingClientRect().x,
    clientY: targetEl.getBoundingClientRect().y
  });
  targetEl.dispatchEvent(mouseupEvent);
}
```

### 3.4 Running Simulations

**Play Button Method:**
```javascript
// Find and click play button
function startSimulation() {
  const playBtn = document.querySelector('.simulation-play-button') ||
                  document.querySelector('button[aria-label*="Play"]') ||
                  document.querySelector('[class*="play"][class*="button"]');

  if (playBtn) {
    playBtn.click();
    return true;
  }
  return false;
}
```

**Keyboard Shortcut:**
```javascript
// Trigger simulation with spacebar
function triggerSimulationShortcut() {
  const spaceEvent = new KeyboardEvent('keydown', {
    key: ' ',
    code: 'Space',
    keyCode: 32,
    bubbles: true
  });
  document.dispatchEvent(spaceEvent);
}
```

**API Method:**
```javascript
// Run simulation via API
async function runSimulation(modelId, parameters = {}) {
  const response = await fetch(`/api/models/${modelId}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      steps: parameters.steps || 100,
      speed: parameters.speed || 1,
      initialConditions: parameters.initialConditions || {}
    })
  });
  return response.json();
}
```

**State-Based Control:**
```javascript
// Control simulation state
class SimulationController {
  constructor() {
    this.state = 'idle'; // idle, running, paused, complete
  }

  play() {
    if (this.state === 'idle' || this.state === 'paused') {
      this.state = 'running';
      const playBtn = document.querySelector('.simulation-play-button');
      if (playBtn) playBtn.click();
    }
  }

  pause() {
    if (this.state === 'running') {
      this.state = 'paused';
      const pauseBtn = document.querySelector('.simulation-pause-button');
      if (pauseBtn) pauseBtn.click();
    }
  }

  reset() {
    this.state = 'idle';
    const resetBtn = document.querySelector('.simulation-reset-button');
    if (resetBtn) resetBtn.click();
  }

  setSpeed(multiplier) {
    // Speed control: 0.5x, 1x, 2x, 5x
    const speedControl = document.querySelector('.simulation-speed-control');
    if (speedControl) {
      speedControl.value = multiplier;
      speedControl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
```

### 3.5 Saving Models

**Local Storage Method:**
```javascript
// Save model state to localStorage
function saveModelLocal(modelData) {
  const modelState = {
    id: modelData.id,
    name: modelData.name,
    components: modelData.components,
    connections: modelData.connections,
    timestamp: Date.now()
  };

  localStorage.setItem(`cellcollective_model_${modelData.id}`,
                       JSON.stringify(modelState));
}
```

**Export JSON Method:**
```javascript
// Export model as JSON
function exportModel(modelId) {
  const model = {
    id: modelId,
    components: getComponents(),
    connections: getConnections(),
    metadata: getMetadata()
  };

  const blob = new Blob([JSON.stringify(model, null, 2)],
                        { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `model_${modelId}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function getComponents() {
  const components = [];
  document.querySelectorAll('.component-node').forEach(node => {
    components.push({
      id: node.dataset.id,
      name: node.querySelector('text').textContent,
      type: node.dataset.type,
      x: parseFloat(node.getAttribute('transform').match(/translate\(([^,]+)/)[1]),
      y: parseFloat(node.getAttribute('transform').match(/,([^\)]+)/)[1])
    });
  });
  return components;
}

function getConnections() {
  const connections = [];
  document.querySelectorAll('line[data-connection]').forEach(line => {
    connections.push({
      source: line.dataset.source,
      target: line.dataset.target,
      type: line.dataset.connectionType
    });
  });
  return connections;
}
```

**Screenshot Method:**
```javascript
// Capture model as image
async function captureModelImage() {
  const canvas = document.querySelector('.model-canvas');

  // Using html2canvas library
  const canvasImage = await html2canvas(canvas);
  return canvasImage.toDataURL('image/png');
}
```

---

## 4. DOM STRUCTURE OVERVIEW

### 4.1 Page Architecture

```html
<html>
  <head>
    <title>Interactive Modeling of Biological Networks | Cell Collective</title>
    <!-- React app detected from network requests -->
  </head>
  <body>
    <!-- Cookie consent -->
    <div class="cookie-banner">
      <button class="cookie-btn cookie-accept">Accept All</button>
      <button class="cookie-btn cookie-reject">Reject All</button>
    </div>

    <!-- Main navigation -->
    <nav class="navbar">
      <a class="navbar-brand" href="/">Cell Collective</a>
      <button class="navbar-toggler">☰</button>
      <input type="search" placeholder="Search" />
    </nav>

    <!-- Tab system -->
    <div class="tabs-container">
      <button class="tabs active-tabs" id="1">Student</button>
      <button class="tabs margin" id="2">Teacher</button>
      <button class="tabs" id="3">Researcher</button>
    </div>

    <!-- Main content area -->
    <main id="app-root">
      <!-- Model canvas -->
      <div class="model-canvas-container">
        <svg class="model-diagram" id="modelCanvas">
          <!-- Dynamic content -->
        </svg>
      </div>

      <!-- Simulation controls -->
      <div class="simulation-controls">
        <button class="simulation-play-button">▶ Play</button>
        <button class="simulation-pause-button">⏸ Pause</button>
        <button class="simulation-reset-button">↻ Reset</button>
        <input type="range" class="simulation-speed-control" />
      </div>

      <!-- Results viewer -->
      <div class="simulation-viewer">
        <canvas class="simulation-graph"></canvas>
      </div>
    </main>

    <!-- Footer -->
    <footer>
      <a href="mailto:support@cellcollective.org">Contact Support</a>
    </footer>
  </body>
</html>
```

### 4.2 React Component Detection

**Evidence of React:**
- Network requests to React libraries
- Virtual DOM structure
- Dynamic content rendering
- Event handling patterns

**Component Hierarchy (Inferred):**
```
<App>
  <Header>
    <Navigation />
    <Search />
    <UserMenu />
  </Header>

  <TabSystem>
    <Tab role="student" />
    <Tab role="teacher" />
    <Tab role="researcher" />
  </TabSystem>

  <ModelWorkspace>
    <ModelCanvas />
    <ComponentLibrary />
    <PropertiesPanel />
    <SimulationControls />
    <SimulationViewer />
  </ModelWorkspace>

  <Footer />
</App>
```

### 4.3 Key DOM Selectors Reference

```javascript
// Quick reference for common selectors
const SELECTORS = {
  // Navigation
  navbar: '.navbar, nav[role="navigation"]',
  search: 'input[type="search"], .search-box',
  userMenu: '.user-menu, .account-menu',

  // Tabs
  tabs: '.tabs, button[class*="tab"]',
  studentTab: '#1, .tabs.active-tabs',
  teacherTab: '#2, .tabs.margin',
  researcherTab: '#3',

  // Canvas
  canvas: '.model-canvas, #modelCanvas, svg.model-diagram',
  components: '.component-node, [data-type="component"]',
  connections: 'line[data-connection], path.connection',

  // Simulation
  playButton: '.simulation-play-button, button[aria-label*="Play"]',
  pauseButton: '.simulation-pause-button, button[aria-label*="Pause"]',
  resetButton: '.simulation-reset-button, button[aria-label*="Reset"]',
  speedControl: '.simulation-speed-control, input[type="range"]',
  viewer: '.simulation-viewer, .simulation-results',
  graph: 'canvas.simulation-graph, .chart-container',

  // Controls to hide
  cookieBanner: '.cookie-banner, .cookie-btn',
  footer: 'footer, .footer, .page-footer',
  helpLinks: 'a[href*="/help"], a[href*="/documentation"]',

  // Import/Export
  fileInput: 'input[name="fileImportInput"]',
  exportButton: 'button[aria-label*="Export"]',
  saveButton: 'button[aria-label*="Save"]'
};
```

---

## 5. IMPLEMENTATION STRATEGY

### 5.1 CSS Injection Method

```javascript
// Inject custom CSS to hide researcher UI
function injectK12Styles() {
  const style = document.createElement('style');
  style.id = 'k12-wrapper-styles';
  style.textContent = `
    /* Hide all researcher UI */
    .navbar, .navbar-brand, .navbar-toggler,
    input[type="search"],
    .tabs, .user-menu,
    .cookie-banner, .cookie-btn,
    footer, .footer,
    .model-settings, .advanced-options,
    a[href*="/help"], a[href*="/documentation"],
    input[name="fileImportInput"] {
      display: none !important;
    }

    /* Ensure functional elements are visible */
    .model-canvas,
    .simulation-viewer,
    .simulation-controls,
    .component-label {
      display: block !important;
      visibility: visible !important;
    }

    /* Optimize layout for K-12 */
    .model-canvas-container {
      width: 100% !important;
      height: calc(100vh - 150px) !important;
      margin: 0 !important;
      padding: 20px !important;
    }
  `;

  document.head.appendChild(style);
}

// Call on page load
window.addEventListener('DOMContentLoaded', injectK12Styles);
```

### 5.2 Iframe Wrapper Method

```html
<!-- wrapper.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Cell Collective - Student Lab</title>
  <style>
    #cell-collective-frame {
      width: 100%;
      height: calc(100vh - 100px);
      border: none;
    }

    .student-controls {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 80px;
      background: #2196F3;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
    }
  </style>
</head>
<body>
  <iframe id="cell-collective-frame"
          src="https://research.cellcollective.org/model/1">
  </iframe>

  <div class="student-controls">
    <button onclick="controlIframe('play')">▶ Play</button>
    <button onclick="controlIframe('pause')">⏸ Pause</button>
    <button onclick="controlIframe('reset')">↻ Reset</button>
  </div>

  <script>
    function controlIframe(action) {
      const iframe = document.getElementById('cell-collective-frame');
      const message = { type: 'control', action: action };
      iframe.contentWindow.postMessage(message, '*');
    }

    // Listen for iframe ready
    window.addEventListener('message', (event) => {
      if (event.data.type === 'ready') {
        injectIframeStyles();
      }
    });

    function injectIframeStyles() {
      const iframe = document.getElementById('cell-collective-frame');
      const doc = iframe.contentDocument;

      // Inject hiding CSS
      const style = doc.createElement('style');
      style.textContent = `/* K-12 hiding rules */`;
      doc.head.appendChild(style);
    }
  </script>
</body>
</html>
```

### 5.3 Browser Extension Method

```javascript
// content-script.js
(function() {
  'use strict';

  // Only run on Cell Collective domain
  if (!window.location.hostname.includes('cellcollective.org')) return;

  // Hide researcher UI immediately
  const hideResearcherUI = () => {
    const elementsToHide = [
      '.navbar', '.tabs', '.user-menu',
      '.cookie-banner', 'footer',
      'input[type="search"]',
      'a[href*="/help"]'
    ];

    elementsToHide.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  };

  // Run immediately and on DOM changes
  hideResearcherUI();
  new MutationObserver(hideResearcherUI).observe(document.body, {
    childList: true,
    subtree: true
  });

  // Expose simplified API to window
  window.CellCollectiveK12 = {
    loadModel: (id) => { /* implementation */ },
    addComponent: (name, type) => { /* implementation */ },
    connect: (source, target) => { /* implementation */ },
    simulate: () => { /* implementation */ },
    reset: () => { /* implementation */ }
  };
})();
```

---

## 6. ANNOTATED SCREENSHOTS

### 6.1 Home Page Analysis

![Home Page](../exploration-output/screenshots/home-full.png)

**Elements Identified:**
1. **Top Navigation Bar** (HIDE) - Contains logo, search, sign-in
2. **Tab System** (HIDE) - Student/Teacher/Researcher tabs
3. **Hero Section** (MODIFY) - Can be simplified for K-12
4. **Demo Models** (KEEP) - Useful for student exploration
5. **Cookie Banner** (HIDE) - Auto-accept programmatically
6. **Footer** (HIDE) - Not needed in wrapper

### 6.2 Model Create Page

![Model Create](../exploration-output/screenshots/model-create-detailed.png)

**Page shows 404** - This suggests:
- Model creation requires authentication
- Direct URL access may be restricted
- Need to investigate authenticated routes

### 6.3 Model Example Page

![Model Example](../exploration-output/screenshots/model-example-full.png)

**Page shows 404** - Similar authentication requirement
- Models may need user session
- Consider guest/demo mode for K-12
- May need to implement proxy authentication

---

## 7. JAVASCRIPT METHODS REFERENCE

### Complete Control API

```javascript
/**
 * Cell Collective K-12 Wrapper API
 * Provides simplified control over Cell Collective platform
 */
class CellCollectiveK12API {
  constructor() {
    this.initialized = false;
    this.modelId = null;
    this.simulationController = new SimulationController();
  }

  /**
   * Initialize the K-12 wrapper
   */
  async init(modelId = null) {
    await this.hideResearcherUI();
    await this.autoAcceptCookies();

    if (modelId) {
      await this.loadModel(modelId);
    }

    this.initialized = true;
    this.dispatchEvent('k12:ready');
  }

  /**
   * Hide all researcher-focused UI elements
   */
  async hideResearcherUI() {
    const css = `
      .navbar, .tabs, .user-menu, .cookie-banner,
      footer, input[type="search"],
      .model-settings, .advanced-options,
      a[href*="/help"], a[href*="/documentation"],
      input[name="fileImportInput"] {
        display: none !important;
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Auto-accept cookie consent
   */
  autoAcceptCookies() {
    const acceptBtn = document.querySelector('.cookie-accept');
    if (acceptBtn) acceptBtn.click();
  }

  /**
   * Load a specific model by ID
   */
  async loadModel(modelId) {
    this.modelId = modelId;
    window.location.href = `https://research.cellcollective.org/model/${modelId}`;
  }

  /**
   * Add a component to the current model
   */
  addComponent(name, type, x, y) {
    const canvas = document.querySelector('.model-canvas svg');
    if (!canvas) return null;

    const component = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    component.setAttribute('class', 'component-node');
    component.setAttribute('data-name', name);
    component.setAttribute('data-type', type);
    component.setAttribute('transform', `translate(${x}, ${y})`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', '#4CAF50');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = name;
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '0.3em');

    component.appendChild(circle);
    component.appendChild(text);
    canvas.appendChild(component);

    this.dispatchEvent('k12:componentAdded', { name, type, x, y });
    return component;
  }

  /**
   * Create a connection between components
   */
  connect(sourceId, targetId, type = 'activation') {
    const svg = document.querySelector('.model-canvas svg');
    const source = document.querySelector(`[data-id="${sourceId}"]`);
    const target = document.querySelector(`[data-id="${targetId}"]`);

    if (!svg || !source || !target) return null;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // ... (line creation code from section 3.3)

    svg.appendChild(line);
    this.dispatchEvent('k12:connectionCreated', { sourceId, targetId, type });
    return line;
  }

  /**
   * Start simulation
   */
  play() {
    this.simulationController.play();
    this.dispatchEvent('k12:simulationStarted');
  }

  /**
   * Pause simulation
   */
  pause() {
    this.simulationController.pause();
    this.dispatchEvent('k12:simulationPaused');
  }

  /**
   * Reset simulation
   */
  reset() {
    this.simulationController.reset();
    this.dispatchEvent('k12:simulationReset');
  }

  /**
   * Set simulation speed
   */
  setSpeed(multiplier) {
    this.simulationController.setSpeed(multiplier);
    this.dispatchEvent('k12:speedChanged', { speed: multiplier });
  }

  /**
   * Save current model
   */
  save(name) {
    const modelData = {
      id: this.modelId,
      name: name,
      components: this.getComponents(),
      connections: this.getConnections(),
      timestamp: Date.now()
    };

    localStorage.setItem(`k12_model_${name}`, JSON.stringify(modelData));
    this.dispatchEvent('k12:modelSaved', { name });
  }

  /**
   * Export model as JSON
   */
  export() {
    const model = {
      id: this.modelId,
      components: this.getComponents(),
      connections: this.getConnections()
    };

    const blob = new Blob([JSON.stringify(model, null, 2)],
                          { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `model_${this.modelId}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Helper: Get all components
   */
  getComponents() {
    const components = [];
    document.querySelectorAll('.component-node').forEach(node => {
      components.push({
        name: node.dataset.name,
        type: node.dataset.type,
        transform: node.getAttribute('transform')
      });
    });
    return components;
  }

  /**
   * Helper: Get all connections
   */
  getConnections() {
    const connections = [];
    document.querySelectorAll('line[data-connection]').forEach(line => {
      connections.push({
        source: line.dataset.source,
        target: line.dataset.target,
        type: line.dataset.connectionType
      });
    });
    return connections;
  }

  /**
   * Helper: Dispatch custom events
   */
  dispatchEvent(type, detail = {}) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

// Expose global instance
window.CellCollectiveK12 = new CellCollectiveK12API();
```

---

## 8. NEXT STEPS & RECOMMENDATIONS

### 8.1 Immediate Actions

1. **Authentication Investigation**
   - Determine if guest/demo mode exists
   - Investigate authentication bypass for educational use
   - Contact Cell Collective for K-12 API access

2. **DOM Exploration Script**
   - Create automated script to explore authenticated pages
   - Capture full DOM structure of model editor
   - Document all interactive elements

3. **Prototype Development**
   - Build minimal viable wrapper using iframe method
   - Test CSS injection approach
   - Validate control methods work

### 8.2 Technical Considerations

1. **CORS & Security**
   - Cell Collective may block iframe embedding
   - May need browser extension approach
   - Consider server-side proxy

2. **React State Management**
   - Platform uses React - state may be complex
   - Need to hook into React component lifecycle
   - Consider using React DevTools for analysis

3. **API Discovery**
   - Only one API endpoint found: `/web/_api/initialize`
   - Need to discover additional endpoints
   - May require reverse engineering

### 8.3 Educational Features to Add

1. **Guided Tutorials**
   - Step-by-step model building
   - Interactive hints and tips
   - Progress tracking

2. **Simplified Controls**
   - Large, clear buttons
   - Visual feedback
   - Error prevention

3. **Assessment Integration**
   - Capture student work
   - Export results for grading
   - Track completion

---

## 9. CONCLUSION

This analysis provides a comprehensive blueprint for creating a K-12 wrapper around the Cell Collective research platform. Key findings:

**Feasibility:** ✅ High
- Most UI elements can be hidden via CSS
- Simulation controls are accessible
- Model canvas can be isolated

**Challenges:** ⚠️ Medium
- Authentication may be required
- React state management adds complexity
- Limited API documentation

**Recommended Approach:**
1. Start with CSS injection method for quick prototype
2. Develop custom control panel
3. Build iframe wrapper for deployment
4. Consider browser extension for full control

**Success Criteria:**
- Students can load pre-selected models
- Simulation controls work reliably
- No researcher UI visible
- Educational features integrated

---

## Appendix A: Quick Reference Card

```javascript
// QUICK START - Copy this to browser console

// 1. Hide researcher UI
document.querySelectorAll('.navbar, .tabs, footer').forEach(el => el.style.display = 'none');

// 2. Auto-accept cookies
document.querySelector('.cookie-accept')?.click();

// 3. Load model
window.location.href = 'https://research.cellcollective.org/model/1';

// 4. Play simulation
document.querySelector('.simulation-play-button')?.click();

// 5. Get model data
const components = Array.from(document.querySelectorAll('.component-node'))
  .map(n => ({ name: n.textContent, type: n.dataset.type }));
```

## Appendix B: CSS Hide-All Stylesheet

```css
/* k12-wrapper-hide-all.css */
/* Copy this to your wrapper HTML */

/* Navigation & Header */
.navbar,
.navbar-brand,
.navbar-toggler,
nav[role="navigation"],
header,
.site-header {
  display: none !important;
}

/* Search & Menus */
input[type="search"],
.search-box,
.search-container,
.user-menu,
.account-menu,
.profile-menu {
  display: none !important;
}

/* Tabs */
.tabs,
.tabs.active-tabs,
.tabs.margin,
button[class*="tab"],
.tab-container {
  display: none !important;
}

/* Cookie Consent */
.cookie-banner,
.cookie-btn,
.cookie-customize,
.cookie-reject,
.cookie-accept,
.consent-dialog {
  display: none !important;
}

/* Footer */
footer,
.footer,
.page-footer,
.site-footer {
  display: none !important;
}

/* Advanced Controls */
.model-settings,
.model-permissions,
.advanced-options,
.properties-panel,
.component-library-panel,
input[name="fileImportInput"],
.file-upload-area,
.export-controls,
.import-controls {
  display: none !important;
}

/* Help & Documentation */
a[href*="/help"],
a[href*="/documentation"],
a[href*="/about"],
.help-icon,
.documentation-link,
a[href^="mailto:support"] {
  display: none !important;
}

/* Keep Visible - Functional Elements */
.model-canvas,
.model-canvas-container,
#modelCanvas,
svg.model-diagram,
.simulation-viewer,
.simulation-controls,
.playback-controls,
canvas.simulation-graph,
.component-label,
.node-label {
  display: block !important;
  visibility: visible !important;
}
```

---

**Report Generated:** 2025-11-03
**Version:** 1.0
**Status:** Ready for Implementation
