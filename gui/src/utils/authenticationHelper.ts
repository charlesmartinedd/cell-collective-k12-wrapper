/**
 * Cell Collective Authentication Helper
 *
 * Handles authentication flow for Cell Collective research dashboard
 * Three approaches:
 * 1. Guest mode (if available)
 * 2. Stored credentials (encrypted in localStorage)
 * 3. OAuth/SSO integration (future)
 */

import * as React from 'react'

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthState {
  isAuthenticated: boolean
  user?: {
    id: string
    name: string
    email: string
  }
  token?: string
  expiresAt?: Date
}

export class CellCollectiveAuth {
  private static readonly STORAGE_KEY = 'cell_collective_auth'
  private static readonly AUTH_URL = 'https://research.cellcollective.org/auth/login'

  /**
   * Check if user is already authenticated
   */
  static isAuthenticated(): boolean {
    const auth = this.getStoredAuth()
    if (!auth || !auth.expiresAt) return false
    return new Date() < new Date(auth.expiresAt)
  }

  /**
   * Get stored authentication state
   */
  static getStoredAuth(): AuthState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      return JSON.parse(stored)
    } catch (err) {
      console.error('Failed to parse stored auth:', err)
      return null
    }
  }

  /**
   * Store authentication state
   */
  static storeAuth(auth: AuthState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(auth))
    } catch (err) {
      console.error('Failed to store auth:', err)
    }
  }

  /**
   * Clear stored authentication
   */
  static clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Attempt guest/anonymous access
   * Cell Collective may offer guest mode for viewing models
   */
  static async tryGuestMode(): Promise<boolean> {
    try {
      const response = await fetch('https://research.cellcollective.org/api/guest-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        this.storeAuth({
          isAuthenticated: true,
          user: { id: 'guest', name: 'Guest', email: 'guest@k12wrapper.local' },
          token: data.token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        })
        return true
      }
    } catch (err) {
      console.warn('Guest mode not available:', err)
    }
    return false
  }

  /**
   * Authenticate with username/password
   * Note: This requires proper CORS setup from Cell Collective
   */
  static async login(credentials: AuthCredentials): Promise<boolean> {
    try {
      const response = await fetch(this.AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        this.storeAuth({
          isAuthenticated: true,
          user: data.user,
          token: data.token,
          expiresAt: new Date(data.expiresAt)
        })
        return true
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
    return false
  }

  /**
   * Inject authentication into iframe
   * This sets cookies/tokens that Cell Collective expects
   */
  static injectAuthIntoIframe(iframe: HTMLIFrameElement): boolean {
    const auth = this.getStoredAuth()
    if (!auth || !auth.token) return false

    try {
      // Send authentication token via postMessage
      iframe.contentWindow?.postMessage({
        type: 'AUTH_INJECT',
        token: auth.token,
        user: auth.user
      }, 'https://research.cellcollective.org')

      return true
    } catch (err) {
      console.error('Failed to inject auth:', err)
      return false
    }
  }

  /**
   * Handle authentication errors
   */
  static handleAuthError(error: any): string {
    if (error.status === 401) {
      return 'Invalid credentials. Please check your username and password.'
    }
    if (error.status === 403) {
      return 'Access denied. You may not have permission to access Cell Collective.'
    }
    if (error.status === 429) {
      return 'Too many login attempts. Please wait a few minutes and try again.'
    }
    return 'Authentication failed. Please try again later.'
  }
}

/**
 * React hook for authentication state
 */
export function useAuth() {
  const [authState, setAuthState] = React.useState<AuthState | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check for existing authentication
    const stored = CellCollectiveAuth.getStoredAuth()
    if (stored && CellCollectiveAuth.isAuthenticated()) {
      setAuthState(stored)
    }
    setLoading(false)
  }, [])

  const login = async (credentials: AuthCredentials) => {
    setLoading(true)
    const success = await CellCollectiveAuth.login(credentials)
    if (success) {
      setAuthState(CellCollectiveAuth.getStoredAuth())
    }
    setLoading(false)
    return success
  }

  const logout = () => {
    CellCollectiveAuth.clearAuth()
    setAuthState(null)
  }

  const tryGuest = async () => {
    setLoading(true)
    const success = await CellCollectiveAuth.tryGuestMode()
    if (success) {
      setAuthState(CellCollectiveAuth.getStoredAuth())
    }
    setLoading(false)
    return success
  }

  return {
    authState,
    loading,
    isAuthenticated: authState?.isAuthenticated ?? false,
    login,
    logout,
    tryGuest
  }
}
