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
  activePlayerId?: string
  guessedPlayers?: string[]
}

export default function Room() {
  const { socket, isConnected } = useSocket()
  const params = useParams()
  const router = useRouter()
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)

  useEffect(() => {
    if (params.roomId) {
      setRoomCode(params.roomId as string)
    }
  }, [params.roomId])

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) {
      console.log('Cannot join room:', {
        socketAvailable: !!socket,
        isConnected,
        roomCode,
      })
      return
    }

    // Set the current player ID
    if (socket.id) {
      setCurrentPlayerId(socket.id)
    }

    console.log('Joining room:', roomCode)
    
    // Join the room
    socket.emit('join_room', roomCode)

    // Handle room creation response
    socket.on('room_created', (data) => {
      console.log('Room created:', data)
      // Re-join the room to get the initial state
      socket.emit('join_room', data.roomId)
    })

    socket.on('error', (message) => {
      console.error('Room error:', message)
      setError(message)
    })

    socket.on('game_state', (state) => {
      console.log('Received game state:', state)
      setGameState(state)
      setConnectedPlayers(state.players || [])
    })

    socket.on('player_joined', (data) => {
      console.log('Player joined:', data)
      setConnectedPlayers(data.players || [])
      setGameState((prev: GameState | null) => ({
        ...prev,
        scores: data.scores,
        players: data.players,
        activePlayerId: data.activePlayerId,
        currentPokemon: prev?.currentPokemon
      }))
    })

    socket.on('player_left', (data) => {
      console.log('Player left:', data)
      setConnectedPlayers(data.players || [])
      setGameState((prev: GameState | null) => ({
        ...prev,
        scores: data.scores,
        players: data.players,
        activePlayerId: data.activePlayerId,
        currentPokemon: prev?.currentPokemon
      }))
    })

    socket.on('correct_guess', (data) => {
      console.log('Correct guess:', data)
      setGameState((prev: GameState | null) => ({
        ...prev,
        scores: data.scores,
        guessedPlayers: data.guessedPlayers,
        players: prev?.players || [],
        currentPokemon: prev?.currentPokemon,
        activePlayerId: prev?.activePlayerId
      }))
    })

    socket.on('round_complete', (data) => {
      console.log('Round complete:', data)
      setGameState((prev: GameState | null) => ({
        ...prev,
        currentPokemon: data.newPokemon,
        scores: data.scores,
        activePlayerId: data.activePlayerId,
        guessedPlayers: [],
        players: prev?.players || []
      }))
    })

    // Cleanup function
    return () => {
      socket.off('error')
      socket.off('game_state')
      socket.off('player_joined')
      socket.off('player_left')
      socket.off('correct_guess')
      socket.off('round_complete')
      socket.off('room_created')
      socket.emit('leave_room', roomCode)
    }
  }, [socket, isConnected, roomCode])

  // Add revalidation on component mount
  useEffect(() => {
    const revalidate = () => {
      if (socket && isConnected && roomCode) {
        socket.emit('join_room', roomCode)
      }
    }

    revalidate()
    
    // Revalidate on focus
    window.addEventListener('focus', revalidate)
    
    return () => {
      window.removeEventListener('focus', revalidate)
    }
  }, [socket, isConnected, roomCode])

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-purple-800 text-white p-4'>
        <h1 className='text-2xl font-bold mb-4'>Error: {error}</h1>
        <button
          onClick={() => router.push('/')}
          className='px-6 py-3 bg-white text-purple-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer'
        >
          Go Home
        </button>
      </div>
    )
  }

  if (!isConnected || !gameState) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-purple-800 text-white p-4'>
        <h1 className='text-2xl font-bold mb-4'>
          {!isConnected ? 'Connecting to server...' : 'Waiting for players...'}
        </h1>
        {connectedPlayers.length > 0 && (
          <div className='mt-4 p-6 bg-purple-900 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>
              Connected Players ({connectedPlayers.length})
            </h2>
            <ul className='space-y-2'>
              {connectedPlayers.map((playerId) => (
                <li
                  key={playerId}
                  className={`text-lg ${playerId === currentPlayerId ? 'text-yellow-300' : 'text-white'}`}
                >
                  Player {connectedPlayers.indexOf(playerId) + 1} {playerId === currentPlayerId ? '(You)' : ''}
                </li>
              ))}
            </ul>
            {connectedPlayers.length === 1 && (
              <p className='mt-4 text-yellow-300'>
                Share the room code with a friend to start playing!
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-purple-800 text-white p-4'>
      <div className='flex items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>Room: {roomCode}</h1>
        <button
          onClick={() => {
            if (roomCode) {
              navigator.clipboard.writeText(roomCode)
            }
          }}
          className='px-3 py-1 bg-purple-900 rounded-lg hover:bg-purple-700 transition-colors'
          title='Copy room code'
        >
          Copy
        </button>
      </div>
      {gameState.currentPokemon && socket && (
        <PokemonGame
          initialPokemon={gameState.currentPokemon}
          onSubmitGuess={(guess) =>
            socket.emit('submit_guess', { roomId: roomCode, guess })
          }
          isMultiplayer={true}
          playerScores={gameState.scores}
          players={gameState.players}
          currentPlayerId={currentPlayerId || ''}
          activePlayerId={gameState.activePlayerId || ''}
        />
      )}
    </div>
  )
}
