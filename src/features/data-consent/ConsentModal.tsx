import { useState } from "react"
import { useConsent } from "./useConsent"

interface Props {
  onComplete: () => void
}

export function ConsentModal({ onComplete }: Props) {
  const { recordConsent } = useConsent()
  const [dataProcessing, setDataProcessing] = useState(false)
  const [photoStorage, setPhotoStorage] = useState(false)
  const [thirdPartySharing, setThirdPartySharing] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const requiredChecked = dataProcessing && photoStorage && thirdPartySharing

  const handleSubmit = async () => {
    if (!requiredChecked) return
    setSubmitting(true)
    try {
      await recordConsent({ dataProcessing, photoStorage, thirdPartySharing, marketing })
      onComplete()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface text-ink rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
        <h2 className="text-xl font-semibold">Before you continue</h2>
        <p className="text-sm opacity-80">
          To process your claim we need your permission to handle certain personal
          data. Read the full{" "}
          <a href="/legal/data-consent" target="_blank" className="underline">
            data consent policy
          </a>{" "}
          for details.
        </p>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={dataProcessing}
            onChange={(e) => setDataProcessing(e.target.checked)}
          />
          I consent to First Mutual processing my personal and claim data to
          handle this claim. (Required)
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={photoStorage}
            onChange={(e) => setPhotoStorage(e.target.checked)}
          />
          I consent to my uploaded documents and photos being stored securely
          for the duration of my claim. (Required)
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={thirdPartySharing}
            onChange={(e) => setThirdPartySharing(e.target.checked)}
          />
          I consent to my claim details being shared with the assigned
          assessor and repair partner as needed to process my claim. (Required)
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          I'd like to receive updates about First Mutual products. (Optional)
        </label>

        <button
          type="button"
          disabled={!requiredChecked || submitting}
          onClick={handleSubmit}
          className="w-full bg-brand-500 text-white rounded-md py-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  )
}
