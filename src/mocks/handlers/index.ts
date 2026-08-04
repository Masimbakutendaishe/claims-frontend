import { claimsHandlers } from "./claims.handlers"
import { authHandlers } from "./auth.handlers"
import { consentHandlers } from "./consent.handlers"

// Add new handler files here as you build more features.
export const handlers = [...authHandlers, ...claimsHandlers, ...consentHandlers]

