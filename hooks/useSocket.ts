import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const socket = useRef<Socket | undefined>(undefined)

  useEffect(() => {
    console.log('Initializing socket connection...')
    socket.current = io('http://localhost:3001')

    socket.current.on('connect', () => {
      console.log('Socket connected!', socket.current?.id)
    })

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return () => {
      console.log('Cleaning up socket connection...')
      socket.current?.disconnect()
    }
  }, [])

  return socket.current
}
