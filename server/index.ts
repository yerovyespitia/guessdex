import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { setupSocketEvents } from './manage/game'

const PORT = process.env.PORT || 3000

const httpServer = createServer((req, res) => {
  // Ruta base del dist del frontend
  const basePath = join(import.meta.dir, '../client/dist')
  const requestedPath = req.url === '/' ? '/index.html' : req.url || ''
  let filePath = join(basePath, requestedPath)

  try {
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html')
    }
  } catch {}

  if (existsSync(filePath)) {
    const ext = extname(filePath)

    // Asignar el Content-Type correcto según el tipo de archivo
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.ico': 'image/x-icon',
      '.ttf': 'font/ttf',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })

    const stream = createReadStream(filePath)
    stream.pipe(res)
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
