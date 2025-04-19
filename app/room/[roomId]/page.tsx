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

  useEffect(() => {
    if (!socket || !roomId) return

    socket.emit('join_room', roomId)

    socket.on('player_joined', ({ scores }) => {
      setScores(scores)
    })

    socket.on('correct_guess', ({ scores, newPokemon }) => {
      setScores(scores)
      setPokemon(newPokemon)
    })

    socket.on('player_left', ({ scores }) => {
      setScores(scores)
    })

    return () => {
      socket.off('player_joined')
      socket.off('correct_guess')
      socket.off('player_left')
    }
  }, [socket, roomId])

  const handleGuess = (guess: string) => {
    socket?.emit('submit_guess', { roomId, guess })
  }

  if (!pokemon) return <div>Loading...</div>

  return (
    <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
        Multiplayer Room: {roomId}
      </h1>
      <div className='mb-4'>
        <h2 className='text-white text-xl'>Scores:</h2>
        {Object.entries(scores).map(([playerId, score]) => (
          <p key={playerId} className='text-white'>
            Player {playerId.slice(0, 4)}: {score}
          </p>
        ))}
      </div>
      <PokemonGame 
        initialPokemon={pokemon} 
        onSubmitGuess={handleGuess}
        isMultiplayer={true}
      />
    </main>
  )
}
