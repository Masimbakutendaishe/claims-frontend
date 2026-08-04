# ============================================================
# claims-frontend — auth, session timeout, profile creation
# Run once from the repo root: .\add-auth-profile.ps1
# ============================================================

$folders = @(
    "src/features/profile"
    "src/widgets/session-timeout-warning"
    "src/shared/lib/hooks"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Path $f -Force | Out-Null }

# ------------------------------------------------------------
# Extend user contract with profile fields
# ------------------------------------------------------------
@'
export interface User {
  id: string
  role: "claimant" | "claims_admin" | "vehicle_assessor" | "service_provider" | "management"
  fullName: string
  email: string
  phone?: string
  avatarUrl?: string
  profileComplete: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
}

export interface SessionResponse {
  user: User
  expiresAt: string   // ISO timestamp — token/session expiry
}
'@ | Set-Content -Path "src/shared/api/contracts/user.contract.ts" -Encoding UTF8

# ------------------------------------------------------------
# Profile contract
# ------------------------------------------------------------
@'
export interface UpdateProfileRequest {
  fullName: string
  phone: string
}

export interface AvatarUploadResponse {
  avatarUrl: string
}
'@ | Set-Content -Path "src/shared/api/contracts/profile.contract.ts" -Encoding UTF8

# ------------------------------------------------------------
# Add profile + session endpoints (idempotent insert)
# ------------------------------------------------------------
$endpointsPath = "src/shared/api/endpoints.ts"
$endpointsContent = Get-Content $endpointsPath -Raw

