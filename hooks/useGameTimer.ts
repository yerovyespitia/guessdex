import { useState, useEffect, useCallback } from 'react'

export const useGameTimer = (duration: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const startTimer = useCallback(() => {
    console.log('Timer started with duration:', duration)
    setTimeLeft(duration)
  }, [duration])

  const stopTimer = useCallback(() => {
    console.log('Timer stopped')
    setTimeLeft(null)
  }, [])

  useEffect(() => {
    if (timeLeft === null) return

    console.log('Timer running, time left:', timeLeft)

    if (timeLeft <= 0) {
      console.log('Timer expired, calling onTimeout')
      onTimeout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null
        const newTime = prev - 1
        console.log('Timer tick, new time:', newTime)
        return newTime
      })
    }, 1000)

    return () => {
      console.log('Clearing timer interval')
      clearInterval(timer)
    }
  }, [timeLeft, onTimeout])

  return {
    timeLeft,
    startTimer,
    stopTimer
  }
} 