# Cell Collective K-12 Wrapper - Build Plan

**Date:** 2025-11-03
**Status:** Development Phase
**Port:** 5610
**Target:** Working prototype with iframe embedding

---

## 🎯 Project Overview

### What We're Building
A beautiful K-12 wrapper for Cell Collective that:
- Takes model ID from URL: `localhost:5610/model/164949:1`
- Embeds Cell Collective's actual model workspace in iframe
- Shows ONLY Model and Simulation tabs (hides Overview, Analysis, Network Analysis, Knowledge Base)
- Provides colorful, kid-friendly navigation and UI
- Works anonymously (no login required)

### Technical Approach
**Hybrid iframe approach:**
1. Beautiful K-12 styled wrapper (React + TypeScript + Vite)
2. Iframe embedding: `https://research.cellcollective.org/dashboard#module/[MODEL_ID]`
3. CSS/JavaScript injection to hide unwanted tabs
4. Custom overlays and controls for K-12 experience

---

## ✅ Completed Work

### Architecture & Setup
- ✅ Created React + TypeScript + Vite project
- ✅ Installed react-router-dom for routing
- ✅ Set up project structure with components
- ✅ Configured TypeScript and ESLint

### Components Created
- ✅ **App.tsx** - Main routing (/, /model/:modelId)
- ✅ **HomePage.tsx** - Landing page with navigation
- ✅ **ModelWrapper.tsx** - Iframe wrapper for Cell Collective models
- ✅ **Dashboard.tsx** - Home dashboard view
- ✅ **ModelBrowser.tsx** - Browse available models
- ✅ **ModelBuilder.tsx** - Simple model creation UI

---

## 🚧 Remaining Work (In Priority Order)

### Phase 1: Core Functionality (Today)
1. **Update Vite config to port 5610** ⏱️ 2 min
   - Change from 5600 to 5610
   - Verify no port conflicts

2. **Complete CSS styling** ⏱️ 30-45 min
   - ModelWrapper.css (iframe container, loading states)
   - Global styles (colors, fonts, animations)
   - Dashboard cards and buttons
   - Responsive breakpoints

3. **Implement tab hiding in iframe** ⏱️ 20-30 min
   - CSS injection to hide unwanted tabs
   - Try postMessage communication
   - Fallback to CSS overlays if needed

4. **Build Dashboard component** ⏱️ 20-30 min
   - Colorful hero section
   - Quick action cards (Browse, Build, Simulate)
   - Recent models section
   - K-12 friendly design

5. **Build ModelBrowser component** ⏱️ 30-40 min
   - Grid of model cards
   - Filter by category (Cell Biology, Ecosystems, etc.)
   - Search functionality
   - Click to navigate to /model/:id

6. **Build ModelBuilder component** ⏱️ 30-40 min
   - Simple template selection
   - "Choose a starting point" UI
   - Links to create new model in Cell Collective
   - Educational explanations

### Phase 2: Polish & Testing (Today/Tomorrow)
7. **Test with real model** ⏱️ 15-20 min
   - Navigate to /model/164949:1
   - Verify iframe loads Cell Collective
   - Test tab hiding works
   - Check loading states

8. **Mobile responsiveness** ⏱️ 20-30 min
   - Test on tablet sizes
   - Adjust iframe sizing
   - Touch-friendly controls

9. **Performance optimization** ⏱️ 15-20 min
   - Lazy load components
   - Optimize images
   - Add loading skeletons

### Phase 3: Deployment (Tomorrow)
10. **Deploy to GitHub Pages** ⏱️ 20-30 min
    - Build production bundle
    - Configure gh-pages deployment
    - Test live site

**Total Estimated Time:** 3-4 hours for MVP

---

## 📁 Current File Structure

```
projects/cell-collective-k12-wrapper/
├── gui/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.tsx ✅
│   │   │   ├── HomePage.tsx ✅
│   │   │   ├── ModelWrapper.tsx ✅
│   │   │   ├── Dashboard.tsx ⚠️ (needs implementation)
│   │   │   ├── ModelBrowser.tsx ⚠️ (needs implementation)
│   │   │   └── ModelBuilder.tsx ⚠️ (needs implementation)
│   │   ├── styles/
│   │   │   ├── index.css ⚠️ (needs completion)
│   │   │   ├── ModelWrapper.css ⚠️ (needs creation)
│   │   │   └── ... (other component styles)
│   │   └── App.tsx
│   ├── public/
│   ├── vite.config.ts ⚠️ (needs port update)
│   ├── package.json ✅
│   └── tsconfig.json ✅
├── WRAPPER-ARCHITECTURE.md ✅
├── EXPLORATION-PROCESS.md ✅
├── BUILD-PLAN.md ✅ (this file)
└── README.md ✅
```

