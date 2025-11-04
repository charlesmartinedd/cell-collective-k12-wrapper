# Cell Collective K-12 Overlay - Comprehensive Plan

**Date:** 2025-11-03
**Goal:** Build a beautiful K-12 overlay that simplifies Cell Collective while maintaining 100% functionality

---

## 🎯 Project Vision

**Create a stunning K-12 interface that:**
- Hides Cell Collective's complex UI (black nav bar, researcher jargon, etc.)
- Provides simple, elegant controls students can understand
- Maintains ALL functionality (building models, running simulations, analysis)
- Makes navigation intuitive and obvious
- Uses beautiful colors, icons, and animations
- Feels like a modern educational app (not a research tool)

---

## 🔍 Phase 1: Deep Exploration & Analysis

### 1.1 Manual Chrome DevTools Inspection
**Goal:** Understand Cell Collective's DOM structure and identify what to hide/control

**Steps:**
1. Open http://localhost:5600 (our wrapper with Cell Collective iframe)
2. Open Chrome DevTools (F12)
3. Inspect iframe contents
4. Document:
   - Black nav bar structure (classes, IDs)
   - Model builder interface elements
   - Simulation controls
   - Tabs to hide (Overview, Knowledge Base, etc.)
   - Buttons/controls we need to trigger programmatically

**Deliverable:** `CELL-COLLECTIVE-UI-ANALYSIS.md` with:
- DOM structure diagrams
- CSS selectors for hiding elements
- JavaScript event targets for controls
- Screenshots of current UI with annotations

### 1.2 Feature Inventory
**Document what students need access to:**

**Model Building:**
- Add components (genes, proteins, etc.)
- Create relationships (activates, inhibits)
- Edit component properties
- Save model

**Simulation:**
- Run simulation
- Pause/stop
- Speed control
- View results in real-time

**Analysis:**
- View simulation graphs
- Compare results
- Export data (optional)

**Navigation:**
- Browse available models
- Open existing model
- Create new model
- Switch between models

---

## 🎨 Phase 2: K-12 Overlay Design

### 2.1 Design System

**Color Palette (Kid-Friendly):**
```css
/* Primary - Vibrant purple/blue gradient */
--primary-start: #667eea;
--primary-end: #764ba2;

/* Accent colors */
--accent-green: #10b981;    /* Success, play button */
--accent-yellow: #fbbf24;   /* Warning, pause */
--accent-red: #ef4444;      /* Stop, delete */
--accent-blue: #3b82f6;     /* Info, help */

/* Neutrals */
--bg-light: #f8fafc;
--bg-white: #ffffff;
--text-dark: #1e293b;
--text-medium: #64748b;
--border: #e2e8f0;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

**Typography:**
```css
/* Headings - Friendly and bold */
font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
font-weight: 600-700;

