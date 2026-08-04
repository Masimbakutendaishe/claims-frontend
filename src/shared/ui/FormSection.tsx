export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="text-left">
      <h3 className="text-sm font-semibold text-card-ink mb-3 pb-1.5 border-b border-white/20">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}