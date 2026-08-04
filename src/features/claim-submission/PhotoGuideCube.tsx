import { useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'motion/react'
import type { PhotoAngle } from '../../shared/api/contracts/claimDraft.contract'

const DEPTH = 90

function CarFront() {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <rect x="15" y="18" width="70" height="30" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="28" cy="46" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="72" cy="46" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="24" x2="70" y2="24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function CarSide() {
  return (
    <svg viewBox="0 0 120 55" className="w-full h-full">
      <path
        d="M10 40 L15 25 Q25 12 45 12 L75 12 Q90 12 95 25 L110 30 L110 40 Z"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
      <circle cx="32" cy="42" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="88" cy="42" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

interface Face {
  angle: PhotoAngle
  label: string
  rotateY: number
  render: () => React.JSX.Element
  flip?: boolean
}

const FACES: Face[] = [
  { angle: 'front', label: 'Front', rotateY: 0, render: CarFront },
  { angle: 'right', label: 'Right side', rotateY: 90, render: CarSide },
  { angle: 'back', label: 'Back', rotateY: 180, render: CarFront },
  { angle: 'left', label: 'Left side', rotateY: 270, render: CarSide, flip: true },
]

export function PhotoGuideCube({
  completed,
  previews,
}: {
  completed: Record<PhotoAngle, boolean>
  previews: Partial<Record<PhotoAngle, string>>
}) {
  const rotateY = useMotionValue(0)
  const isDragging = useRef(false)

  useAnimationFrame((_, delta) => {
    if (!isDragging.current) {
      rotateY.set(rotateY.get() + delta * 0.015)
    }
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ perspective: 700 }} className="w-40 h-28">
        <motion.div
          style={{ rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => { isDragging.current = true }}
          onDragEnd={() => { isDragging.current = false }}
          onDrag={(_, info) => rotateY.set(rotateY.get() + info.delta.x * 0.6)}
        >
          {FACES.map(({ angle, label, rotateY: faceRotate, render: Render, flip }) => {
            const photo = previews[angle]
            return (
              <div
                key={angle}
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 backface-hidden overflow-hidden ${
                  completed[angle] ? 'border-green-400' : 'border-white/40 text-card-ink'
                }`}
                style={{
                  transform: `rotateY(${faceRotate}deg) translateZ(${DEPTH}px) ${flip ? 'scaleX(-1)' : ''}`,
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={label}
                    className="w-full h-full object-cover"
                    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
                  />
                ) : (
                  <>
                    <div className="w-16 h-10"><Render /></div>
                    <span className="text-[10px] mt-1 opacity-80">{label}</span>
                  </>
                )}
                {photo && (
                  <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/50 rounded px-1 py-0.5">
                    {label}
                  </span>
                )}
              </div>
            )
          })}
        </motion.div>
      </div>
      <p className="text-[11px] opacity-60 text-card-ink">Drag to rotate — capture each angle shown</p>
    </div>
  )
}