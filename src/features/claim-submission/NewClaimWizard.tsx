import { useState } from 'react'
import { StepTracker } from './StepTracker'
import { LicenseStep } from './steps/LicenseStep'
import { OwnershipStep } from './steps/OwnershipStep'
import { ClaimDetailsStep } from './steps/ClaimDetailsStep'
import { PoliceReportStep } from './steps/PoliceReportStep'
import { PlaceholderStep } from './steps/PlaceholderStep'
import { PhotosStep } from './steps/PhotosStep'
import { Card } from '../../shared/ui/Card'
import { motion, AnimatePresence } from 'motion/react'
import { emptyClaimDraft, type ClaimDraft } from '../../shared/api/contracts/claimDraft.contract'

const OWN_VEHICLE_STEPS = ['License', 'Ownership', 'Claim details', 'Police report', 'Photos', 'Review']
const THIRD_PARTY_STEPS = ['License', 'Ownership', 'Third-party details', 'Review']
const FORM_STEPS = ['Claim details', 'Third-party details'] // tilt is disabled only on these

interface Props {
  onExit: () => void
  onSubmitted: () => void
}

export function NewClaimWizard({ onExit, onSubmitted }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [viewIndex, setViewIndex] = useState(0)
  const [draft, setDraft] = useState<ClaimDraft>(emptyClaimDraft)
  const isViewingPast = viewIndex < stepIndex

  const steps = draft.ownership === 'third_party' ? THIRD_PARTY_STEPS : OWN_VEHICLE_STEPS
  const isFormStepActive = FORM_STEPS.includes(steps[viewIndex])

  const goNext = () => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
    setViewIndex((i) => Math.min(i + 1, steps.length - 1))
  }
  const goBack = () => {
    if (stepIndex === 0) {
      onExit()
    } else {
      setStepIndex((i) => i - 1)
    }
  }

  const renderStep = () => {
    switch (viewIndex) {
      case 0:
        return <LicenseStep onNext={() => { setDraft((d) => ({ ...d, licenseConfirmed: true })); goNext() }} />
      case 1:
        return <OwnershipStep onNext={(answer) => { setDraft((d) => ({ ...d, ownership: answer })); goNext() }} />
      case 2:
        return (
          <ClaimDetailsStep
            initial={draft.formDetails}
            onBack={goBack}
            onNext={(data) => { setDraft((d) => ({ ...d, formDetails: data })); goNext() }}
          />
        )
      case 3:
        return (
          <PoliceReportStep
            initialFile={draft.policeReportFile}
            onBack={goBack}
            onNext={(file) => { setDraft((d) => ({ ...d, policeReportFile: file })); goNext() }}
          />
        )
      case 4:
        return (
          <PhotosStep
            photosByAngle={draft.photosByAngle}
            onBack={goBack}
            onNext={(photos) => setDraft((d) => ({ ...d, photosByAngle: photos }))}
          />
        )
      default:
        if (viewIndex === steps.length - 1) {
          return <PlaceholderStep title="Review & Submit" onBack={goBack} onNext={onSubmitted} />
        }
        return <PlaceholderStep title={steps[viewIndex]} onBack={goBack} onNext={goNext} />
    }
  }

  return (
    <div>
      {/* Full-width sticky glass bar — no padding here, so no gap math needed */}
      <div
        className="sticky z-10 w-full backdrop-blur-lg backdrop-saturate-150 bg-white/70 dark:bg-[#0B1533]/60 border-b border-black/5 dark:border-white/15"
        style={{ top: 'var(--navbar-h, 64px)' }}
      >
        <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-8 pt-3 pb-2">
          <StepTracker steps={steps} currentIndex={stepIndex} viewIndex={viewIndex} onStepClick={setViewIndex} />
        </div>
      </div>

      <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-8 pt-4 pb-8">
        {isViewingPast && (
          <div className="flex items-center justify-between text-xs text-card bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 mb-3">
            <span>Viewing "{steps[viewIndex]}" — completed, read-only.</span>
            <button type="button" onClick={() => setViewIndex(stepIndex)} className="underline font-medium">
              Return to current step
            </button>
          </div>
        )}

        <Card variant="sheen" tilt={!isFormStepActive} className="p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={
                isViewingPast
                  ? 'opacity-90 [&_input]:pointer-events-none [&_textarea]:pointer-events-none [&_select]:pointer-events-none [&_button]:pointer-events-none [&_label]:pointer-events-none [&_a]:pointer-events-none'
                  : ''
              }
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}