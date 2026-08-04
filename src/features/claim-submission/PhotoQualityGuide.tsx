import { Sun, Focus, Ban, Frame, CheckCircle2, XCircle } from 'lucide-react'

const RULES = [
  { icon: Sun, text: 'Shoot in daylight or good lighting — avoid deep shadows or backlighting' },
  { icon: Focus, text: 'Hold steady — blurry or out-of-focus photos will be rejected' },
  { icon: Frame, text: 'Fill the frame — get close enough that the damage is clearly visible' },
  { icon: Ban, text: 'No filters or heavy editing — photos must reflect the vehicle as-is' },
]

const GOOD = ['Whole vehicle visible, well lit', 'Damage clearly in focus', 'Taken straight-on, not at an angle']
const AVOID = ['Blurry or motion-shake', 'Taken in the dark or with harsh glare', 'Cropped so damage is cut off']

export function PhotoQualityGuide() {
  return (
    <div className="text-left space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {RULES.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-2 text-xs text-card-ink opacity-80">
            <Icon size={15} className="shrink-0 mt-0.5" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-green-400/40 bg-green-400/10 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-card-ink mb-1.5">
            <CheckCircle2 size={14} className="text-green-400" /> Acceptable
          </div>
          <ul className="text-xs text-card-ink opacity-75 space-y-1 list-disc list-inside">
            {GOOD.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-card-ink mb-1.5">
            <XCircle size={14} className="text-red-400" /> Avoid
          </div>
          <ul className="text-xs text-card-ink opacity-75 space-y-1 list-disc list-inside">
            {AVOID.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}