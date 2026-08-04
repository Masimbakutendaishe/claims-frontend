export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-left">
      <label className="block text-[11px] uppercase tracking-wide opacity-60 text-card-ink mb-1">{label}</label>
      {children}
    </div>
  )
}