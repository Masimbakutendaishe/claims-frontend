import { LayoutDashboard, FilePlus, FileText, User } from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ElementType
  active?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'New Claim', icon: FilePlus },
  { label: 'My Claims', icon: FileText },
  { label: 'Profile', icon: User },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-card text-card-ink min-h-dvh p-4 gap-1">
      <div className="text-sm font-semibold tracking-wide mb-6 px-2 opacity-80">Claims System</div>
      {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          type="button"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
            active ? 'bg-white/15 font-medium' : 'hover:bg-white/10 opacity-80'
          }`}
        >
          <Icon size={17} strokeWidth={2} />
          {label}
        </button>
      ))}
    </aside>
  )
}