# Improvement Action Items - Cell Collective K-12 Wrapper

**Generated**: November 3, 2025
**Project Status**: Production-Ready (B+)
**Priority**: High → Medium → Low

---

## 🔴 Critical Fixes (Do This Week)

### 1. Fix TypeScript `any` Types
**Files**: `App.tsx`, `cellCollectiveController.ts`
**Estimated Time**: 30 minutes

#### Fix #1: App.tsx (Line 49)
```typescript
// ❌ CURRENT CODE:
onChange={(e) => handleConfigChange(e.target.value as any)}

// ✅ FIXED CODE:
type ConfigMode = 'default' | 'advanced' | 'minimal';
onChange={(e) => handleConfigChange(e.target.value as ConfigMode)}
```

#### Fix #2: cellCollectiveController.ts (Line 358)
```typescript
// ❌ CURRENT CODE:
private sendMessage(message: any): void {
  if (this.iframeWindow) {
    this.iframeWindow.postMessage(message, '*');
  }
}

// ✅ FIXED CODE:
interface CellCollectiveMessage {
  action: string;
  type?: string;
  command?: string;
  [key: string]: unknown;
}

private sendMessage(message: CellCollectiveMessage): void {
  if (this.iframeWindow) {
    this.iframeWindow.postMessage(message, '*');
    console.log('📨 Sent postMessage:', message);
  }
}
```

---

### 2. Handle Unused Components
**Files**: `HomePage.tsx`, `Dashboard.tsx`, `ModelBrowser.tsx`, `ModelBuilder.tsx`
**Estimated Time**: 1-2 hours

**Decision Required**: Choose ONE option:

#### Option A: Delete Unused Components (RECOMMENDED)
```bash
# These components are not used in App.tsx
# If they're prototypes, delete them:
rm src/components/HomePage.tsx
rm src/components/Dashboard.tsx
rm src/components/ModelBrowser.tsx
rm src/components/ModelBuilder.tsx

# Also remove unused styles if any
```

#### Option B: Move to Examples Directory
```bash
mkdir -p examples
mv src/components/HomePage.tsx examples/HomePage.example.tsx
mv src/components/Dashboard.tsx examples/Dashboard.example.tsx
mv src/components/ModelBrowser.tsx examples/ModelBrowser.example.tsx
mv src/components/ModelBuilder.tsx examples/ModelBuilder.example.tsx
```

#### Option C: Integrate with Routing
```typescript
// If these should be used, update App.tsx:
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ModelWrapper from './components/ModelWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wrapper" element={<CellWrapperWithControls />} />
        <Route path="/model/:modelId" element={<ModelWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 3. Add Error Boundary
**New File**: `src/components/ErrorBoundary.tsx`
**Estimated Time**: 1 hour

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui'
        }}>
          <h1 style={{ color: '#e53e3e' }}>⚠️ Something went wrong</h1>
          <p style={{ color: '#718096' }}>
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                background: '#f7fafc',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Update main.tsx:**
```typescript
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
```

---

## 🟡 High Priority (This Month)

### 4. Add Testing Infrastructure
**Estimated Time**: 1 week

#### Step 1: Install Testing Libraries
```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest \
  jsdom \
  @vitest/ui
```

#### Step 2: Configure Vitest
**New File**: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}'
      ]
    }
  }
});
```

#### Step 3: Create Test Setup
**New File**: `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

#### Step 4: Write Sample Tests
**New File**: `src/components/__tests__/FloatingControlPanel.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingControlPanel from '../FloatingControlPanel';
import { getDefaultConfig } from '../../config/FeatureConfig';

