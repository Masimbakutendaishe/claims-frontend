import { getPasswordStrength } from '../lib/passwordStrength'

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null
  const { score, color, label } = getPasswordStrength(password)
  const segments = 5

  return (
    <div className="w-full">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < score ? color : '#E5E7EB' }}
          />
        ))}
      </div>
      <p className="text-xs mt-1" style={{ color }}>
        {label}
        {label !== 'Strong' && ' — a strong password is required'}
      </p>
    </div>
  )
}