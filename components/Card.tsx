'use client'

import Image from 'next/image'
import { Pokemon } from '@/types/pokemon'
import { ScoreBoard } from './ScoreBoard'
import { Feedback } from './Feedback'
import { GuessForm } from './GuessForm'
import { useGuess } from '@/hooks/useGuess'
import { useEffect, useRef, useState } from 'react'

type CardProps = {
  pokemon: Pokemon
  onCorrectGuess: () => void
  onWrongGuess: () => void
  isInputDisabled?: boolean
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
}

export const Card = ({
  pokemon,
  onCorrectGuess,
  onWrongGuess,
  isInputDisabled = false,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
}: CardProps) => {
  const {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
  } = useGuess(pokemon)

  const [showName, setShowName] = useState(false)
  const [localInputDisabled, setLocalInputDisabled] = useState(false)
  const hasInteractedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (hasInteractedRef.current && !isInputDisabled) inputRef.current?.focus()
  }, [pokemon, isInputDisabled])
  
  useEffect(() => {
    setShowName(false)
    setLocalInputDisabled(false)
  }, [pokemon])

  const handleGuess = () => {
    hasInteractedRef.current = true
    setLocalInputDisabled(true)
    const isGuessCorrect = submitGuess()
    setShowName(true)

    if (isGuessCorrect) {
      console.log('Correct guess, showing name for 2 seconds')
      setTimeout(() => {
        setShowName(false)
        onCorrectGuess()
      }, 2000)
    } else {
      console.log('Wrong guess, showing feedback for 2 seconds')
      setTimeout(() => {
        setShowName(false)
        onWrongGuess()
        setLocalInputDisabled(false)
      }, 2000)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <ScoreBoard
        correct={correctGuesses}
        wrong={wrongGuesses}
        isMultiplayer={isMultiplayer}
        playerScores={playerScores}
        players={players}
        currentPlayerId={currentPlayerId}
        activePlayerId={activePlayerId}
      />

      <Image
        width={384}
        height={384}
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={`Random pokemon artwork`}
        className={`${isCorrect ? 'brightness-100' : 'brightness-0'} w-full`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className='h-[32px] flex flex-col items-center justify-center'>
        <Feedback
          status={isCorrect ? 'correct' : showWrongIcon ? 'wrong' : null}
          name={showName ? pokemon.name : ''}
        />
      </div>

      {(!isMultiplayer ||
        (isMultiplayer &&
          currentPlayerId === activePlayerId &&
          players.length >= 2)) && (
          <div className='flex items-center justify-center gap-2 w-full'>
            <GuessForm
              ref={inputRef}
              value={guess}
              onChange={setGuess}
              onSubmit={handleGuess}
              disabled={isInputDisabled || localInputDisabled}
            />
          </div>
        )}
    </div>
  )
}
