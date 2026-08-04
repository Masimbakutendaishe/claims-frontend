import { ForgotPasswordForm } from '../../features/auth/ForgotPasswordForm'
import { ThemeToggle } from '../../widgets/theme-toggle/ThemeToggle'
import { AnimatedBackground } from '../../widgets/animated-background/AnimatedBackground'

export function ForgotPasswordPage({ onNavigateLogin }: { onNavigateLogin: () => void }) {
  return (
    <div className="h-dvh overflow-hidden relative flex items-center justify-center px-4 bg-white dark:bg-[#0B1533]">
      <AnimatedBackground />
      <div className="relative z-10 bg-page rounded-[2.5rem] shadow-2xl px-10 py-10 flex flex-col items-center gap-5 w-full max-w-sm">
        <h1 className="text-card font-semibold text-lg tracking-wide">Reset your password</h1>
        <ThemeToggle />
        <div className="bg-card rounded-3xl px-8 py-10 flex flex-col items-center shadow-lg w-full">
          <ForgotPasswordForm />
        </div>
        <button type="button" onClick={onNavigateLogin} className="text-xs text-card underline">
          Back to sign in
        </button>
      </div>
    </div>
  )
}