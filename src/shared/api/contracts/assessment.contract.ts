export interface Assessment {
  id: string
  claimId: string
  assessorId: string
  decision: "approved" | "denied"
  reportUrl: string
  notes: string
  createdAt: string
}
