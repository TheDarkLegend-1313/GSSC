import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tokenService } from '../services/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore auth state on page refresh
  useEffect(() => {
    if (tokenService.hasTokens()) {
      const username = tokenService.getUsername()
      if (username) {
        setUser({ username })
      }
    }
    setLoading(false)
  }, [])

  // LOGIN
  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password)

      /*
        Expected response structure (can vary):
        {
          access_token or access,
          refresh_token or refresh,
          email or user.email
        }
      */

      // Handle different response structures
      const accessToken = response.access_token || response.access || response.data?.access_token
      const refreshToken = response.refresh_token || response.refresh || response.data?.refresh_token
      const userName = response.username || response.user?.username || username

      if (!accessToken) {
        throw new Error('No access token received from server')
      }

      tokenService.setTokens(accessToken, refreshToken || '', userName)
      setUser({ username : userName })

      return { success: true }
    } catch (error) {
      let message = 'Login failed. Please check your credentials.'

      if (error.response) {
        message =
          error.response.data?.error ||
          error.response.data?.detail ||
          error.response.data?.message ||
          `Server error: ${error.response.status}`
      } else if (error.request) {
        message = 'Unable to connect to server. Is the backend running?'
      } else if (error.message) {
        message = error.message
      }

      return { success: false, error: message }
    }
  }

  // REGISTER
  const register = async (username, email, password) => {
    try {
      await authAPI.register(username, email, password)
      return { success: true }
    } catch (error) {
      let message = 'Registration failed.'

      if (error.response) {
        const data = error.response.data
        message =
          data?.email?.[0] ||
          data?.username?.[0] ||
          data?.password?.[0] ||
          `Server error: ${error.response.status}`
      }

      return { success: false, error: message }
    }
  }

  // LOGOUT
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (_) {
      // Even if logout fails, clear local state
    } finally {
      tokenService.clearTokens()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
