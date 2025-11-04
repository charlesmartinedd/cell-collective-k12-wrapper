# Cell Collective K-12 Wrapper - Full Implementation Plan

**Strategy:** Manual inspection first → Full overlay implementation → Then decide what to remove
**Goal:** Complete K-12 overlay for Model and Analysis pages with 100% functionality, simplified UI

---

## 🎯 Two-Phase Approach

### Phase 1: Manual Inspection & Documentation (2-3 hours)
Deep dive into Cell Collective's actual UI to understand every control, button, and interaction

### Phase 2: Full Overlay Implementation (12-15 hours)
Build beautiful K-12 overlay that exposes ALL functionality from both pages in simplified way

---

## 📋 PHASE 1: Manual Chrome DevTools Inspection

### 1.1 Setup & Access (15 min)

**Steps:**
1. Open http://localhost:5600 (our wrapper with Cell Collective iframe)
2. Open Chrome DevTools (F12)
3. Navigate to iframe:
   - DevTools → Elements tab
   - Find `<iframe>` element
   - Right-click → "Inspect"
   - Or use Console: `document.querySelector('.cell-iframe').contentDocument`

4. Navigate within Cell Collective:
   - Go to Models page
   - Open a specific model (e.g., model/1)
   - Switch to Model tab
   - Switch to Analysis tab
   - Document each view

**Deliverable:**
- Access confirmed to iframe contents
- Navigation working within Cell Collective
- DevTools set up for inspection

---

### 1.2 Model Page Inspection (1 hour)

**What to Document:**

#### A. Header/Navigation Bar
```markdown
**Black Header Bar:**
- Element: `<header class="...">`
- Selector: `.header-bar` or `nav.top-navigation`
- Contains: Logo, Search, User menu, Sign in
- Height: [measure in DevTools]
- Background color: [note exact color]
- Z-index: [check stacking]

**Screenshots:**
- Full header with annotations
- Hover states
- Dropdown menus
```

#### B. Tab Navigation
```markdown
**Tab Bar:**
- Location: Below header or sidebar?
- Tabs visible:
  1. Overview (selector: ?)
  2. Model (selector: ?)
  3. Simulation (selector: ?)
  4. Analysis (selector: ?)
  5. Network Analysis (selector: ?)
  6. Knowledge Base (selector: ?)

**For each tab:**
- CSS selector
- Active state class
- Click event target
- JavaScript function called
```

#### C. Model Builder Interface
```markdown
**Canvas Area:**
- Element: `<div class="model-canvas">` or similar
- Dimensions: [width x height]
- Contains: Components, connections, zoom controls

**Component Panel/Palette:**
- Location: Left sidebar? Right sidebar? Bottom?
- Add component button: [selector]
- Component types available: [list all]
- How to trigger: [click, drag, etc.]

**Connection Tools:**
- How to create connection: [drag? click twice?]
- Connection type selector: [selector]
- Edit connection: [how?]
- Delete connection: [how?]

**Zoom/Pan Controls:**
- Zoom in button: [selector]
- Zoom out button: [selector]
- Pan: [drag canvas? or separate tool?]
- Fit to screen: [selector]

**Component Properties:**
- How to edit component: [click? right-click?]
- Properties panel: [location, selector]
- Editable fields: [name, type, etc.]
- Save button: [selector]

**Model Controls:**
- Save model: [selector]
- Export: [selector]
- Share: [selector]
- Duplicate: [selector]
```

#### D. Sidebar/Panels
```markdown
**Left Sidebar:**
- Collapsible? [yes/no]
- Contains: [list everything]
- Toggle button: [selector]

**Right Sidebar:**
- Contains: [list everything]
- Properties panel: [selector]
- Help panel: [selector]

**Bottom Panel:**
- Console/logs: [selector]
- Status messages: [selector]
```

#### E. Toolbar/Actions
```markdown
**Top Toolbar:**
- Buttons: [list all with selectors]
- Icons: [note which icons for what actions]

**Context Menu (Right-click):**
- Opens where: [on component? on canvas?]
- Menu items: [list all]
- Selectors: [document]
```

---

### 1.3 Analysis Page Inspection (45 min)

**What to Document:**

#### A. Analysis Controls
```markdown
**Run Simulation:**
- Button location: [selector]
- Start simulation: [selector + event]
- Pause: [selector]
- Stop: [selector]
- Reset: [selector]

**Simulation Settings:**
- Speed control: [slider? dropdown?]
- Time range: [input fields]
- Initial conditions: [where to set?]
- Advanced options: [panel location]
```