describe('FloatingControlPanel', () => {
  it('renders with default config', () => {
    const onTrigger = vi.fn();
    render(<FloatingControlPanel onTriggerControl={onTrigger} />);

    expect(screen.getByText('Model Controls')).toBeInTheDocument();
  });

  it('renders enabled controls based on config', () => {
    const onTrigger = vi.fn();
    const config = getDefaultConfig();

    render(<FloatingControlPanel onTriggerControl={onTrigger} config={config} />);

    expect(screen.getByText('Add Gene')).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onTriggerControl when button clicked', () => {
    const onTrigger = vi.fn();
    render(<FloatingControlPanel onTriggerControl={onTrigger} />);

    fireEvent.click(screen.getByText('Run'));
    expect(onTrigger).toHaveBeenCalledWith('simulate');
  });

  it('shows student mode badge when studentMode is true', () => {
    const onTrigger = vi.fn();
    const config = { ...getDefaultConfig(), studentMode: true };

    render(<FloatingControlPanel onTriggerControl={onTrigger} config={config} />);

    expect(screen.getByText('Student Mode')).toBeInTheDocument();
  });

  it('can be collapsed and expanded', () => {
    const onTrigger = vi.fn();
    render(<FloatingControlPanel onTriggerControl={onTrigger} />);

    const toggleButton = screen.getByLabelText(/collapse panel/i);
    fireEvent.click(toggleButton);

    expect(screen.queryByText('Model Controls')).not.toBeInTheDocument();
  });
});
```

#### Step 5: Update package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### 5. Improve Accessibility
**Estimated Time**: 3-5 days

#### Enhancement #1: Add ARIA Live Regions
**File**: `CellWrapperWithControls.tsx`
```typescript
{/* Notification toast with ARIA */}
{notification && (
  <div
    className="notification-toast"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    {notification}
  </div>
)}
```

#### Enhancement #2: Add Keyboard Navigation
**File**: `FloatingControlPanel.tsx`
```typescript
<div
  className="control-grid"
  role="toolbar"
  aria-label="Model control buttons"
  aria-orientation="vertical"
>
  {enabledControls.map(control => (
    <button
      key={control.id}
      className={`control-button control-${control.color}`}
      onClick={() => handleControlClick(control.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleControlClick(control.id);
        }
      }}
      aria-label={control.label}
      aria-pressed={activeControl === control.id}
      title={control.label}
    >
      <span className="control-icon" aria-hidden="true">{control.icon}</span>
      <span className="control-label">{control.label}</span>
    </button>
  ))}
</div>
```

#### Enhancement #3: Add Skip Navigation
**File**: `CellWrapperWithControls.tsx`
```typescript
// Add at the top of the component
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Add id to main content
<div id="main-content" className="iframe-container">
  <iframe ... />
</div>

// Add CSS
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #667eea;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

#### Enhancement #4: Add Focus Management
**File**: `FloatingControlPanel.tsx`
```typescript
import { useRef, useEffect } from 'react';

function FloatingControlPanel({ onTriggerControl, config = getDefaultConfig() }: FloatingControlPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Focus management when panel expands
  useEffect(() => {
    if (isExpanded && panelRef.current) {
      const firstButton = panelRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isExpanded]);

  return (
    <div ref={panelRef} className={`floating-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* ... rest of component */}
    </div>
  );
}
```

---

### 6. Create Documentation
**Estimated Time**: 2-3 days

#### Document #1: API Documentation
**New File**: `docs/API.md`
```markdown
# API Documentation

## CellCollectiveController

The main controller for programmatic interaction with Cell Collective iframe.

### Methods

#### `initialize(iframe: HTMLIFrameElement): void`
Initialize the controller with an iframe reference.

#### `triggerControl(controlId: string): Promise<ControlResult>`
Trigger a control action by ID.

**Parameters:**
- `controlId`: One of: 'addGene', 'addProtein', 'connect', 'simulate', 'pause', 'reset', 'save', etc.

**Returns:** Promise<ControlResult>
```typescript
interface ControlResult {
  success: boolean;
  message: string;
  error?: string;
}
```

[... full API documentation ...]
```

#### Document #2: Component Documentation
**New File**: `docs/COMPONENTS.md`
```markdown
# Component Documentation

## CellWrapperWithControls

Main wrapper component that embeds Cell Collective in an iframe with K-12 controls.

### Props
- `config?: FeatureConfig` - Configuration for enabled features
- `startUrl?: string` - Initial URL to load (default: Cell Collective models page)

### Example Usage
```tsx
import CellWrapperWithControls from './components/CellWrapperWithControls';
import { getDefaultConfig } from './config/FeatureConfig';

function App() {
  return (
    <CellWrapperWithControls
      config={getDefaultConfig()}
      startUrl="https://research.cellcollective.org/models"
    />
  );
}
```

[... full component documentation ...]
```

#### Document #3: Development Guide
**New File**: `docs/DEVELOPMENT.md`
```markdown
# Development Guide

