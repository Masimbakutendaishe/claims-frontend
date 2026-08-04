import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { resizeImage } from '../../profile/resizeImage'

interface Props {
  onNext: () => void
}

export function LicenseStep({ onNext }: Props) {
  const { user } = useAuthContext()
  const [newFile, setNewFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const hasLicenseOnFile = Boolean(user?.avatarUrl)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNewFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleContinue = async () => {
    if (newFile) {
      setUploading(true)
      try {
        await resizeImage(newFile)
      } finally {
        setUploading(false)
      }
    }
    onNext()
  }

  return (
    <div className="space-y-4 text-center">
      <h2 className="font-semibold text-card-ink">Confirm your driver's license</h2>

      {hasLicenseOnFile && !newFile && (
        <p className="text-sm opacity-70 text-card-ink">
          We have a license on file from when you signed up. You can continue, or upload a new one below if it's changed.
        </p>
      )}

      {!hasLicenseOnFile && !newFile && (
        <p className="text-sm opacity-70 text-card-ink">
          We don't have a license on file yet — please upload one to continue.
        </p>
      )}

      {preview && (
        <img src={preview} alt="License preview" className="w-full max-h-40 object-contain rounded-lg bg-input-bg" />
      )}

      <label className="inline-block text-sm underline cursor-pointer text-card-ink">
        {hasLicenseOnFile ? 'Upload a different license' : 'Upload license'}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      <div className="flex justify-center">
        <Button
            onClick={handleContinue}
            loading={uploading}
            disabled={!hasLicenseOnFile && !newFile}
        >
            Continue
        </Button>
        </div>
    </div>
  )
}