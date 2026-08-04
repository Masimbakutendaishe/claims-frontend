interface Props {
  steps: string[]
  currentIndex: number
}

export function StepTracker({ steps, currentIndex }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              i < currentIndex
                ? 'bg-brand-500 text-white'
                : i === currentIndex
                ? 'bg-brand-500 text-white ring-2 ring-brand-500/40'
                : 'bg-black/10 dark:bg-white/10 text-card opacity-50'
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-xs whitespace-nowrap ${i === currentIndex ? 'font-medium text-card' : 'opacity-50 text-card'}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-black/10 dark:bg-white/10" />}
        </div>
      ))}
    </div>
  )
}