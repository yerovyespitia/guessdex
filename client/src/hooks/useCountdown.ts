import { useState, useEffect } from 'react'

export const useCountdown = (startFrom: number, onComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (countdown === null) return

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown((prev) => (prev ?? 1) - 1)
      } else {
        onComplete()
        setCountdown(null)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onComplete])

  const start = () => setCountdown(startFrom)
  const reset = () => setCountdown(null)

  return { countdown, start, reset }
}