#### B. Results Display
```markdown
**Graph/Chart Area:**
- Chart library used: [identify - D3? Plotly? Custom?]
- Container: [selector]
- Multiple graphs: [how many? layout?]
- Legend: [location, selector]

**Graph Controls:**
- Export graph: [selector]
- Zoom: [controls]
- Pan: [controls]
- Toggle series: [checkboxes? legend clicks?]
- Compare results: [how?]
```

#### C. Data Tables
```markdown
**Data Display:**
- Table location: [selector]
- Columns: [list all]
- Sort: [how?]
- Filter: [controls]
- Export: [CSV? Excel?]
```

#### D. Analysis Tools
```markdown
**Additional Analysis:**
- Parameter sweep: [location, controls]
- Sensitivity analysis: [location, controls]
- Comparison tools: [selectors]
- Custom analysis: [what's available?]
```

---

### 1.4 Common Elements (30 min)

**Elements Present on Both Pages:**

#### A. Footer
```markdown
**Footer:**
- Selector: [footer tag? class?]
- Contains: [links, copyright, etc.]
- Hide? [yes/no - decide later]
```

#### B. Modals/Dialogs
```markdown
**Dialog Types:**
1. Save dialog: [selector, trigger]
2. Share dialog: [selector]
3. Settings: [selector]
4. Help/Tutorial: [selector]
5. Error messages: [selector]

**For each:**
- How triggered
- Close button selector
- Overlay selector
- z-index
```

#### C. Loading States
```markdown
**Loading Indicators:**
- Spinner: [selector, when shown]
- Progress bar: [selector]
- Loading overlay: [selector]
```

---

### 1.5 JavaScript Event System (30 min)

**Understand How Cell Collective Works:**

```javascript
// In Chrome DevTools Console:

// 1. Find global objects
console.log(window.CellCollective); // or similar
console.log(window.app); // common pattern

// 2. Test event listeners
const modelCanvas = document.querySelector('[class*="model-canvas"]');
console.log(getEventListeners(modelCanvas));

// 3. Find API functions
Object.keys(window).filter(key => key.includes('Cell') || key.includes('Model'));

// 4. Test triggering actions
// Try clicking buttons programmatically
document.querySelector('[data-action="add-component"]').click();

// 5. Check for postMessage support
window.addEventListener('message', (e) => {
  console.log('postMessage received:', e.data);
});
```

**Document:**
- Global objects available
- API functions we can call
- Event listeners we can trigger
- postMessage support (if any)

---

### 1.6 Create Comprehensive Documentation (30 min)

**File: `CELL-COLLECTIVE-UI-ANALYSIS.md`**

**Structure:**
```markdown
# Cell Collective UI Analysis

## 1. Overview
- Site structure
- Navigation flow
- Key areas

## 2. Model Page
### 2.1 Layout
- [Annotated screenshot]
- Element hierarchy

### 2.2 Elements to Hide
- Black header: `selector1`
- Sign-in prompt: `selector2`
- Tabs to hide: `selector3, selector4`
- [Complete list]

### 2.3 Elements to Keep/Control
- Model canvas: `selector`
- Component palette: `selector`
- [Complete list with how to control]

### 2.4 JavaScript Controls
- Add component: `function()`
- Create connection: `function()`
- [Complete API]

## 3. Analysis Page
### 3.1 Layout
- [Annotated screenshot]

### 3.2 Elements to Hide
- [List]

### 3.3 Elements to Keep/Control
- [List with controls]

### 3.4 JavaScript Controls
- Run simulation: `function()`
- [Complete API]

## 4. CSS Injection Strategy
```css
/* Hide header */
header.main-nav { display: none !important; }

/* Hide tabs */
[data-tab="overview"] { display: none !important; }

/* [Complete CSS] */
```

## 5. JavaScript Control Strategy
```javascript
// Control Cell Collective
const cellCollective = iframe.contentWindow;

function addComponent(type) {
  // Implementation
}

function runSimulation() {
  // Implementation
}

// [Complete control functions]
```

## 6. Screenshots
- model-page-annotated.png
- analysis-page-annotated.png
- element-hierarchy.png
- [All screenshots with annotations]
```

---

## 📋 PHASE 2: Full Overlay Implementation

