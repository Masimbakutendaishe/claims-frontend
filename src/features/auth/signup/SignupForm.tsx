import { useState, type FormEvent } from 'react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { PasswordStrengthMeter } from '../../../shared/ui/PasswordStrengthMeter'
import { isPasswordStrongEnough } from '../../../shared/lib/passwordStrength'
import { resizeImage } from '../../profile/resizeImage'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { Input } from '../../../shared/ui/Input'
import { Button } from '../../../shared/ui/Button'
import type { UserRole } from '../../../shared/api/contracts/user.contract'

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'claimant', label: 'Client / Claimant' },
  { value: 'claims_admin', label: 'Claims Admin' },
  { value: 'vehicle_assessor', label: 'Assessor' },
  { value: 'management', label: 'Manager' },
  { value: 'service_provider', label: 'Repair Partner' },
]

export function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signup } = useAuthContext()
  const [fullName, setFullName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState<UserRole>('claimant')
  const [password, setPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isPasswordStrongEnough(password)) {
      setError('Please choose a stronger password before continuing.')
      return
    }

    setSubmitting(true)
    try {
      await signup({ fullName, surname, username, email, phone, address, role, password })

      if (avatarFile) {
        const resized = await resizeImage(avatarFile)
        const formData = new FormData()
        formData.append('avatar', resized, 'avatar.jpg')
        await fetch(ENDPOINTS.profile.uploadAvatar, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
      }

      onSuccess()
    } catch {
      setError('Could not create your account. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-72">
      <div className="flex flex-col items-center gap-1">
        <div className="w-16 h-16 rounded-full bg-input-bg overflow-hidden flex items-center justify-center border border-white/30">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] opacity-50">Photo</span>
          )}
        </div>
        <label className="text-xs underline cursor-pointer text-card-ink/80">
          Upload photo
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="First name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <Input placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
      </div>

      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        className="w-full rounded-lg bg-input-bg text-input-ink px-3 py-2 text-sm outline-none"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordStrengthMeter password={password} />
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Button type="submit" loading={submitting} className="w-full">
        Create account
      </Button>
    </form>
  )
}