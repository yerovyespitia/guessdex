'use client'

import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useEffect } from 'react'

type CreateFormProps = {
  disabled?: boolean
}

export const CreateForm = ({ disabled }: CreateFormProps) => {
  const router = useRouter()
  const socket = useSocket()

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available in CreateForm')
      return
    }

    console.log('Setting up room_created listener')
    socket.on('room_created', ({ roomId }) => {
      console.log('Room created!', roomId)
      router.push(`/room/${roomId}`)
    })

    return () => {
      console.log('Cleaning up room_created listener')
      socket.off('room_created')
    }
  }, [socket, router])

  const handleCreateRoom = () => {
    if (disabled || !socket) {
      console.log('Cannot create room:', { disabled, socketAvailable: !!socket })
      return
    }
    console.log('Emitting create_room event')
    socket.emit('create_room')
  }

  return (
    <button
      onClick={handleCreateRoom}
      className='px-6 py-3 bg-white text-purple-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
      disabled={disabled}
    >
      Create New Room
    </button>
  )
}