### 2.1 Architecture Design (2 hours)

**Based on inspection findings, design:**

#### A. Overlay Component Hierarchy
```
K12OverlayController
├── TopControlBar
│   ├── ModelName
│   ├── SaveButton
│   ├── UndoRedo
│   └── SettingsMenu
│
├── LeftSidebar (collapsible)
│   ├── NavigationPanel
│   │   ├── MyModels
│   │   ├── BrowseModels
│   │   └── CreateNew
│   │
│   ├── ModelToolsPanel (when on Model page)
│   │   ├── QuickAddPanel
│   │   ├── ConnectionWizard
│   │   └── EditTools
│   │
│   └── AnalysisToolsPanel (when on Analysis page)
│       ├── SimulationControls
│       ├── GraphControls
│       └── ExportTools
│
├── RightSidebar (collapsible)
│   ├── PropertiesPanel
│   ├── HelpPanel
│   └── HistoryPanel
│
├── BottomStatusBar
│   ├── StatusMessages
│   ├── ProgressIndicator
│   └── KeyboardShortcuts
│
└── FloatingActionButton
    └── Context-aware primary action
```

#### B. State Management
```typescript
interface K12OverlayState {
  // Current view
  currentPage: 'model' | 'analysis';
  currentModelId: string | null;

  // UI state
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activePanel: string | null;

  // Model editing
  selectedComponents: Component[];
  connectionMode: boolean;
  connectionState: ConnectionWizardState;

  // Simulation
  isSimulating: boolean;
  simulationProgress: number;
  simulationResults: SimulationResult | null;

  // User actions
  undoStack: Action[];
  redoStack: Action[];

  // Cell Collective communication
  iframeReady: boolean;
  cellCollectiveAPI: CellCollectiveAPI;
}
```

#### C. Styling System
```css
/* Theme variables */
:root {
  /* K-12 friendly colors */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-green: #10b981;
  --accent-yellow: #fbbf24;
  --accent-red: #ef4444;
  --accent-blue: #3b82f6;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Shadows */
  --shadow-overlay: 0 10px 40px rgba(0, 0, 0, 0.15);
  --shadow-panel: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-button: 0 2px 8px rgba(0, 0, 0, 0.08);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-medium: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Z-index layers */
  --z-iframe: 1;
  --z-overlay-base: 10;
  --z-sidebar: 20;
  --z-toolbar: 30;
  --z-modal: 100;
  --z-tooltip: 200;
}
```

---

### 2.2 Core Infrastructure (3 hours)

#### A. CSS Injection System
```typescript
// utils/cssInjection.ts

export class CSSInjector {
  private iframe: HTMLIFrameElement;
  private injectedStyles: Map<string, HTMLStyleElement> = new Map();

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  injectStyles(id: string, css: string): boolean {
    try {
      const doc = this.iframe.contentDocument;
      if (!doc) return false;

      // Remove existing style with this ID
      const existing = this.injectedStyles.get(id);
      if (existing) {
        existing.remove();
      }

      // Create new style element
      const style = doc.createElement('style');
      style.id = `k12-overlay-${id}`;
      style.textContent = css;
      doc.head.appendChild(style);

      this.injectedStyles.set(id, style);
      return true;
    } catch (err) {
      console.error('Failed to inject CSS:', err);
      return false;
    }
  }

  hideElements(selectors: string[]): boolean {
    const css = selectors.map(sel => `${sel} { display: none !important; }`).join('\n');
    return this.injectStyles('hide-elements', css);
  }

  cleanup(): void {
    this.injectedStyles.forEach(style => style.remove());
    this.injectedStyles.clear();
  }
}

// Usage:
const injector = new CSSInjector(iframeRef.current);

// Hide Cell Collective's UI elements
injector.hideElements([
  'header.main-nav',
  '[data-tab="overview"]',
  '[data-tab="knowledge-base"]',
  '.sign-in-prompt',
  '.researcher-tools'
]);
```

