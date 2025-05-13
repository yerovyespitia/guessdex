import { useEffect, useRef } from 'react'
import correctSound from '../assets/sounds/ping.mp3'
import wrongSound from '../assets/sounds/error.mp3'

export const useSound = () => {
  const correctAudioRef = useRef<HTMLAudioElement | null>(null)
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    correctAudioRef.current = new Audio(correctSound)
    wrongAudioRef.current = new Audio(wrongSound)

    // Precargar los audios
    correctAudioRef.current.load()
    wrongAudioRef.current.load()

    return () => {
      // Limpiar los audios cuando el componente se desmonta
      if (correctAudioRef.current) {
        correctAudioRef.current.pause()
        correctAudioRef.current = null
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.pause()
        wrongAudioRef.current = null
      }
    }
  }, [])

  return {
    playCorrectSound: () => {
      if (correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0
        correctAudioRef.current.play()
      }
    },
    playWrongSound: () => {
      if (wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0
        wrongAudioRef.current.play()
      }
    },
  }
}
