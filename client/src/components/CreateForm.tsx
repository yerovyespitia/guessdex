import { useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useRouter } from '@tanstack/react-router'

type CreateFormProps = {
  disabled?: boolean
}

export const CreateForm = ({ disabled }: CreateFormProps) => {
  const { navigate } = useRouter()
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available in CreateForm')
      return
    }

    console.log('Setting up room_created listener')
    socket.on('room_created', ({ roomId }) => {
      console.log('Room created!', roomId)
      navigate({ to: `/room/${roomId}` })
    })

    return () => {
      console.log('Cleaning up room_created listener')
      socket.off('room_created')
    }
  }, [socket, navigate])

  const handleCreateRoom = () => {
    if (disabled || !socket || !isConnected) {
      console.log('Cannot create room:', {
        disabled,
        socketAvailable: !!socket,
        isConnected,
      })
      return
    }
    console.log('Emitting create_room event')
    socket.emit('create_room')
  }

  return (
    <button
      onClick={handleCreateRoom}
      className='px-6 py-3 w-80 md:w-96 text-lg text-center bg-white rounded-lg text-black outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
      disabled={disabled || !isConnected}
    >
      {isConnected ? 'Create New Room' : 'Connecting...'}
    </button>
  )
}
