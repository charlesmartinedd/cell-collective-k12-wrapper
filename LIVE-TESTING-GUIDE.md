# 🧪 Live Testing Guide - Cell Collective K-12 Wrapper

**Purpose:** Step-by-step guide to test the wrapper with live Cell Collective
**Status:** Ready for Testing
**URL:** http://localhost:5600

---

## 🎯 Prerequisites

### What You Need

1. **Dev Server Running**
   - Should already be running on localhost:5600
   - Check terminal for "VITE ready" message

2. **Cell Collective Account** (Optional but Recommended)
   - Create free account at https://cellcollective.org
   - Note your username/email and password

3. **Modern Browser**
   - Chrome, Firefox, or Edge recommended
   - Enable DevTools for debugging

---

## 📋 Test Checklist

### Phase 1: Initial Load ✅

**Test Steps:**

1. Open http://localhost:5600 in browser
2. Observe loading screen with spinner
3. Wait 2-3 seconds

**Expected Results:**
- ✅ Beautiful header with "Cell Model Builder" title
- ✅ Loading spinner with "Loading Cell Collective..." text
- ✅ Purple gradient design loads correctly

**Possible Issues:**
- If page is blank, check browser console for errors
- If styles are broken, check that CSS files imported correctly

---

### Phase 2: Authentication Flow 🔐

#### Test 2A: Guest Mode Attempt

**Expected Behavior:**
- After 2 seconds, guest mode auto-attempted
- If guest mode succeeds: Green notification "✅ Guest mode activated"
- If guest mode fails: Auth modal appears

**What to Check:**
- Browser console shows guest mode attempt
- No JavaScript errors
- Notification appears correctly positioned

#### Test 2B: Auth Modal Appearance

**If Guest Mode Fails (Expected):**

1. Auth modal appears after 2 seconds
2. Modal has beautiful purple gradient header
3. Shows 🔬 icon and "Cell Collective Access" title
4. Two buttons visible:
   - "👋 Try Guest Mode"
   - "🔑 Login with Cell Collective Account"
5. Info box with Cell Collective link

**Expected UI:**
```
┌─────────────────────────────────────┐
│  🔬  Cell Collective Access         │
│  (Purple gradient header)           │
├─────────────────────────────────────┤
│  To use the Cell Model Builder,     │
│  you need access to Cell             │
│  Collective's research platform.     │
│                                      │
│  [👋 Try Guest Mode]                 │
│  [🔑 Login with Cell Collective]    │
│                                      │
│  📚 Don't have an account?           │
│  Visit cellcollective.org           │
└─────────────────────────────────────┘
```

**What to Test:**
- ✅ Modal centered on screen
- ✅ Backdrop blur effect visible
- ✅ Modal animates in smoothly (slide up)
- ✅ Close button (✕) works (if visible)
- ✅ All text readable and properly formatted

---

### Phase 3: Login Flow 🔑

#### Test 3A: Switch to Login Mode

1. Click "🔑 Login with Cell Collective Account"
2. Modal transitions to login form

**Expected UI:**
```
┌─────────────────────────────────────┐
│  🔬  Cell Collective Access         │
│  (Purple gradient header)           │
├─────────────────────────────────────┤
│  Username or Email                  │
│  [                                ] │
│                                      │
│  Password                            │
│  [                                ] │
│                                      │
│  [🔓 Login]                          │
│  [← Back to options]                │
│                                      │
│  Forgot password?                    │
└─────────────────────────────────────┘
```

**What to Test:**
- ✅ Form fields appear correctly
- ✅ Input fields have proper styling
- ✅ Focus states work (blue border on focus)
- ✅ "Back to options" button works
- ✅ "Forgot password?" link goes to Cell Collective

#### Test 3B: Attempt Login

**Without Credentials:**
1. Leave fields empty
2. Click "🔓 Login"
3. Browser should show "required" validation

**With Invalid Credentials:**
1. Enter fake username/password
2. Click "🔓 Login"
3. Loading state shows ("⏳ Logging in...")
4. Error message appears if credentials invalid

**With Valid Credentials:**
1. Enter real Cell Collective credentials
2. Click "🔓 Login"
3. Loading state shows
4. Success notification: "✅ Authentication successful!"
5. Modal closes
6. Iframe reloads

**What to Check:**
- ✅ Loading spinner shows during login attempt
- ✅ Buttons disabled during loading
- ✅ Error messages clear and helpful
- ✅ Success triggers iframe reload
- ✅ No console errors during process

---

### Phase 4: Iframe Loading 📱

**After Successful Auth:**

1. Iframe starts loading research.cellcollective.org
2. Loading overlay appears
3. Cell Collective dashboard loads inside iframe

**Expected Results:**
- ✅ Iframe src = `https://research.cellcollective.org/research/dashboard/`
- ✅ Cell Collective UI visible in iframe
- ✅ No "403 Forbidden" or "X-Frame-Options" errors
- ✅ Loading overlay disappears when loaded

