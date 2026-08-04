import { useEffect, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { PhotoQualityGuide } from '../PhotoQualityGuide'
import { PhotoGuideCube } from '../PhotoGuideCube'
import { AngleUploadSlot } from '../AngleUploadSlot'
import type { ClaimDraft, PhotoAngle } from '../../../shared/api/contracts/claimDraft.contract'

interface Props {
  photosByAngle: ClaimDraft['photosByAngle']
  onBack: () => void
  onNext: (photos: ClaimDraft['photosByAngle']) => void
}

const REQUIRED: PhotoAngle[] = ['front', 'back', 'left', 'right']
const SLOTS: { angle: PhotoAngle; label: string }[] = [
  { angle: 'front', label: 'Front' },
  { angle: 'back', label: 'Back' },
  { angle: 'left', label: 'Left side' },
  { angle: 'right', label: 'Right side' },
  { angle: 'damage_close', label: 'Damage close-up' },
  { angle: 'wide_shot', label: 'Wide shot' },
]

export function PhotosStep({ photosByAngle, onBack, onNext }: Props) {
  const [previews, setPreviews] = useState<Partial<Record<PhotoAngle, string>>>({})

  useEffect(() => {
    const urls: Partial<Record<PhotoAngle, string>> = {}
    for (const { angle } of SLOTS) {
      const file = photosByAngle[angle]
      if (file) urls[angle] = URL.createObjectURL(file)
    }
    setPreviews(urls)
    return () => {
      Object.values(urls).forEach((url) => url && URL.revokeObjectURL(url))
    }
  }, [photosByAngle])

  const setPhoto = (angle: PhotoAngle, file: File) => {
    onNext({ ...photosByAngle, [angle]: file })
  }
  const removePhoto = (angle: PhotoAngle) => {
    onNext({ ...photosByAngle, [angle]: null })
  }

  const completed = Object.fromEntries(
    SLOTS.map(({ angle }) => [angle, Boolean(photosByAngle[angle])])
  ) as Record<PhotoAngle, boolean>

  const canContinue = REQUIRED.every((angle) => photosByAngle[angle])

  return (
    <div className="space-y-5 text-center">
      <h2 className="font-semibold text-card-ink">Photos of the damage</h2>
      <PhotoQualityGuide />
      <PhotoGuideCube completed={completed} previews={previews} />

      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(({ angle, label }) => (
          <AngleUploadSlot
            key={angle}
            label={label}
            required={REQUIRED.includes(angle)}
            file={photosByAngle[angle]}
            onFile={(file) => setPhoto(angle, file)}
            onRemove={() => removePhoto(angle)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button disabled={!canContinue} onClick={() => onNext(photosByAngle)}>Continue</Button>
      </div>
    </div>
  )
}