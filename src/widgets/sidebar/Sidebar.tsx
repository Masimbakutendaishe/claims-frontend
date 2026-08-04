import { LayoutDashboard, FilePlus, FileText, User } from 'lucide-react'
import { useTheme } from '../../app/providers/ThemeProvider'
import fmLight from '../../shared/assets/logos/fmlogo-light.png'
import nicozDark from '../../shared/assets/logos/nicozlogo-dark.png'
import { useState } from 'react'
import { motion } from 'motion/react'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [hovered, setHovered] = useState(false)

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-dvh bg-card text-card-ink p-4 gap-1 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        initial={{ y: '-100%' }}
        animate={{ y: hovered ? '100%' : '-100%' }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      <div className="flex items-center gap-2 mb-6 px-2">
        <img src={isDark ? nicozDark : fmLight} alt="" className={isDark ? 'h-14 w-auto shrink-0' : 'h-9 w-auto shrink-0'} />
        <span className="text-sm font-semibold tracking-wide opacity-80">Claims System</span>
      </div>
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