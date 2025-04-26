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

  // Comprobar si la ruta solicitada existe
  const fileExists = existsSync(filePath) && !statSync(filePath).isDirectory()
  
  // Si la ruta no existe, servir index.html para manejar rutas del cliente
  if (!fileExists && !requestedPath.startsWith('/socket.io/')) {
    console.log(`Route ${requestedPath} not found, serving index.html for client-side routing`)
    filePath = join(basePath, 'index.html')
  }

  try {
    // Si el path es un directorio, buscar index.html dentro
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html')
    }
  } catch (error) {
    console.error('Error checking file path:', error)
  }

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
    stream.on('error', (error) => {
      console.error(`Error streaming file ${filePath}:`, error)
      res.writeHead(500)
      res.end('Internal Server Error')
    })
  } else {
    console.error(`File not found: ${filePath}`)
    res.writeHead(404)
    res.end('Not found')
  }
})

const io = new Server(httpServer, {
  cors: {
    origin: "*", // En producción, restringe esto a tus dominios específicos
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 30000,
  maxHttpBufferSize: 5e6, // 5MB
  transports: ['websocket', 'polling'],
  allowEIO3: true // Para compatibilidad con clientes más antiguos si es necesario
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