#### B. Cell Collective API Wrapper
```typescript
// utils/cellCollectiveAPI.ts

export class CellCollectiveAPI {
  private iframe: HTMLIFrameElement;
  private window: Window | null = null;

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.window = iframe.contentWindow;
  }

  // Model operations
  async addComponent(type: ComponentType, properties?: ComponentProperties): Promise<Component> {
    // Try postMessage first
    if (await this.tryPostMessage('ADD_COMPONENT', { type, properties })) {
      return this.waitForResponse('COMPONENT_ADDED');
    }

    // Fallback: Direct DOM manipulation
    return this.triggerAddComponentUI(type);
  }

  async createConnection(from: ComponentId, to: ComponentId, type: ConnectionType): Promise<Connection> {
    if (await this.tryPostMessage('CREATE_CONNECTION', { from, to, type })) {
      return this.waitForResponse('CONNECTION_CREATED');
    }

    return this.triggerCreateConnectionUI(from, to, type);
  }

  async runSimulation(settings?: SimulationSettings): Promise<void> {
    if (await this.tryPostMessage('RUN_SIMULATION', settings)) {
      return;
    }

    this.clickButton('[data-action="run-simulation"]');
  }

  // Helper methods
  private async tryPostMessage(action: string, data: any): Promise<boolean> {
    if (!this.window) return false;

    try {
      this.window.postMessage({ action, data, source: 'k12-overlay' }, '*');
      return true;
    } catch (err) {
      return false;
    }
  }

  private clickButton(selector: string): boolean {
    try {
      const doc = this.iframe.contentDocument;
      const button = doc?.querySelector(selector) as HTMLButtonElement;
      if (button) {
        button.click();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  private triggerAddComponentUI(type: ComponentType): Promise<Component> {
    // Open Cell Collective's add component dialog
    this.clickButton('[data-action="add-component"]');

    // Select component type
    this.clickButton(`[data-component-type="${type}"]`);

    // Return promise that resolves when component is added
    return this.waitForComponentAdded();
  }

  private waitForComponentAdded(): Promise<Component> {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        // Watch for new component in DOM
        const newComponent = this.detectNewComponent(mutations);
        if (newComponent) {
          observer.disconnect();
          resolve(newComponent);
        }
      });

      const doc = this.iframe.contentDocument;
      observer.observe(doc.querySelector('.model-canvas'), {
        childList: true,
        subtree: true
      });
    });
  }
}
```

#### C. Communication Bridge
```typescript
// hooks/useCellCollectiveControl.ts

export function useCellCollectiveControl(iframeRef: RefObject<HTMLIFrameElement>) {
  const [api, setApi] = useState<CellCollectiveAPI | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;

    // Wait for iframe to load
    const handleLoad = () => {
      const cellAPI = new CellCollectiveAPI(iframe);
      setApi(cellAPI);
      setIsReady(true);

      // Inject CSS to hide elements
      const injector = new CSSInjector(iframe);
      injector.hideElements(ELEMENTS_TO_HIDE);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [iframeRef]);

  // Listen for messages from Cell Collective
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://research.cellcollective.org') {
        handleCellCollectiveMessage(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { api, isReady };
}
```

---

### 2.3 Model Page Overlay (4 hours)

#### A. TopControlBar Component
```typescript
// components/overlay/TopControlBar.tsx

interface TopControlBarProps {
  modelName: string;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export function TopControlBar({
  modelName,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving
}: TopControlBarProps) {
  return (
    <div className="top-control-bar">
      <div className="control-bar-content">
        {/* Left: Model name */}
        <div className="model-info">
          <span className="model-icon">🧬</span>
          <h1 className="model-name">{modelName}</h1>
        </div>

        {/* Center: Undo/Redo */}
        <div className="undo-redo">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="btn-icon"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="btn-icon"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>

        {/* Right: Actions */}
        <div className="actions">
          <button
            onClick={onSave}
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Model'}
          </button>

          <button className="btn-icon" title="Help">
            💡
          </button>

          <button className="btn-icon" title="Settings">
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### B. QuickAddPanel Component
```typescript
// components/overlay/QuickAddPanel.tsx

interface ComponentType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const COMPONENT_TYPES: ComponentType[] = [
  { id: 'gene', label: 'Gene', icon: '🧬', description: 'DNA that codes for proteins' },
  { id: 'protein', label: 'Protein', icon: '⚡', description: 'Does the work in cells' },
  { id: 'input', label: 'Input', icon: '🔵', description: 'External signal' },
  { id: 'output', label: 'Output', icon: '🟢', description: 'Cell response' }
];

