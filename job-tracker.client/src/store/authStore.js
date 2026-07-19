import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import { TOKEN_STORAGE_KEY } from '../api/axios'

const USER_STORAGE_KEY = 'jobtracker_user'

const AuthContext = createContext(/** @type {any} */ (null))

function readStoredUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

function persistSession(authResponse) {
  const { token, ...user } = authResponse
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  return user
}

function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(() => readStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const authResponse = await loginRequest(credentials)
      const storedUser = persistSession(authResponse)
      setToken(authResponse.token)
      setUser(storedUser)
      return storedUser
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid email or password.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const authResponse = await registerRequest(data)
      const storedUser = persistSession(authResponse)
      setToken(authResponse.token)
      setUser(storedUser)
      return storedUser
    } catch (err) {
      setError(err.response?.data?.message ?? 'Could not create account.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, token, loading, error, login, register, logout],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthStore must be used within an AuthProvider')
  }
  return context
}
