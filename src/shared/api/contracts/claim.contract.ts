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
  cvDetectedIssues: string[]       // AI Model 1 â€” computer vision output
  llmSummary: string                // AI Model 2 â€” RAG-grounded summary
  consolidatedIssues: string[]
}
