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
    })

    socket.join(roomId)
    socket.emit('room_created', { roomId })
  })

  // Handle joining rooms
  socket.on('join_room', async (roomId: string) => {
    const room = rooms.get(roomId)

    if (!room) {
      socket.emit('error', 'Room not found')
      return
    }

    room.players.push(socket.id)
    room.scores[socket.id] = 0
    socket.join(roomId)

    // Send initial game state to the joining player
    socket.emit('game_state', {
      players: room.players,
      scores: room.scores,
      currentPokemon: room.currentPokemon
    })

    // Notify all players in the room
    io.to(roomId).emit('player_joined', {
      playerId: socket.id,
      scores: room.scores,
      players: room.players
    })
  })

  // Handle guesses
  socket.on('submit_guess', async ({ roomId, guess }) => {
    const room = rooms.get(roomId)
    if (!room) return

    const isCorrect =
      guess.toLowerCase() === room.currentPokemon.name.toLowerCase()

    if (isCorrect) {
      room.scores[socket.id]++

      // Get new Pokemon for next round
      const newPokemon = await getPokemon()
      room.currentPokemon = newPokemon

      // Notify all players
      io.to(roomId).emit('correct_guess', {
        playerId: socket.id,
        scores: room.scores,
        newPokemon,
      })
    } else {
      socket.emit('wrong_guess')
    }
  })

  // Handle disconnections
  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.indexOf(socket.id)
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        delete room.scores[socket.id]

        if (room.players.length === 0) {
          rooms.delete(roomId)
        } else {
          io.to(roomId).emit('player_left', {
            playerId: socket.id,
            scores: room.scores,
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
