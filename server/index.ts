import { Server } from 'socket.io'
import { createServer } from 'http'
import { getPokemon } from '@/utils/get'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

type GameRoom = {
  id: string
  players: string[]
  currentPokemon: any
  scores: Record<string, number>
  activePlayerId: string
  guessedPlayers: string[]
}

const rooms = new Map<string, GameRoom>()

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Handle room creation
  socket.on('create_room', async () => {
    const roomId = Math.random().toString(36).substring(2, 8)
    const pokemon = await getPokemon()

    rooms.set(roomId, {
      id: roomId,
      players: [socket.id],
      currentPokemon: pokemon,
      scores: { [socket.id]: 0 },
      activePlayerId: socket.id,
      guessedPlayers: []
    })

    socket.join(roomId)
    socket.emit('room_created', { roomId })
    
    // Send initial game state to the room creator without the Pokemon
    socket.emit('game_state', {
      players: [socket.id],
      scores: { [socket.id]: 0 },
      currentPokemon: null, // Don't send Pokemon to the room creator yet
      activePlayerId: socket.id
    })
  })

  // Handle joining rooms
  socket.on('join_room', async (roomId: string) => {
    console.log(`Player ${socket.id} joining room ${roomId}`)
    const room = rooms.get(roomId)

    if (!room) {
      console.log(`Room ${roomId} not found`)
      socket.emit('error', 'Room not found')
      return
    }

    // Check if player is already in the room
    if (room.players.includes(socket.id)) {
      console.log(`Player ${socket.id} already in room ${roomId}`)
      // Even if player is already in room, send them the current state
      socket.emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: room.activePlayerId === socket.id ? room.currentPokemon : null, // Only send Pokemon to the active player
        activePlayerId: room.activePlayerId
      })
      return
    }

    room.players.push(socket.id)
    room.scores[socket.id] = 0
    socket.join(roomId)

    console.log(`Player ${socket.id} joined room ${roomId}. Players: ${room.players.join(', ')}`)

    // Send initial game state to the joining player
    socket.emit('game_state', {
      players: room.players,
      scores: room.scores,
      currentPokemon: room.activePlayerId === socket.id ? room.currentPokemon : null, // Only send Pokemon to the active player
      activePlayerId: room.activePlayerId
    })

    // Notify all players in the room
    io.to(roomId).emit('player_joined', {
      playerId: socket.id,
      scores: room.scores,
      players: room.players,
      activePlayerId: room.activePlayerId
    })
    
    // If this is the second player joining, start the game by sending the Pokemon to the active player
    if (room.players.length === 2) {
      // Send the Pokemon to the active player
      io.to(room.activePlayerId).emit('game_state', {
        players: room.players,
        scores: room.scores,
        currentPokemon: room.currentPokemon,
        activePlayerId: room.activePlayerId
      })
    }
  })

  // Handle leaving rooms
  socket.on('leave_room', (roomId: string) => {
    console.log(`Player ${socket.id} leaving room ${roomId}`)
    const room = rooms.get(roomId)
    
    if (room) {
      const playerIndex = room.players.indexOf(socket.id)
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        delete room.scores[socket.id]
        
        // If the active player leaves, assign the turn to another player
        if (room.activePlayerId === socket.id && room.players.length > 0) {
          room.activePlayerId = room.players[0]
          
          // Notify the new active player that it's their turn
          io.to(room.activePlayerId).emit('game_state', {
            players: room.players,
            scores: room.scores,
            currentPokemon: room.currentPokemon,
            activePlayerId: room.activePlayerId
          })
        }
        
        console.log(`Player ${socket.id} left room ${roomId}. Remaining players: ${room.players.join(', ')}`)
        
        if (room.players.length === 0) {
          console.log(`Room ${roomId} is empty, deleting`)
          rooms.delete(roomId)
        } else {
          io.to(roomId).emit('player_left', {
            playerId: socket.id,
            scores: room.scores,
            players: room.players,
            activePlayerId: room.activePlayerId
          })
        }
      }
    }
    
    socket.leave(roomId)
  })

  // Handle guesses
  socket.on('submit_guess', async ({ roomId, guess }) => {
    const room = rooms.get(roomId)
    if (!room) return

    // Check if it's the player's turn
    if (room.activePlayerId !== socket.id) {
      console.log(`Player ${socket.id} tried to guess out of turn`)
      return
    }

    console.log(`Player ${socket.id} submitted guess: ${guess}`)
    console.log(`Current Pokemon: ${room.currentPokemon.name}`)

    const isCorrect = guess.toLowerCase() === room.currentPokemon.name.toLowerCase()
    console.log(`Guess is ${isCorrect ? 'correct' : 'incorrect'}`)

    if (isCorrect) {
      // Update player's score
      room.scores[socket.id]++
      room.guessedPlayers.push(socket.id)
      
      console.log(`Player ${socket.id} guessed correctly. Guessed players: ${room.guessedPlayers.join(', ')}`)
      
      // Check if all players have guessed
      if (room.guessedPlayers.length === room.players.length) {
        // All players have guessed, get a new Pokemon and reset the game state
        const newPokemon = await getPokemon()
        room.currentPokemon = newPokemon
        room.guessedPlayers = []
        
        // Rotate the active player
        const currentIndex = room.players.indexOf(room.activePlayerId)
        const nextIndex = (currentIndex + 1) % room.players.length
        room.activePlayerId = room.players[nextIndex]
        
        console.log(`All players have guessed. New active player: ${room.activePlayerId}`)
        
        // Notify all players about the round completion
        io.to(roomId).emit('round_complete', {
          scores: room.scores,
          newPokemon,
          activePlayerId: room.activePlayerId
        })
        
        // Send the Pokemon only to the new active player
        io.to(room.activePlayerId).emit('game_state', {
          players: room.players,
          scores: room.scores,
          currentPokemon: newPokemon,
          activePlayerId: room.activePlayerId
        })
      } else {
        // Not all players have guessed yet
        // Find the next player who hasn't guessed
        const currentIndex = room.players.indexOf(room.activePlayerId)
        let nextIndex = (currentIndex + 1) % room.players.length
        let attempts = 0
        
        // Keep looking for the next player who hasn't guessed, with a maximum of room.players.length attempts
        while (room.guessedPlayers.includes(room.players[nextIndex]) && attempts < room.players.length) {
          nextIndex = (nextIndex + 1) % room.players.length
          attempts++
        }
        
        // If we couldn't find a player who hasn't guessed, something went wrong
        if (attempts >= room.players.length) {
          console.error('Could not find next player who hasn\'t guessed')
          return
        }
        
        room.activePlayerId = room.players[nextIndex]
        console.log(`New active player: ${room.activePlayerId}`)
        
        // Notify all players about the correct guess
        io.to(roomId).emit('correct_guess', {
          playerId: socket.id,
          scores: room.scores,
          guessedPlayers: room.guessedPlayers,
          activePlayerId: room.activePlayerId
        })
        
        // Send the Pokemon only to the new active player
        io.to(room.activePlayerId).emit('game_state', {
          players: room.players,
          scores: room.scores,
          currentPokemon: room.currentPokemon,
          activePlayerId: room.activePlayerId
        })
        
        // Send a game_state update to the player who just guessed correctly
        io.to(socket.id).emit('game_state', {
          players: room.players,
          scores: room.scores,
          currentPokemon: null,
          activePlayerId: room.activePlayerId
        })
        
        // Disable guessing for the player who just guessed correctly
        socket.emit('disable_guess')
        
        // Send a game_state update to all other players
        room.players.forEach(playerId => {
          if (playerId !== room.activePlayerId && playerId !== socket.id) {
            io.to(playerId).emit('game_state', {
              players: room.players,
              scores: room.scores,
              currentPokemon: null,
              activePlayerId: room.activePlayerId
            })
          }
        })
      }
    } else {
      socket.emit('wrong_guess')
    }
  })

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.indexOf(socket.id)
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        delete room.scores[socket.id]
        
        // If the active player disconnects, assign the turn to another player
        if (room.activePlayerId === socket.id && room.players.length > 0) {
          room.activePlayerId = room.players[0]
        }

        if (room.players.length === 0) {
          console.log(`Room ${roomId} is empty after disconnect, deleting`)
          rooms.delete(roomId)
        } else {
          console.log(`Player ${socket.id} disconnected from room ${roomId}. Remaining players: ${room.players.join(', ')}`)
          io.to(roomId).emit('player_left', {
            playerId: socket.id,
            scores: room.scores,
            players: room.players,
            activePlayerId: room.activePlayerId
          })
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
