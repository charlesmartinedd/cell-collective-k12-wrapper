# Cell Collective K-12 Wrapper - Testing Guide

**Quick Start Testing Instructions**

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
cd C:\Users\MarieLexisDad\projects\cell-collective-k12-wrapper\gui
npm run dev
```

**Expected Output:**
```
VITE v4.3.0  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### 2. Open in Browser

Navigate to: `http://localhost:5173/`

### 3. Expected Behavior

**Loading Phase (0-3 seconds):**
- See "Cell Model Builder" header
- Loading spinner with "Loading Cell Collective..."
- Iframe begins loading research dashboard

**Loaded Phase (after 3-5 seconds):**
- Loading spinner disappears
- Iframe shows Cell Collective research dashboard
- Floating control panel appears (bottom-right)
- Console shows: "✅ Cell Collective loaded successfully"

---

## 🧪 Test Checklist

### Phase 1: Basic Loading ⏱️ 2 minutes

- [ ] Development server starts without errors
- [ ] Browser opens to localhost:5173
- [ ] Header shows "Cell Model Builder 🧬"
- [ ] Iframe loads research dashboard URL
- [ ] Loading spinner disappears after load
- [ ] No console errors
- [ ] Floating control panel visible

**Console Commands:**
```javascript
// Check iframe loaded
document.querySelector('iframe').src
// Should show: https://research.cellcollective.org/research/dashboard/

// Check controller initialized
console.log('Controller ready:', window.cellCollectiveController?.isReady())
```

---

### Phase 2: CSS Injection ⏱️ 3 minutes

- [ ] Open browser DevTools (F12)
- [ ] Inspect iframe element
- [ ] Check for style injection

**Manual Inspection:**

1. Right-click iframe → Inspect
2. Navigate to iframe's `<head>` element
3. Look for `<style id="k12-wrapper-styles">`

**Expected:** Style tag exists with CSS rules

**Console Test:**
```javascript
const iframe = document.querySelector('iframe');
const doc = iframe.contentDocument || iframe.contentWindow?.document;

if (doc) {
  const style = doc.getElementById('k12-wrapper-styles');
  console.log('✅ CSS Injected:', !!style);

  // Check if navbar is hidden
  const navbar = doc.querySelector('.navbar, [class*="NavBar"]');
  if (navbar) {
    console.log('Navbar display:', window.getComputedStyle(navbar).display);
    // Should be: "none"
  }
} else {
  console.log('❌ Cannot access iframe (CORS blocked)');
}
```

**Visual Checks:**
- [ ] No top navigation bar visible
- [ ] No left sidebar visible
- [ ] No right properties panel visible
- [ ] Model canvas is prominent and centered
- [ ] Clean, simplified interface

---

### Phase 3: Control Panel ⏱️ 2 minutes

**Visual Inspection:**
- [ ] Control panel appears in bottom-right corner
- [ ] Panel shows "Model Controls 🎮" header
- [ ] "Student Mode 🎓" badge visible
- [ ] Quick tips section visible
- [ ] All buttons have icons and labels

**Buttons Present:**
- [ ] Add Gene 🧬
- [ ] Add Protein ⚡
- [ ] Connect 🔗
- [ ] Run ▶️ (green, primary)
- [ ] Pause ⏸️
- [ ] Reset 🔄
- [ ] Zoom In 🔍+
- [ ] Zoom Out 🔍-
- [ ] Save 💾
- [ ] Help ❓

**Interaction Test:**
- [ ] Panel can collapse (click 📌)
- [ ] Panel can expand (click 🎮)
- [ ] Buttons are clickable
- [ ] Hover shows button labels

---

### Phase 4: Control Actions ⏱️ 10 minutes

Test each control button:

#### Test 1: Add Gene 🧬

**Steps:**
1. Click "Add Gene" button
2. Check console logs
3. Observe iframe for response
4. Look for notification toast

**Expected Console:**
```
🎮 Triggering control: addGene
Adding component: gene
✅ Add gene request sent - click on canvas to place component
```

**Expected Notification:**
- Toast appears: "Add gene request sent..."
- Disappears after 3 seconds

**Iframe Behavior:**
- [ ] Component placement mode activated (if DOM accessible)
- [ ] Cursor changes or UI feedback
- [ ] Can click canvas to place component

#### Test 2: Connect 🔗

**Steps:**
1. Click "Connect" button
2. Check console logs
3. Observe iframe

**Expected:**
- Console: "Connection mode activated..."
- Notification: "Connection tool requested..."
- Iframe: Connection mode UI appears

#### Test 3: Run Simulation ▶️

**Steps:**
1. Click "Run" button
2. Check console
3. Watch for simulation

**Expected:**
- Console: "▶️ Running simulation..."
- Notification: "Simulation start triggered"
- Iframe: Simulation begins (if model exists)

#### Test 4: Save Model 💾

**Steps:**
1. Click "Save" button
2. Check console
3. Look for save confirmation

**Expected:**
- Console: "💾 Saving model..."
- Notification: "Save request sent..."
- Iframe: Save dialog or auto-save

**Full Test Matrix:**

| Button | Click | Console Log | Notification | Iframe Response |
|--------|-------|-------------|--------------|-----------------|
| Add Gene | ✅ | ✅ | ✅ | ⏳ |
| Add Protein | ✅ | ✅ | ✅ | ⏳ |
| Connect | ✅ | ✅ | ✅ | ⏳ |
| Run | ✅ | ✅ | ✅ | ⏳ |
| Pause | ✅ | ✅ | ✅ | ⏳ |
| Reset | ✅ | ✅ | ✅ | ⏳ |
| Zoom In | ✅ | ✅ | ✅ | ⏳ |
| Zoom Out | ✅ | ✅ | ✅ | ⏳ |
| Save | ✅ | ✅ | ✅ | ⏳ |
| Help | ✅ | ✅ | ✅ | ⏳ |

