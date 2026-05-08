import { useState, useEffect, useCallback } from 'react'

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isPaused) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused])

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
    setStartTime(new Date())
  }, [])

  const pause = useCallback(() => setIsPaused((p) => !p), [])

  const stop = useCallback(() => {
    const duration = seconds
    setIsRunning(false)
    setIsPaused(false)
    setSeconds(0)
    setStartTime(null)
    return duration
  }, [seconds])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setSeconds(0)
    setStartTime(null)
  }, [])

  return { isRunning, isPaused, seconds, startTime, start, pause, stop, reset }
}
