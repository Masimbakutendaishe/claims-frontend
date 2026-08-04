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
function KeyIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 60" fill="none" stroke={color} strokeWidth="2.5">
      <circle cx="20" cy="30" r="14" />
      <path d="M32 30 H92 M70 30 V44 M84 30 V40" />
    </svg>
  )
}
function CheckShieldIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M50 6 L90 22 V50 C90 74 72 90 50 96 C28 90 10 74 10 50 V22 Z" />
      <path d="M32 48 L46 62 L70 34" />
    </svg>
  )
}

interface FloatItem {
  Icon: (props: { color: string }) => React.JSX.Element
  size: number
  top: string
  duration: number
  reverse?: boolean
}

const items: FloatItem[] = [
  { Icon: ShieldIcon, size: 150, top: '2%', duration: 26 },
  { Icon: DiamondIcon, size: 100, top: '15%', duration: 22, reverse: true },
  { Icon: CarIcon, size: 180, top: '30%', duration: 30 },
  { Icon: DocumentIcon, size: 120, top: '45%', duration: 20, reverse: true },
  { Icon: KeyIcon, size: 110, top: '58%', duration: 24 },
  { Icon: ShieldIcon, size: 90, top: '70%', duration: 18, reverse: true },
  { Icon: DiamondIcon, size: 130, top: '80%', duration: 28 },
  { Icon: CheckShieldIcon, size: 100, top: '90%', duration: 21, reverse: true },
  { Icon: CarIcon, size: 140, top: '8%', duration: 34, reverse: true },
  { Icon: DocumentIcon, size: 95, top: '38%', duration: 19 },
  { Icon: KeyIcon, size: 105, top: '65%', duration: 25, reverse: true },
  { Icon: CheckShieldIcon, size: 115, top: '95%', duration: 23 },
]

export function AnimatedBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const color = isDark ? '#4A5A6B' : '#D8AEA8'

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map(({ Icon, size, top, duration, reverse }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top, width: size, height: size, opacity: isDark ? 0.22 : 0.2 }}
          initial={{ x: reverse ? '110vw' : '-20vw' }}
          animate={{ x: reverse ? '-20vw' : '110vw' }}
          transition={{ duration, delay: 0, repeat: Infinity, ease: 'linear' }}
        >
          <Icon color={color} />
        </motion.div>
      ))}
    </div>
  )
}