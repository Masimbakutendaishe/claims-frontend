import { Button } from '../../../shared/ui/Button'

interface Props {
  title: string
  onNext: () => void
  onBack: () => void
}

export function PlaceholderStep({ title, onNext, onBack }: Props) {
  return (
    <div className="space-y-4 text-center">
      <h2 className="font-semibold text-card-link">{title}</h2>
      <p className="text-sm opacity-70 text-card-link">Not built yet — placeholder step.</p>
     <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue</Button>
        </div>
    </div>
  )
}