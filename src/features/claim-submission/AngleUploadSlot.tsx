import { useEffect, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'

interface Props {
  label: string
  required?: boolean
  file: File | null
  onFile: (file: File) => void
  onRemove: () => void
}

export function AngleUploadSlot({ label, required, file, onFile, onRemove }: Props) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (preview) {
    return (
      <div className="relative h-20 rounded-xl overflow-hidden border-2 border-green-400 group">
        <img src={preview} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onRemove() }}
            className="text-white flex items-center gap-1 text-[11px] bg-black/50 rounded-full px-2 py-1"
          >
            <X size={12} /> Remove
          </button>
        </div>
        <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 rounded px-1.5 py-0.5">
          {label}
        </span>
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) onFile(dropped)
      }}
      className={`flex flex-col items-center justify-center gap-1 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-card-ink ${
        dragActive ? 'border-white bg-white/10' : 'border-white/40 hover:border-white/70'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <UploadCloud size={16} className="opacity-70" />
      <span className="text-[11px] opacity-80">{label}{required ? ' *' : ''}</span>
    </label>
  )
}