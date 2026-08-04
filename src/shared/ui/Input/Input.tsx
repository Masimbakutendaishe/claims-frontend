import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sheen?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { sheen = true, className = '', ...rest },
  ref
) {
  return (
    <div className="group relative overflow-hidden rounded-lg w-full">
      <input
        ref={ref}
        className={`w-full rounded-lg bg-input-bg text-input-ink px-3 py-2 text-sm outline-none ${className}`}
        {...rest}
      />
      {sheen && (
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full group-focus-within:translate-x-full" />
      )}
    </div>
  )
})