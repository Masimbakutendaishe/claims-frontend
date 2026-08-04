import { useState, useEffect, useCallback } from "react"
import { api } from "../../shared/api/client"
import { ENDPOINTS } from "../../shared/api/endpoints"
import type { User, LoginRequest, SignupRequest, SessionResponse } from "../../shared/api/contracts/user.contract"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSession = useCallback(async () => {
    try {
      const session = await api.get<SessionResponse>(ENDPOINTS.auth.me)
      setUser(session.user)
      setExpiresAt(session.expiresAt)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const login = async (credentials: LoginRequest) => {
    const session = await api.post<SessionResponse>(ENDPOINTS.auth.login, credentials)
    setUser(session.user)
    setExpiresAt(session.expiresAt)
    return session.user
  }

  const signup = async (data: SignupRequest) => {
  const session = await api.post<SessionResponse>(ENDPOINTS.auth.signup, data)
  setUser(session.user)
  setExpiresAt(session.expiresAt)
  return session.user
}

  const logout = async () => {
    await api.post(ENDPOINTS.auth.logout).catch(() => {})
    setUser(null)
  }

  return { user, expiresAt, loading, login, signup, logout, isAuthenticated: !!user }
}