## Prerequisites
- Node.js 18+
- npm 9+

## Setup
```bash
cd gui
npm install
npm run dev
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Project Structure
```
gui/
├── src/
│   ├── components/     # React components
│   ├── config/         # Configuration
│   ├── utils/          # Utilities
│   ├── api/            # API layer
│   └── styles/         # CSS files
├── tests/              # Test files
└── docs/               # Documentation
```

[... full development guide ...]
```

---

## 🟢 Medium Priority (Nice to Have)

### 7. Add Environment Configuration
**Estimated Time**: 2 hours

**New File**: `.env.example`
```bash
# Cell Collective Configuration
VITE_CELL_COLLECTIVE_URL=https://research.cellcollective.org
VITE_API_BASE=https://research.cellcollective.org/web/_api

# Feature Flags
VITE_ENABLE_LOGGING=false
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEV_MODE=true
```

**Update**: `vite.config.ts`
```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5600,
      open: true
    },
    define: {
      'import.meta.env.VITE_CELL_COLLECTIVE_URL': JSON.stringify(
        env.VITE_CELL_COLLECTIVE_URL || 'https://research.cellcollective.org'
      ),
      'import.meta.env.VITE_API_BASE': JSON.stringify(
        env.VITE_API_BASE || 'https://research.cellcollective.org/web/_api'
      )
    }
  };
});
```

---

### 8. Add CI/CD Pipeline
**Estimated Time**: 4 hours

**New File**: `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: gui/package-lock.json

      - name: Install dependencies
        working-directory: ./gui
        run: npm ci

      - name: Run linter
        working-directory: ./gui
        run: npm run lint

      - name: Run tests
        working-directory: ./gui
        run: npm run test

      - name: Build
        working-directory: ./gui
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./gui/coverage/coverage-final.json
```

---

### 9. Add Performance Monitoring
**Estimated Time**: 3 hours

**New File**: `src/utils/performance.ts`
```typescript
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      console.warn(`Missing marks: ${startMark} or ${endMark}`);
      return 0;
    }

    const duration = end - start;
    console.log(`⏱️ ${startMark} → ${endMark}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  measureSince(markName: string): number {
    const start = this.marks.get(markName);
    if (!start) return 0;

    const duration = performance.now() - start;
    console.log(`⏱️ ${markName} → now: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

**Usage in components:**
```typescript
import { performanceMonitor } from '../utils/performance';

useEffect(() => {
  performanceMonitor.mark('iframe-load-start');
}, []);

const handleIframeLoad = () => {
  performanceMonitor.mark('iframe-load-end');
  performanceMonitor.measure('iframe-load-start', 'iframe-load-end');
  setLoading(false);
};
```

---

## 📊 Progress Tracking

Use this checklist to track implementation:

### Critical Fixes
- [ ] Fix TypeScript `any` in App.tsx
- [ ] Fix TypeScript `any` in cellCollectiveController.ts
- [ ] Handle unused components (choose option A, B, or C)
- [ ] Add ErrorBoundary component
- [ ] Wrap App in ErrorBoundary

### High Priority
- [ ] Install testing libraries
- [ ] Configure Vitest
- [ ] Write test setup
- [ ] Write component tests (at least 5 test suites)
- [ ] Add ARIA live regions
- [ ] Add keyboard navigation
- [ ] Add skip navigation
- [ ] Add focus management
- [ ] Create API documentation
- [ ] Create component documentation
- [ ] Create development guide

### Medium Priority
- [ ] Add .env.example
- [ ] Update vite.config.ts for env vars
- [ ] Create CI/CD pipeline
- [ ] Add performance monitoring
- [ ] Set up code coverage reporting

---

## 🎯 Success Criteria

**Phase 1 Complete When:**
- ✅ No TypeScript `any` types
- ✅ Unused components handled
- ✅ Error boundary implemented
- ✅ All linting errors resolved

**Phase 2 Complete When:**
- ✅ Test coverage > 60%
- ✅ All components have tests
- ✅ Accessibility score > 85%
- ✅ Documentation complete

**Phase 3 Complete When:**
- ✅ CI/CD pipeline running
- ✅ Environment configuration working
- ✅ Performance monitoring implemented
- ✅ Code quality metrics tracked

---

**Last Updated**: November 3, 2025
**Next Review**: After Phase 1 completion
