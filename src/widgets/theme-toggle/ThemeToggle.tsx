import { motion } from 'motion/react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../app/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-14 h-7 rounded-full bg-card p-1 transition-colors duration-300 flex items-center"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center shrink-0"
        style={{ marginLeft: isDark ? 'calc(100% - 1.25rem)' : 0 }}
      >
        {isDark ? <Moon size={11} strokeWidth={2} /> : <Sun size={11} strokeWidth={2} />}
      </motion.div>
    </button>
  )
}