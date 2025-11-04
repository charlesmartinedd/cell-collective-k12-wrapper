import { useState } from 'react'
import { getDefaultConfig } from '../config/FeatureConfig'
import type { FeatureConfig } from '../config/FeatureConfig'
import '../styles/overlay.css'

interface FloatingControlPanelProps {
  onTriggerControl: (controlId: string) => void
  config?: FeatureConfig
}

function FloatingControlPanel({ onTriggerControl, config = getDefaultConfig() }: FloatingControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeControl, setActiveControl] = useState<string | null>(null)

  const handleControlClick = (controlId: string) => {
    setActiveControl(controlId)
    onTriggerControl(controlId)

    // Visual feedback - reset after animation
    setTimeout(() => setActiveControl(null), 300)
  }

  const controls = [
    // Model Building Controls
    {
      id: 'addGene',
      icon: '🧬',
      label: 'Add Gene',
      color: 'purple',
      enabled: config.features.addGene,
      category: 'build'
    },
    {
      id: 'addProtein',
      icon: '⚡',
      label: 'Add Protein',
      color: 'blue',
      enabled: config.features.addProtein,
      category: 'build'
    },
    {
      id: 'connect',
      icon: '🔗',
      label: 'Connect',
      color: 'cyan',
      enabled: config.features.connect,
      category: 'build'
    },

    // Simulation Controls
    {
      id: 'simulate',
      icon: '▶️',
      label: 'Run',
      color: 'green',
      enabled: config.features.simulate,
      category: 'simulate',
      primary: true
    },
    {
      id: 'pause',
      icon: '⏸️',
      label: 'Pause',
      color: 'yellow',
      enabled: config.features.pause,
      category: 'simulate'
    },
    {
      id: 'reset',
      icon: '🔄',
      label: 'Reset',
      color: 'orange',
      enabled: config.features.reset,
      category: 'simulate'
    },

    // View Controls
    {
      id: 'zoom-in',
      icon: '🔍+',
      label: 'Zoom In',
      color: 'purple',
      enabled: config.features.zoom,
      category: 'view'
    },
    {
      id: 'zoom-out',
      icon: '🔍-',
      label: 'Zoom Out',
      color: 'purple',
      enabled: config.features.zoom,
      category: 'view'
    },

    // General Controls
    {
      id: 'save',
      icon: '💾',
      label: 'Save',
      color: 'blue',
      enabled: config.features.save,
      category: 'general'
    },
    {
      id: 'help',
      icon: '❓',
      label: 'Help',
      color: 'pink',
      enabled: config.features.help,
      category: 'general'
    }
  ]

  const enabledControls = controls.filter(c => c.enabled)

  return (
    <div className={`floating-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle button */}
      <button
        className="panel-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
      >
        {isExpanded ? '📌' : '🎮'}
      </button>

      {/* Panel header */}
      {isExpanded && (
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-icon">🎮</span>
            <h3>Model Controls</h3>
          </div>
          <div className="panel-subtitle">
            Click buttons to control your model
          </div>
        </div>
      )}

      {/* Control buttons */}
      {isExpanded && (
        <div className="control-grid">
          {enabledControls.map(control => (
            <button
              key={control.id}
              className={`control-button control-${control.color} ${
                activeControl === control.id ? 'active' : ''
              } ${control.primary ? 'primary' : ''}`}
              onClick={() => handleControlClick(control.id)}
              aria-label={control.label}
              title={control.label}
            >
              <span className="control-icon">{control.icon}</span>
              <span className="control-label">{control.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Student mode indicator */}
      {isExpanded && config.studentMode && (
        <div className="student-mode-badge">
          <span className="badge-icon">🎓</span>
          <span className="badge-text">Student Mode</span>
        </div>
      )}

      {/* Quick tips */}
      {isExpanded && config.features.quickTips && (
        <div className="quick-tips">
          <div className="tip-header">💡 Quick Tips</div>
          <ul className="tip-list">
            <li>Click nodes to edit them</li>
            <li>Drag to add connections</li>
            <li>Save your work often!</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default FloatingControlPanel
