'use client'

import Image from 'next/image'
import { Pokemon } from '@/types/pokemon'
import { ScoreBoard } from './ScoreBoard'
import { Feedback } from './Feedback'
import { GuessForm } from './GuessForm'
import { useGuess } from '@/hooks/useGuess'
import { useEffect, useRef } from 'react'

type CardProps = {
  pokemon: Pokemon
  onCorrectGuess: () => void
  onWrongGuess: () => void
  isInputDisabled?: boolean
}

export const Card = ({
  pokemon,
  onCorrectGuess,
  onWrongGuess,
  isInputDisabled = false,
}: CardProps) => {
  const {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
  } = useGuess(pokemon, onCorrectGuess, onWrongGuess)

  const hasInteractedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (hasInteractedRef.current && !isInputDisabled) inputRef.current?.focus()
  }, [pokemon, isInputDisabled])

  const handleGuess = () => {
    hasInteractedRef.current = true
    submitGuess()
  }

  return (
    <div className='flex flex-col gap-5'>
      <ScoreBoard
        correct={correctGuesses}
        wrong={wrongGuesses}
      />

      <Image
        width={384}
        height={384}
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={`Random pokemon artwork`}
        className={`${isCorrect ? 'brightness-100 ' : 'brightness-0'} w-full`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className='h-[32px] flex flex-col items-center justify-center'>
        <Feedback
          status={isCorrect ? 'correct' : showWrongIcon ? 'wrong' : null}
          name={pokemon.name}
        />
      </div>

      <div className='flex items-center justify-center gap-2 w-full'>
        <GuessForm
          ref={inputRef}
          value={guess}
          onChange={setGuess}
          onSubmit={handleGuess}
          disabled={isInputDisabled}
        />
      </div>
    </div>
  )
}
