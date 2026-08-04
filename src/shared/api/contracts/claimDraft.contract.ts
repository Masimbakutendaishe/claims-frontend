import { emptyClaimFormDetails, type ClaimFormDetails } from './claim.contract'

export type OwnershipAnswer = 'own' | 'third_party'
export type PhotoAngle = 'front' | 'back' | 'left' | 'right' | 'damage_close' | 'wide_shot'

export interface ClaimDraft {
  licenseConfirmed: boolean
  ownership: OwnershipAnswer | null
  formDetails: ClaimFormDetails
  policeReportFile: File | null
  photosByAngle: Record<PhotoAngle, File | null>
}

export const emptyClaimDraft: ClaimDraft = {
  licenseConfirmed: false,
  ownership: null,
  formDetails: emptyClaimFormDetails,
  policeReportFile: null,
  photosByAngle: {
    front: null,
    back: null,
    left: null,
    right: null,
    damage_close: null,
    wide_shot: null,
  },
}