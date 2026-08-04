export interface ConsentRecord {
  userId: string
  consentedAt: string
  version: string          // bump this whenever the policy text changes
  dataProcessing: boolean   // required — collecting/storing claim data
  photoStorage: boolean      // required — storing uploaded damage photos
  thirdPartySharing: boolean  // required — sharing with assessors/repair partners
  marketing: boolean           // optional — not required to use the app
}

export interface RecordConsentRequest {
  version: string
  dataProcessing: boolean
  photoStorage: boolean
  thirdPartySharing: boolean
  marketing: boolean
}
