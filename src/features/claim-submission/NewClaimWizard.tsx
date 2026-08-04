import { useState } from 'react'
import { StepTracker } from './StepTracker'
import { LicenseStep } from './steps/LicenseStep'
import { OwnershipStep } from './steps/OwnershipStep'
import { PlaceholderStep } from './steps/PlaceholderStep'
import { Card } from '../../shared/ui/Card'
import { motion, AnimatePresence } from 'motion/react'
import { emptyClaimDraft, type ClaimDraft } from '../../shared/api/contracts/claimDraft.contract'

const OWN_VEHICLE_STEPS = ['License', 'Ownership', 'Claim details', 'Police report', 'Photos', 'Review']
const THIRD_PARTY_STEPS = ['License', 'Ownership', 'Third-party details', 'Review']

interface Props {
  onExit: () => void
  onSubmitted: () => void
}

export function NewClaimWizard({ onExit, onSubmitted }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState<ClaimDraft>(emptyClaimDraft)

  const steps = draft.ownership === 'third_party' ? THIRD_PARTY_STEPS : OWN_VEHICLE_STEPS

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => {
    if (stepIndex === 0) {
      onExit()
    } else {
      setStepIndex((i) => i - 1)
    }
  }

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return <LicenseStep onNext={() => { setDraft((d) => ({ ...d, licenseConfirmed: true })); goNext() }} />
      case 1:
        return (
          <OwnershipStep
            onNext={(answer) => { setDraft((d) => ({ ...d, ownership: answer })); goNext() }}
          />
        )
      default:
        // Every remaining step is a placeholder for now, except the very last (Review)
        if (stepIndex === steps.length - 1) {
          return (
            <PlaceholderStep title="Review & Submit" onBack={goBack} onNext={onSubmitted} />
          )
        }
        return <PlaceholderStep title={steps[stepIndex]} onBack={goBack} onNext={goNext} />
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <StepTracker steps={steps} currentIndex={stepIndex} />
      <Card className="p-6 overflow-hidden">
  <AnimatePresence mode="wait">
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {renderStep()}
    </motion.div>
  </AnimatePresence>
</Card>
    </div>
  )
}