if ($endpointsContent -notmatch "profile:") {
    $endpointsContent = $endpointsContent -replace `
        '(\s*)auth: \{', "`$1profile: {`n    update: `"/api/profile`",`n    uploadAvatar: `"/api/profile/avatar`",`n  },`n`$1auth: {"
}
if ($endpointsContent -notmatch "refresh:") {
    $endpointsContent = $endpointsContent -replace `
        '(me: "/api/auth/me",)', "`$1`n    refresh: `"/api/auth/refresh`","
}
Set-Content -Path $endpointsPath -Value $endpointsContent -Encoding UTF8
Write-Host "Endpoints updated." -ForegroundColor Green

# ------------------------------------------------------------
# shared/lib/hooks/useIdleTimeout.ts — detects inactivity
# ------------------------------------------------------------
@'
import { useEffect, useRef, useCallback } from "react"

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]

interface UseIdleTimeoutArgs {
  idleMs: number        // total idle time before logout
  warningMs: number      // how long before logout to show the warning
  onWarning: () => void
  onTimeout: () => void
  enabled: boolean
}

export function useIdleTimeout({ idleMs, warningMs, onWarning, onTimeout, enabled }: UseIdleTimeoutArgs) {
  const warningTimer = useRef<ReturnType<typeof setTimeout>>()
  const logoutTimer = useRef<ReturnType<typeof setTimeout>>()

  const resetTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current)
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (!enabled) return

    warningTimer.current = setTimeout(onWarning, idleMs - warningMs)
    logoutTimer.current = setTimeout(onTimeout, idleMs)
  }, [idleMs, warningMs, onWarning, onTimeout, enabled])

  useEffect(() => {
    if (!enabled) return
    resetTimers()
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimers))
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimers))
      if (warningTimer.current) clearTimeout(warningTimer.current)
      if (logoutTimer.current) clearTimeout(logoutTimer.current)
    }
  }, [enabled, resetTimers])

  return { resetTimers }
}
'@ | Set-Content -Path "src/shared/lib/hooks/useIdleTimeout.ts" -Encoding UTF8

# ------------------------------------------------------------
# features/auth/useAuth.ts — the real auth hook (no localStorage tokens)
# ------------------------------------------------------------
@'
import { useState, useEffect, useCallback } from "react"
import { api } from "../../shared/api/client"
import { ENDPOINTS } from "../../shared/api/endpoints"
import type { User, LoginRequest, SignupRequest, SessionResponse } from "../../shared/api/contracts/user.contract"

// Token itself is never stored in localStorage/sessionStorage — the backend
// sets an httpOnly cookie, and the client just tracks the user object +
// expiry in memory. See API_CONTRACT.md for what the backend needs to do.

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSession = useCallback(async () => {
    try {
      const session = await api.get<SessionResponse>(ENDPOINTS.auth.me)
      setUser(session.user)
      setExpiresAt(session.expiresAt)
    } catch {
      setUser(null)
      setExpiresAt(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const login = async (credentials: LoginRequest) => {
    const session = await api.post<SessionResponse>(ENDPOINTS.auth.login, credentials)
    setUser(session.user)
    setExpiresAt(session.expiresAt)
    return session.user
  }

  const signup = async (data: SignupRequest) => {
    const session = await api.post<SessionResponse>(ENDPOINTS.auth.login, data)
    setUser(session.user)
    setExpiresAt(session.expiresAt)
    return session.user
  }

  const logout = async () => {
    await api.post(ENDPOINTS.auth.logout).catch(() => {})
    setUser(null)
    setExpiresAt(null)
  }

  const refreshSession = async () => {
    const session = await api.post<SessionResponse>(ENDPOINTS.auth.refresh)
    setExpiresAt(session.expiresAt)
    return session
  }

  return { user, expiresAt, loading, login, signup, logout, refreshSession, isAuthenticated: !!user }
}
'@ | Set-Content -Path "src/features/auth/useAuth.ts" -Encoding UTF8

# ------------------------------------------------------------
# LoginForm
# ------------------------------------------------------------
@'
import { useState, type FormEvent } from "react"
import { useAuth } from "../useAuth"

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ username, password })
      onSuccess()
    } catch {
      setError("Incorrect username or password.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-500 text-white rounded-md py-2 font-medium disabled:opacity-40"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
'@ | Set-Content -Path "src/features/auth/login/LoginForm.tsx" -Encoding UTF8

# ------------------------------------------------------------
# SignupForm
# ------------------------------------------------------------
@'
import { useState, type FormEvent } from "react"
import { useAuth } from "../useAuth"

export function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setSubmitting(true)
    try {
      await signup({ fullName, email, password })
      onSuccess()
    } catch {
      setError("Could not create your account. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-500 text-white rounded-md py-2 font-medium disabled:opacity-40"
      >
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  )
}
'@ | Set-Content -Path "src/features/auth/signup/SignupForm.tsx" -Encoding UTF8

# ------------------------------------------------------------
# SessionTimeoutModal — warning before auto-logout
# ------------------------------------------------------------
@'
interface Props {
  secondsLeft: number
  onStayLoggedIn: () => void
  onLogoutNow: () => void
}

export function SessionTimeoutModal({ secondsLeft, onStayLoggedIn, onLogoutNow }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface text-ink rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4 text-center">
        <h2 className="text-lg font-semibold">Still there?</h2>
        <p className="text-sm opacity-80">
          You'll be signed out in {secondsLeft} seconds due to inactivity.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLogoutNow}
            className="flex-1 rounded-md border border-brand-500/30 py-2 text-sm"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="flex-1 bg-brand-500 text-white rounded-md py-2 text-sm font-medium"
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  )
}
'@ | Set-Content -Path "src/widgets/session-timeout-warning/SessionTimeoutModal.tsx" -Encoding UTF8

# ------------------------------------------------------------
# app/providers/AuthProvider.tsx — wires auth + idle timeout together
# ------------------------------------------------------------
@'
import { createContext, useContext, useState, useCallback } from "react"
import { useAuth } from "../../features/auth/useAuth"
import { useIdleTimeout } from "../../shared/lib/hooks/useIdleTimeout"
import { SessionTimeoutModal } from "../../widgets/session-timeout-warning/SessionTimeoutModal"

const IDLE_MS = 20 * 60 * 1000    // 20 minutes total idle
const WARNING_MS = 60 * 1000       // warn 60 seconds before logout

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(60)

  const handleWarning = useCallback(() => {
    setShowWarning(true)
    setSecondsLeft(Math.floor(WARNING_MS / 1000))
  }, [])

  const handleTimeout = useCallback(() => {
    setShowWarning(false)
    auth.logout()
  }, [auth])

  const { resetTimers } = useIdleTimeout({
    idleMs: IDLE_MS,
    warningMs: WARNING_MS,
    onWarning: handleWarning,
    onTimeout: handleTimeout,
    enabled: auth.isAuthenticated,
  })

  const stayLoggedIn = async () => {
    setShowWarning(false)
    await auth.refreshSession().catch(() => {})
    resetTimers()
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
      {showWarning && (
        <SessionTimeoutModal
          secondsLeft={secondsLeft}
          onStayLoggedIn={stayLoggedIn}
          onLogoutNow={handleTimeout}
        />
      )}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider")
  return ctx
}
'@ | Set-Content -Path "src/app/providers/AuthProvider.tsx" -Encoding UTF8

# ------------------------------------------------------------
# features/profile — image resize helper + form
# ------------------------------------------------------------
@'
// Resizes an image client-side before upload, so we never send a
// multi-megabyte phone photo as someone's avatar.
export function resizeImage(file: File, maxDim = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas not supported"))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))), "image/jpeg", 0.85)
    }
    img.onerror = reject
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
'@ | Set-Content -Path "src/features/profile/resizeImage.ts" -Encoding UTF8

@'
import { useState, type FormEvent } from "react"
import { api } from "../../shared/api/client"
import { ENDPOINTS } from "../../shared/api/endpoints"
import { resizeImage } from "./resizeImage"
import type { UpdateProfileRequest, AvatarUploadResponse } from "../../shared/api/contracts/profile.contract"

const MAX_AVATAR_MB = 5

export function ProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_AVATAR_MB}MB.`)
      return
    }
    setError(null)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (avatarFile) {
        const resized = await resizeImage(avatarFile)
        const formData = new FormData()
        formData.append("avatar", resized, "avatar.jpg")
        await fetch(ENDPOINTS.profile.uploadAvatar, {
          method: "POST",
          body: formData,
          credentials: "include",
        }) as unknown as AvatarUploadResponse
      }
      const payload: UpdateProfileRequest = { fullName, phone }
      await api.patch(ENDPOINTS.profile.update, payload)
      onSuccess()
    } catch {
      setError("Could not save your profile. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-surface-muted overflow-hidden flex items-center justify-center border border-brand-500/30">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs opacity-50">No photo</span>
          )}
        </div>
        <label className="text-sm text-brand-500 cursor-pointer">
          Upload photo
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-md border border-brand-500/30 bg-surface px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-500 text-white rounded-md py-2 font-medium disabled:opacity-40"
      >
        {submitting ? "Saving..." : "Save profile"}
      </button>
    </form>
  )
}
'@ | Set-Content -Path "src/features/profile/ProfileForm.tsx" -Encoding UTF8