/* Body - Clean and readable */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
font-weight: 400-500;
```

**Component Style:**
- Large, rounded buttons (min 44px height for touch)
- Generous spacing and padding
- Smooth animations (300ms ease-in-out)
- Clear visual hierarchy
- Icons + labels for clarity
- Tooltips for complex actions

### 2.2 Layout Design

```
┌──────────────────────────────────────────────────────────────┐
│  🧬 Cell Model Builder                    [? Help] [Save] [⚙️] │  ← Colorful header
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════╗│
│ ║  Simplified K-12 Sidebar (Overlay)    Cell Collective     ║│
│ ║  ┌─────────────────────┐             (Hidden UI)          ║│
│ ║  │ 📊 My Models        │             ┌──────────────┐     ║│
│ ║  │ ➕ Add Component    │             │              │     ║│
│ ║  │ 🔗 Add Connection   │             │   Model      │     ║│
│ ║  │ ▶️  Run Simulation  │             │   Canvas     │     ║│
│ ║  │ 📈 View Results     │             │   (Visible)  │     ║│
│ ║  │ 💾 Save Model       │             │              │     ║│
│ ║  └─────────────────────┘             └──────────────┘     ║│
│ ║                                                            ║│
│ ╚═══════════════════════════════════════════════════════════╝│
└──────────────────────────────────────────────────────────────┘
```

**Key Overlay Components:**

1. **Top Control Bar (Fixed)**
   - Model name/title
   - Save button (big, obvious)
   - Help button (opens tutorial)
   - Settings (advanced options)

2. **Left Sidebar (Collapsible)**
   - Navigation: My Models, Browse, Create New
   - Tools: Add Component, Add Connection, Edit
   - Actions: Run, Pause, Stop, Reset
   - Results: View Graphs, Export

3. **Bottom Status Bar (Fixed)**
   - Status messages ("Model saved!", "Simulation running...")
   - Progress indicators
   - Keyboard shortcuts hints

4. **Floating Action Button (FAB)**
   - Quick access to most common action (Run Simulation)
   - Prominent, colorful, animated

### 2.3 Simplified Controls Mockup

**Model Building Section:**
```
┌─────────────────────────────┐
│  🧪 Build Your Model         │
├─────────────────────────────┤
│  ┌──────────────────────┐   │
│  │ ➕ Add Component      │   │ ← Big, clear button
│  │   (Genes, Proteins)  │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ 🔗 Add Connection    │   │
│  │   (How they work)    │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ ✏️ Edit Properties   │   │
│  │   (Change behavior)  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**Simulation Section:**
```
┌─────────────────────────────┐
│  ▶️ Run Your Simulation     │
├─────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │   ▶️  RUN            │   │ ← Huge green button
│  │  Start Simulation    │   │
│  └──────────────────────┘   │
│                              │
│  Speed: ○━━━━━○ Fast        │ ← Visual slider
│                              │
│  ┌──────────────────────┐   │
│  │ 📊 View Results       │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

---

## 🛠️ Phase 3: Implementation Strategy

### 3.1 CSS Hiding Strategy

**Approach: CSS Injection into iframe**

```css
/* Hide Cell Collective's black nav bar */
header[class*="navbar"],
nav[class*="navigation"],
.top-bar,
.header-bar {
  display: none !important;
  height: 0 !important;
}

/* Hide tabs we don't want */
[data-tab="overview"],
[data-tab="knowledge-base"],
.tab-overview,
.tab-knowledge {
  display: none !important;
}

/* Hide sign-in prompts */
.auth-prompt,
.login-required,
[class*="sign-in"] {
  display: none !important;
}

/* Hide complex researcher controls */
.advanced-options,
.export-options,
.publish-controls {
  display: none !important;
}

/* Simplify remaining UI */
.model-canvas {
  /* Keep visible */
}

.simulation-view {
  /* Keep visible */
}
```

**Implementation:**
1. Try CSS injection via postMessage
2. If blocked by CORS, use CSS overlay positioning
3. Create comprehensive selector list after DevTools inspection

### 3.2 JavaScript Control Strategy

**Approach: Programmatic Control of Cell Collective**

```javascript
// Get iframe reference
const iframe = document.querySelector('.cell-iframe');
const cellCollective = iframe.contentWindow;

// Listen for messages from Cell Collective
window.addEventListener('message', (event) => {
  if (event.origin === 'https://research.cellcollective.org') {
    handleCellCollectiveEvent(event.data);
  }
});

// Trigger Cell Collective actions
function addComponent() {
  cellCollective.postMessage({
    action: 'ADD_COMPONENT',
    type: 'gene'
  }, '*');
}

function runSimulation() {
  cellCollective.postMessage({
    action: 'RUN_SIMULATION',
    speed: currentSpeed
  }, '*');
}

// Alternative: Direct DOM manipulation (if postMessage doesn't work)
function clickCellCollectiveButton(selector) {
  const button = iframe.contentDocument.querySelector(selector);
  if (button) {
    button.click();
  }
}
```

### 3.3 Overlay Component Architecture

```typescript
// K12OverlayController.tsx
interface OverlayProps {
  iframeRef: RefObject<HTMLIFrameElement>;
}

