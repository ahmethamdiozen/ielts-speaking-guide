import { useCallback, useEffect, useState } from 'react'

export const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function useCountdown(initial) {
  const [left, setLeft] = useState(initial)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => { if (running && left <= 0) setRunning(false) }, [running, left])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback((seconds = initial) => { setRunning(false); setLeft(seconds) }, [initial])
  return { left, running, start, pause, reset }
}
