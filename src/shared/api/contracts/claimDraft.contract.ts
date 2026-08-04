export type OwnershipAnswer = 'own' | 'third_party'

export interface ClaimDraft {
  licenseConfirmed: boolean
  ownership: OwnershipAnswer | null
  incidentDescription: string
  vehicleRegistration: string
  policeReportFile: File | null
  photoFiles: File[]
}

export const emptyClaimDraft: ClaimDraft = {
  licenseConfirmed: false,
  ownership: null,
  incidentDescription: '',
  vehicleRegistration: '',
  policeReportFile: null,
  photoFiles: [],
}