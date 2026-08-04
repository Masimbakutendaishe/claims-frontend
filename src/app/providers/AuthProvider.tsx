import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from '../../features/auth/useAuth'
import { useIdleTimeout } from '../../shared/lib/hooks/useIdleTimeout'
import { SessionTimeoutModal } from '../../widgets/session-timeout-warning/SessionTimeoutModal'

const IDLE_MS = 20 * 60 * 1000
const WARNING_MS = 60 * 1000

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(60)

  const handleWarning = useCallback(() => {
    setShowWarning(true)
    setSecondsLeft(Math.floor(WARNING_MS / 1000))
  }, [])

  const handleTimeout = useCallback(() => {
    setShowWarning(false)
    auth.logout()
  }, [auth])

  const { resetTimers } = useIdleTimeout({
    idleMs: IDLE_MS,
    warningMs: WARNING_MS,
    onWarning: handleWarning,
    onTimeout: handleTimeout,
    enabled: auth.isAuthenticated,
  })

  const stayLoggedIn = async () => {
    setShowWarning(false)
    await auth.refreshSession().catch(() => {})
    resetTimers()
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
      {showWarning && (
        <SessionTimeoutModal
          secondsLeft={secondsLeft}
          onStayLoggedIn={stayLoggedIn}
          onLogoutNow={handleTimeout}
        />
      )}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}