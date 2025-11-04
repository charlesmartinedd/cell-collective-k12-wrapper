// Simple test component to verify React is working
function TestApp() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧬</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Cell Collective K-12 Wrapper</h2>
      <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>React is working! ✅</p>
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem 2rem',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ margin: 0, fontSize: '1rem' }}>Server: Running</p>
        <p style={{ margin: 0, fontSize: '1rem' }}>Port: 5600</p>
        <p style={{ margin: 0, fontSize: '1rem' }}>Status: Operational</p>
      </div>
    </div>
  )
}

export default TestApp
