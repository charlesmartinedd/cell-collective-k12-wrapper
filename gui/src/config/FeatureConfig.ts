/**
 * Feature Configuration System
 *
 * Controls which features are enabled in the K-12 overlay
 * Allows teachers to customize the interface for different grade levels
 */

export interface FeatureConfig {
  // Student mode simplifies the interface
  studentMode: boolean

  // Individual feature toggles
  features: {
    // Model building
    addComponent: boolean
    addGene: boolean
    addProtein: boolean
    addInput: boolean
    addOutput: boolean
    connect: boolean
    editComponent: boolean
    deleteComponent: boolean

    // Simulation controls
    save: boolean
    simulate: boolean
    pause: boolean
    reset: boolean
    stop: boolean
    speedControl: boolean

    // Analysis
    viewGraphs: boolean
    exportResults: boolean
    compareRuns: boolean

    // UI helpers
    zoom: boolean
    help: boolean
    export: boolean
    import: boolean
    share: boolean
    quickTips: boolean
    advancedControls: boolean
    undo: boolean
    redo: boolean
  }

  // Visual settings
  visual: {
    largeButtons: boolean
    highContrast: boolean
    animations: boolean
    tooltips: boolean
  }

  // Control panel position
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

/**
 * Default configuration for K-12 students
 * Simplified, beginner-friendly settings
 */
export function getDefaultConfig(): FeatureConfig {
  return {
    studentMode: true,
    features: {
      // Model building
      addComponent: true,
      addGene: true,
      addProtein: true,
      addInput: false, // Simplified for K-12
      addOutput: false, // Simplified for K-12
      connect: true,
      editComponent: true,
      deleteComponent: true,

      // Simulation controls
      save: true,
      simulate: true,
      pause: true,
      reset: true,
      stop: false,
      speedControl: false,

      // Analysis
      viewGraphs: true,
      exportResults: false,
      compareRuns: false,

      // UI helpers
      zoom: true,
      help: true,
      export: false, // Advanced feature
      import: false, // Advanced feature
      share: false,  // Advanced feature
      quickTips: true,
      advancedControls: false,
      undo: true,
      redo: false
    },
    visual: {
      largeButtons: true,
      highContrast: false,
      animations: true,
      tooltips: true
    },
    position: 'bottom-right'
  }
}

/**
 * Advanced configuration for older students or research mode
 */
export function getAdvancedConfig(): FeatureConfig {
  return {
    studentMode: false,
    features: {
      // Model building - all enabled
      addComponent: true,
      addGene: true,
      addProtein: true,
      addInput: true,
      addOutput: true,
      connect: true,
      editComponent: true,
      deleteComponent: true,

      // Simulation controls - all enabled
      save: true,
      simulate: true,
      pause: true,
      reset: true,
      stop: true,
      speedControl: true,

      // Analysis - all enabled
      viewGraphs: true,
      exportResults: true,
      compareRuns: true,

      // UI helpers
      zoom: true,
      help: true,
      export: true,
      import: true,
      share: true,
      quickTips: false,
      advancedControls: true,
      undo: true,
      redo: true
    },
    visual: {
      largeButtons: false,
      highContrast: false,
      animations: true,
      tooltips: true
    },
    position: 'bottom-right'
  }
}

/**
 * Minimal configuration for testing
 * Only essential controls
 */
export function getMinimalConfig(): FeatureConfig {
  return {
    studentMode: true,
    features: {
      // Model building - minimal
      addComponent: false,
      addGene: true,
      addProtein: false,
      addInput: false,
      addOutput: false,
      connect: true,
      editComponent: false,
      deleteComponent: false,

      // Simulation controls - minimal
      save: true,
      simulate: true,
      pause: false,
      reset: true,
      stop: false,
      speedControl: false,

      // Analysis - minimal
      viewGraphs: true,
      exportResults: false,
      compareRuns: false,

      // UI helpers
      zoom: false,
      help: true,
      export: false,
      import: false,
      share: false,
      quickTips: false,
      advancedControls: false,
      undo: false,
      redo: false
    },
    visual: {
      largeButtons: true,
      highContrast: true,
      animations: false,
      tooltips: false
    },
    position: 'bottom-right'
  }
}

/**
 * Create custom configuration
 */
export function createCustomConfig(overrides: Partial<FeatureConfig>): FeatureConfig {
  return {
    ...getDefaultConfig(),
    ...overrides,
    features: {
      ...getDefaultConfig().features,
      ...overrides.features
    },
    visual: {
      ...getDefaultConfig().visual,
      ...overrides.visual
    }
  }
}

/**
 * Validate configuration
 */
export function validateConfig(config: FeatureConfig): boolean {
  // Ensure at least one control is enabled
  const hasEnabledFeature = Object.values(config.features).some(v => v === true)

  if (!hasEnabledFeature) {
    console.warn('FeatureConfig: No features enabled, using default config')
    return false
  }

  return true
}
