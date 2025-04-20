import { useState, useEffect } from 'react'

export const useGameTimer = (duration: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (timeLeft === null) return

    if (timeLeft <= 0) {
      onTimeout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeout])

  const startTimer = () => {
    setTimeLeft(duration)
  }

  const stopTimer = () => {
    setTimeLeft(null)
  }

  return {
    timeLeft,
    startTimer,
    stopTimer
  }
} 