import { useState, type FormEvent } from 'react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { HumanCheckModal } from '../HumanCheckModal'
import { Input } from '../../../shared/ui/Input'
import { Button } from '../../../shared/ui/Button'

interface Props {
  onSuccess: () => void
  onNavigateSignup: () => void
  onNavigateForgotPassword: () => void
}

export function LoginForm({ onSuccess, onNavigateSignup, onNavigateForgotPassword }: Props) {
  const { login } = useAuthContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showHumanCheck, setShowHumanCheck] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowHumanCheck(true)
  }

  const performLogin = async () => {
    setShowHumanCheck(false)
    setSubmitting(true)
    try {
      await login({ username, password })
      onSuccess()
    } catch {
      setError('Incorrect username or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 w-64">
        <Input
          type="text"
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={onNavigateForgotPassword}
          className="text-xs text-card-ink/70 hover:underline block text-center w-full"
        >
          Forgot password?
        </button>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <Button type="submit" loading={submitting} className="w-full">
          Sign in
        </Button>

        <p className="text-xs text-card-ink/70 text-center">
          Don't have an account?{' '}
          <button type="button" onClick={onNavigateSignup} className="underline font-medium">
            Sign up
          </button>
        </p>
      </form>

      {showHumanCheck && (
        <HumanCheckModal onVerified={performLogin} onCancel={() => setShowHumanCheck(false)} />
      )}
    </>
  )
}