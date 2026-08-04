import { useState, useEffect } from "react"
import { api } from "../../shared/api/client"
import { ENDPOINTS } from "../../shared/api/endpoints"
import type { ConsentRecord, RecordConsentRequest } from "../../shared/api/contracts/consent.contract"

const CONSENT_VERSION = "1.0"

export function useConsent() {
  const [consent, setConsent] = useState<ConsentRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<ConsentRecord>(ENDPOINTS.consent.getCurrent)
      .then(setConsent)
      .catch(() => setConsent(null))
      .finally(() => setLoading(false))
  }, [])

  const needsConsent =
    !loading && (!consent || consent.version !== CONSENT_VERSION)

  const recordConsent = async (choices: Omit<RecordConsentRequest, "version">) => {
    const payload: RecordConsentRequest = { version: CONSENT_VERSION, ...choices }
    const result = await api.post<ConsentRecord>(ENDPOINTS.consent.record, payload)
    setConsent(result)
    return result
  }

  return { consent, loading, needsConsent, recordConsent, CONSENT_VERSION }
}
