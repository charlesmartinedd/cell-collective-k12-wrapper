# Cell Collective K-12 Wrapper - Simplified Plan

**Date:** 2025-11-03
**Goal:** Simple iframe wrapper for Cell Collective model builder/analysis

---

## 🎯 What We're Actually Building

**A minimal wrapper that:**
- Embeds Cell Collective's full model workspace in an iframe
- Students can build their own models OR manipulate existing ones
- Shows ONLY Model and Analysis tabs (hides other tabs)
- Minimal K-12 branding/header around the iframe
- NO homepage with model cards
- NO model browser
- NO routing complexity
- Students navigate Cell Collective normally within the wrapper

**URL Structure:**
- Just one page: loads Cell Collective's interface
- Either start at models page OR specific model
- Students use Cell Collective's actual UI to navigate

---

## ✅ What We Have

- React + TypeScript + Vite setup
- Test model discovered: `https://research.cellcollective.org/model/1`
- API endpoint: `https://research.cellcollective.org/web/_api/initialize`

---

## 🚧 What We Need to Build

### 1. **Single Wrapper Component** (30 min)
```typescript
// SimpleCellWrapper.tsx
- Load Cell Collective in iframe
- Start at: https://research.cellcollective.org/models
  (or https://research.cellcollective.org/model/1 for testing)
- Clean, minimal wrapper
- No complex routing
```

### 2. **CSS to Hide Unwanted Elements** (20 min)
- Keep visible: Model tab, Analysis tab
- Hide: Overview, Network Analysis, Knowledge Base, unnecessary nav
- Try CSS injection into iframe (if possible)
- Or CSS overlay to cover unwanted parts

### 3. **Minimal K-12 Header** (15 min)
- Simple colorful header above iframe
- Title: "Cell Model Builder"
- Maybe: Help button, Back to models button
- That's it - keep it simple!

### 4. **Test with Real Model** (15 min)
- Load model/1 in iframe
- Verify students can:
  - See model structure
  - Edit components
  - Run analysis
  - Navigate between models
- Check tab hiding works

**Total Time:** ~1.5 hours

---

## 🎨 Simple Design

```
┌─────────────────────────────────────────────────┐
│  🧬 Cell Model Builder for Students             │  ← Simple header
│  [?Help]                           [Back to Home]│
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│        [Cell Collective Iframe]                 │
│         - Model builder visible                 │
│         - Analysis visible                      │
│         - Other tabs hidden                     │
│                                                  │
│                                                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📁 Simplified File Structure

```
gui/
├── src/
│   ├── App.tsx                    ← Just render SimpleCellWrapper
│   ├── components/
│   │   └── SimpleCellWrapper.tsx  ← Main component
│   ├── styles/
│   │   ├── index.css              ← Global styles
│   │   └── wrapper.css            ← Wrapper-specific styles
│   └── main.tsx
├── vite.config.ts
└── package.json
```

**Delete/ignore:**
- HomePage.tsx (not needed)
- Dashboard.tsx (not needed)
- ModelBrowser.tsx (not needed)
- ModelBuilder.tsx (not needed)
- Complex routing (not needed)

---

## 🚀 Implementation Steps

### Step 1: Create SimpleCellWrapper Component
```typescript
import { useState, useEffect } from 'react'
import '../styles/wrapper.css'

function SimpleCellWrapper() {
  const [loading, setLoading] = useState(true)

  // Option A: Start at models page
  const iframeUrl = 'https://research.cellcollective.org/models'

  // Option B: Start at specific model (for testing)
  // const iframeUrl = 'https://research.cellcollective.org/model/1'

  const handleIframeLoad = () => {
    setLoading(false)
    // Try to hide unwanted tabs via CSS injection
    hideUnwantedTabs()
  }

  const hideUnwantedTabs = () => {
    try {
      const iframe = document.querySelector('iframe')
      if (iframe?.contentWindow) {
        // Inject CSS to hide tabs
        const style = `
          /* Hide unwanted tabs - adjust selectors based on actual DOM */
          [data-tab="overview"],
          [data-tab="network-analysis"],
          [data-tab="knowledge-base"],
          .tab-overview,
          .tab-network {
            display: none !important;
          }
        `
        iframe.contentWindow.postMessage({
          type: 'INJECT_CSS',
          css: style
        }, '*')
      }
    } catch (err) {
      console.warn('Could not inject CSS:', err)
    }
  }

  return (
    <div className="cell-wrapper">
      {/* Simple K-12 Header */}
      <header className="wrapper-header">
        <div className="header-content">
          <h1>🧬 Cell Model Builder for Students</h1>
          <div className="header-actions">
            <button className="help-btn">? Help</button>
          </div>
        </div>
      </header>

      {/* Loading overlay */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Cell Collective...</p>
        </div>
      )}

      {/* Cell Collective iframe */}
      <iframe
        src={iframeUrl}
        className="cell-iframe"
        title="Cell Collective"
        onLoad={handleIframeLoad}
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}

export default SimpleCellWrapper
```

### Step 2: Update App.tsx
```typescript
import SimpleCellWrapper from './components/SimpleCellWrapper'
import './styles/index.css'

function App() {
  return <SimpleCellWrapper />
}

export default App
```

### Step 3: Create wrapper.css
```css
.cell-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.wrapper-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.wrapper-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.help-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.help-btn:hover {
  background: rgba(255,255,255,0.3);
}

.cell-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: white;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Step 4: Update index.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 5: Test
```bash
cd gui
npm run dev
```

Open browser and verify:
- [ ] Cell Collective loads in iframe
- [ ] Can navigate to models
- [ ] Can open a model
- [ ] Model and Analysis tabs are visible
- [ ] Other tabs are hidden (if CSS injection works)
- [ ] Students can build/edit models

---

## 🧪 Testing Strategy

### Manual Test Steps
1. Start dev server
2. Open in browser
3. Wait for Cell Collective to load
4. Try navigating to models page within iframe
5. Try opening model/1
6. Check which tabs are visible
7. Try editing the model
8. Try running analysis

### If Tab Hiding Doesn't Work
**Option 1:** CSS overlay to cover tabs
**Option 2:** Just leave all tabs visible (simplest)
**Option 3:** Ask Cell Collective for embed parameters

---

## 📝 Notes

### Iframe Communication Challenges
- Cross-origin iframe restrictions (CORS)
- May not be able to inject CSS
- May not be able to listen to iframe events
- Cell Collective may block iframing (X-Frame-Options)

### Fallback Approaches
If iframe is blocked:
1. **Proxy approach:** Run Cell Collective through our server
2. **Browser extension:** Inject CSS via extension
3. **Ask Cell Collective:** See if they have embed mode
4. **Just link out:** "Open in Cell Collective" button

---

## ✅ Success Criteria

- [ ] Cell Collective loads in iframe
- [ ] Students can see model builder
- [ ] Students can create new models
- [ ] Students can edit existing models
- [ ] Students can run analysis
- [ ] Interface looks clean and K-12 friendly
- [ ] Works on desktop (tablet nice-to-have)

---

**Ready to build this simplified version!** Much faster and cleaner than the complex routing approach.
