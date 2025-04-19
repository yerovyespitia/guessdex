'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useParams, useRouter } from 'next/navigation'
import { PokemonGame } from '@/components/PokemonGame'
import { Pokemon } from '@/types/pokemon'

interface GameState {
  players: string[]
  scores: Record<string, number>
  currentPokemon?: Pokemon
}

export default function Room() {
  const { socket, isConnected } = useSocket()
  const params = useParams()
  const router = useRouter()
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    if (params.code) {
      setRoomCode(params.code as string)
    }
  }, [params.code])

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) {
      console.log('Cannot join room:', {
        socketAvailable: !!socket,
        isConnected,
        roomCode,
      })
      return
    }

    console.log('Joining room:', roomCode)
    socket.emit('join_room', roomCode)

    socket.on('error', (message) => {
      console.error('Room error:', message)
      setError(message)
    })

    socket.on('game_state', (state) => {
      console.log('Received game state:', state)
      setGameState(state)
    })

    socket.on('player_joined', (data) => {
      console.log('Player joined:', data)
      setGameState((prev: GameState | null) => ({
        ...prev,
        scores: data.scores,
        players: data.players,
      }))
    })

    socket.on('correct_guess', (data) => {
      console.log('Correct guess:', data)
      setGameState((prev: GameState | null) => ({
        ...prev,
        currentPokemon: data.newPokemon,
        scores: data.scores,
        players: prev?.players || [],
      }))
    })

    return () => {
      socket.off('error')
      socket.off('game_state')
      socket.off('player_joined')
      socket.off('correct_guess')
      socket.emit('leave_room', roomCode)
    }
  }, [socket, isConnected, roomCode])

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4'>
        <h1 className='text-2xl font-bold mb-4'>Error: {error}</h1>
        <button
          onClick={() => router.push('/')}
          className='px-6 py-3 bg-white text-purple-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
        >
          Go Home
        </button>
      </div>
    )
  }

  if (!isConnected || !gameState) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4'>
        <h1 className='text-2xl font-bold mb-4'>
          {!isConnected ? 'Connecting to server...' : 'Loading game state...'}
        </h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4'>
      <h1 className='text-2xl font-bold mb-4'>Room: {roomCode}</h1>
      <div className='mb-4'>
        <h2>Players:</h2>
        {gameState.players.map((playerId: string) => (
          <div key={playerId}>
            Player {playerId.slice(0, 4)}: {gameState.scores[playerId]}
          </div>
        ))}
      </div>
      {gameState.currentPokemon && socket && (
        <PokemonGame
          initialPokemon={gameState.currentPokemon}
          onSubmitGuess={(guess) =>
            socket.emit('submit_guess', { roomId: roomCode, guess })
          }
          isMultiplayer={true}
        />
      )}
    </div>
  )
}
