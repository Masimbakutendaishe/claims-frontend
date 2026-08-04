import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-button-bg text-button-ink shadow-md',
  secondary: 'bg-transparent border border-current text-card-ink',
  ghost: 'bg-transparent text-card-ink underline',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-sm py-2 px-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...rest },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.03, y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  )
})