export function QuickAddPanel({ onAddComponent }: { onAddComponent: (type: string) => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="quick-add-panel">
      <h3 className="panel-title">➕ Add to Your Model</h3>

      <div className="component-grid">
        {COMPONENT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              onAddComponent(type.id);
            }}
            className={`component-button ${selectedType === type.id ? 'selected' : ''}`}
            title={type.description}
          >
            <span className="component-icon">{type.icon}</span>
            <span className="component-label">{type.label}</span>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="placement-hint">
          <p>👆 Click on the canvas to place your {selectedType}</p>
        </div>
      )}
    </div>
  );
}
```

#### C. ConnectionWizard Component
```typescript
// components/overlay/ConnectionWizard.tsx

type WizardStep = 'idle' | 'select-first' | 'select-second' | 'choose-type';

interface ConnectionWizardProps {
  onCreateConnection: (from: ComponentId, to: ComponentId, type: ConnectionType) => void;
}

export function ConnectionWizard({ onCreateConnection }: ConnectionWizardProps) {
  const [step, setStep] = useState<WizardStep>('idle');
  const [firstComponent, setFirstComponent] = useState<Component | null>(null);
  const [secondComponent, setSecondComponent] = useState<Component | null>(null);

  const startConnection = () => {
    setStep('select-first');
    showTooltip("Click the first component (the one that controls)");
  };

  const handleComponentClick = (component: Component) => {
    if (step === 'select-first') {
      setFirstComponent(component);
      setStep('select-second');
      showTooltip("Great! Now click what this controls");
    } else if (step === 'select-second') {
      setSecondComponent(component);
      setStep('choose-type');
    }
  };

  const createConnection = (type: ConnectionType) => {
    onCreateConnection(firstComponent!.id, secondComponent!.id, type);
    resetWizard();
  };

  const resetWizard = () => {
    setStep('idle');
    setFirstComponent(null);
    setSecondComponent(null);
  };

  return (
    <div className="connection-wizard">
      {step === 'idle' && (
        <button onClick={startConnection} className="btn-primary btn-large">
          🔗 Connect Components
        </button>
      )}

      {step === 'select-first' && (
        <div className="wizard-step">
          <p className="step-instruction">1️⃣ Click the FIRST component (the one that controls)</p>
        </div>
      )}

      {step === 'select-second' && (
        <div className="wizard-step">
          <p className="step-instruction">2️⃣ Click the SECOND component (the one being controlled)</p>
          {firstComponent && (
            <div className="selected-component">
              <span>Selected: {firstComponent.name}</span>
            </div>
          )}
        </div>
      )}

      {step === 'choose-type' && (
        <div className="connection-type-selector">
          <h3>How does {firstComponent?.name} affect {secondComponent?.name}?</h3>

          <button
            onClick={() => createConnection('activates')}
            className="connection-option activates"
          >
            <span className="option-icon">✅</span>
            <span className="option-label">Activates</span>
            <span className="option-description">(Turns it ON)</span>
          </button>

          <button
            onClick={() => createConnection('inhibits')}
            className="connection-option inhibits"
          >
            <span className="option-icon">⛔</span>
            <span className="option-label">Inhibits</span>
            <span className="option-description">(Turns it OFF)</span>
          </button>

          <button
            onClick={() => createConnection('both')}
            className="connection-option both"
          >
            <span className="option-icon">↔️</span>
            <span className="option-label">Both Ways</span>
            <span className="option-description">(They affect each other)</span>
          </button>

          <button onClick={resetWizard} className="btn-text">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
```

#### D. LeftSidebar Component
```typescript
// components/overlay/LeftSidebar.tsx

export function LeftSidebar({
  isOpen,
  currentPage,
  onToggle,
  onAddComponent,
  onCreateConnection,
  onRunSimulation
}: LeftSidebarProps) {
  return (
    <div className={`left-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={onToggle} className="sidebar-toggle">
        {isOpen ? '◀' : '▶'}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          {/* Navigation */}
          <NavigationPanel />

          {/* Model Tools (only on Model page) */}
          {currentPage === 'model' && (
            <>
              <QuickAddPanel onAddComponent={onAddComponent} />
              <ConnectionWizard onCreateConnection={onCreateConnection} />
            </>
          )}

          {/* Analysis Tools (only on Analysis page) */}
          {currentPage === 'analysis' && (
            <>
              <SimulationControls onRunSimulation={onRunSimulation} />
              <GraphControls />
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 2.4 Analysis Page Overlay (3 hours)

#### A. SimulationControls Component
```typescript
// components/overlay/SimulationControls.tsx

export function SimulationControls({
  isSimulating,
  progress,
  onRun,
  onPause,
  onStop,
  onReset,
  speed,
  onSpeedChange
}: SimulationControlsProps) {
  return (
    <div className="simulation-controls">
      <h3 className="panel-title">⚡ Simulation Controls</h3>

      {/* Main control button */}
      <button
        onClick={isSimulating ? onPause : onRun}
        className={`btn-primary btn-huge ${isSimulating ? 'btn-warning' : 'btn-success'}`}
      >
        {isSimulating ? (
          <>
            <span className="btn-icon">⏸️</span>
            <span className="btn-label">Pause</span>
          </>
        ) : (
          <>
            <span className="btn-icon">▶️</span>
            <span className="btn-label">Run Simulation</span>
          </>
        )}
      </button>

      {/* Speed control */}
      <div className="speed-control">
        <label>Speed:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="speed-slider"
        />
        <span className="speed-label">
          {speed < 33 ? 'Slow' : speed < 66 ? 'Normal' : 'Fast'}
        </span>
      </div>

      {/* Progress bar */}
      {isSimulating && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Secondary controls */}
      <div className="secondary-controls">
        <button onClick={onStop} className="btn-secondary" disabled={!isSimulating}>
          ⏹️ Stop
        </button>
        <button onClick={onReset} className="btn-secondary">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
```

#### B. GraphControls Component
```typescript
// components/overlay/GraphControls.tsx

export function GraphControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
  onToggleLegend,
  showLegend
}: GraphControlsProps) {
  return (
    <div className="graph-controls">
      <h3 className="panel-title">📊 Graph Controls</h3>

      {/* View controls */}
      <div className="control-group">
        <button onClick={onZoomIn} className="btn-icon" title="Zoom In">
          🔍+
        </button>
        <button onClick={onZoomOut} className="btn-icon" title="Zoom Out">
          🔍-
        </button>
        <button onClick={onResetView} className="btn-icon" title="Reset View">
          ↻ Reset
        </button>
      </div>

      {/* Display options */}
      <div className="control-group">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showLegend}
            onChange={(e) => onToggleLegend(e.target.checked)}
          />
          <span>Show Legend</span>
        </label>
      </div>

      {/* Export */}
      <div className="control-group">
        <button onClick={() => onExport('png')} className="btn-secondary">
          💾 Save as Image
        </button>
        <button onClick={() => onExport('csv')} className="btn-secondary">
          📄 Export Data (CSV)
        </button>
      </div>
    </div>
  );
}
```

---

### 2.5 Polish & Refinement (2 hours)

#### A. Animations
```css
/* animations.css */

@keyframes slideInRight {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Apply animations */
.sidebar {
  animation: slideInRight 0.3s ease-out;
}

.notification {
  animation: fadeIn 0.3s ease-out;
}

.fab {
  animation: pulse 2s ease-in-out infinite;
}

.loading {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

#### B. Responsive Design
```css
/* responsive.css */

/* Desktop (default) */
.left-sidebar {
  width: 320px;
}

/* Tablet */
@media (max-width: 1024px) {
  .left-sidebar {
    width: 280px;
  }

  .right-sidebar {
    display: none; /* Hide on tablet */
  }
}

/* Mobile */
@media (max-width: 768px) {
  .left-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .left-sidebar.open {
    transform: translateX(0);
  }

  .top-control-bar {
    padding: 0.75rem 1rem;
  }

  .model-name {
    font-size: 1.1rem;
  }
}
```

#### C. Accessibility
```typescript
// Add keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Z: Undo
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      handleUndo();
    }

    // Ctrl+Y: Redo
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }

    // Ctrl+S: Save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Space: Run/Pause simulation
    if (e.key === ' ' && currentPage === 'analysis') {
      e.preventDefault();
      isSimulating ? handlePause() : handleRun();
    }

    // Escape: Cancel current action
    if (e.key === 'Escape') {
      cancelCurrentAction();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

// ARIA labels
<button
  onClick={handleSave}
  aria-label="Save model"
  aria-pressed={isSaving}
>
  💾 Save
</button>
```

---

### 2.6 Testing & Validation (2 hours)

**Complete Testing Checklist:**

#### Model Page Testing
- [ ] Black header hidden
- [ ] Unwanted tabs hidden
- [ ] Model canvas visible and functional
- [ ] Can add components via QuickAddPanel
- [ ] Can create connections via ConnectionWizard
- [ ] Can edit component properties
- [ ] Can delete components
- [ ] Can save model
- [ ] Undo/redo works
- [ ] Keyboard shortcuts work

#### Analysis Page Testing
- [ ] Can run simulation
- [ ] Can pause/stop simulation
- [ ] Speed control works
- [ ] Progress indicator accurate
- [ ] Graphs display correctly
- [ ] Can zoom/pan graphs
- [ ] Can export results
- [ ] Can compare runs

#### Cross-Page Testing
- [ ] Navigation between pages works
- [ ] State persists when switching pages
- [ ] No conflicts between overlays
- [ ] Performance is smooth

#### Responsive Testing
- [ ] Works on 1920x1080 (desktop)
- [ ] Works on 1024x768 (tablet)
- [ ] Sidebars collapse properly
- [ ] Touch-friendly (if needed)

---

## 📊 Project Timeline

### Phase 1: Inspection (2-3 hours)
- Hour 1: Setup and Model page inspection
- Hour 2: Analysis page inspection
- Hour 3: Documentation and screenshots

### Phase 2: Implementation (12-15 hours)
- Hours 1-2: Architecture design
- Hours 3-5: Core infrastructure
- Hours 6-9: Model page overlay
- Hours 10-12: Analysis page overlay
- Hours 13-14: Polish and animations
- Hour 15: Testing and validation

**Total: 15-18 hours for complete implementation**

---

## 🎯 Success Criteria

### Functionality
- ✅ 100% of Cell Collective functionality accessible
- ✅ Model building works exactly as before
- ✅ Simulation runs exactly as before
- ✅ All analysis tools available

### Usability
- ✅ 10x easier to add components
- ✅ 10x easier to create connections
- ✅ Clear, obvious controls for students
- ✅ No technical jargon visible

### Design
- ✅ Beautiful, modern K-12 interface
- ✅ Colorful, engaging visuals
- ✅ Smooth animations
- ✅ Professional polish

### Performance
- ✅ No lag when interacting
- ✅ Smooth scrolling/zooming
- ✅ Fast load time

---

## 📁 File Structure

```
gui/
├── src/
│   ├── components/
│   │   ├── SimpleCellWrapper.tsx           ← Main wrapper (existing)
│   │   ├── overlay/                        ← NEW: K-12 overlay
│   │   │   ├── K12OverlayController.tsx    ← Main controller
│   │   │   ├── TopControlBar.tsx
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   ├── BottomStatusBar.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   └── HelpOverlay.tsx
│   │   └── controls/                       ← NEW: Simplified controls
│   │       ├── QuickAddPanel.tsx
│   │       ├── ConnectionWizard.tsx
│   │       ├── SimulationControls.tsx
│   │       ├── GraphControls.tsx
│   │       └── QuickEditMenu.tsx
│   ├── hooks/                              ← NEW: Custom hooks
│   │   ├── useCellCollectiveControl.ts
│   │   ├── useIframeMessaging.ts
│   │   ├── useSimulationState.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/                              ← NEW: Utilities
│   │   ├── cellCollectiveAPI.ts
│   │   ├── cssInjection.ts
│   │   └── domManipulation.ts
│   ├── types/                              ← NEW: TypeScript types
│   │   ├── cellCollective.ts
│   │   ├── overlay.ts
│   │   └── simulation.ts
│   └── styles/
│       ├── overlay.css                     ← NEW: Overlay styles
│       ├── controls.css                    ← NEW: Control styles
│       ├── animations.css                  ← NEW: Animations
│       └── responsive.css                  ← NEW: Responsive styles
├── docs/
│   ├── CELL-COLLECTIVE-UI-ANALYSIS.md      ← NEW: From Phase 1
│   ├── FULL-IMPLEMENTATION-PLAN.md         ← This file
│   └── COMPONENT-MANIPULATION-SIMPLIFIED.md
└── screenshots/                             ← NEW: Annotated screenshots
    ├── model-page-annotated.png
    ├── analysis-page-annotated.png
    └── element-hierarchy.png
```

---

## 🚀 Next Steps

**Phase 1 starts NOW:**

1. Open http://localhost:5600 in Chrome
2. Open DevTools (F12)
3. Inspect iframe contents
4. Start documenting Model page
5. Take annotated screenshots
6. Create `CELL-COLLECTIVE-UI-ANALYSIS.md`

**Ready to begin manual inspection! 🔍**

Shall I guide you through the inspection process step-by-step?
