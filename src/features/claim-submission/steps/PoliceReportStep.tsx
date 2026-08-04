import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'

interface Props {
  initialFile: File | null
  onNext: (file: File) => void
  onBack: () => void
}

export function PoliceReportStep({ initialFile, onNext, onBack }: Props) {
  const [file, setFile] = useState<File | null>(initialFile)
  const [preview, setPreview] = useState<string | null>(initialFile ? URL.createObjectURL(initialFile) : null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  return (
    <div className="space-y-4 text-center">
      <h2 className="font-semibold text-card-ink">Police report</h2>
      <p className="text-sm opacity-70 text-card-ink">
        Upload a signed police report. Don't have one yet?{' '}
        <a href="/police-report-template.pdf" download className="underline">
          Download the template
        </a>{' '}
        to fill in and upload once ready.
      </p>

      {preview && (
        <div className="text-sm opacity-80 text-card-ink">Selected: {file?.name}</div>
      )}

      <label className="inline-block text-sm underline cursor-pointer text-card-ink">
        {file ? 'Choose a different file' : 'Upload police report'}
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
      </label>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button disabled={!file} onClick={() => file && onNext(file)}>Continue</Button>
      </div>
    </div>
  )
}