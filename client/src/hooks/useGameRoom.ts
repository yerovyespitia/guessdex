import { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useQueryClient } from '@tanstack/react-query'
import { Pokemon } from '../types/pokemon'

export interface GameState {
  players: string[]
  scores: Record<string, number>
  currentPokemon?: Pokemon
  activePlayerId?: string
  guessedPlayers?: string[]
  readyPlayers?: string[]
}

export function useGameRoom(roomCode: string | null) {
  const { socket, isConnected } = useSocket()
  const queryClient = useQueryClient()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [abandonment, setAbandonment] = useState(false)

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
      game_over: (data: any) => {
        setWinnerId(data.winnerId)
        setGameOver(true)
        setAbandonment(data.abandonment || false)
      },
      hide_game_over: () => {
        setGameOver(false)
        setAbandonment(false)
      },
      player_ready_to_restart: (data: any) => {
        // Update readyPlayers in game state
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                readyPlayers: data.readyPlayers,
              }
            : null
        )
      },
      game_restarted: (data: any) => {
        setGameOver(false)
        setWinnerId(null)
        setAbandonment(false)
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                scores: data.scores,
                activePlayerId: data.activePlayerId,
                readyPlayers: [],
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

    return () => {
      for (const event of Object.keys(handlers)) socket.off(event)
      socket.emit('leave_room', roomCode)
    }
  }, [socket, isConnected, roomCode, queryClient])

  const restartGame = () => {
    if (socket && roomCode) {
      socket.emit('restart_game', roomCode)
    }
  }

  return {
    gameState,
    currentPlayerId,
    connectedPlayers,
    error,
    isConnected,
    socket,
    gameOver,
    winnerId,
    restartGame,
    abandonment,
  }
}
