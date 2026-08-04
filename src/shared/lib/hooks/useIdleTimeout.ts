import { useEffect, useRef, useCallback } from "react"

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]

interface UseIdleTimeoutArgs {
  idleMs: number
  warningMs: number
  onWarning: () => void
  onTimeout: () => void
  enabled: boolean
}

export function useIdleTimeout({ idleMs, warningMs, onWarning, onTimeout, enabled }: UseIdleTimeoutArgs) {
  const warningTimer = useRef<ReturnType<typeof setTimeout>>()
  const logoutTimer = useRef<ReturnType<typeof setTimeout>>()

  const resetTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current)
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (!enabled) return

    warningTimer.current = setTimeout(onWarning, idleMs - warningMs)
    logoutTimer.current = setTimeout(onTimeout, idleMs)
  }, [idleMs, warningMs, onWarning, onTimeout, enabled])

  useEffect(() => {
    if (!enabled) return
    resetTimers()
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimers))
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimers))
      if (warningTimer.current) clearTimeout(warningTimer.current)
      if (logoutTimer.current) clearTimeout(logoutTimer.current)
    }
  }, [enabled, resetTimers])

  return { resetTimers }
}