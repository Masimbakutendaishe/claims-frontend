import { http, HttpResponse } from "msw"
import { ENDPOINTS } from "../../shared/api/endpoints"

let mockConsentGiven = false

export const consentHandlers = [
  http.get(ENDPOINTS.consent.getCurrent, () => {
    if (!mockConsentGiven) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({
      userId: "u1",
      consentedAt: new Date().toISOString(),
      version: "1.0",
      dataProcessing: true,
      photoStorage: true,
      thirdPartySharing: true,
      marketing: false,
    })
  }),
  http.post(ENDPOINTS.consent.record, async ({ request }) => {
    mockConsentGiven = true
    const body = await request.json()
    return HttpResponse.json({
      userId: "u1",
      consentedAt: new Date().toISOString(),
      ...(body as object),
    })
  }),
]
