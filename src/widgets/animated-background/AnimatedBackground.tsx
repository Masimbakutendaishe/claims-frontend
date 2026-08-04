import { motion } from 'motion/react'
import { useTheme } from '../../app/providers/ThemeProvider'

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M50 6 L90 22 V50 C90 74 72 90 50 96 C28 90 10 74 10 50 V22 Z" />
      <path d="M35 50 L46 62 L68 38" />
    </svg>
  )
}

function DiamondIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M50 8 L82 40 L50 96 L18 40 Z" />
      <path d="M18 40 H82 M50 8 L34 40 M50 8 L66 40" />
    </svg>
  )
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M22 6 H64 L80 22 V94 H22 Z" />
      <path d="M64 6 V22 H80" />
      <path d="M34 56 L46 68 L70 42" />
    </svg>
  )
}

function CarIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M10 50 V38 L26 22 H80 L100 38 H110 V50 H10Z" />
      <circle cx="32" cy="52" r="8" />
      <circle cx="88" cy="52" r="8" />
    </svg>
  )
}

interface FloatItem {
  Icon: (props: { color: string }) => React.JSX.Element
  size: number
  top: string
  duration: number
  delay: number
  reverse?: boolean
}

const items: FloatItem[] = [
  { Icon: ShieldIcon, size: 160, top: '4%', duration: 55, delay: 0 },
  { Icon: DiamondIcon, size: 110, top: '68%', duration: 48, delay: 6, reverse: true },
  { Icon: CarIcon, size: 190, top: '42%', duration: 62, delay: 3 },
  { Icon: DocumentIcon, size: 130, top: '82%', duration: 50, delay: 10, reverse: true },
  { Icon: ShieldIcon, size: 100, top: '18%', duration: 45, delay: 14, reverse: true },
  { Icon: DiamondIcon, size: 140, top: '58%', duration: 58, delay: 20 },
]

export function AnimatedBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const color = isDark ? '#4A5A6B' : '#D8AEA8'

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map(({ Icon, size, top, duration, delay, reverse }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top, width: size, height: size, opacity: isDark ? 0.22 : 0.2 }}
          initial={{ x: reverse ? '110vw' : '-20vw' }}
          animate={{ x: reverse ? '-20vw' : '110vw' }}
          transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
        >
          <Icon color={color} />
        </motion.div>
      ))}
    </div>
  )
}