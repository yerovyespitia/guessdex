'use client'

import { useSocket } from '@/hooks/useSocket'
import { useEffect, useState } from 'react'
import { PokemonGame } from '@/components/PokemonGame'
import { useParams } from 'next/navigation'
import { Pokemon } from '@/types/pokemon'

export default function Room() {
  const socket = useSocket()
  const { roomId } = useParams()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [players, setPlayers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket || !roomId) return

    console.log('Joining room:', roomId)
    socket.emit('join_room', roomId)

    socket.on('player_joined', ({ playerId, scores }) => {
      console.log('Player joined:', playerId)
      setScores(scores)
      setPlayers(Object.keys(scores))
    })

    socket.on('correct_guess', ({ scores, newPokemon }) => {
      console.log('Correct guess! New Pokemon:', newPokemon.name)
      setScores(scores)
      setPokemon(newPokemon)
    })

    socket.on('player_left', ({ playerId, scores }) => {
      console.log('Player left:', playerId)
      setScores(scores)
      setPlayers(Object.keys(scores))
    })

    socket.on('error', (message) => {
      console.error('Room error:', message)
      setError(message)
    })

    return () => {
      socket.off('player_joined')
      socket.off('correct_guess')
      socket.off('player_left')
      socket.off('error')
    }
  }, [socket, roomId])

  const handleGuess = (guess: string) => {
    socket?.emit('submit_guess', { roomId, guess })
  }

  if (error) {
    return (
      <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
        <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
          Error
        </h1>
        <p className='text-white text-xl mb-4'>{error}</p>
        <a 
          href="/"
          className='px-6 py-3 bg-white text-purple-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer'
        >
          Go Home
        </a>
      </main>
    )
  }

  if (!pokemon) {
    return (
      <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
        <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
          Loading Room...
        </h1>
      </main>
    )
  }

  return (
    <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
        Room: {roomId}
      </h1>
      <div className='mb-4 text-center'>
        <h2 className='text-white text-xl mb-2'>Players ({players.length}):</h2>
        <div className='flex flex-wrap gap-2 justify-center'>
          {players.map((playerId) => (
            <div 
              key={playerId} 
              className='bg-white/10 px-4 py-2 rounded-lg text-white'
            >
              Player {playerId.slice(0, 4)}: {scores[playerId] || 0}
            </div>
          ))}
        </div>
      </div>
      <PokemonGame 
        initialPokemon={pokemon} 
        onSubmitGuess={handleGuess}
        isMultiplayer={true}
      />
    </main>
  )
}
