export type UserRole = 'claimant' | 'claims_admin' | 'vehicle_assessor' | 'service_provider' | 'management'

export interface User {
  id: string
  role: UserRole
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
  surname: string
  username: string
  email: string
  password: string
  phone: string
  address: string
  role: UserRole
}

export interface SessionResponse {
  user: User
  expiresAt: string
}