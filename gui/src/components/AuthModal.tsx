/**
 * Authentication Modal Component
 *
 * Provides a beautiful, student-friendly login interface
 * Appears when Cell Collective authentication is required
 */

import { useState } from 'react'
import { CellCollectiveAuth, AuthCredentials } from '../utils/authenticationHelper'
import '../styles/auth-modal.css'

interface Props {
  onAuthSuccess: () => void
  onClose?: () => void
}

export default function AuthModal({ onAuthSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'guest' | 'info'>('info')
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const success = await CellCollectiveAuth.login(credentials)
      if (success) {
        onAuthSuccess()
      } else {
        setError('Login failed. Please check your credentials and try again.')
      }
    } catch (err: any) {
      setError(CellCollectiveAuth.handleAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGuestMode = async () => {
    setLoading(true)
    setError(null)

    try {
      const success = await CellCollectiveAuth.tryGuestMode()
      if (success) {
        onAuthSuccess()
      } else {
        setError('Guest mode is not available. Please log in with your Cell Collective account.')
        setMode('login')
      }
    } catch (err) {
      setError('Guest mode failed. Please log in with your Cell Collective account.')
      setMode('login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-icon">🔬</span>
          <h2>Cell Collective Access</h2>
        </div>

        {/* Info Mode */}
        {mode === 'info' && (
          <div className="auth-content">
            <p className="auth-description">
              To use the Cell Model Builder, you need access to Cell Collective's research platform.
            </p>

            <div className="auth-options">
              <button
                className="auth-btn auth-btn-primary"
                onClick={handleGuestMode}
                disabled={loading}
              >
                {loading ? '⏳ Checking...' : '👋 Try Guest Mode'}
              </button>

              <button
                className="auth-btn auth-btn-secondary"
                onClick={() => setMode('login')}
              >
                🔑 Login with Cell Collective Account
              </button>
            </div>

            <div className="auth-info-box">
              <h4>📚 Don't have an account?</h4>
              <p>
                Cell Collective is a free research platform for building biological models.
                Visit <a href="https://cellcollective.org" target="_blank" rel="noopener">cellcollective.org</a> to create an account.
              </p>
            </div>

            {onClose && (
              <button className="auth-close" onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <div className="auth-content">
            <form onSubmit={handleLogin} className="auth-form">
              {error && (
                <div className="auth-error">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username or Email</label>
                <input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your Cell Collective username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn-primary auth-btn-full"
                disabled={loading}
              >
                {loading ? '⏳ Logging in...' : '🔓 Login'}
              </button>

              <button
                type="button"
                className="auth-btn auth-btn-text"
                onClick={() => setMode('info')}
                disabled={loading}
              >
                ← Back to options
              </button>
            </form>

            <div className="auth-help">
              <a href="https://research.cellcollective.org/reset-password" target="_blank" rel="noopener">
                Forgot password?
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
