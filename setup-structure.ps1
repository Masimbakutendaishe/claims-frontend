# ============================================================
# claims-frontend — full folder scaffold + API contract layer
# Run once from the repo root: .\setup-structure.ps1
# ============================================================

$folders = @(
    "src/app/providers"
    "src/app/router"

    "src/pages/auth"
    "src/pages/claimant"
    "src/pages/claims-admin"
    "src/pages/vehicle-assessor"
    "src/pages/service-providers"
    "src/pages/third-party"

    "src/widgets/nav-bar"
    "src/widgets/sidebar"
    "src/widgets/page-header"
    "src/widgets/theme-toggle"

    "src/features/auth/login"
    "src/features/auth/signup"
    "src/features/claim-submission/upload-license"
    "src/features/claim-submission/vehicle-ownership-check"
    "src/features/claim-submission/claims-form"
    "src/features/claim-submission/police-report-upload"
    "src/features/claim-submission/photo-upload"
    "src/features/claim-submission/review-submit"
    "src/features/claims-review/ai-damage-review"
    "src/features/claims-review/issue-summary"
    "src/features/assessment/submit-assessment"
    "src/features/bidding/send-bid-request"
    "src/features/bidding/submit-quotation"
    "src/features/bidding/close-bid"
    "src/features/payment-approval"
    "src/features/third-party-claim/full-cover-check"
    "src/features/third-party-claim/insurance-letter-submission"

    "src/entities/user"
    "src/entities/claim"
    "src/entities/police-report"
    "src/entities/assessment"
    "src/entities/quote"
    "src/entities/notification"

    "src/shared/ui/Button"
    "src/shared/ui/Card"
    "src/shared/ui/Input"
    "src/shared/ui/Modal"
    "src/shared/ui/Table"
    "src/shared/ui/Badge"
    "src/shared/ui/Spinner"
    "src/shared/theme"
    "src/shared/lib/hooks"
    "src/shared/lib/utils"
    "src/shared/api/contracts"
    "src/shared/config"
    "src/shared/assets/logos"

    "src/mocks/handlers"
    "src/mocks/fixtures"
)

foreach ($f in $folders) {
    New-Item -ItemType Directory -Path $f -Force | Out-Null
    $gitkeep = Join-Path $f ".gitkeep"
    if (-not (Test-Path $gitkeep)) {
        New-Item -ItemType File -Path $gitkeep -Force | Out-Null
    }
}

Write-Host "Created $($folders.Count) folders." -ForegroundColor Green

# ------------------------------------------------------------
# shared/api/endpoints.ts — single source of truth for URLs
# ------------------------------------------------------------
@'
// Single source of truth for every API path.
// Your collaborator implements the backend to match these exactly.
// When a real endpoint is ready, delete its handler in src/mocks/handlers/
// — nothing else in the app needs to change, since components only ever
// import ENDPOINTS, never a hardcoded URL string.

export const ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  claims: {
    create: "/api/claims",
    getById: (id: string) => `/api/claims/${id}`,
    list: "/api/claims",
    submitForm: "/api/claims/:id/form",
    uploadPoliceReport: "/api/claims/:id/police-report",
    uploadPhotos: "/api/claims/:id/photos",
    review: "/api/claims/:id/review",       // AI CV + RAG-LLM issue summary
  },
  assessment: {
    submit: "/api/claims/:id/assessment",
    getByClaimId: (claimId: string) => `/api/claims/${claimId}/assessment`,
  },
  bidding: {
    sendRequest: "/api/claims/:id/bids",
    submitQuote: "/api/bids/:bidId/quote",
    closeBid: "/api/bids/:bidId/close",
  },
  payment: {
    requestApproval: "/api/claims/:id/payment-approval",
  },
  thirdParty: {
    fullCoverCheck: "/api/third-party/full-cover-check",
    submitInsuranceLetter: "/api/third-party/insurance-letter",
  },
} as const
'@ | Set-Content -Path "src/shared/api/endpoints.ts" -Encoding UTF8

# ------------------------------------------------------------
# shared/api/client.ts — thin fetch wrapper
# ------------------------------------------------------------
@'
// Thin wrapper so every feature calls the API the same way.
// Swapping mock -> real backend never touches this file.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    ...options,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${path} ${body}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
'@ | Set-Content -Path "src/shared/api/client.ts" -Encoding UTF8

# ------------------------------------------------------------
# shared/api/contracts/*.contract.ts — the actual handoff docs
# ------------------------------------------------------------
@'
// This is the contract your collaborator builds the real backend against.
// Whoever changes a shape here must update it in both places:
// the mock fixture (src/mocks/fixtures/) and the real backend.

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "denied_account"
  | "under_review"
  | "with_assessor"
  | "assessed"
  | "bidding"
  | "provider_selected"
  | "payment_requested"
  | "complete"