**Possible Issues:**

**Issue: Iframe Blocked by X-Frame-Options**
- Cell Collective may block iframe embedding
- Browser console shows "Refused to display in frame"
- **Solution:** Need proxy server (documented in DEBUG-REPORT.md)

**Issue: Authentication Not Passed to Iframe**
- Iframe loads but shows login page
- **Check:** Browser console for postMessage attempts
- **Solution:** May need different auth injection method

---

### Phase 5: CSS Hiding Verification 🎨

**Once Iframe Loads Successfully:**

1. Open browser DevTools (F12)
2. Select iframe element
3. Inspect Cell Collective's actual UI

**What Should Be Hidden:**

✅ **Navigation & Header**
- Top navigation bar
- Site header with logo
- User account menu
- Sign in/Sign up buttons

✅ **Sidebars & Panels**
- Left sidebar navigation
- Right properties panel
- Advanced controls panel
- Component library panel

✅ **Footer & Distractions**
- Site footer
- Cookie banners
- Tutorial overlays

**What Should Be Visible:**

✅ **Model Canvas**
- Main workspace area
- Component visualization
- Connection lines

✅ **Simulation Controls**
- Play/Pause buttons
- Simulation viewer
- Results graphs

**How to Verify:**

1. Right-click in iframe → Inspect Element
2. Look for our injected styles: `<style id="k12-overlay-hide-complex-ui">`
3. Check that elements have `display: none !important`
4. Manually toggle CSS to see hidden elements

**If CSS Not Working:**
- Check browser console for CORS errors
- Our CSS may not inject due to iframe restrictions
- May need different approach (proxy server)

---

### Phase 6: Control Panel Testing 🎮

**Once Iframe Loaded and CSS Applied:**

The floating control panel should appear on the right side.

**Test Each Button:**

#### Build Section

1. **🧬 Add Gene**
   - Click button
   - Notification appears: "✅ Add Gene successful!" OR error
   - Check console for control trigger logs
   - Verify if gene added in Cell Collective (if accessible)

2. **⚡ Add Protein**
   - Same process as Add Gene
   - Notification should appear

3. **🔗 Connect**
   - Click to create connection
   - Notification appears
   - Check if connection mode activated

#### Simulate Section

4. **▶️ Run Simulation**
   - Click to start simulation
   - Should trigger Cell Collective's run button
   - Notification appears

5. **⏸️ Pause** (if enabled)
   - Pause simulation
   - Notification appears

#### General Section

6. **💾 Save**
   - Save model
   - Notification appears

7. **❓ Help**
   - Show help dialog
   - Check what appears

**Expected for ALL Buttons:**
- Notification toast appears at top center
- Notification auto-dismisses after 3 seconds
- Console logs show control trigger attempt
- No JavaScript errors

**If Controls Don't Work:**
- This is expected without DOM access
- Cell Collective blocks programmatic control
- We can only verify UI appears correctly
- Real testing requires Cell Collective partnership

---

### Phase 7: Configuration Modes 🎛️

**Test Different Configurations:**

1. **Default Mode (K-12 Student)**
   - Select from top-left dropdown
   - All controls visible
   - Full functionality

2. **Minimal Mode (Simple)**
   - Select from dropdown
   - Fewer controls visible
   - Basic functionality only

3. **Advanced Mode (Research)**
   - Select from dropdown
   - All controls visible
   - Advanced features included

**What to Check:**
- ✅ Dropdown works and updates config
- ✅ Control panel updates immediately
- ✅ Correct buttons show/hide per mode
- ✅ No errors during mode switching

---

### Phase 8: Responsive Design 📱

**Test Different Screen Sizes:**

1. **Desktop (1920x1080)**
   - Control panel positioned correctly
   - Header readable
   - Iframe fills space

2. **Tablet (768px)**
   - Control panel still accessible
   - Header subtitle may hide (expected)
   - Touch-friendly button sizes

3. **Mobile (480px)**
   - Control panel adapts
   - Header simplified
   - All controls still accessible

**How to Test:**
- Browser DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- Test various preset devices
- Check that nothing overlaps or breaks

---

## 📊 Test Results Template

