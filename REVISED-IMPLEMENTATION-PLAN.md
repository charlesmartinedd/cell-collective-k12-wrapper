# Cell Collective K-12 Wrapper - REVISED Implementation Plan

**Approach:** Hide Cell Collective's complex UI → Keep canvas/controls visible → Add simple K-12 overlay → Configure what to expose

---

## 🎯 Core Strategy

### What Students See:
✅ Model canvas (with existing components)
✅ Simulation viewer (graphs, results)
✅ Our simplified K-12 controls (overlay)

### What Students DON'T See:
❌ Cell Collective's black header/nav
❌ Cell Collective's complex "Add Component" menus
❌ Cell Collective's technical property panels
❌ Cell Collective's researcher-focused UI
❌ Sign-in prompts and distractions

### What We Add:
➕ Simple, beautiful control buttons
➕ Clear, kid-friendly language
➕ Visual feedback and guidance
➕ Configuration system to enable/disable features

---

## 📋 PHASE 1: Manual Inspection (C) - 2-3 hours

### Goal: Understand Cell Collective's UI to know what to hide/keep

### 1.1 Open and Inspect (15 min)

**Steps:**
1. Navigate to http://localhost:5600
2. Open Chrome DevTools (F12)
3. Inspect iframe:
   ```javascript
   // In Console:
   const iframe = document.querySelector('.cell-iframe');
   const doc = iframe.contentDocument;
   console.log(doc.body);
   ```

### 1.2 Document Elements to HIDE (45 min)

**Create list:**
```markdown
## Elements to HIDE (Complex UI)

### Header/Navigation
- [ ] Black top nav bar: `selector: ???`
- [ ] Logo and search: `selector: ???`
- [ ] User menu: `selector: ???`
- [ ] Sign-in prompt: `selector: ???`

### Tabs to Hide
- [ ] Overview tab: `selector: ???`
- [ ] Knowledge Base tab: `selector: ???`
- [ ] Advanced tabs: `selector: ???`

### Complex Menus
- [ ] "Add Component" panel: `selector: ???`
- [ ] Property editors: `selector: ???`
- [ ] Advanced settings: `selector: ???`
- [ ] Export/publish buttons: `selector: ???`

### Distractions
- [ ] Cookie banners: `selector: ???`
- [ ] Tutorial popups: `selector: ???`
- [ ] Ads or promotions: `selector: ???`
```

### 1.3 Document Elements to KEEP VISIBLE (45 min)

**Create list:**
```markdown
## Elements to KEEP VISIBLE (Functional)

### Model Page
- [ ] Model canvas: `selector: ???` (where components live)
- [ ] Existing components: `selector: ???` (genes, proteins)
- [ ] Connections/arrows: `selector: ???`
- [ ] Zoom/pan controls: `selector: ???`

### Simulation/Analysis Page
- [ ] Simulation viewer: `selector: ???`
- [ ] Graphs/charts: `selector: ???`
- [ ] Results display: `selector: ???`
- [ ] Play/pause buttons: `selector: ???` (if simple enough)
```

### 1.4 Document Controls We Need to Trigger (30 min)

**Map our overlay buttons to Cell Collective actions:**
```markdown
## Control Mapping

### Our Simple Button → Cell Collective Action

1. "Add Gene" button → How to add gene?
   - Option A: Click hidden button: `selector: ???`
   - Option B: Call JS function: `function: ???`
   - Option C: postMessage: `{action: 'add', type: 'gene'}`

2. "Connect Components" button → How to create connection?
   - Method: ???
   - Selectors: ???

3. "Run Simulation" button → How to start sim?
   - Button: `selector: ???`
   - Or function: `function: ???`

4. "Save Model" button → How to save?
   - Button: `selector: ???`

[Complete list for ALL controls we want to expose]
```

### 1.5 Create Documentation (30 min)

**File: `CELL-COLLECTIVE-UI-ANALYSIS.md`**

