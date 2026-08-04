import { Button } from '../../../shared/ui/Button'
import type { OwnershipAnswer } from '../../../shared/api/contracts/claimDraft.contract'

interface Props {
  onNext: (answer: OwnershipAnswer) => void
}

export function OwnershipStep({ onNext }: Props) {
  return (
    <div className="space-y-4 text-center">
      <h2 className="font-semibold text-card-link">Is this your vehicle, or a third party's?</h2>
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={() => onNext('own')}>My vehicle</Button>
        <Button variant="secondary" onClick={() => onNext('third_party')}>Third party</Button>
        </div>
    </div>
  )
}