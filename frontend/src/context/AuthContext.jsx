import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)          // { user_id, session_id, ... } decoded from token
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'))
  const [loading, setLoading] = useState(true)

  // Decode JWT payload (no verification — just reading claims)
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch {
      return null
    }
  }

  // Hydrate user from stored token on mount
  useEffect(() => {
    if (accessToken) {
      const decoded = decodeToken(accessToken)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      } else {
        // Token expired — clear
        localStorage.removeItem('accessToken')
        setAccessToken(null)
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password })
    // Backend typo: returns "acessToken" (missing 'c')
    const token = res.data.acessToken || res.data.accessToken
    localStorage.setItem('accessToken', token)
    setAccessToken(token)
    const decoded = decodeToken(token)
    setUser(decoded)
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (_) {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('accessToken')
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const register = useCallback(async (username, email, password) => {
    const res = await authAPI.register({ username, email, password })
    return res.data
  }, [])

  const sendOtp = useCallback(async (email) => {
    const res = await authAPI.sendOtp(email)
    return res.data
  }, [])

  const verifyOtp = useCallback(async (email, otp) => {
    const res = await authAPI.verifyOtp(email, otp)
    return res.data
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        sendOtp,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
