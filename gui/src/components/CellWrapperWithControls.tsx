import { useState, useRef, useEffect } from 'react'
import FloatingControlPanel from './FloatingControlPanel'
import AuthModal from './AuthModal'
import { cellCollectiveController } from '../utils/cellCollectiveController'
import { applyK12Modifications, watchIframeNavigation } from '../utils/cssInjection'
import { CellCollectiveAuth } from '../utils/authenticationHelper'
import { getDefaultConfig } from '../config/FeatureConfig'
import type { FeatureConfig } from '../config/FeatureConfig'
import '../styles/wrapper.css'
import '../styles/overlay.css'
import '../styles/auth-modal.css'

interface CellWrapperWithControlsProps {
  config?: FeatureConfig
  startUrl?: string
}

function CellWrapperWithControls({
  config = getDefaultConfig(),
  startUrl = 'https://research.cellcollective.org/research/dashboard/'
}: CellWrapperWithControlsProps) {
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = CellCollectiveAuth.isAuthenticated()
    setIsAuthenticated(authenticated)

    // If not authenticated, try guest mode first
    if (!authenticated) {
      CellCollectiveAuth.tryGuestMode().then(success => {
        if (success) {
          setIsAuthenticated(true)
          showNotification('✅ Guest mode activated')
        } else {
          // Show auth modal after iframe attempts to load
          setTimeout(() => {
            setShowAuthModal(true)
            showNotification('🔒 Authentication required to access Cell Collective')
          }, 2000)
        }
      })
    }
  }, [])

  // Initialize controller and apply CSS when iframe loads
  useEffect(() => {
    if (iframeRef.current && !loading) {
      // Initialize controller
      cellCollectiveController.initialize(iframeRef.current)

      // Apply K-12 CSS modifications
      applyK12Modifications(iframeRef.current)

      // Watch for navigation to reapply CSS
      watchIframeNavigation(iframeRef.current)
    }
  }, [loading])

  const handleIframeLoad = () => {
    setLoading(false)
    console.log('✅ Cell Collective loaded successfully')

    // Inject authentication if available
    if (isAuthenticated && iframeRef.current) {
      CellCollectiveAuth.injectAuthIntoIframe(iframeRef.current)
    }

    // Apply modifications after a short delay to ensure DOM is ready
    if (iframeRef.current) {
      setTimeout(() => {
        applyK12Modifications(iframeRef.current!)
      }, 500)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    showNotification('✅ Authentication successful! Loading Cell Collective...')

    // Reload iframe with authentication
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src
      }, 100)
    }
  }

  const handleControlTrigger = async (controlId: string) => {
    console.log(`Control triggered: ${controlId}`)

    // Execute control
    const result = await cellCollectiveController.triggerControl(controlId)

    // Show notification
    showNotification(result.message)

    if (!result.success) {
      console.error('Control failed:', result.error)
    }
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="cell-wrapper">
      {/* Header */}
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

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading Cell Collective...</p>
          </div>
        </div>
      )}

      {/* Notification toast */}
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      {/* Cell Collective iframe */}
      <div className="iframe-container">
        <iframe
          ref={iframeRef}
          src={startUrl}
          className="cell-iframe"
          title="Cell Collective - Model Builder"
          onLoad={handleIframeLoad}
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        />
      </div>

      {/* Floating control panel */}
      {!loading && (
        <FloatingControlPanel
          onTriggerControl={handleControlTrigger}
          config={config}
        />
      )}

      {/* Authentication modal */}
      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}

export default CellWrapperWithControls
