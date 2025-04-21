'use client'

import { useState, useEffect } from 'react'
import { Card } from './Card'
import { Pokemon } from '@/types/pokemon'
import { useCountdown } from '@/hooks/useCountdown'
import { Countdown } from './Countdown'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/contexts/SocketContext'

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
  const [isGuessDisabled, setIsGuessDisabled] = useState(false)
  const queryClient = useQueryClient()
  const { socket } = useSocket()

  useEffect(() => {
    setPokemon(initialPokemon)
    setIsGuessDisabled(false)
  }, [initialPokemon])

  useEffect(() => {
    if (isMultiplayer && activePlayerId) {
      const isActive = activePlayerId === currentPlayerId
      console.log(
        `Player ${currentPlayerId} is ${isActive ? 'active' : 'not active'}`
      )
      setIsMyTurn(isActive)
    } else {
      setIsMyTurn(true)
    }
  }, [isMultiplayer, activePlayerId, currentPlayerId, players.length])

  // Add a new effect to handle the disable_guess event
  useEffect(() => {
    if (!socket) return

    const handleDisableGuess = () => {
      console.log('Guess disabled for player:', currentPlayerId)
      setIsGuessDisabled(true)
    }

    const handleWrongGuess = () => {
      console.log('Wrong guess for player:', currentPlayerId)
      setIsGuessDisabled(true)
      setIsMyTurn(false) // Update turn state since it's now another player's turn
    }

    socket.on('disable_guess', handleDisableGuess)
    socket.on('wrong_guess', handleWrongGuess)

    return () => {
      socket.off('disable_guess', handleDisableGuess)
      socket.off('wrong_guess', handleWrongGuess)
    }
  }, [socket, currentPlayerId])

  // Add a new effect to reset isGuessDisabled when the Pokemon changes
  useEffect(() => {
    setIsGuessDisabled(false)
  }, [pokemon])

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
      onSubmitGuess(pokemon.name)
      setIsGuessDisabled(true)
    } else {
      startCountdown()
    }
  }

  const handleWrongGuess = () => {
    if (isMultiplayer && onSubmitGuess) {
      onSubmitGuess('') // Send empty string to signal wrong guess to server
      setIsGuessDisabled(true)
    } else {
      startCountdown()
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
        isInputDisabled={
          countdown !== null || (isMultiplayer && !isMyTurn) || isGuessDisabled
        }
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

      <Countdown value={countdown} />
    </div>
  )
}