```markdown
# Test Results - Cell Collective K-12 Wrapper

**Date:** [Date]
**Tester:** [Name]
**Browser:** [Browser + Version]

## Phase 1: Initial Load
- [ ] Loading screen appears
- [ ] Styles load correctly
- [ ] No console errors
**Notes:**

## Phase 2: Authentication
- [ ] Guest mode attempted automatically
- [ ] Auth modal appears if needed
- [ ] Modal UI looks correct
**Notes:**

## Phase 3: Login
- [ ] Login form works
- [ ] Validation works
- [ ] Error handling works
- [ ] Success flow completes
**Notes:**

## Phase 4: Iframe Loading
- [ ] Iframe loads Cell Collective
- [ ] No blocking errors
- [ ] Authentication passed to iframe
**Notes:**

## Phase 5: CSS Hiding
- [ ] Complex UI hidden
- [ ] Model canvas visible
- [ ] Simulation controls visible
**Notes:**

## Phase 6: Control Panel
- [ ] All buttons appear
- [ ] Notifications work
- [ ] Controls trigger (or fail gracefully)
**Notes:**

## Phase 7: Configuration Modes
- [ ] Default mode works
- [ ] Minimal mode works
- [ ] Advanced mode works
**Notes:**

## Phase 8: Responsive Design
- [ ] Desktop looks good
- [ ] Tablet looks good
- [ ] Mobile looks good
**Notes:**

## Overall Assessment
Grade: __/100
Ready for students: [ ] Yes [ ] No [ ] Needs work

## Blockers Found
1.
2.
3.

## Recommended Next Steps
1.
2.
3.
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Auth Modal Doesn't Appear

**Symptoms:**
- Iframe loads but no auth modal
- No notification after 2 seconds

**Debugging:**
1. Check browser console for errors
2. Verify `setTimeout` is executing
3. Check that `showAuthModal` state updates
4. Look for JavaScript errors blocking execution

**Solution:**
- Open DevTools Console
- Type: `localStorage.getItem('cell_collective_auth')`
- If returns value, auth may already be stored
- Clear with: `localStorage.clear()` then reload

### Issue 2: Iframe Shows "Refused to Display"

**Symptoms:**
- Iframe empty with console error
- Error: "Refused to display in frame"

**Cause:**
- Cell Collective blocks iframe embedding
- X-Frame-Options: DENY or SAMEORIGIN

**Solution:**
- Need proxy server approach
- See DEBUG-REPORT.md section "Proxy Server Solution"
- May require Cell Collective partnership

### Issue 3: CSS Not Hiding Elements

**Symptoms:**
- Cell Collective UI fully visible
- All menus and toolbars showing

**Cause:**
- CORS blocking CSS injection
- Selectors don't match actual DOM

**Debugging:**
1. Open DevTools
2. Select iframe
3. Check for `<style id="k12-overlay-hide-complex-ui">`
4. If missing, CSS injection failed

**Solution:**
- Verify CORS allows DOM access
- May need different approach
- Document actual selectors needed

### Issue 4: Controls Don't Trigger

**Symptoms:**
- Click button, notification appears
- But nothing happens in Cell Collective

**Cause:**
- Expected! CORS blocks DOM manipulation
- Our fallback methods also blocked

**Not a Bug:**
- System designed with fallbacks
- Notifications show attempt was made
- Real functionality requires Cell Collective integration

---

## 🎯 Success Criteria

**Minimum Viable (MVP):**
- ✅ App loads without errors
- ✅ Auth modal appears and looks correct
- ✅ Iframe attempts to load Cell Collective
- ✅ Control panel appears with all buttons
- ✅ Configuration modes switch correctly

**Ideal Success:**
- ✅ All above PLUS:
- ✅ Guest mode or login works
- ✅ Iframe loads Cell Collective dashboard
- ✅ CSS successfully hides complex UI
- ✅ Model canvas and simulation viewer visible
- ✅ Controls trigger Cell Collective actions

**Perfect Implementation:**
- ✅ All above PLUS:
- ✅ Controls work 100% correctly
- ✅ No CORS issues
- ✅ Seamless authentication flow
- ✅ Students can build complete models
- ✅ Ready for classroom deployment

---

## 🚀 Next Actions After Testing

### If Tests Pass
1. Document successful features
2. Take screenshots for documentation
3. Create demo video
4. Begin student pilot testing
5. Gather feedback from teachers

### If Tests Reveal Issues
1. Document specific blockers
2. Categorize by severity
3. Create GitHub issues
4. Prioritize fixes
5. Re-test after fixes

### If Cell Collective Blocks Embedding
1. Reach out to Cell Collective team
2. Explain educational use case
3. Request partnership or API access
4. Implement proxy server if needed
5. Consider alternative approaches

---

## 📞 Support & Resources

**Documentation:**
- AUTH-INTEGRATION-COMPLETE.md - Auth system details
- DEBUG-REPORT.md - Technical debugging (900+ lines)
- VALIDATION-REPORT.md - Comprehensive validation results
- CODE-REVIEW.md - Code quality analysis

**Cell Collective Resources:**
- Website: https://cellcollective.org
- Docs: (if available)
- Support: (contact info)

**Quick Commands:**
```bash
# View dev server output
cd projects/cell-collective-k12-wrapper/gui
npm run dev

# Clear all state and start fresh
# In browser console:
localStorage.clear()
location.reload()
```

---

**Ready to test! Open http://localhost:5600 and follow the phases above.** 🚀