---

## 🎨 Design System

### Color Palette (K-12 Friendly)
```css
--primary-50: #FFF4ED;     /* Light orange/pink */
--primary-100: #FFE6D5;
--primary-200: #FFC9A3;
--primary-300: #FFA870;
--primary-400: #FF8E4A;
--primary-500: #FF6B1A;    /* Main brand color */
--primary-600: #E55A0F;
--primary-700: #C24A0A;
--primary-800: #9E3C0B;
--primary-900: #7A2F0C;

--secondary: #4ECDC4;      /* Teal - scientific */
--accent: #FFE66D;         /* Yellow - energy */
--success: #95E1D3;        /* Mint - positive */
--danger: #F38181;         /* Coral - warnings */
```

### Typography
- **Headers:** 'Fredoka One', system-ui, sans-serif
- **Body:** 'Inter', system-ui, sans-serif
- **Code:** 'Monaco', monospace

### Component Patterns
- Large, rounded buttons (16px border-radius)
- Colorful gradient backgrounds
- Smooth animations (300ms ease)
- Shadow layers for depth
- Icons + text for clarity

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Homepage loads without errors
- [ ] Navigation works between views
- [ ] /model/164949:1 loads iframe correctly
- [ ] Cell Collective model visible in iframe
- [ ] Loading state shows before iframe loads
- [ ] Unwanted tabs are hidden
- [ ] Back button returns to homepage
- [ ] Responsive on tablet (768px width)
- [ ] No console errors

### Test URLs
- Homepage: `http://localhost:5610/`
- Model test: `http://localhost:5610/model/164949:1`
- Invalid model: `http://localhost:5610/model/invalid` (should show error)

---

## 🚀 Next Immediate Steps

**Start here when resuming work:**

1. Update `vite.config.ts` to port 5610
2. Create `ModelWrapper.css` with iframe styling
3. Complete global CSS with color system
4. Test basic iframe loading with model 164949:1
5. Implement tab hiding via CSS injection
6. Build out Dashboard component with cards
7. Test full navigation flow

---

## 💡 Key Implementation Notes

### Iframe Communication
```javascript
// Try postMessage first
iframe.contentWindow.postMessage({
  type: 'HIDE_TABS',
  tabs: ['overview', 'analysis', 'network-analysis', 'knowledge-base']
}, '*')

// Fallback: CSS overlay to hide tabs
const style = document.createElement('style')
style.textContent = `
  /* Hide unwanted tabs */
  [data-tab="overview"],
  [data-tab="analysis"] {
    display: none !important;
  }
`
```

### Model ID Parsing
- Format: `164949:1` or `164949`
- Clean: Take first part before `:`
- Validate: Must be numeric
- Build URL: `https://research.cellcollective.org/dashboard#module/${cleanId}`

### Loading States
- Show spinner while iframe loads
- Minimum 1.5s delay for smooth UX
- Error state with helpful message
- Back to home button on error

---

## 📊 Success Metrics

### MVP Success Criteria
- [ ] Loads Cell Collective model in iframe
- [ ] Hides Overview, Analysis, Network Analysis, Knowledge Base tabs
- [ ] Shows only Model and Simulation tabs
- [ ] Beautiful K-12 styled wrapper
- [ ] Works on desktop and tablet
- [ ] No login required
- [ ] Loads in < 3 seconds

### User Experience Goals
- **Time to interact:** < 5 seconds
- **Visual appeal:** Colorful, engaging, kid-friendly
- **Ease of use:** One-click access to models
- **Clarity:** Clear instructions and feedback

---

## 🎯 Future Enhancements (Post-MVP)

### Phase 2 Features
- [ ] Search and filter models by category
- [ ] Save favorite models (localStorage)
- [ ] Tutorial overlay for first-time users
- [ ] Share model links
- [ ] Print/export simulation results

### Phase 3 Features
- [ ] User accounts (optional)
- [ ] Teacher dashboard
- [ ] Classroom management
- [ ] Assignment tracking
- [ ] Custom model templates

---

**Ready to build!** Start with Phase 1, Task 1: Update Vite config to port 5610.
