'use client'

import Image from 'next/image'
import { Pokemon } from '@/types/pokemon'
import { ScoreBoard } from './ScoreBoard'
import { Feedback } from './Feedback'
import { GuessForm } from './GuessForm'
import { useGuess } from '@/hooks/useGuess'

type CardProps = {
  pokemon: Pokemon
  onCorrectGuess: () => void
  onWrongGuess: () => void
}

export const Card = ({ pokemon, onCorrectGuess, onWrongGuess }: CardProps) => {
  const {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
  } = useGuess(pokemon, onCorrectGuess, onWrongGuess)

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
          value={guess}
          onChange={setGuess}
          onSubmit={submitGuess}
        />
      </div>
    </div>
  )
}
