import { useRef, useState, type HTMLAttributes } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

type Variant = 'default' | 'sheen'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  tilt?: boolean
}

export function Card({ variant = 'default', tilt = true, children, className = '', ...rest }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 250, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 22 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleEnter = () => setHovered(true)
  const handleLeave = () => {
    setHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const base = 'relative bg-card text-card-ink rounded-3xl shadow-lg overflow-hidden'

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={`${base} ${className}`}
      {...rest}
    >
      {children}
      {variant === 'sheen' && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: hovered ? '100%' : '-100%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}