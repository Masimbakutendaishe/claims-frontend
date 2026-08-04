import { LoginForm } from '../../features/auth/login/LoginForm'
import { ThemeToggle } from '../../widgets/theme-toggle/ThemeToggle'
import { useTheme } from '../../app/providers/ThemeProvider'
import fmLight from '../../shared/assets/logos/fmlogo-light.png'
import fmDark from '../../shared/assets/logos/fmlogo-dark.png'
import nicozLight from '../../shared/assets/logos/nicozlogo-light.png'
import nicozDark from '../../shared/assets/logos/nicozlogo-dark.png'

export function LoginPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center gap-6 px-4">
      <img src={isDark ? fmDark : fmLight} alt="First Mutual" className="h-12" />
      <img src={isDark ? nicozDark : nicozLight} alt="Nicoz" className="h-10" />

      <h1 className="text-card font-semibold text-lg tracking-wide">
        Claims System
      </h1>

      <ThemeToggle />

      <div className="bg-card rounded-3xl px-8 py-10 flex flex-col items-center gap-6 shadow-lg">
        <LoginForm onSuccess={() => alert('Logged in!')} />
      </div>
    </div>
  )
}