Structure:
```markdown
# Cell Collective UI Analysis

## 1. Elements to Hide
[Complete list with selectors]

## 2. Elements to Keep
[Complete list with selectors]

## 3. Control Actions
[How to trigger each action]

## 4. CSS Hiding Strategy
```css
/* Hide all complex UI */
header.navbar { display: none !important; }
.add-component-panel { display: none !important; }
/* ... complete CSS */
```

## 5. Screenshots
[Annotated images showing what to hide/keep]
```

---

## 📋 PHASE 2: Full Implementation (B) - 12-15 hours

### 2.1 CSS Hiding System (1 hour)

**Hide Cell Collective's complex UI:**

```typescript
// utils/hideComplexUI.ts

export const ELEMENTS_TO_HIDE = [
  // Header/Nav
  'header.main-nav',
  'nav.top-bar',
  '.site-header',

  // Tabs to hide
  '[data-tab="overview"]',
  '[data-tab="knowledge-base"]',
  '.tab-overview',

  // Complex menus
  '.add-component-panel',
  '.component-library',
  '.advanced-properties',

  // Distractions
  '.cookie-banner',
  '.sign-in-prompt',
  '.tutorial-overlay',

  // [Complete list from Phase 1]
];

export function hideComplexUI(iframe: HTMLIFrameElement) {
  const css = ELEMENTS_TO_HIDE
    .map(selector => `${selector} { display: none !important; }`)
    .join('\n');

  injectCSS(iframe, css);
}
```

### 2.2 Keep Canvas/Controls Visible (30 min)

**Ensure functional parts stay visible:**

```typescript
export const ELEMENTS_TO_KEEP_VISIBLE = [
  '.model-canvas',
  '.simulation-viewer',
  '.graph-container',
  '.zoom-controls',
  // [Complete list]
];

// Make sure these aren't accidentally hidden
export function ensureVisibility(iframe: HTMLIFrameElement) {
  const css = ELEMENTS_TO_KEEP_VISIBLE
    .map(selector => `${selector} { display: block !important; visibility: visible !important; }`)
    .join('\n');

  injectCSS(iframe, css);
}
```

### 2.3 Simple K-12 Control Overlay (6 hours)

**Add our beautiful, simple controls:**

#### A. Floating Control Panel (Bottom-Right)
```typescript
// components/overlay/FloatingControlPanel.tsx

export function FloatingControlPanel({ api, config }: Props) {
  return (
    <div className="floating-control-panel">
      <h3>🧬 Model Tools</h3>

      {/* Only show enabled features */}
      {config.features.addComponent && (
        <button onClick={() => api.addGene()} className="control-btn">
          🧬 Add Gene
        </button>
      )}

      {config.features.addProtein && (
        <button onClick={() => api.addProtein()} className="control-btn">
          ⚡ Add Protein
        </button>
      )}

      {config.features.connect && (
        <button onClick={() => startConnection()} className="control-btn">
          🔗 Connect
        </button>
      )}

      {config.features.simulate && (
        <button onClick={() => api.runSimulation()} className="control-btn btn-primary">
          ▶️ Run Simulation
        </button>
      )}

      {config.features.save && (
        <button onClick={() => api.saveModel()} className="control-btn">
          💾 Save
        </button>
      )}
    </div>
  );
}
```

