import { SignupForm } from '../../features/auth/signup/SignupForm'
import { ThemeToggle } from '../../widgets/theme-toggle/ThemeToggle'
import { AnimatedBackground } from '../../widgets/animated-background/AnimatedBackground'
import { useTheme } from '../../app/providers/ThemeProvider'
import fmLight from '../../shared/assets/logos/fmlogo-light.png'
import fmDark from '../../shared/assets/logos/fmlogo-dark.png'
import nicozLight from '../../shared/assets/logos/nicozlogo-light.png'
import nicozDark from '../../shared/assets/logos/nicozlogo-dark.png'

interface Props {
  onSuccess: () => void
  onNavigateLogin: () => void
}

export function SignupPage({ onSuccess, onNavigateLogin }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-dvh overflow-y-auto relative flex items-center justify-center px-4 py-6 bg-white dark:bg-[#0B1533]">
      <AnimatedBackground />

      <div className="relative z-10 bg-page rounded-[2.5rem] shadow-2xl px-8 py-6 flex flex-col items-center gap-2 w-full max-w-sm">
        <div className="flex items-center gap-3">
          <img src={isDark ? fmDark : fmLight} alt="First Mutual" className="h-10" />
          <img src={isDark ? nicozDark : nicozLight} alt="Nicoz" className="h-9" />
        </div>
        <h1 className="text-card font-semibold text-base tracking-wide">Create your account</h1>
        <ThemeToggle />

        <div className="group relative overflow-hidden bg-card rounded-3xl px-6 py-6 flex flex-col items-center gap-3 shadow-lg w-full mt-2">
          <SignupForm onSuccess={onSuccess} />
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        <button type="button" onClick={onNavigateLogin} className="text-xs text-card underline mt-1">
          Already have an account? Sign in
        </button>
      </div>
    </div>
  )
}