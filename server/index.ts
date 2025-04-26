import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createReadStream, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { setupSocketEvents } from './manage/game'

const PORT = process.env.PORT || 3000

const httpServer = createServer((req, res) => {
  const basePath = join(import.meta.dir, '../client/dist')
  const requestedPath = req.url === '/' ? '/index.html' : req.url || ''
  let filePath = join(basePath, requestedPath)

  if (!existsSync(filePath)) {
    filePath = join(basePath, 'index.html')
  }

  const ext = extname(filePath)
  const contentTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.json': 'application/json',
  }

  const contentType = contentTypes[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': contentType })

  const stream = createReadStream(filePath)
  stream.pipe(res)
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
