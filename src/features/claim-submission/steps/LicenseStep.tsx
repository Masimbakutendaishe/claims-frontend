import { useState } from 'react'
import { motion } from 'motion/react'
import { UploadCloud, FileCheck } from 'lucide-react'
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
  const [dragActive, setDragActive] = useState(false)

  const hasLicenseOnFile = Boolean(user?.avatarUrl)

  const acceptFile = (file: File | undefined) => {
    if (!file) return
    setNewFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => acceptFile(e.target.files?.[0])

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragActive(false)
    acceptFile(e.dataTransfer.files?.[0])
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

      <label
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-200 ${
          dragActive ? 'border-white bg-white/10' : 'border-white/40 hover:border-white/70'
        }`}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {preview ? (
          <motion.img
            key={preview}
            src={preview}
            alt="License preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full object-contain rounded-lg p-2"
          />
        ) : (
          <motion.div
            animate={{ y: dragActive ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-2 text-card-ink"
          >
            {hasLicenseOnFile ? <FileCheck size={28} strokeWidth={1.5} /> : <UploadCloud size={28} strokeWidth={1.5} />}
            <span className="text-xs opacity-70">
              {dragActive ? 'Drop to upload' : 'Drag & drop, or click to browse'}
            </span>
          </motion.div>
        )}
      </label>

      {newFile && (
        <p className="text-xs opacity-70 text-card-ink truncate">{newFile.name}</p>
      )}

      <div className="flex justify-center">
        <Button onClick={handleContinue} loading={uploading} disabled={!hasLicenseOnFile && !newFile}>
          Continue
        </Button>
      </div>
    </div>
  )
}