import { useState, useMemo } from 'react'

interface Props {
  onVerified: () => void
  onCancel: () => void
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O/0/I/1, easy to confuse

function generateCode(length = 5) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

function CaptchaSvg({ code, seed }: { code: string; seed: number }) {
  const width = 180
  const height = 60
  const rand = (min: number, max: number, offset: number) => {
    const x = Math.sin(seed * 9973 + offset * 37.1) * 10000
    const frac = x - Math.floor(x)
    return min + frac * (max - min)
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 rounded-lg bg-input-bg">
      {code.split('').map((ch, i) => {
        const x = 18 + i * 30 + rand(-4, 4, i)
        const y = 38 + rand(-6, 6, i + 10)
        const rotate = rand(-25, 25, i + 20)
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={26}
            fontWeight={700}
            fill="#7A1F1A"
            fontFamily="Georgia, serif"
            transform={`rotate(${rotate} ${x} ${y})`}
          >
            {ch}
          </text>
        )
      })}
      {/* noise strike lines, crossing through the text */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={rand(0, width, i + 30)}
          y1={rand(0, height, i + 40)}
          x2={rand(0, width, i + 50)}
          y2={rand(0, height, i + 60)}
          stroke="#7A1F1A"
          strokeWidth={1.5}
          opacity={0.35}
        />
      ))}
      {/* scattered dot noise */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={rand(0, width, i + 70)}
          cy={rand(0, height, i + 90)}
          r={1}
          fill="#7A1F1A"
          opacity={0.4}
        />
      ))}
    </svg>
  )
}

export function HumanCheckModal({ onVerified, onCancel }: Props) {
  const [seed, setSeed] = useState(() => Math.random())
  const code = useMemo(() => generateCode(), [seed])
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleCheck = () => {
    if (input.trim().toUpperCase() === code) {
      onVerified()
    } else {
      setError(true)
    }
  }

  const refresh = () => {
    setSeed(Math.random())
    setInput('')
    setError(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card text-card-ink rounded-2xl shadow-xl max-w-xs w-full p-6 space-y-4 text-center">
        <h2 className="text-base font-semibold">Quick check</h2>
        <p className="text-sm opacity-80">Type the characters you see below</p>

        <div className="flex items-center gap-2">
          <CaptchaSvg code={code} seed={seed} />
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh code"
            className="text-lg leading-none px-2 py-1 rounded-md border border-white/30"
          >
            ↻
          </button>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          autoFocus
          placeholder="Enter the code"
          className="w-full text-center rounded-md bg-input-bg text-input-ink px-3 py-2 text-sm outline-none"
        />
        {error && <p className="text-xs text-red-300">That didn't match, try again.</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-md border border-white/30 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCheck}
            className="flex-1 bg-button-bg text-button-ink rounded-md py-2 text-sm font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}