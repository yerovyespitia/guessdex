import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useQueryClient } from '@tanstack/react-query'
import { Pokemon } from '@/types/pokemon'

export interface GameState {
  players: string[]
  scores: Record<string, number>
  currentPokemon?: Pokemon
  activePlayerId?: string
  guessedPlayers?: string[]
}

export function useGameRoom(roomCode: string | null) {
  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return

    if (socket.id) setCurrentPlayerId(socket.id)
    socket.emit('join_room', roomCode)

    const handlers = {
      room_created: (data: any) => socket.emit('join_room', data.roomId),
      error: (message: string) => setError(message),
      game_state: (state: GameState) => {
        setGameState(state)
        setConnectedPlayers(state.players || [])
        if (state.currentPokemon)
          queryClient.setQueryData(['pokemon'], state.currentPokemon)
      },
      player_joined: (data: any) =>
        updatePlayerState(data.players, data.scores, data.activePlayerId),
      player_left: (data: any) =>
        updatePlayerState(data.players, data.scores, data.activePlayerId),
      correct_guess: (data: any) =>
        setGameState((prev) =>
          prev
            ? { ...prev, ...data, currentPokemon: prev.currentPokemon }
            : null
        ),
      turn_changed: (data: any) => {
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                activePlayerId: data.activePlayerId,
                currentPokemon: data.newPokemon || prev.currentPokemon,
                scores: data.scores,
              }
            : null
        )
        if (data.newPokemon)
          queryClient.setQueryData(['pokemon'], data.newPokemon)
      },
      round_complete: (data: any) => {
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                ...data,
                guessedPlayers: [],
                players: prev.players,
              }
            : null
        )
        if (data.newPokemon)
          queryClient.setQueryData(['pokemon'], data.newPokemon)
      },
    }

    function updatePlayerState(
      players: string[],
      scores: Record<string, number>,
      activePlayerId: string
    ) {
      setConnectedPlayers(players)
      setGameState((prev) => ({
        ...prev,
        scores,
        players,
        activePlayerId,
        currentPokemon: prev?.currentPokemon,
      }))
    }

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler)
    }

    socket.on('disable_guess', () => {})

    return () => {
      for (const event of Object.keys(handlers)) socket.off(event)
      socket.off('disable_guess')
      socket.emit('leave_room', roomCode)
    }
  }, [socket, isConnected, roomCode, queryClient])

  return {
    gameState,
    currentPlayerId,
    connectedPlayers,
    error,
    isConnected,
    socket,
  }
}
