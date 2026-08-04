import { LogOut, Menu } from 'lucide-react'
import { useAuthContext } from '../../app/providers/AuthProvider'
import { ThemeToggle } from '../theme-toggle/ThemeToggle'

export function NavBar() {
  const { user, logout } = useAuthContext()

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/5 dark:border-white/10">
      <button type="button" className="md:hidden text-card">
        <Menu size={22} />
      </button>

      <div className="hidden md:block">
        <h1 className="text-base font-semibold text-card">Welcome, {user?.fullName}</h1>
        <p className="text-xs opacity-60">Manage your claims</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button type="button" onClick={logout} className="flex items-center gap-1.5 text-sm text-card">
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}