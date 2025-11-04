import { useState } from 'react'
import '../styles/wrapper.css'

function SimpleCellWrapper() {
  const [loading, setLoading] = useState(true)

  // Start at Cell Collective research dashboard
  // This is the main workspace for model creation and manipulation
  const iframeUrl = 'https://research.cellcollective.org/research/dashboard/'

  // Alternative URLs for testing:
  // const iframeUrl = 'https://research.cellcollective.org/models' // Model browser
  // const iframeUrl = 'https://research.cellcollective.org/model/1' // Specific model

  const handleIframeLoad = () => {
    setLoading(false)
    console.log('Cell Collective loaded successfully')
  }

  return (
    <div className="cell-wrapper">
      {/* Simple, elegant header */}
      <header className="wrapper-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🧬</span>
            <h1 className="logo-text">Cell Model Builder</h1>
          </div>
          <div className="header-subtitle">
            Interactive Biology Simulations for Students
          </div>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading Cell Collective...</p>
          </div>
        </div>
      )}

      {/* Cell Collective iframe */}
      <div className="iframe-container">
        <iframe
          src={iframeUrl}
          className="cell-iframe"
          title="Cell Collective - Model Builder"
          onLoad={handleIframeLoad}
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        />
      </div>
    </div>
  )
}

export default SimpleCellWrapper
