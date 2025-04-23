import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { setupSocketEvents } from './manage/game'

console.log('🚀 HTTP + WebSocket server running on PORT 3000')

// Create a standard HTTP server
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

httpServer.listen(3000, () => {
  console.log('Socket.IO server running')
})

// Event Socket.IO
io.on('connection', (socket) => {
  console.log('🧩 Client connected:', socket.id)
  
  // Setup all game-related socket events
  setupSocketEvents(io, socket)

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})
