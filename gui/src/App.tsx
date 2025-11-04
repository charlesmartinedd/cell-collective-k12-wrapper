import { useState } from 'react'
import CellWrapperWithControls from './components/CellWrapperWithControls'
import { getDefaultConfig, getAdvancedConfig, getMinimalConfig } from './config/FeatureConfig'
import type { FeatureConfig } from './config/FeatureConfig'
import './styles/index.css'
import './App.css'

function App() {
  console.log('🚀 App component mounting...')
  const [config, setConfig] = useState<FeatureConfig>(getDefaultConfig())
  const [configMode, setConfigMode] = useState<'default' | 'advanced' | 'minimal'>('default')
  console.log('✅ App state initialized, config mode:', configMode)

  const handleConfigChange = (mode: 'default' | 'advanced' | 'minimal') => {
    setConfigMode(mode)
    switch (mode) {
      case 'default':
        setConfig(getDefaultConfig())
        break
      case 'advanced':
        setConfig(getAdvancedConfig())
        break
      case 'minimal':
        setConfig(getMinimalConfig())
        break
    }
  }

  console.log('📦 App rendering...')
  return (
    <div className="app">
      {/* Configuration Panel (for testing/demo) */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 10001,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        <label style={{ margin: 0 }}>Configuration Mode:</label>
        <select
          value={configMode}
          onChange={(e) => handleConfigChange(e.target.value as any)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'white',
            color: '#667eea',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="default">Default (K-12 Student)</option>
          <option value="minimal">Minimal (Simple)</option>
          <option value="advanced">Advanced (Research)</option>
        </select>
      </div>

      {/* Main Wrapper with Controls */}
      <CellWrapperWithControls config={config} />
    </div>
  )
}

export default App
