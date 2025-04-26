import { Server, Socket } from 'socket.io'
import { getPokemon } from '../../client/src/utils/get'
import type { GameRoom, Pokemon } from '../../client/src/types/pokemon'
import { rotateTurn, findNextPlayer } from './utils'

const rooms = new Map<string, GameRoom>()

export function setupSocketEvents(io: Server, socket: Socket) {
  console.log(`Setting up socket events for client ${socket.id}`)

  // Track and log heartbeats
  socket.conn.on('heartbeat', () => {
    console.log(`Heartbeat received from ${socket.id}`)
  })

  socket.on('create_room', async () => {
    try {
      console.log(`Client ${socket.id} requested to create a room`)
      const roomId = Math.random().toString(36).substring(2, 8)
      const pokemon = (await getPokemon()) as Pokemon
      const room: GameRoom = {
        id: roomId,
        players: [socket.id],
        currentPokemon: pokemon,
        scores: { [socket.id]: 0 },
        activePlayerId: socket.id,
        guessedPlayers: [],
      }

      rooms.set(roomId, room)
      socket.join(roomId)

      console.log(`Room ${roomId} created by ${socket.id}`)
      socket.emit('room_created', { roomId })
      socket.emit('game_state', {
        players: [socket.id],
        scores: { [socket.id]: 0 },
        currentPokemon: null,
        activePlayerId: socket.id,
      })
    } catch (error) {
      console.error('Error creating room:', error)
      socket.emit('error', 'Failed to create room')
    }
  })

  socket.on('join_room', async (roomId: string) => {
    const room = rooms.get(roomId)
    if (!room) return socket.emit('error', 'Room not found')

    if (!room.players.includes(socket.id)) {
      room.players.push(socket.id)
      room.scores[socket.id] = 0
      socket.join(roomId)
    }

    const isActive = room.activePlayerId === socket.id
    socket.emit('game_state', {
      players: room.players,
      scores: room.scores,
      currentPokemon: isActive ? room.currentPokemon : null,
      activePlayerId: room.activePlayerId,
    })

    io.to(roomId).emit('player_joined', {
      playerId: socket.id,
      players: room.players,
      scores: room.scores,
      activePlayerId: room.activePlayerId,
    })

    if (room.players.length === 2) {
      io.to(room.activePlayerId).emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: room.currentPokemon,
        activePlayerId: room.activePlayerId,
      })
    }
  })

  socket.on('leave_room', (roomId: string) => {
    const room = rooms.get(roomId)
    if (!room) return

    room.players = room.players.filter((id) => id !== socket.id)
    delete room.scores[socket.id]

    if (room.activePlayerId === socket.id && room.players.length > 0) {
      room.activePlayerId = room.players[0] || ''
      io.to(room.activePlayerId).emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: room.currentPokemon,
        activePlayerId: room.activePlayerId,
      })
    }

    if (room.players.length === 0) {
      rooms.delete(roomId)
    } else {
      if (room.players.length >= 1 && room.players.length + 1 >= 2) {
        io.to(roomId).emit('game_over', {
          winnerId: room.players[0],
          scores: room.scores,
          abandonment: true,
          quitterId: socket.id,
        })
      }

      io.to(roomId).emit('player_left', {
        playerId: socket.id,
        players: room.players,
        scores: room.scores,
        activePlayerId: room.activePlayerId,
      })
    }

    socket.leave(roomId)
  })

  socket.on('submit_guess', async ({ roomId, guess }) => {
    const room = rooms.get(roomId)
    if (!room || room.activePlayerId !== socket.id) return

    const isCorrect =
      guess.toLowerCase() === room.currentPokemon.name.toLowerCase()

    if (isCorrect) {
      room.scores[socket.id] = (room.scores[socket.id] || 0) + 1
      room.guessedPlayers.push(socket.id)

      if ((room.scores[socket.id] || 0) >= 10) {
        io.to(roomId).emit('game_over', {
          winnerId: socket.id,
          scores: room.scores,
        })
        return
      }

      if (room.guessedPlayers.length === room.players.length) {
        const newPokemon = (await getPokemon()) as Pokemon
        room.currentPokemon = newPokemon
        room.guessedPlayers = []
        room.activePlayerId = rotateTurn(room.players, room.activePlayerId)

        io.to(roomId).emit('round_complete', {
          scores: room.scores,
          newPokemon,
          activePlayerId: room.activePlayerId,
        })

        io.to(room.activePlayerId).emit('game_state', {
          players: room.players,
          scores: room.scores,
          currentPokemon: newPokemon,
          activePlayerId: room.activePlayerId,
        })
      } else {
        const nextPlayer = findNextPlayer(
          room.players,
          room.guessedPlayers,
          socket.id
        )
        if (!nextPlayer) return

        room.activePlayerId = nextPlayer

        io.to(roomId).emit('correct_guess', {
          playerId: socket.id,
          scores: room.scores,
          guessedPlayers: room.guessedPlayers,
          activePlayerId: room.activePlayerId,
        })

        socket.emit('disable_guess')

        io.to(room.activePlayerId).emit('game_state', {
          players: room.players,
          scores: room.scores,
          currentPokemon: room.currentPokemon,
          activePlayerId: room.activePlayerId,
        })

        room.players.forEach((id) => {
          if (id !== socket.id && id !== room.activePlayerId) {
            io.to(id).emit('game_state', {
              players: room.players,
              scores: room.scores,
              currentPokemon: null,
              activePlayerId: room.activePlayerId,
            })
          }
        })
      }
    } else {
      const currentAttemptedPokemon = room.currentPokemon

      const newPokemon = (await getPokemon()) as Pokemon
      room.currentPokemon = newPokemon
      room.activePlayerId = rotateTurn(room.players, room.activePlayerId)

      socket.emit('wrong_guess')
      io.to(roomId).emit('turn_changed', {
        playerId: socket.id,
        scores: room.scores,
        newPokemon,
        activePlayerId: room.activePlayerId,
      })

      io.to(room.activePlayerId).emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: newPokemon,
        activePlayerId: room.activePlayerId,
      })

      io.to(socket.id).emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: currentAttemptedPokemon,
        activePlayerId: room.activePlayerId,
      })

      room.players.forEach((id) => {
        if (id !== socket.id && id !== room.activePlayerId) {
          io.to(id).emit('game_state', {
            players: room.players,
            scores: room.scores,
            currentPokemon: null,
            activePlayerId: room.activePlayerId,
          })
        }
      })
    }
  })

  socket.on('restart_game', async (roomId: string) => {
    const room = rooms.get(roomId)
    if (!room) return

    if (!room.readyToRestart) {
      room.readyToRestart = [socket.id]
    } else if (!room.readyToRestart.includes(socket.id)) {
      room.readyToRestart.push(socket.id)
    }

    socket.emit('hide_game_over')

    const allPlayersReady = room.players.every((playerId) =>
      room.readyToRestart?.includes(playerId)
    )

    if (allPlayersReady) {
      room.players.forEach((playerId) => {
        room.scores[playerId] = 0
      })

      const newPokemon = (await getPokemon()) as Pokemon
      room.currentPokemon = newPokemon
      room.guessedPlayers = []
      room.readyToRestart = []

      if (room.players.length > 0) {
        room.activePlayerId = room.players[0] || ''
      }

      io.to(roomId).emit('game_restarted', {
        scores: room.scores,
        newPokemon,
        activePlayerId: room.activePlayerId,
      })

      room.players.forEach((playerId) => {
        if (playerId === room.activePlayerId) {
          io.to(playerId).emit('game_state', {
            players: room.players,
            scores: room.scores,
            currentPokemon: newPokemon,
            activePlayerId: room.activePlayerId,
          })
        } else {
          io.to(playerId).emit('game_state', {
            players: room.players,
            scores: room.scores,
            currentPokemon: null,
            activePlayerId: room.activePlayerId,
          })
        }
      })
    } else {
      io.to(roomId).emit('player_ready_to_restart', {
        playerId: socket.id,
        readyPlayers: room.readyToRestart,
      })
    }
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter((id) => id !== socket.id)
        delete room.scores[socket.id]

        if (room.activePlayerId === socket.id && room.players.length > 0) {
          room.activePlayerId = room.players[0] || ''
        }

        if (room.players.length === 0) {
          console.log(`Removing empty room ${roomId}`)
          rooms.delete(roomId)
        } else {
          if (room.players.length >= 1 && room.players.length + 1 >= 2) {
            console.log(`Emitting game_over due to player abandonment in room ${roomId}`)
            io.to(roomId).emit('game_over', {
              winnerId: room.players[0],
              scores: room.scores,
              abandonment: true,
              quitterId: socket.id,
            })
          }

          io.to(roomId).emit('player_left', {
            playerId: socket.id,
            players: room.players,
            scores: room.scores,
            activePlayerId: room.activePlayerId,
          })
        }
      }
    }
  })
}