export interface Claim {
  id: string
  claimantId: string
  status: ClaimStatus
  ownVehicle: boolean
  vehicleRegistration: string
  incidentDescription: string
  policeReportUrl?: string
  photoUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateClaimRequest {
  ownVehicle: boolean
  vehicleRegistration: string
  incidentDescription: string
}

export interface ClaimIssueSummary {
  claimId: string
  cvDetectedIssues: string[]       // AI Model 1 — computer vision output
  llmSummary: string                // AI Model 2 — RAG-grounded summary
  consolidatedIssues: string[]
}
'@ | Set-Content -Path "src/shared/api/contracts/claim.contract.ts" -Encoding UTF8

@'
export interface User {
  id: string
  role: "claimant" | "claims_admin" | "vehicle_assessor" | "service_provider" | "management"
  fullName: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
'@ | Set-Content -Path "src/shared/api/contracts/user.contract.ts" -Encoding UTF8

@'
export interface Assessment {
  id: string
  claimId: string
  assessorId: string
  decision: "approved" | "denied"
  reportUrl: string
  notes: string
  createdAt: string
}
'@ | Set-Content -Path "src/shared/api/contracts/assessment.contract.ts" -Encoding UTF8

@'
export interface Quote {
  id: string
  claimId: string
  providerId: string
  description: string
  amount: number
  submittedAt: string
}

export interface BidRequest {
  id: string
  claimId: string
  repairList: string[]      // AI-suggested, manually editable by Claims Admin
  providerIds: string[]
  status: "open" | "closed"
  selectedQuoteId?: string
}
'@ | Set-Content -Path "src/shared/api/contracts/bidding.contract.ts" -Encoding UTF8

# ------------------------------------------------------------
# mocks/fixtures — sample data matching the contracts above
# ------------------------------------------------------------
@'
import type { Claim } from "../../shared/api/contracts/claim.contract"

export const mockClaim: Claim = {
  id: "claim_001",
  claimantId: "user_claimant_01",
  status: "under_review",
  ownVehicle: true,
  vehicleRegistration: "AEX 1234",
  incidentDescription: "Rear-end collision at traffic lights.",
  policeReportUrl: "/mock-files/police-report.pdf",
  photoUrls: ["/mock-files/damage-1.jpg", "/mock-files/damage-2.jpg"],
  createdAt: "2026-07-28T09:00:00Z",
  updatedAt: "2026-07-30T14:00:00Z",
}
'@ | Set-Content -Path "src/mocks/fixtures/claim.fixture.ts" -Encoding UTF8

# ------------------------------------------------------------
# mocks/handlers — one file per domain, matching ENDPOINTS exactly
# ------------------------------------------------------------
@'
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
'@ | Set-Content -Path "src/mocks/handlers/claims.handlers.ts" -Encoding UTF8

@'
import { http, HttpResponse } from "msw"
import { ENDPOINTS } from "../../shared/api/endpoints"

export const authHandlers = [
  http.post(ENDPOINTS.auth.login, () =>
    HttpResponse.json({
      user: { id: "u1", role: "claimant", fullName: "Tariro Moyo", email: "tariro@example.com" },
      token: "mock-token",
    })
  ),
]
'@ | Set-Content -Path "src/mocks/handlers/auth.handlers.ts" -Encoding UTF8

@'
import { claimsHandlers } from "./claims.handlers"
import { authHandlers } from "./auth.handlers"

// Add new handler files here as you build more features.
export const handlers = [...authHandlers, ...claimsHandlers]
'@ | Set-Content -Path "src/mocks/handlers/index.ts" -Encoding UTF8

@'
import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)
'@ | Set-Content -Path "src/mocks/browser.ts" -Encoding UTF8

# ------------------------------------------------------------
# API_CONTRACT.md — the actual handoff doc for your collaborator
# ------------------------------------------------------------
@'
# API Contract — read this first

This is how frontend and backend stay independent while building in parallel.

## The rule
Every endpoint the frontend calls is listed once in `src/shared/api/endpoints.ts`.
Every request/response shape is defined once in `src/shared/api/contracts/*.contract.ts`.
Build the real backend to match those two files exactly — path, method, and JSON shape.

## Workflow
1. Frontend is currently running entirely on mock data (see `src/mocks/`) — it works
   end to end right now with fake responses, no backend required.
2. When you finish a real endpoint, tell me which one (e.g. "claims.create is live").
3. I delete that one line from the matching file in `src/mocks/handlers/`.
4. Everything else keeps working on mocks, untouched. No other code changes.

## If a shape needs to change
Edit the relevant `.contract.ts` file first, message me the change, then update your
backend and I'll update the mock fixture to match. The contract file is the single
source of truth both sides build against — never let the two drift apart silently.

## Where things live
- `src/shared/api/endpoints.ts` — every URL path
- `src/shared/api/contracts/` — every request/response TypeScript shape
- `src/mocks/handlers/` — mock implementations, one file per domain
- `src/mocks/fixtures/` — sample data used by the mocks
'@ | Set-Content -Path "API_CONTRACT.md" -Encoding UTF8

Write-Host "Contract layer and mock handlers created." -ForegroundColor Green
Write-Host "Next: npm install msw, then npx msw init public/ --save" -ForegroundColor Yellow