#### B. Configuration System
```typescript
// config/features.ts

export interface FeatureConfig {
  features: {
    // Model building
    addComponent: boolean;
    addGene: boolean;
    addProtein: boolean;
    addInput: boolean;
    addOutput: boolean;
    connect: boolean;
    editComponent: boolean;
    deleteComponent: boolean;

    // Simulation
    simulate: boolean;
    pause: boolean;
    stop: boolean;
    speedControl: boolean;

    // Analysis
    viewGraphs: boolean;
    exportResults: boolean;
    compareRuns: boolean;

    // General
    save: boolean;
    undo: boolean;
    redo: boolean;
    help: boolean;
  };

  ui: {
    showControlPanel: boolean;
    showTopBar: boolean;
    showSidebar: boolean;
    showStatusBar: boolean;
  };
}

// Default: All features enabled
export const DEFAULT_CONFIG: FeatureConfig = {
  features: {
    addComponent: true,
    addGene: true,
    addProtein: true,
    addInput: true,
    addOutput: true,
    connect: true,
    editComponent: true,
    deleteComponent: true,
    simulate: true,
    pause: true,
    stop: true,
    speedControl: true,
    viewGraphs: true,
    exportResults: true,
    compareRuns: true,
    save: true,
    undo: true,
    redo: true,
    help: true
  },
  ui: {
    showControlPanel: true,
    showTopBar: true,
    showSidebar: false, // Start collapsed
    showStatusBar: true
  }
};

// You can create different configs
export const SIMPLE_CONFIG: FeatureConfig = {
  features: {
    addComponent: true,
    addGene: true,
    addProtein: false,  // Disable protein
    addInput: false,
    addOutput: false,
    connect: true,
    editComponent: false,  // Disable editing
    deleteComponent: false,
    simulate: true,
    pause: true,
    stop: false,
    speedControl: false,  // Disable speed control
    viewGraphs: true,
    exportResults: false,
    compareRuns: false,
    save: true,
    undo: true,
    redo: false,
    help: true
  },
  ui: {
    showControlPanel: true,
    showTopBar: true,
    showSidebar: false,
    showStatusBar: false
  }
};
```

#### C. Use Configuration
```typescript
// App.tsx

function App() {
  const [config, setConfig] = useState<FeatureConfig>(DEFAULT_CONFIG);

  return (
    <SimpleCellWrapper>
      <K12Overlay config={config} />

      {/* Admin panel to adjust config (only for you) */}
      {isDev && (
        <ConfigPanel config={config} onChange={setConfig} />
      )}
    </SimpleCellWrapper>
  );
}
```

### 2.4 Control Triggers (3 hours)

**Map our buttons to Cell Collective actions:**

```typescript
// utils/cellCollectiveControl.ts

export class CellCollectiveController {
  private iframe: HTMLIFrameElement;

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  // Trigger "Add Gene" in Cell Collective
  async addGene() {
    // Based on Phase 1 inspection:
    // Option A: Click hidden button
    this.clickButton('[data-action="add-gene"]');

    // Option B: Call JS function
    const win = this.iframe.contentWindow;
    win.CellCollective?.addComponent('gene');

    // Option C: postMessage
    win.postMessage({ action: 'addGene' }, '*');

    // Wait for component to be added
    await this.waitForNewComponent();
  }

  async addProtein() {
    // Similar to addGene
  }

  async createConnection(from: string, to: string, type: 'activates' | 'inhibits') {
    // Based on inspection, trigger connection UI
    this.clickButton('[data-action="create-connection"]');
    this.selectComponent(from);
    this.selectComponent(to);
    this.selectConnectionType(type);
  }

  async runSimulation() {
    // Click run button
    this.clickButton('[data-action="run-simulation"]');
  }

  async saveModel() {
    // Trigger save
    this.clickButton('[data-action="save"]');
  }

  // Helper methods
  private clickButton(selector: string) {
    const doc = this.iframe.contentDocument;
    const button = doc?.querySelector(selector);
    if (button) {
      (button as HTMLElement).click();
    }
  }

  private async waitForNewComponent(): Promise<void> {
    // Watch DOM for new component
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        // Detect new component in canvas
        if (this.detectNewComponent(mutations)) {
          observer.disconnect();
          resolve();
        }
      });

      const canvas = this.iframe.contentDocument.querySelector('.model-canvas');
      observer.observe(canvas, { childList: true, subtree: true });

      // Timeout after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 5000);
    });
  }
}
```

### 2.5 Beautiful UI Components (3 hours)

**Make it look amazing:**

```css
/* overlay-controls.css */

.floating-control-panel {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;
}

.control-btn {
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.control-btn.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
}

.control-btn.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
```

### 2.6 Configuration UI (Admin Only) (1 hour)

**Panel to adjust what students see:**

