import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

interface Props {
  label: string
  required?: boolean
  onFile: (file: File) => void
  hasFile: boolean
}

export function AngleUploadSlot({ label, required, onFile, hasFile }: Props) {
  const [dragActive, setDragActive] = useState(false)

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file) onFile(file)
      }}
      className={`flex flex-col items-center justify-center gap-1 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-card-ink ${
        hasFile ? 'border-green-400 bg-green-400/10' : dragActive ? 'border-white bg-white/10' : 'border-white/40 hover:border-white/70'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <UploadCloud size={16} className={hasFile ? 'text-green-400' : 'opacity-70'} />
      <span className="text-[11px] opacity-80">{label}{required && !hasFile ? ' *' : ''}</span>
    </label>
  )
}