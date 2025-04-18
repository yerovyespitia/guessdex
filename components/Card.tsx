'use client'
import Image from 'next/image'
import { Pokemon } from '@/types/pokemon'
import { useState, useEffect } from 'react'

type CardProps = {
  pokemon: Pokemon
  onCorrectGuess: () => void
  onWrongGuess: () => void
}

export const Card = ({ pokemon, onCorrectGuess, onWrongGuess }: CardProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [guess, setGuess] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)

  // Reset state when pokemon changes
  useEffect(() => {
    setIsCorrect(false)
    setGuess('')
    // setTimeLeft(15)
  }, [pokemon])

  // Timer countdown
//   useEffect(() => {
//     if (timeLeft > 0 && !isCorrect) {
//       const timer = setTimeout(() => {
//         setTimeLeft(timeLeft - 1)
//       }, 1000)
//       return () => clearTimeout(timer)
//     } else if (timeLeft === 0 && !isCorrect) {
//       setWrongGuesses((prev) => prev + 1)
//       onWrongGuess()
//     }
//   }, [timeLeft, isCorrect, onWrongGuess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isGuessCorrect = guess.toLowerCase() === pokemon.name.toLowerCase()
    setIsCorrect(isGuessCorrect)

    if (isGuessCorrect) {
      setCorrectGuesses((prev) => prev + 1)
      onCorrectGuess()
    } else {
      setWrongGuesses((prev) => prev + 1)
      onWrongGuess()
    }
  }

  return (
    <div className='space-y-10'>
      <div className='flex justify-between text-white mb-4'>
        <p className='text-3xl font-bold'>Correct: {correctGuesses}</p>
        <p className='text-3xl font-bold'>Wrong: {wrongGuesses}</p>
      </div>
      <Image
        width={400}
        height={400}
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={`Random pokemon artwork`}
        className={`${isCorrect ? 'brightness-100 ' : 'brightness-0'} w-full`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className='flex items-center justify-center gap-2'>
        <form
          onSubmit={handleSubmit}
          className='flex justify-center items-center'
        >
          <input
            type='text'
            className='px-6 py-3 w-96 border text-lg text-center border-white rounded-lg text-white outline-none'
            placeholder={showPlaceholder ? 'Make a guess...' : ''}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onFocus={() => setShowPlaceholder(false)}
            onBlur={() => setShowPlaceholder(true)}
          />
        </form>
        {/* <div
          className={`text-white border px-5 py-3 rounded-lg text-xl min-w-[5rem] text-center ${
            timeLeft <= 5 ? 'text-red-500' : ''
          }`}
        >
          <p>{timeLeft}s</p>
        </div> */}
      </div>
    </div>
  )
}
