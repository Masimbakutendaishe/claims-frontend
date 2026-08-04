import { LoginForm } from '../../features/auth/login/LoginForm'
import { ThemeToggle } from '../../widgets/theme-toggle/ThemeToggle'
import { AnimatedBackground } from '../../widgets/animated-background/AnimatedBackground'
import { useTheme } from '../../app/providers/ThemeProvider'
import fmLight from '../../shared/assets/logos/fmlogo-light.png'
import fmDark from '../../shared/assets/logos/fmlogo-dark.png'
import nicozLight from '../../shared/assets/logos/nicozlogo-light.png'
import nicozDark from '../../shared/assets/logos/nicozlogo-dark.png'
import { Tilt3D } from '../../shared/ui/Tilt3D'
interface Props {
  onNavigateSignup: () => void
  onNavigateForgotPassword: () => void
}

export function LoginPage({ onNavigateSignup, onNavigateForgotPassword }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-dvh overflow-y-auto relative flex items-center justify-center px-4 py-6 bg-white dark:bg-[#0B1533]">
      <AnimatedBackground />

      <div className="relative z-10 bg-page rounded-[2.5rem] shadow-2xl px-10 py-8 flex flex-col items-center gap-4 w-full max-w-sm">
        <img src={isDark ? fmDark : fmLight} alt="First Mutual" className="h-24" />
        <img src={isDark ? nicozDark : nicozLight} alt="Nicoz" className="h-[6.5rem]" />
        <h1 className="text-card font-semibold text-lg tracking-wide">Claims System</h1>
        <ThemeToggle />

       <Tilt3D className="w-full">
  <div className="group relative overflow-hidden bg-card rounded-3xl px-8 py-10 flex flex-col items-center gap-6 shadow-lg w-full">
    <LoginForm
            onSuccess={() => {}}
            onNavigateSignup={onNavigateSignup}
            onNavigateForgotPassword={onNavigateForgotPassword}
          />
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>
      </Tilt3D>
      </div>
    </div>
  )
}