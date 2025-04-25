import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { setupSocketEvents } from './manage/game'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { createReadStream } from 'node:fs'

const PORT = process.env.PORT || 3000
const httpServer = createServer(async (req, res) => {
  const filePath = join(
    import.meta.dir,
    '../client/dist',
    req.url === '/' ? 'index.html' : req.url || ''
  )

  if (existsSync(filePath)) {
    const fileStream = createReadStream(filePath)
    res.writeHead(200)
    fileStream.pipe(res)
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('🧩 Client connected:', socket.id)
  setupSocketEvents(io, socket)

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`🚀 HTTP + WebSocket server running on PORT ${PORT}`)
})
