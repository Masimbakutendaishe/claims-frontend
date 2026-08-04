export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrength {
  score: number          // 0-4
  level: StrengthLevel
  color: string
  label: string
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, level: 'weak', color: '#DC2626', label: 'Weak' }
  if (score === 2) return { score, level: 'fair', color: '#F59E0B', label: 'Fair' }
  if (score === 3) return { score, level: 'good', color: '#EAB308', label: 'Good' }
  return { score, level: 'strong', color: '#16A34A', label: 'Strong' }
}

export function isPasswordStrongEnough(password: string): boolean {
  return getPasswordStrength(password).level === 'strong'
}