import { useRef, useState } from 'react'

function CustomPlatformUI() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [activeTab, setActiveTab] = useState<'model' | 'help' | 'progress'>('model')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cellCollectivePage, setCellCollectivePage] = useState<'overview' | 'model' | 'analysis'>('overview')
  const [showCustomContent, setShowCustomContent] = useState(true)

  // Function to simulate clicking Cell Collective tabs by dispatching events at coordinates
  const navigateCellCollective = (page: 'overview' | 'model' | 'analysis') => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return

    // Approximate pixel positions of Cell Collective's tabs (after -100px margin adjustment)
    // These are relative to the iframe's visible area
    const tabPositions = {
      overview: { x: 80, y: 40 },   // Overview tab position
      model: { x: 180, y: 40 },      // Model tab position
      analysis: { x: 250, y: 40 }    // Analysis tab position
    }

    const position = tabPositions[page]

    try {
      // Create and dispatch a click event at the calculated position
      const clickEvent = new MouseEvent('click', {
        view: iframeRef.current.contentWindow,
        bubbles: true,
        cancelable: true,
        clientX: position.x,
        clientY: position.y
      })

      // Try to dispatch the event (may be blocked by CORS)
      iframeRef.current.contentWindow.dispatchEvent(clickEvent)
      setCellCollectivePage(page)
    } catch (error) {
      console.log('Could not simulate click due to CORS, trying alternative method...')

      // Fallback: Just update our UI state
      setCellCollectivePage(page)
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left Sidebar - OUR CUSTOM UI with ModelIt K12 blue colors */}
      {sidebarOpen && (
        <div style={{
          width: '280px',
          background: 'linear-gradient(180deg, #047abe 0%, #0F6ACE 100%)',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '2px 0 12px rgba(0,0,0,0.1)'
        }}>
          {/* Logo/Branding */}
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
              🧬 ModelIt!
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: '13px', opacity: 0.9 }}>
              Interactive Cell Modeling Platform
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('model')}
              style={{
                padding: '12px 16px',
                background: activeTab === 'model' ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: activeTab === 'model' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              📊 Model Builder
            </button>
            <button
              onClick={() => setActiveTab('help')}
              style={{
                padding: '12px 16px',
                background: activeTab === 'help' ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: activeTab === 'help' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              📚 Learning Resources
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              style={{
                padding: '12px 16px',
                background: activeTab === 'progress' ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: activeTab === 'progress' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              🎯 My Progress
            </button>
          </div>

          {/* Cell Collective Page Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>
              Switch View
            </h3>
            <button
              onClick={() => navigateCellCollective('overview')}
              style={{
                padding: '10px 12px',
                background: cellCollectivePage === 'overview' ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                color: 'white',
                border: cellCollectivePage === 'overview' ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: cellCollectivePage === 'overview' ? 600 : 500,
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              📋 Overview
            </button>
            <button
              onClick={() => navigateCellCollective('model')}
              style={{
                padding: '10px 12px',
                background: cellCollectivePage === 'model' ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                color: 'white',
                border: cellCollectivePage === 'model' ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: cellCollectivePage === 'model' ? 600 : 500,
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              🧬 Model
            </button>
            <button
              onClick={() => navigateCellCollective('analysis')}
              style={{
                padding: '10px 12px',
                background: cellCollectivePage === 'analysis' ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                color: 'white',
                border: cellCollectivePage === 'analysis' ? 'none' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: cellCollectivePage === 'analysis' ? 600 : 500,
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              📊 Analysis
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>
              Quick Actions
            </h3>
            <button style={{
              padding: '10px 12px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px'
            }}>
              ▶️ Run Simulation
            </button>
            <button style={{
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '13px'
            }}>
              🔄 Reset Model
            </button>
            <button style={{
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '13px'
            }}>
              💾 Save Progress
            </button>
          </div>

          {/* Student Info */}
          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '8px',
            fontSize: '12px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>👤 Student Mode</p>
            <p style={{ margin: '4px 0 0', opacity: 0.8 }}>E. coli K-12 Model</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '8px 12px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {sidebarOpen ? '◀️' : '▶️'} {sidebarOpen ? 'Hide' : 'Show'} Sidebar
            </button>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
              {activeTab === 'model' && '🔬 Interactive Model Builder'}
              {activeTab === 'help' && '📖 Learning Resources'}
              {activeTab === 'progress' && '📈 Student Progress'}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Escherichia coli K-12
            </span>
            <div style={{
              padding: '6px 12px',
              background: '#10b981',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              ● ACTIVE
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, position: 'relative', background: '#f9fafb' }}>
          {activeTab === 'model' && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* Cell Collective iframe - hide ALL Cell Collective branding */}
              <iframe
                ref={iframeRef}
                src={`https://research.cellcollective.org/dashboard#module/164947:1/escherichia-coli-str-k12-substr-mg1655/1${cellCollectivePage === 'model' ? '/model' : cellCollectivePage === 'analysis' ? '/analysis' : ''}`}
                style={{
                  width: '100%',
                  height: 'calc(100% + 180px)',  // Extended height to hide black nav bar
                  marginTop: '-180px',  // Hide Cell Collective's black navigation bar completely
                  border: 'none',
                  overflow: 'hidden'
                }}
                allow="fullscreen"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
                title="Cell Collective Model Builder"
              />

              {/* Custom overlay panel - positioned EXACTLY over Description panel on RIGHT SIDE */}
              {showCustomContent && (
                <div style={{
                  position: 'absolute',
                  right: '20px',   // Description panel is on the RIGHT side
                  top: '60px',     // Below our blue banner
                  width: '380px',  // Width of Description panel on right
                  height: 'calc(100% - 80px)',  // Full height minus top offset
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 50,
                  overflow: 'hidden',
                  border: '2px solid #047abe',
                  minHeight: '500px',  // Ensure minimum height for content
                  maxHeight: 'calc(100vh - 150px)'  // Responsive: never taller than viewport
                }}>
                  {/* Minimal header with only close button - no text */}
                  <div style={{
                    background: 'linear-gradient(135deg, #047abe 0%, #0F6ACE 100%)',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={() => setShowCustomContent(false)}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Embedded SCORM content */}
                  <iframe
                    src="/modelit-course/index.html"
                    style={{
                      width: '100%',
                      height: 'calc(100% - 36px)',  // Adjusted for smaller header
                      border: 'none'
                    }}
                    title="ModelIt Learning Module"
                    allow="fullscreen"
                  />
                </div>
              )}

              {/* Show button when custom content is hidden */}
              {!showCustomContent && (
                <button
                  onClick={() => setShowCustomContent(true)}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '60px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #047abe 0%, #0F6ACE 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    zIndex: 50,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  📚 Show
                </button>
              )}
            </div>
          )}

          {activeTab === 'help' && (
            <div style={{
              padding: '32px',
              maxWidth: '800px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginTop: '24px'
            }}>
              <h2 style={{ margin: '0 0 16px', color: '#1f2937' }}>📚 Learning Resources</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Getting Started</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    Learn how to build and simulate biological models
                  </p>
                </div>
                <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>Video Tutorials</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    Watch step-by-step guides for model building
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div style={{
              padding: '32px',
              maxWidth: '800px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginTop: '24px'
            }}>
              <h2 style={{ margin: '0 0 16px', color: '#1f2937' }}>🎯 My Progress</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>✅ E. coli Model Started</span>
                    <span style={{ fontSize: '12px', color: '#059669' }}>Today</span>
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>⏳ Run First Simulation</span>
                    <span style={{ fontSize: '12px', color: '#d97706' }}>In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomPlatformUI
