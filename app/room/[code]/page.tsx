'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useParams } from 'next/navigation'

export default function Room() {
  const { socket, isConnected } = useSocket()
  const params = useParams()
  const [roomCode, setRoomCode] = useState<string | null>(null)

  useEffect(() => {
    if (params.code) {
      setRoomCode(params.code as string)
    }
  }, [params.code])

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) {
      console.log('Cannot join room:', { socketAvailable: !!socket, isConnected, roomCode })
      return
    }

    console.log('Joining room:', roomCode)
    socket.emit('join_room', { roomCode })

    return () => {
      console.log('Leaving room:', roomCode)
      socket.emit('leave_room', { roomCode })
    }
  }, [socket, isConnected, roomCode])

  if (!isConnected) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4'>
        <h1 className='text-2xl font-bold mb-4'>Connecting to server...</h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4'>
      <h1 className='text-2xl font-bold mb-4'>Room: {roomCode}</h1>
      <p>Connected to server</p>
    </div>
  )
} 