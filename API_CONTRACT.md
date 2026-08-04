# API Contract — read this first

This is how frontend and backend stay independent while building in parallel.

## The rule
Every endpoint the frontend calls is listed once in `src/shared/api/endpoints.ts`.
Every request/response shape is defined once in `src/shared/api/contracts/*.contract.ts`.
Build the backend to match those two files exactly — path, method, and JSON shape.
Backend language/framework doesn't matter (Python/FastAPI, Flask, Django, whatever) —
only the URL, method, and JSON shape need to match.

## Workflow
1. Frontend is currently running entirely on mock data (see `src/mocks/`) — it works
   end to end right now with fake responses, no backend required.
2. When you finish a real endpoint, say which one (e.g. "auth.login is live").
3. That one handler gets deleted from the matching file in `src/mocks/handlers/`.
4. Everything else keeps working on mocks, untouched. No other frontend code changes.

## If a shape needs to change
Edit the relevant `.contract.ts` file first, flag the change, then update the backend —
the mock fixture gets updated to match at the same time. The contract file is the single
source of truth both sides build against — never let the two drift apart silently.

## Where things live
- `src/shared/api/endpoints.ts` — every URL path, grouped by feature
- `src/shared/api/contracts/` — every request/response TypeScript shape
- `src/mocks/handlers/` — mock implementations, one file per domain (also useful as a
  working example of the exact JSON currently expected back)
- `src/mocks/fixtures/` — sample data used by the mocks

## Endpoint groups, in build priority order

### 1. auth — build this first, everything else depends on it
- `POST /api/auth/signup` — creates account, returns `{ user, expiresAt }`
- `POST /api/auth/login` — returns `{ user, expiresAt }`
- `POST /api/auth/logout`
- `GET /api/auth/me` — returns current session `{ user, expiresAt }`, 401 if not logged in
- `POST /api/auth/refresh` — extends session, returns `{ expiresAt }`
- `POST /api/auth/forgot-password` — always returns 200 regardless of whether the email
  exists (security — never reveal which emails are registered)

**Important:** login/signup should set the session as an **httpOnly cookie**, not return
a token in the JSON body. The frontend never stores a token in localStorage — it just
calls endpoints with credentials included and expects the cookie to carry the session.
CORS needs to allow credentials from the frontend's dev origin (`localhost:5173`).

See `user.contract.ts` for the exact `User`, `LoginRequest`, `SignupRequest`,
`SessionResponse` shapes, including the `UserRole` union (`claimant`, `claims_admin`,
`vehicle_assessor`, `service_provider`, `management`).

### 2. consent
- `POST /api/consent` — records a user's consent choices
- `GET /api/consent/me` — returns current consent record, 404 if none on file yet

See `consent.contract.ts`.

### 3. profile
- `PATCH /api/profile` — update name/phone
- `POST /api/profile/avatar` — multipart form upload, returns `{ avatarUrl }`

See `profile.contract.ts`.

### 4. claims
- `POST /api/claims` — create a new claim
- `GET /api/claims` — list claims for the current user
- `GET /api/claims/:id` — get one claim
- `POST /api/claims/:id/form` — submit claim details (incident description, registration)
- `POST /api/claims/:id/police-report` — upload police report
- `POST /api/claims/:id/photos` — upload damage photos
- `POST /api/claims/:id/review` — triggers the two AI review passes (computer vision +
  RAG-grounded summary), returns `ClaimIssueSummary`

See `claim.contract.ts` for `Claim`, `ClaimStatus`, `CreateClaimRequest`,
`ClaimIssueSummary`.

### 5. assessment
- `POST /api/claims/:id/assessment` — assessor submits their report
- `GET /api/claims/:id/assessment`

See `assessment.contract.ts`.

### 6. bidding
- `POST /api/claims/:id/bids` — Claims Admin sends bid request to service providers
- `POST /api/bids/:bidId/quote` — provider submits their quote
- `POST /api/bids/:bidId/close` — Claims Admin closes and selects a provider

See `bidding.contract.ts` for `Quote` and `BidRequest`.

### 7. payment
- `POST /api/claims/:id/payment-approval` — Claims Admin requests approval to pay

### 8. thirdParty
- `POST /api/third-party/full-cover-check`
- `POST /api/third-party/insurance-letter`

Not yet fully specced on the frontend — still being built out, will update this section
once that flow's contract is finalized.

## Questions
Ping before assuming — especially on the auth cookie/CORS setup, since that's the one
piece that blocks literally everything else once you're past mocks.