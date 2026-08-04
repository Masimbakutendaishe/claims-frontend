import { motion, AnimatePresence } from 'motion/react'
import { IdCard, GitFork, FileEdit, ShieldAlert, Camera, ClipboardCheck, Users, Check } from 'lucide-react'

const STEP_ICONS: Record<string, React.ElementType> = {
  'License': IdCard,
  'Ownership': GitFork,
  'Claim details': FileEdit,
  'Third-party details': Users,
  'Police report': ShieldAlert,
  'Photos': Camera,
  'Review': ClipboardCheck,
}

interface Props {
  steps: string[]
  currentIndex: number
  viewIndex: number
  onStepClick: (index: number) => void
}

export function StepTracker({ steps, currentIndex, viewIndex, onStepClick }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap">
      {steps.map((label, i) => {
        const Icon = STEP_ICONS[label] ?? FileEdit
        const isComplete = i < currentIndex
        const isCurrent = i === currentIndex
        const isViewed = i === viewIndex
        const isClickable = i <= currentIndex

        return (
          <button
            type="button"
            key={label}
            onClick={() => isClickable && onStepClick(i)}
            disabled={!isClickable}
            className={`flex items-center gap-2 shrink-0 ${isClickable ? 'cursor-pointer' : 'cursor-default'} disabled:opacity-40`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shadow-sm transition-transform ${
                isViewed ? 'scale-110' : ''
              } ${
                isComplete || isCurrent
                  ? 'bg-brand-500 text-white'
                  : 'bg-black/10 dark:bg-white/20 text-card border border-black/15 dark:border-white/30'
              } ${isCurrent ? 'ring-4 ring-brand-500/30' : ''}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isComplete ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div key="icon" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                    <Icon size={15} strokeWidth={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className={`text-xs whitespace-nowrap ${isCurrent ? 'font-semibold text-card' : 'opacity-60 text-card'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-black/15 dark:bg-white/20" />}
          </button>
        )
      })}
    </div>
  )
}