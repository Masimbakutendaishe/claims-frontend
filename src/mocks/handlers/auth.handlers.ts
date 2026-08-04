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
  http.post(ENDPOINTS.auth.signup, async ({ request }) => {
    loggedIn = true
    const body = (await request.json()) as { fullName: string; role: string }
    return HttpResponse.json({
      user: { ...mockUser, fullName: body.fullName, role: body.role, profileComplete: false },
      expiresAt: futureExpiry(),
    })
  }),

  http.post(ENDPOINTS.auth.forgotPassword, () => new HttpResponse(null, { status: 200 })),

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