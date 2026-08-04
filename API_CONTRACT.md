# API Contract â€” read this first

This is how frontend and backend stay independent while building in parallel.

## The rule
Every endpoint the frontend calls is listed once in `src/shared/api/endpoints.ts`.
Every request/response shape is defined once in `src/shared/api/contracts/*.contract.ts`.
Build the real backend to match those two files exactly â€” path, method, and JSON shape.

## Workflow
1. Frontend is currently running entirely on mock data (see `src/mocks/`) â€” it works
   end to end right now with fake responses, no backend required.
2. When you finish a real endpoint, tell me which one (e.g. "claims.create is live").
3. I delete that one line from the matching file in `src/mocks/handlers/`.
4. Everything else keeps working on mocks, untouched. No other code changes.

## If a shape needs to change
Edit the relevant `.contract.ts` file first, message me the change, then update your
backend and I'll update the mock fixture to match. The contract file is the single
source of truth both sides build against â€” never let the two drift apart silently.

## Where things live
- `src/shared/api/endpoints.ts` â€” every URL path
- `src/shared/api/contracts/` â€” every request/response TypeScript shape
- `src/mocks/handlers/` â€” mock implementations, one file per domain
- `src/mocks/fixtures/` â€” sample data used by the mocks
