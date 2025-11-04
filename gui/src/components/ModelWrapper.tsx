import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../styles/ModelWrapper.css'


function ModelWrapper() {
  const { modelId } = useParams<{ modelId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string>('')

  useEffect(() => {
    if (!modelId) {
      setError('No model ID provided')
      setLoading(false)
      return
    }

    try {
      // Parse model ID - format can be "164949:1" or just "164949"
      const cleanId = modelId.split(':')[0]

      if (!cleanId || isNaN(Number(cleanId))) {
        throw new Error('Invalid model ID format')
      }

      // Build Cell Collective iframe URL
      const url = `https://research.cellcollective.org/dashboard#module/${cleanId}`
      setIframeUrl(url)

      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model')
      setLoading(false)
    }
  }, [modelId])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false)

    // Try to inject CSS to hide unwanted tabs
    try {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        // Send message to hide tabs (if Cell Collective supports postMessage)
        iframe.contentWindow.postMessage({
          type: 'HIDE_TABS',
          tabs: ['overview', 'analysis', 'network-analysis', 'knowledge-base']
        }, '*')
      }
    } catch (err) {
      console.warn('Could not communicate with iframe:', err)
    }
  }

  if (error) {
    return (
      <div className="model-wrapper">
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <div className="error-details">
              <p>Model ID: <code>{modelId || 'Not provided'}</code></p>
              <p className="help-text">
                Expected format: <code>164949:1</code> or <code>164949</code>
              </p>
            </div>
            <Link to="/" className="btn btn-primary">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="model-wrapper">
      {/* K-12 Styled Header */}
      <header className="model-header">
        <div className="header-content">
          <Link to="/" className="back-button">
            ← Back to Cell Explorer
          </Link>
          <div className="model-info">
            <div className="model-badge">
              <span className="badge-icon">🧬</span>
              <span className="badge-text">Model {modelId}</span>
            </div>
            <h1 className="model-title">Interactive Cell Model</h1>
          </div>
          <div className="header-actions">
            <button className="help-button" title="Help">
              💡 Quick Tips
            </button>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">Loading your cell model...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Cell Collective Iframe */}
      <div className="iframe-container">
        <iframe
          src={iframeUrl}
          className="model-iframe"
          title="Cell Collective Model"
          onLoad={handleIframeLoad}
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Quick Tips Tooltip (initially hidden) */}
      <div className="tips-panel" id="tips-panel" style={{ display: 'none' }}>
        <h3>🎯 Quick Tips</h3>
        <ul>
          <li>Use the <strong>Model</strong> tab to explore the cell components</li>
          <li>Try the <strong>Simulation</strong> tab to see cells in action!</li>
          <li>Click and drag to pan around the model</li>
          <li>Zoom in and out to see different levels of detail</li>
        </ul>
      </div>
    </div>
  )
}

export default ModelWrapper
