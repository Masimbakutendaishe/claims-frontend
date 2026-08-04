export const ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    forgotPassword: "/api/auth/forgot-password",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
  },
  consent: {
    record: "/api/consent",
    getCurrent: "/api/consent/me",
  },
  profile: {
    update: "/api/profile",
    uploadAvatar: "/api/profile/avatar",
  },
  claims: {
    create: "/api/claims",
    getById: (id: string) => `/api/claims/${id}`,
    list: "/api/claims",
    submitForm: "/api/claims/:id/form",
    uploadPoliceReport: "/api/claims/:id/police-report",
    uploadPhotos: "/api/claims/:id/photos",
    review: "/api/claims/:id/review",
  },
  assessment: {
    submit: "/api/claims/:id/assessment",
    getByClaimId: (claimId: string) => `/api/claims/${claimId}/assessment`,
  },
  bidding: {
    sendRequest: "/api/claims/:id/bids",
    submitQuote: "/api/bids/:bidId/quote",
    closeBid: "/api/bids/:bidId/close",
  },
  payment: {
    requestApproval: "/api/claims/:id/payment-approval",
  },
  thirdParty: {
    fullCoverCheck: "/api/third-party/full-cover-check",
    submitInsuranceLetter: "/api/third-party/insurance-letter",
  },
} as const