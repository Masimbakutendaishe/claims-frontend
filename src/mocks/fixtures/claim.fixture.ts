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