# ------------------------------------------------------------
# Mock handlers — auth with session expiry, logout, refresh, profile
# ------------------------------------------------------------
@'
import { http, HttpResponse } from "msw"
import { ENDPOINTS } from "../../shared/api/endpoints"

const mockUser = {
  id: "u1",
  role: "claimant" as const,
  fullName: "Tariro Moyo",
  email: "tariro@example.com",
  profileComplete: false,
}

function futureExpiry(minutes = 20) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
}

let loggedIn = false

export const authHandlers = [
  http.post(ENDPOINTS.auth.login, () => {
    loggedIn = true
    return HttpResponse.json({ user: mockUser, expiresAt: futureExpiry() })
  }),
  http.get(ENDPOINTS.auth.me, () => {
    if (!loggedIn) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json({ user: mockUser, expiresAt: futureExpiry() })
  }),
  http.post(ENDPOINTS.auth.refresh, () => HttpResponse.json({ expiresAt: futureExpiry() })),
  http.post(ENDPOINTS.auth.logout, () => {
    loggedIn = false
    return new HttpResponse(null, { status: 204 })
  }),
]
'@ | Set-Content -Path "src/mocks/handlers/auth.handlers.ts" -Encoding UTF8

@'
import { http, HttpResponse } from "msw"
import { ENDPOINTS } from "../../shared/api/endpoints"

export const profileHandlers = [
  http.patch(ENDPOINTS.profile.update, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...(body as object), profileComplete: true })
  }),
  http.post(ENDPOINTS.profile.uploadAvatar, () =>
    HttpResponse.json({ avatarUrl: "/mock-files/avatar-placeholder.jpg" })
  ),
]
'@ | Set-Content -Path "src/mocks/handlers/profile.handlers.ts" -Encoding UTF8

# ------------------------------------------------------------
# Wire new handlers into the combined index
# ------------------------------------------------------------
$handlersIndexPath = "src/mocks/handlers/index.ts"
$handlersContent = Get-Content $handlersIndexPath -Raw
if ($handlersContent -notmatch "profileHandlers") {
    $handlersContent = $handlersContent -replace `
        '(import \{ consentHandlers \} from "./consent.handlers")', `
        "`$1`nimport { profileHandlers } from `"./profile.handlers`""
    $handlersContent = $handlersContent -replace `
        '\[\.\.\.authHandlers, \.\.\.claimsHandlers, \.\.\.consentHandlers\]', `
        '[...authHandlers, ...claimsHandlers, ...consentHandlers, ...profileHandlers]'
    Set-Content -Path $handlersIndexPath -Value $handlersContent -Encoding UTF8
    Write-Host "Wired profileHandlers into mocks/handlers/index.ts" -ForegroundColor Green
} else {
    Write-Host "profileHandlers already wired in, skipped" -ForegroundColor Yellow
}

Write-Host "`nAuth + session timeout + profile creation added:" -ForegroundColor Cyan
Write-Host "  - src/features/auth/useAuth.ts, login/LoginForm.tsx, signup/SignupForm.tsx"
Write-Host "  - src/shared/lib/hooks/useIdleTimeout.ts"
Write-Host "  - src/widgets/session-timeout-warning/SessionTimeoutModal.tsx"
Write-Host "  - src/app/providers/AuthProvider.tsx (wires it all together — 20 min idle, 60s warning)"
Write-Host "  - src/features/profile/ProfileForm.tsx + resizeImage.ts"
Write-Host "`nStill manual: wrap <App> in <AuthProvider>, add /login /signup /profile-setup routes," -ForegroundColor Yellow
Write-Host "and redirect to profile setup when user.profileComplete is false after login." -ForegroundColor Yellow