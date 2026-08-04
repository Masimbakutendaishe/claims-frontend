import { http, HttpResponse } from "msw"
import { ENDPOINTS } from "../../shared/api/endpoints"
import { mockClaim } from "../fixtures/claim.fixture"

// DELETE a line from this array once your collaborator's real
// endpoint for it is live. Everything else keeps working untouched.
export const claimsHandlers = [
  http.get(ENDPOINTS.claims.getById(":id"), () => HttpResponse.json(mockClaim)),
  http.post(ENDPOINTS.claims.create, () => HttpResponse.json(mockClaim, { status: 201 })),
  http.get(ENDPOINTS.claims.list, () => HttpResponse.json([mockClaim])),
]
