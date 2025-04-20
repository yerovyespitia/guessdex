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
  activePlayerId = ''
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

  const [showName, setShowName] = useState(false)
  const hasInteractedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (hasInteractedRef.current && !isInputDisabled) inputRef.current?.focus()
  }, [pokemon, isInputDisabled])

  useEffect(() => {
    setShowName(false)
  }, [pokemon])

  const handleGuess = () => {
    hasInteractedRef.current = true
    submitGuess()
    setShowName(true)
    
    if (isCorrect) {
      setTimeout(() => {
        setShowName(false)
        onCorrectGuess()
      }, 1000)
    } else {
      setTimeout(() => {
        setShowName(false)
        onWrongGuess()
      }, 1000)
    }
  }

  return (
    <div className='flex flex-col gap-5'>
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
        className={`${isCorrect || (isMultiplayer && currentPlayerId === activePlayerId) ? 'brightness-100' : 'brightness-0'} w-full`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className='h-[32px] flex flex-col items-center justify-center'>
        <Feedback
          status={isCorrect ? 'correct' : showWrongIcon ? 'wrong' : null}
          name={showName ? pokemon.name : ''}
        />
      </div>

      {(!isMultiplayer || (isMultiplayer && currentPlayerId === activePlayerId)) && (
        <div className='flex items-center justify-center gap-2 w-full'>
          <GuessForm
            ref={inputRef}
            value={guess}
            onChange={setGuess}
            onSubmit={handleGuess}
            disabled={isInputDisabled}
          />
        </div>
      )}
    </div>
  )
}
