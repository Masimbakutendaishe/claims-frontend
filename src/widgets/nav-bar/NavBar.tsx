import { LogOut, Menu, User } from 'lucide-react'
import { useAuthContext } from '../../app/providers/AuthProvider'
import { useTheme } from '../../app/providers/ThemeProvider'
import { ThemeToggle } from '../theme-toggle/ThemeToggle'
import fmPark from '../../shared/assets/backgrounds/fmpark.jpg'
import nicozImage from '../../shared/assets/backgrounds/nicozimage.jpg'
import { useRef, useEffect } from 'react'

export function NavBar() {
  const { user, logout } = useAuthContext()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const setHeight = () => {
      document.documentElement.style.setProperty('--navbar-h', `${ref.current!.offsetHeight}px`)
    }
    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${isDark ? nicozImage : fmPark})` }}
    >
      {/* Shade layer — keeps text readable regardless of what's in the photo underneath */}
      <div
        className={`absolute inset-0 ${
          isDark ? 'bg-[#0B1B33]/70' : 'bg-white/75'
        }`}
      />

      <button type="button" className="relative z-10 md:hidden text-card">
        <Menu size={22} />
      </button>

      <div className="relative z-10 hidden md:flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 flex items-center justify-center shrink-0">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-card opacity-70" />
          )}
        </div>
        <div>
          <h1 className="text-base font-semibold text-card drop-shadow-sm">Welcome, {user?.fullName}</h1>
          <p className="text-xs opacity-80 text-card">Manage your claims</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <ThemeToggle />
        <button type="button" onClick={logout} className="flex items-center gap-1.5 text-sm text-card">
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}