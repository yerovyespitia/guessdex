import { useState, useEffect } from 'react'
import { Pokemon } from '@/types/pokemon'

export const useGuess = (
  pokemon: Pokemon,
  onCorrect: () => void,
  onWrong: () => void
) => {
  const [guess, setGuess] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showWrongIcon, setShowWrongIcon] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [wrongGuesses, setWrongGuesses] = useState(0)

  useEffect(() => {
    setGuess('')
    setIsCorrect(false)
    setShowWrongIcon(false)
  }, [pokemon])

  const submitGuess = () => {
    const isGuessCorrect = guess.toLowerCase() === pokemon.name.toLowerCase()
    setIsCorrect(isGuessCorrect)

    if (isGuessCorrect) {
      setCorrectGuesses((prev) => prev + 1)
      onCorrect()
    } else {
      setWrongGuesses((prev) => prev + 1)
      setShowWrongIcon(true)
      onWrong()
    }
  }

  return {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
  }
}
