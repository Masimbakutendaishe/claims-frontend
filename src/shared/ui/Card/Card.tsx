import { type HTMLAttributes } from 'react'

type Variant = 'default' | 'sheen'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

export function Card({ variant = 'default', children, className = '', ...rest }: CardProps) {
  const base = 'relative bg-card text-card-ink rounded-3xl shadow-lg overflow-hidden'

  return (
    <div className={`${base} ${className}`} {...rest}>
      {children}
      {variant === 'sheen' && (
        <div className="group-hover:translate-x-full pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
      )}
    </div>
  )
}