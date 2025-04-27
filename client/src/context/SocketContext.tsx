import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log('Initializing socket connection...')

    const socketInstance = io()

    socketInstance.on('connect', () => {
      console.log('Socket connected!', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error details:', error.message, error)
      // Intenta reconectar con diferentes opciones en caso de error
      if (
        socketInstance.io.opts.transports &&
        socketInstance.io.opts.transports.includes('websocket' as any)
      ) {
        console.log('Falling back to polling...')
        socketInstance.io.opts.transports = ['polling' as any]
      }
      setIsConnected(false)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      console.log('Cleaning up socket connection...')
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