---

### Phase 5: Error Scenarios ⏱️ 5 minutes

#### Scenario A: CORS Blocking

**Trigger:** iframe blocks DOM access

**Expected Behavior:**
- Console warning: "⚠️ Cannot access iframe document (CORS)"
- Console: "⚠️ Controls will use postMessage fallback"
- Controls still attempt actions via postMessage
- User sees notifications
- No JavaScript errors

**Test:**
```javascript
const controller = window.cellCollectiveController;
console.log('Document accessible:', !!controller?.iframeDocument);
```

#### Scenario B: Authentication Required

**Trigger:** Dashboard requires login

**Expected Behavior:**
- Iframe shows login page
- Wrapper still loads
- Controls are available (but won't work until logged in)
- No console errors

**Action Required:**
- Document authentication requirements
- Investigate guest mode
- Contact Cell Collective if needed

#### Scenario C: Network Error

**Trigger:** Iframe fails to load

**Simulate:**
1. Disconnect internet
2. Refresh page

**Expected:**
- Loading spinner persists
- Console error visible
- Clear error message to user

---

### Phase 6: Browser Compatibility ⏱️ 10 minutes

Test in multiple browsers:

#### Chrome/Edge
- [ ] Iframe loads
- [ ] CSS injection works
- [ ] Controls function
- [ ] No console errors

#### Firefox
- [ ] Iframe loads
- [ ] CSS injection works
- [ ] Controls function
- [ ] No console errors

#### Safari (Mac only)
- [ ] Iframe loads
- [ ] CSS injection works
- [ ] Controls function
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Issue: Iframe Doesn't Load

**Symptoms:** Blank iframe, perpetual loading

**Checks:**
1. Check browser console for errors
2. Try URL directly: https://research.cellcollective.org/research/dashboard/
3. Check network tab for blocked requests
4. Verify no browser extensions blocking

**Solutions:**
- Disable ad blockers
- Check X-Frame-Options
- Try incognito mode
- Verify Cell Collective is accessible

### Issue: CSS Not Applied

**Symptoms:** Full researcher UI visible

**Checks:**
1. Inspect iframe head for style tag
2. Check timing of injection (should be 500ms delay)
3. Look for CORS errors

**Debug Command:**
```javascript
const iframe = document.querySelector('iframe');
setTimeout(() => {
  const doc = iframe.contentDocument;
  if (doc) {
    const style = doc.getElementById('k12-wrapper-styles');
    console.log('Style tag:', style?.textContent?.length, 'characters');
  }
}, 1000);
```

**Solutions:**
- Increase injection delay in `cssInjection.ts`
- Verify selectors match actual DOM
- Check iframe allows same-origin access

### Issue: Controls Don't Work

**Symptoms:** Buttons click but no effect

**Checks:**
1. Console shows control trigger logs
2. Selector attempts logged
3. No element found messages

**Debug:**
```javascript
// Manually test a control
window.cellCollectiveController?.triggerControl('addGene').then(result => {
  console.log('Result:', result);
});

// Check if elements exist
const iframe = document.querySelector('iframe');
const doc = iframe.contentDocument;
if (doc) {
  console.log('Add button found:', !!doc.querySelector('[data-action="add-component"]'));
}
```

**Solutions:**
- Inspect actual button selectors
- Update controller with correct selectors
- Use keyboard shortcuts as fallback
- Rely on postMessage method

---

## 📊 Test Report Template

**Date:** _______________
**Tester:** _______________
**Environment:** Development / Staging / Production

### Summary

- **Overall Status:** Pass / Fail / Partial
- **Critical Issues:** _______________
- **Minor Issues:** _______________

### Detailed Results

**Phase 1 - Loading:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

**Phase 2 - CSS:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

**Phase 3 - Controls:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

**Phase 4 - Actions:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

**Phase 5 - Errors:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

**Phase 6 - Browsers:** ✅ Pass  ⚠️ Issues  ❌ Fail
_Notes:_ _______________

### Recommendations

1. _______________
2. _______________
3. _______________

---

## 🎯 Success Criteria

**Minimum Viable Product (MVP):**
- ✅ Wrapper loads without errors
- ✅ Iframe displays research dashboard
- ✅ Control panel visible and interactive
- ✅ At least 3 controls trigger actions
- ✅ User notifications work

**Production Ready:**
- ✅ All controls functional
- ✅ CSS injection hides all researcher UI
- ✅ Authentication handled
- ✅ No console errors
- ✅ Works in 3+ browsers
- ✅ Responsive design
- ✅ Clear user feedback

**Excellent:**
- ✅ Complete student workflow tested
- ✅ Error handling validated
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Teacher tested and approved

---

## 📞 Need Help?

**Debug Output Command:**
```javascript
// Copy all debug info at once
console.log('=== DEBUG INFO ===');
console.log('Iframe URL:', document.querySelector('iframe')?.src);
console.log('Controller Ready:', window.cellCollectiveController?.isReady());

const iframe = document.querySelector('iframe');
const doc = iframe?.contentDocument;
console.log('DOM Access:', !!doc);

if (doc) {
  console.log('CSS Injected:', !!doc.getElementById('k12-wrapper-styles'));
  console.log('Canvas Found:', !!doc.querySelector('.model-canvas, #modelCanvas'));
}

// Test a control
window.cellCollectiveController?.triggerControl('addGene').then(r => {
  console.log('Test Result:', r);
});
```

**Contact:**
- Review DEBUG-REPORT.md for detailed technical info
- Check console logs for specific errors
- Take screenshots of issues
- Document expected vs actual behavior

---

**Happy Testing! 🧪**
