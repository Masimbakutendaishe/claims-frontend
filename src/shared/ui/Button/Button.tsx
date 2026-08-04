import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-button-bg text-button-ink hover:opacity-90',
  secondary: 'bg-transparent border border-current text-card-ink hover:bg-white/10',
  ghost: 'bg-transparent text-card-ink underline hover:opacity-80',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-sm py-2 px-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
})