import { useState, useEffect } from 'react'
import { Pokemon } from '../types/pokemon'

export const useGuess = (pokemon: Pokemon) => {
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
    } else {
      setWrongGuesses((prev) => prev + 1)
      setShowWrongIcon(true)
    }

    return isGuessCorrect
  }

  const incrementWrongGuesses = () => {
    setWrongGuesses((prev) => prev + 1)
    setShowWrongIcon(true)
  }

  return {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
    incrementWrongGuesses,
  }
}