function K12OverlayController({ iframeRef }: OverlayProps) {
  // State management
  const [currentView, setCurrentView] = useState('build'); // build | simulate | results
  const [modelName, setModelName] = useState('My Cell Model');
  const [isSimulating, setIsSimulating] = useState(false);

  // Control Cell Collective
  const addComponent = () => {
    // Trigger Cell Collective's add component UI
    sendToCellCollective('ADD_COMPONENT');
  };

  const runSimulation = () => {
    setIsSimulating(true);
    sendToCellCollective('RUN_SIMULATION');
  };

  return (
    <>
      <TopControlBar
        modelName={modelName}
        onSave={saveModel}
        onHelp={showHelp}
      />

      <LeftSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddComponent={addComponent}
        onRunSimulation={runSimulation}
        isSimulating={isSimulating}
      />

      <BottomStatusBar
        status={currentStatus}
        progress={simulationProgress}
      />

      <FloatingActionButton
        action={runSimulation}
        icon="▶️"
        label="Run"
      />
    </>
  );
}
```

---

## 🚀 Phase 4: Implementation Roadmap

### Sprint 1: Deep Exploration (2-3 hours)
- [ ] Manual Chrome DevTools inspection of Cell Collective
- [ ] Document DOM structure with screenshots
- [ ] Identify all CSS selectors for hiding
- [ ] Map JavaScript events for controls
- [ ] Create UI analysis document

### Sprint 2: CSS Hiding & Cleanup (1-2 hours)
- [ ] Implement CSS injection system
- [ ] Hide black nav bar
- [ ] Hide unwanted tabs
- [ ] Hide sign-in prompts
- [ ] Test on different pages (models, create, simulate)

### Sprint 3: K-12 Overlay Components (3-4 hours)
- [ ] Build TopControlBar component
- [ ] Build LeftSidebar component
- [ ] Build BottomStatusBar component
- [ ] Build FloatingActionButton component
- [ ] Implement responsive design

### Sprint 4: JavaScript Control Integration (2-3 hours)
- [ ] Implement postMessage communication
- [ ] Map overlay buttons to Cell Collective actions
- [ ] Add Component → trigger Cell Collective UI
- [ ] Run Simulation → trigger Cell Collective simulation
- [ ] Test all control flows

### Sprint 5: Polish & Refinement (2-3 hours)
- [ ] Add animations and transitions
- [ ] Implement loading states
- [ ] Add helpful tooltips
- [ ] Create tutorial overlay for first-time users
- [ ] Test with real student workflow
- [ ] Performance optimization

**Total Estimated Time:** 10-15 hours for complete implementation

---

## 🧪 Testing Strategy

### User Testing Scenarios

**Scenario 1: New Student - First Model**
1. Student opens wrapper
2. Sees clean, simple interface (not Cell Collective's complex UI)
3. Clicks "Create New Model"
4. Sees simplified component palette
5. Adds 2-3 components easily
6. Creates connections
7. Clicks big "RUN" button
8. Sees simulation results clearly

**Scenario 2: Existing Model Manipulation**
1. Student opens example model
2. Black nav bar is hidden
3. Only relevant tabs visible (Model, Simulation)
4. Can edit components
5. Can run simulation
6. Can view results
7. Can save changes

**Scenario 3: Complex Workflow**
1. Browse models
2. Open model
3. Duplicate it
4. Modify components
5. Run multiple simulations
6. Compare results
7. Save final version

### Success Criteria
- [ ] No Cell Collective researcher UI visible
- [ ] All functionality accessible through K-12 overlay
- [ ] Students can complete full workflow without confusion
- [ ] Interface feels modern and educational
- [ ] No loss of Cell Collective functionality
- [ ] Works on desktop (tablet nice-to-have)

---

## 🎨 Design Assets Needed

### Icons
- Model building: 🧬 🧪 ➕ ✏️ 🗑️
- Simulation: ▶️ ⏸️ ⏹️ 🔄 ⚡
- Navigation: 📊 📚 🏠 💾
- Help: 💡 ❓ 📖 🎯

### Animations
- Button hover effects (scale, color shift)
- Loading spinners (smooth, colorful)
- Success/error notifications (slide in from top)
- Sidebar collapse/expand (smooth transition)
- FAB pulse animation (attention grabber)

### Illustrations (Optional)
- Empty state: "Create your first model!"
- Success state: "Simulation complete! 🎉"
- Error state: "Oops! Let's try again"
- Help overlay: Step-by-step visual guide

---

## 📁 Updated File Structure

```
gui/
├── src/
│   ├── components/
│   │   ├── SimpleCellWrapper.tsx      ← Main wrapper (existing)
│   │   ├── overlay/                    ← NEW: K-12 overlay components
│   │   │   ├── K12OverlayController.tsx
│   │   │   ├── TopControlBar.tsx
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── BottomStatusBar.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   └── HelpOverlay.tsx
│   │   └── controls/                   ← NEW: Simplified controls
│   │       ├── AddComponentButton.tsx
│   │       ├── RunSimulationButton.tsx
│   │       ├── SimulationControls.tsx
│   │       └── ResultsViewer.tsx
│   ├── hooks/                          ← NEW: Custom hooks
│   │   ├── useCellCollectiveControl.ts
│   │   ├── useIframeMessaging.ts
│   │   └── useSimulationState.ts
│   ├── utils/                          ← NEW: Utilities
│   │   ├── cellCollectiveAPI.ts
│   │   ├── cssInjection.ts
│   │   └── domManipulation.ts
│   ├── styles/
│   │   ├── index.css                   ← Global styles
│   │   ├── wrapper.css                 ← Wrapper styles (existing)
│   │   ├── overlay.css                 ← NEW: Overlay styles
│   │   ├── controls.css                ← NEW: Control styles
│   │   └── animations.css              ← NEW: Animation styles
│   └── types/
│       └── cellCollective.ts           ← TypeScript types
├── docs/
│   ├── CELL-COLLECTIVE-UI-ANALYSIS.md  ← NEW: UI analysis
│   ├── K12-OVERLAY-PLAN.md             ← This file
│   └── CONTROL-MAPPING.md              ← NEW: Button → action mapping
└── package.json
```

---

## 🔑 Key Technical Challenges

### Challenge 1: Iframe Cross-Origin Restrictions
**Problem:** Can't directly access iframe DOM due to CORS
**Solutions:**
1. postMessage API for communication
2. CSS overlay positioning to hide elements
3. Proxy server to serve Cell Collective (advanced)

### Challenge 2: Cell Collective May Block Iframing
**Problem:** X-Frame-Options header might block iframe
**Solutions:**
1. Check if Cell Collective allows iframe embedding
2. Use browser extension to bypass (development only)
3. Contact Cell Collective for embed API
4. Proxy approach as fallback

### Challenge 3: Maintaining Functionality
**Problem:** Hiding UI might break workflows
**Solutions:**
1. Careful CSS targeting (hide container, not functionality)
2. Test every feature after hiding
3. Progressive enhancement (start simple, add complexity)

### Challenge 4: Responsive Design
**Problem:** Overlay needs to work on different screen sizes
**Solutions:**
1. Collapsible sidebar for small screens
2. Bottom toolbar for mobile
3. Touch-friendly controls (min 44px)

---

## 🎯 Next Immediate Steps

1. **Manual Chrome DevTools Inspection** (30 min)
   - Open http://localhost:5600
   - F12 → inspect iframe
   - Document DOM structure
   - Screenshot UI elements to hide

2. **Create UI Analysis Document** (30 min)
   - `CELL-COLLECTIVE-UI-ANALYSIS.md`
   - DOM selectors
   - Control mapping
   - Screenshots with annotations

3. **Implement CSS Hiding** (1 hour)
   - Create `cssInjection.ts` utility
   - Hide black nav bar
   - Hide unwanted tabs
   - Test visibility

4. **Build First Overlay Component** (1 hour)
   - Start with TopControlBar
   - Simple, elegant header
   - Test positioning over iframe

5. **Iterate and Refine** (ongoing)
   - Get user feedback
   - Adjust based on actual Cell Collective UI
   - Polish design and interactions

---

**Ready to make this absolutely beautiful! 🎨✨**

Let's start with Phase 1: Manual inspection and UI analysis.
