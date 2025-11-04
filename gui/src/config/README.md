# Feature Configuration System

This directory contains the configuration system for the K-12 Cell Collective wrapper.

## Files

- **FeatureConfig.ts** - Main configuration interface and presets

## Configuration Presets

### Default Configuration (`getDefaultConfig()`)
- Student-friendly mode
- Large buttons, animations enabled
- Core controls: save, simulate, reset, zoom, help
- Quick tips enabled
- Bottom-right position

### Advanced Configuration (`getAdvancedConfig()`)
- Research/advanced student mode
- All features enabled including export, import, share
- Standard button sizes
- Bottom-right position

### Minimal Configuration (`getMinimalConfig()`)
- Essential controls only
- High contrast mode
- No animations
- Simplified interface

## Usage Examples

```typescript
// Use default configuration
<CellWrapperWithControls />

// Use advanced configuration
<CellWrapperWithControls config={getAdvancedConfig()} />

// Create custom configuration
const myConfig = createCustomConfig({
  studentMode: true,
  features: {
    save: true,
    simulate: true,
    zoom: false,
    help: true
  },
  visual: {
    largeButtons: true,
    highContrast: true
  }
})

<CellWrapperWithControls config={myConfig} />
```

## Customization

Teachers can customize the interface by:

1. Choosing a preset configuration
2. Creating custom configurations with `createCustomConfig()`
3. Adjusting feature toggles for different grade levels
4. Changing visual settings for accessibility needs

## Configuration Properties

### studentMode
- `true`: Simplified interface for K-12 students
- `false`: Full research mode

### features
- `save`: Enable save functionality
- `simulate`: Enable simulation controls
- `reset`: Enable reset button
- `zoom`: Enable zoom controls
- `help`: Enable help system
- `export`: Enable model export (advanced)
- `import`: Enable model import (advanced)
- `share`: Enable sharing features (advanced)
- `quickTips`: Show quick tips panel
- `advancedControls`: Show advanced control options

### visual
- `largeButtons`: Use large, touch-friendly buttons
- `highContrast`: High contrast mode for accessibility
- `animations`: Enable smooth animations
- `tooltips`: Show tooltips on hover

### position
- `'bottom-right'`: Default position
- `'bottom-left'`: Left side placement
- `'top-right'`: Top right placement
- `'top-left'`: Top left placement
