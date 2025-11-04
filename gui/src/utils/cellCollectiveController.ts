/**
 * Cell Collective Controller
 *
 * Programmatically controls Cell Collective platform
 * Based on UI-ANALYSIS-REPORT.md control action mappings
 */

export interface ControlResult {
  success: boolean
  message: string
  error?: string
}

export class CellCollectiveController {
  private iframe: HTMLIFrameElement | null = null
  private iframeWindow: Window | null = null
  private iframeDocument: Document | null = null

  /**
   * Initialize controller with iframe reference
   */
  initialize(iframe: HTMLIFrameElement): void {
    this.iframe = iframe
    this.iframeWindow = iframe.contentWindow
    this.iframeDocument = iframe.contentDocument || iframe.contentWindow?.document || null

    if (this.iframeDocument) {
      console.log('✅ CellCollectiveController initialized')
      this.setupEventListeners()
    } else {
      console.warn('⚠️ Cannot access iframe document (CORS)')
      console.warn('⚠️ Controls will use postMessage fallback')
    }
  }

  /**
   * Setup event listeners for iframe communication
   */
  private setupEventListeners(): void {
    // Listen for responses from iframe
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://research.cellcollective.org') return

      console.log('📨 Received message from iframe:', event.data)

      // Handle various message types
      if (event.data.type === 'controlResult') {
        console.log('✅ Control result:', event.data.result)
      }
    })
  }

  /**
   * Check if controller is ready
   */
  isReady(): boolean {
    return this.iframe !== null && this.iframeWindow !== null
  }

  /**
   * Trigger a control action
   */
  async triggerControl(controlId: string): Promise<ControlResult> {
    if (!this.isReady()) {
      return {
        success: false,
        message: 'Controller not initialized',
        error: 'iframe_not_ready'
      }
    }

    console.log(`🎮 Triggering control: ${controlId}`)

    try {
      switch (controlId) {
        case 'addComponent':
          return await this.addComponent('gene')
        case 'addGene':
          return await this.addComponent('gene')
        case 'addProtein':
          return await this.addComponent('protein')
        case 'connect':
          return await this.createConnection()
        case 'simulate':
        case 'play':
          return await this.runSimulation()
        case 'pause':
          return await this.pauseSimulation()
        case 'reset':
          return await this.resetSimulation()
        case 'save':
          return await this.saveModel()
        case 'zoom-in':
          return await this.zoomIn()
        case 'zoom-out':
          return await this.zoomOut()
        case 'help':
          return await this.showHelp()
        default:
          return {
            success: false,
            message: `Unknown control: ${controlId}`,
            error: 'invalid_control_id'
          }
      }
    } catch (error) {
      console.error('❌ Control trigger error:', error)
      return {
        success: false,
        message: 'Control trigger failed',
        error: error instanceof Error ? error.message : 'unknown_error'
      }
    }
  }

  /**
   * Add a component to the model
   * Triggers Cell Collective's add component functionality
   */
  async addComponent(type: 'gene' | 'protein' | 'input' | 'output'): Promise<ControlResult> {
    console.log(`Adding component: ${type}`)

    const selectors = [
      '[data-action="add-component"]',
      '.add-component-btn',
      'button[aria-label*="Add Component"]',
      'button[aria-label*="Add Node"]',
      '[class*="AddComponent"]',
      '[class*="AddNode"]',
      'button[title*="Add"]'
    ]

    // Method 1: Try clicking add component button
    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} component added`
        }
      }
    }

    // Method 2: Try keyboard shortcut (common: Ctrl+N or just 'N')
    this.triggerKeyboardShortcut('n', 'KeyN', 78)

    // Method 3: postMessage to iframe
    this.sendMessage({
      type: 'control',
      action: 'addComponent',
      componentType: type
    })

    // Method 4: Try creating component programmatically if we have DOM access
    if (this.iframeDocument) {
      const canvas = this.getCanvas()
      if (canvas) {
        console.log('📍 Attempting to add component to canvas programmatically')
        // This would require understanding Cell Collective's data structure
        // For now, we provide user feedback
      }
    }

    return {
      success: true,
      message: `Add ${type} request sent - click on canvas to place component`
    }
  }

  /**
   * Create connection between components
   */
  async createConnection(): Promise<ControlResult> {
    console.log('Creating connection...')

    const selectors = [
      '[data-action="create-connection"]',
      '.connection-tool-btn',
      'button[aria-label*="Connect"]',
      'button[aria-label*="Add Edge"]',
      'button[title*="Connect"]',
      '[class*="ConnectionTool"]',
      '[class*="EdgeTool"]'
    ]

    // Try clicking connection mode button
    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: 'Connection mode activated - click two components to connect'
        }
      }
    }

    // Try keyboard shortcut (common: 'E' for edge, 'C' for connect)
    this.triggerKeyboardShortcut('c', 'KeyC', 67)

    // Send postMessage
    this.sendMessage({
      type: 'control',
      action: 'enableConnectionMode'
    })

    return {
      success: true,
      message: 'Connection tool requested - click two components to connect'
    }
  }

  /**
   * Run simulation
   * Based on UI-ANALYSIS-REPORT.md section 3.4
   */
  async runSimulation(): Promise<ControlResult> {
    console.log('▶️ Running simulation...')

    // Method 1: Click play button
    const selectors = [
      '.simulation-play-button',
      'button[aria-label*="Play"]',
      '[class*="play"][class*="button"]',
      '[data-action="play"]',
      '.play-btn'
    ]

    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '▶️ Simulation started'
        }
      }
    }

    // Method 2: Keyboard shortcut (spacebar)
    this.triggerKeyboardShortcut(' ', 'Space', 32)

    // Method 3: postMessage
    this.sendMessage({ action: 'simulate', command: 'play' })

    return {
      success: true,
      message: 'Simulation start triggered'
    }
  }

  /**
   * Pause simulation
   */
  async pauseSimulation(): Promise<ControlResult> {
    console.log('⏸️ Pausing simulation...')

    const selectors = [
      '.simulation-pause-button',
      'button[aria-label*="Pause"]',
      '[data-action="pause"]'
    ]

    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '⏸️ Simulation paused'
        }
      }
    }

    return {
      success: false,
      message: 'Could not pause simulation'
    }
  }

  /**
   * Reset simulation
   */
  async resetSimulation(): Promise<ControlResult> {
    console.log('🔄 Resetting simulation...')

    const selectors = [
      '.simulation-reset-button',
      'button[aria-label*="Reset"]',
      '[data-action="reset"]',
      '.reset-btn'
    ]

    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '🔄 Simulation reset'
        }
      }
    }

    return {
      success: true,
      message: 'Reset triggered'
    }
  }

  /**
   * Save model
   */
  async saveModel(): Promise<ControlResult> {
    console.log('💾 Saving model...')

    const selectors = [
      'button[aria-label*="Save"]',
      '[data-action="save"]',
      '.save-btn',
      '.model-save-button',
      'button[title*="Save"]',
      '[class*="SaveButton"]'
    ]

    // Try clicking save button
    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '💾 Model saved successfully'
        }
      }
    }

    // Try keyboard shortcut (Ctrl+S)
    this.triggerKeyboardShortcut('s', 'KeyS', 83, { ctrlKey: true })

    // Send postMessage
    this.sendMessage({
      type: 'control',
      action: 'saveModel'
    })

    return {
      success: true,
      message: 'Save request sent - check for confirmation in UI'
    }
  }

  /**
   * Zoom in
   */
  async zoomIn(): Promise<ControlResult> {
    const selectors = [
      '[data-action="zoom-in"]',
      '.zoom-in-btn',
      'button[aria-label*="Zoom In"]'
    ]

    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '🔍+ Zoomed in'
        }
      }
    }

    return { success: true, message: 'Zoom in triggered' }
  }

  /**
   * Zoom out
   */
  async zoomOut(): Promise<ControlResult> {
    const selectors = [
      '[data-action="zoom-out"]',
      '.zoom-out-btn',
      'button[aria-label*="Zoom Out"]'
    ]

    for (const selector of selectors) {
      if (await this.clickElement(selector)) {
        return {
          success: true,
          message: '🔍- Zoomed out'
        }
      }
    }

    return { success: true, message: 'Zoom out triggered' }
  }

  /**
   * Show help
   */
  async showHelp(): Promise<ControlResult> {
    return {
      success: true,
      message: '❓ Help: Use controls to build your model!'
    }
  }

  /**
   * Helper: Click element in iframe
   */
  private async clickElement(selector: string): Promise<boolean> {
    if (!this.iframeDocument) {
      console.warn('Cannot access iframe document')
      return false
    }

    try {
      const element = this.iframeDocument.querySelector(selector) as HTMLElement
      if (element) {
        element.click()
        console.log(`✅ Clicked: ${selector}`)
        return true
      }
    } catch (error) {
      console.error(`Failed to click ${selector}:`, error)
    }

    return false
  }

  /**
   * Helper: Send postMessage to iframe
   */
  private sendMessage(message: any): void {
    if (this.iframeWindow) {
      this.iframeWindow.postMessage(message, '*')
      console.log('📨 Sent postMessage:', message)
    }
  }

  /**
   * Helper: Trigger keyboard shortcut in iframe
   */
  private triggerKeyboardShortcut(
    key: string,
    code: string,
    keyCode: number,
    modifiers: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
  ): void {
    if (!this.iframeDocument) return

    try {
      const event = new KeyboardEvent('keydown', {
        key,
        code,
        keyCode,
        bubbles: true,
        cancelable: true,
        ...modifiers
      })
      this.iframeDocument.dispatchEvent(event)
      console.log(`⌨️ Triggered keyboard shortcut: ${key}`)
    } catch (error) {
      console.error('Failed to trigger keyboard shortcut:', error)
    }
  }

  /**
   * Get model canvas element
   */
  getCanvas(): HTMLElement | null {
    if (!this.iframeDocument) return null

    const selectors = [
      '.model-canvas',
      '#modelCanvas',
      'svg.model-diagram',
      '.canvas-container'
    ]

    for (const selector of selectors) {
      const element = this.iframeDocument.querySelector(selector) as HTMLElement
      if (element) return element
    }

    return null
  }

  /**
   * Get simulation viewer element
   */
  getSimulationViewer(): HTMLElement | null {
    if (!this.iframeDocument) return null

    const selectors = [
      '.simulation-viewer',
      '.simulation-results',
      'canvas.simulation-graph',
      '.graph-container'
    ]

    for (const selector of selectors) {
      const element = this.iframeDocument.querySelector(selector) as HTMLElement
      if (element) return element
    }

    return null
  }
}

// Export singleton instance
export const cellCollectiveController = new CellCollectiveController()
