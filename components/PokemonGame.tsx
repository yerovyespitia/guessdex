'use client'

import { useState, useEffect } from 'react'
import { Card } from './Card'
import { Pokemon } from '@/types/pokemon'
import { useCountdown } from '@/hooks/useCountdown'
import { Countdown } from './Countdown'
import { useGameTimer } from '@/hooks/useGameTimer'
import { useQueryClient } from '@tanstack/react-query'

type PokemonGameProps = {
  initialPokemon: Pokemon
  onSubmitGuess?: (guess: string) => void
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
}

export const PokemonGame = ({
  initialPokemon,
  onSubmitGuess,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
}: PokemonGameProps) => {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon)
  const [isMyTurn, setIsMyTurn] = useState(false)
  const queryClient = useQueryClient()

  const { timeLeft, startTimer, stopTimer } = useGameTimer(15, () => {
    if (isMultiplayer && onSubmitGuess) {
      onSubmitGuess('')
    }
  })

  useEffect(() => {
    setPokemon(initialPokemon)
  }, [initialPokemon])

  useEffect(() => {
    if (isMultiplayer && activePlayerId) {
      const isActive = activePlayerId === currentPlayerId
      setIsMyTurn(isActive)
      if (isActive) {
        startTimer()
      } else {
        stopTimer()
      }
    } else {
      setIsMyTurn(true)
    }
  }, [isMultiplayer, activePlayerId, currentPlayerId, startTimer, stopTimer])

  const loadNewPokemon = async () => {
    // Get the new data directly without invalidating the query first
    const newData = await queryClient.fetchQuery({
      queryKey: ['pokemon'],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${
            Math.floor(Math.random() * 150) + 1
          }`,
          {
            cache: 'no-store',
            next: { revalidate: 0 },
          }
        )
        return response.json() as Promise<Pokemon>
      },
    })
    setPokemon(newData as Pokemon)
  }

  const { countdown, start: startCountdown } = useCountdown(3, loadNewPokemon)

  const handleCorrectGuess = () => {
    if (isMultiplayer && onSubmitGuess) {
      stopTimer()
      onSubmitGuess(pokemon.name)
    } else {
      startCountdown()
    }
  }

  const handleWrongGuess = () => {
    if (!isMultiplayer) {
      startCountdown()
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
        isInputDisabled={countdown !== null || (isMultiplayer && !isMyTurn)}
        isMultiplayer={isMultiplayer}
        playerScores={playerScores}
        players={players}
        currentPlayerId={currentPlayerId}
        activePlayerId={activePlayerId}
      />

      {isMultiplayer && !isMyTurn && (
        <div className='mt-4 text-xl font-semibold text-yellow-300'>
          Waiting for {players.find((p) => p === activePlayerId)?.slice(0, 4)}{' '}
          to guess...
        </div>
      )}

      {isMultiplayer && isMyTurn && timeLeft !== null && (
        <div className='mt-4 text-xl font-semibold text-yellow-300'>
          Time left: {timeLeft}s
        </div>
      )}

      <Countdown value={countdown} />
    </div>
  )
}
