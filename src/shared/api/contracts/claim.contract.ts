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

export type YesNo = 'yes' | 'no'
export type YesNoUnknown = 'yes' | 'no' | 'unknown'

export interface DamageLine {
  partPanel: string
  natureOfDamage: string
  estimatedCost: string
}

export interface ClaimFormDetails {
  // Section 1 — Policy & Claimant
  policyNumber: string
  policyInceptionDate: string
  fullName: string
  idNumber: string
  physicalAddress: string
  email: string
  phoneMobile: string
  phoneOffice: string
  intermediaryName: string
  claimDate: string

  // Section 2 — Accident details
  accidentDate: string
  accidentTime: string
  accidentLocation: string
  weatherConditions: string
  dateReportedToInsurer: string
  vehicleUsageAtTime: string
  speedAtImpact: string
  roadConditions: string
  accidentDescription: string
  reportedToPolice: YesNo | ''
  policeStationName: string
  rrbNumber: string
  investigatingOfficer: string
  dateReportedToPolice: string
  personCharged: string
  finePaidOrConvicted: string

  // Section 3 — Vehicle details
  vehicleMakeModel: string
  registrationNumber: string
  yearOfManufacture: string
  colour: string
  chassisNumber: string
  engineNumber: string
  sumInsured: string
  coverType: string
  isFinanced: YesNo | ''
  financeHouseName: string

  // Section 4 — Driver at time of accident
  driverFullName: string
  driverLicenceNumber: string
  licenceClassCategory: string
  licenceExpiryDate: string
  driverDob: string
  licenceEndorsed: YesNo | ''
  relationshipToInsured: string
  driverAuthorized: YesNo | ''
  hadPreviousAccidents: YesNo | ''
  previousAccidentDetails: string
  underInfluence: YesNoUnknown | ''

  // Section 6 — Damage to insured vehicle
  whereVehicleCanBeSeen: string
  assessmentContactName: string
  assessmentContactNumber: string
  vehicleDriveable: YesNo | ''
  damageLines: DamageLine[]
}

export const emptyClaimFormDetails: ClaimFormDetails = {
  policyNumber: '', policyInceptionDate: '', fullName: '', idNumber: '', physicalAddress: '',
  email: '', phoneMobile: '', phoneOffice: '', intermediaryName: '', claimDate: '',
  accidentDate: '', accidentTime: '', accidentLocation: '', weatherConditions: '',
  dateReportedToInsurer: '', vehicleUsageAtTime: '', speedAtImpact: '', roadConditions: '',
  accidentDescription: '', reportedToPolice: '', policeStationName: '', rrbNumber: '',
  investigatingOfficer: '', dateReportedToPolice: '', personCharged: '', finePaidOrConvicted: '',
  vehicleMakeModel: '', registrationNumber: '', yearOfManufacture: '', colour: '',
  chassisNumber: '', engineNumber: '', sumInsured: '', coverType: '', isFinanced: '',
  financeHouseName: '',
  driverFullName: '', driverLicenceNumber: '', licenceClassCategory: '', licenceExpiryDate: '',
  driverDob: '', licenceEndorsed: '', relationshipToInsured: '', driverAuthorized: '',
  hadPreviousAccidents: '', previousAccidentDetails: '', underInfluence: '',
  whereVehicleCanBeSeen: '', assessmentContactName: '', assessmentContactNumber: '',
  vehicleDriveable: '', damageLines: [{ partPanel: '', natureOfDamage: '', estimatedCost: '' }],
}

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
