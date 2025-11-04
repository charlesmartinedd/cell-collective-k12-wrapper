/**
 * CSS Injection System
 *
 * Injects CSS into the Cell Collective iframe to hide complex researcher UI
 * while keeping functional elements (canvas, simulation viewer) visible
 */

/**
 * CSS to hide all complex researcher-focused UI elements
 * Based on UI-ANALYSIS-REPORT.md findings
 * Updated for /research/dashboard/ structure
 */
export const HIDE_COMPLEX_UI_CSS = `
  /* Hide Navigation & Header */
  .navbar,
  .navbar-brand,
  .navbar-toggler,
  nav[role="navigation"],
  header,
  .site-header,
  .dashboard-header,
  .main-navigation,
  input[type="search"],
  .search-box,
  .search-container,
  button[aria-label*="search"],
  [class*="NavBar"],
  [class*="Header"] {
    display: none !important;
  }

  /* Hide User Controls */
  .user-controls,
  .sign-in-button,
  .user-menu,
  .account-menu,
  .profile-menu,
  .user-dashboard-link {
    display: none !important;
  }

  /* Hide Tab System & Sidebar Navigation */
  .tabs,
  .tabs.active-tabs,
  .tabs.margin,
  button.tabs,
  button[class*="tab"],
  .tab-container,
  #tab-3,
  .tab-content[data-role="researcher"],
  .dashboard-sidebar,
  .side-navigation,
  .left-panel,
  [class*="Sidebar"],
  [class*="LeftPanel"] {
    display: none !important;
  }

  /* Hide Cookie Consent */
  .cookie-banner,
  .cookie-btn,
  .cookie-customize,
  .cookie-reject,
  .cookie-accept,
  .consent-dialog,
  a[href*="privacy"],
  a[href*="cookie"] {
    display: none !important;
  }

  /* Hide Advanced Model Controls */
  .model-settings,
  .model-permissions,
  .model-sharing,
  .advanced-options,
  .export-controls,
  .import-controls,
  input[name="fileImportInput"],
  .file-upload-area,
  button[aria-label*="import"],
  .model-editor-toolbar,
  .component-library-panel,
  .properties-panel,
  .right-panel,
  .advanced-simulation-controls,
  .model-description-editor,
  .model-tags-editor,
  .model-version-control,
  [class*="RightPanel"],
  [class*="PropertiesPanel"],
  [class*="ComponentLibrary"],
  [class*="ModelSettings"],
  [class*="AdvancedControls"] {
    display: none !important;
  }

  /* Hide Social & Sharing Features */
  .share-button,
  .social-media-links,
  .collaboration-tools {
    display: none !important;
  }

  /* Hide Help & Documentation Links */
  a[href*="/help"],
  a[href*="/documentation"],
  a[href*="/about"],
  .help-icon,
  .documentation-link {
    display: none !important;
  }

  /* Hide Footer */
  footer,
  .footer,
  .page-footer,
  .site-footer,
  a[href^="mailto:support"] {
    display: none !important;
  }

  /* KEEP VISIBLE - Functional Elements */
  .model-canvas,
  .model-canvas-container,
  #modelCanvas,
  svg.model-diagram,
  .simulation-viewer,
  .simulation-results,
  .simulation-controls,
  .playback-controls,
  .graph-container,
  .chart-container,
  .time-series-graph,
  canvas.simulation-graph,
  .component-label,
  .node-label,
  .edge-label,
  [class*="label"][class*="component"],
  .tooltip,
  .info-tooltip,
  [role="tooltip"],
  .simulation-status,
  .loading-indicator,
  .status-message,
  .component-active,
  .component-inactive,
  [data-state] {
    display: block !important;
    visibility: visible !important;
  }

  /* Optimize Layout for K-12 */
  .model-canvas-container {
    width: 100% !important;
    height: calc(100vh - 150px) !important;
    margin: 0 !important;
    padding: 20px !important;
  }

  .model-canvas {
    width: 100% !important;
    height: calc(100vh - 200px) !important;
    min-height: 600px !important;
  }

  /* Ensure simulation viewer is prominent */
  .simulation-viewer {
    width: 100% !important;
    min-height: 300px !important;
  }

  /* K-12 wrapper branding */
  body {
    background: #f7fafc !important;
  }
`

/**
 * Inject CSS into iframe
 */
export function injectCSS(iframe: HTMLIFrameElement, css: string): boolean {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) {
      console.error('Cannot access iframe document (CORS?)')
      return false
    }

    // Create style element
    const style = doc.createElement('style')
    style.id = 'k12-wrapper-styles'
    style.textContent = css

    // Remove existing style if present
    const existing = doc.getElementById('k12-wrapper-styles')
    if (existing) {
      existing.remove()
    }

    // Append to head
    doc.head.appendChild(style)
    console.log('✅ K-12 CSS injected successfully')
    return true
  } catch (error) {
    console.error('Failed to inject CSS:', error)
    return false
  }
}

/**
 * Auto-accept cookie consent
 */
export function autoAcceptCookies(iframe: HTMLIFrameElement): void {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return

    // Find and click accept button
    const acceptBtn = doc.querySelector('.cookie-accept') as HTMLElement
    if (acceptBtn) {
      acceptBtn.click()
      console.log('✅ Auto-accepted cookies')
    }
  } catch (error) {
    console.error('Failed to auto-accept cookies:', error)
  }
}

/**
 * Apply all K-12 modifications to iframe
 */
export function applyK12Modifications(iframe: HTMLIFrameElement): void {
  // Wait for iframe to fully load
  setTimeout(() => {
    // Inject hiding CSS
    injectCSS(iframe, HIDE_COMPLEX_UI_CSS)

    // Auto-accept cookies
    autoAcceptCookies(iframe)

    console.log('✅ K-12 modifications applied')
  }, 500)
}

/**
 * Watch for iframe navigation and reapply modifications
 */
export function watchIframeNavigation(iframe: HTMLIFrameElement): void {
  // Listen for location changes in iframe
  try {
    const iframeWindow = iframe.contentWindow
    if (!iframeWindow) return

    // Monitor hash changes
    iframeWindow.addEventListener('hashchange', () => {
      console.log('Iframe navigated, reapplying modifications...')
      applyK12Modifications(iframe)
    })

    // Monitor popstate
    iframeWindow.addEventListener('popstate', () => {
      console.log('Iframe history changed, reapplying modifications...')
      applyK12Modifications(iframe)
    })
  } catch (error) {
    console.error('Cannot watch iframe navigation (CORS):', error)
  }
}
