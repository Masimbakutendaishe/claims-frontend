import { useState } from 'react'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { AuthProvider, useAuthContext } from './app/providers/AuthProvider'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ClaimantDashboardPage } from './pages/claimant/ClaimantDashboardPage'

type AuthView = 'login' | 'signup' | 'forgot'

function AuthGate() {
  const { user, loading } = useAuthContext()
  const [view, setView] = useState<AuthView>('login')

  if (loading) {
    return <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-[#0B1533]" />
  }

  if (!user) {
    if (view === 'signup') {
      return <SignupPage onSuccess={() => setView('login')} onNavigateLogin={() => setView('login')} />
    }
    if (view === 'forgot') {
      return <ForgotPasswordPage onNavigateLogin={() => setView('login')} />
    }
    return (
      <LoginPage
        onNavigateSignup={() => setView('signup')}
        onNavigateForgotPassword={() => setView('forgot')}
      />
    )
  }

  // Logged in — route by role. Only claimant is built so far.
  if (user.role === 'claimant') {
    return <ClaimantDashboardPage />
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-[#0B1533] text-card-ink">
      <p>Dashboard for role "{user.role}" isn't built yet.</p>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App