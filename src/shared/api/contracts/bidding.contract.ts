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