```typescript
// components/admin/ConfigPanel.tsx

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const toggleFeature = (feature: keyof FeatureConfig['features']) => {
    onChange({
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature]
      }
    });
  };

  return (
    <div className="config-panel">
      <h2>🛠️ Admin Configuration</h2>
      <p>Toggle features to expose to students:</p>

      <div className="feature-toggles">
        <h3>Model Building</h3>
        <label>
          <input
            type="checkbox"
            checked={config.features.addGene}
            onChange={() => toggleFeature('addGene')}
          />
          <span>Add Gene</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={config.features.addProtein}
            onChange={() => toggleFeature('addProtein')}
          />
          <span>Add Protein</span>
        </label>

        {/* ... all other features */}
      </div>

      <div className="config-presets">
        <h3>Presets</h3>
        <button onClick={() => onChange(DEFAULT_CONFIG)}>
          All Features (Default)
        </button>
        <button onClick={() => onChange(SIMPLE_CONFIG)}>
          Simple Mode
        </button>
      </div>

      <div className="config-export">
        <button onClick={() => exportConfig(config)}>
          💾 Export Config
        </button>
        <button onClick={() => importConfig()}>
          📂 Import Config
        </button>
      </div>
    </div>
  );
}
```

### 2.7 Testing & Refinement (2 hours)

**Test everything:**

1. **Hide/Show Testing:**
   - [ ] Cell Collective's complex UI is hidden
   - [ ] Model canvas is visible
   - [ ] Simulation viewer is visible
   - [ ] No broken layouts

2. **Control Testing:**
   - [ ] "Add Gene" button works
   - [ ] "Add Protein" button works
   - [ ] "Connect" button works
   - [ ] "Run Simulation" button works
   - [ ] "Save" button works

3. **Configuration Testing:**
   - [ ] Toggle features on/off
   - [ ] Buttons appear/disappear correctly
   - [ ] Export/import config works

4. **Student Experience:**
   - [ ] Simple, clear interface
   - [ ] No confusing menus visible
   - [ ] Can complete full workflow
   - [ ] Intuitive and obvious

---

## 📊 Final Architecture

```
┌─────────────────────────────────────────────────────────┐
│  🧬 Cell Model Builder                  💾 Save  ⚙️     │ ← Simple top bar
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Cell Collective (Complex UI Hidden)                     │
│  ┌─────────────────────────────────────┐                │
│  │                                      │  ┌───────────┐ │
│  │    Model Canvas                      │  │ 🧬 Tools  │ │
│  │    (Visible)                         │  │           │ │
│  │                                      │  │ Add Gene  │ │
│  │    [Components and connections]      │  │           │ │
│  │                                      │  │ Add       │ │
│  │                                      │  │ Protein   │ │
│  │                                      │  │           │ │
│  │                                      │  │ Connect   │ │
│  │                                      │  │           │ │
│  │                                      │  │ ▶️ Run    │ │
│  │                                      │  │           │ │
│  │                                      │  │ 💾 Save   │ │
│  └─────────────────────────────────────┘  └───────────┘ │
│                                              ↑           │
│                                    Our simple controls  │
│                                    (Floating panel)      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Deliverables

### Phase 1 (Inspection):
1. `CELL-COLLECTIVE-UI-ANALYSIS.md` - Complete UI documentation
2. Screenshots with annotations
3. CSS selectors for hiding/keeping elements
4. Control trigger mappings

### Phase 2 (Implementation):
1. CSS hiding system - removes complex UI
2. Simple K-12 control overlay - floating panel
3. Configuration system - toggle features
4. Admin panel - adjust what students see
5. Complete testing and validation

---

## 🚀 Next Steps

**Start Phase 1 NOW:**

1. Open http://localhost:5600 in Chrome
2. Open DevTools (F12)
3. Inspect Cell Collective iframe
4. Document elements to hide
5. Document elements to keep
6. Document control triggers
7. Create `CELL-COLLECTIVE-UI-ANALYSIS.md`

Then Phase 2:
1. Implement CSS hiding
2. Build simple control overlay
3. Add configuration system
4. Test with students

**Ready to begin! Shall I guide you through the inspection? 🔍**
