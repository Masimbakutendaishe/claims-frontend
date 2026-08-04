import { useState, type FormEvent } from 'react'
import { api } from '../../shared/api/client'
import { ENDPOINTS } from '../../shared/api/endpoints'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(ENDPOINTS.auth.forgotPassword, { email })
    } finally {
      setSubmitting(false)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-card-ink text-center w-64">
        If an account exists for that email, a reset link is on its way.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-64">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg bg-input-bg text-input-ink px-3 py-2 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-button-bg text-button-ink rounded-lg py-2 font-medium disabled:opacity-40"
      >
        {submitting ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  )
}