import { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useRouter } from '@tanstack/react-router'

type CreateFormProps = {
  disabled?: boolean
}

export const CreateForm = ({ disabled }: CreateFormProps) => {
  const { navigate } = useRouter()
  const { socket, isConnected } = useSocket()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available in CreateForm')
      return
    }

    console.log('Setting up room_created listener')
    socket.on('room_created', ({ roomId }) => {
      console.log('Room created!', roomId)
      setIsCreating(false)
      navigate({ to: `/room/${roomId}` })
    })

    socket.on('error', (errorMsg) => {
      console.error('Server error:', errorMsg)
      setError(errorMsg)
      setIsCreating(false)
    })

    return () => {
      console.log('Cleaning up room_created listener')
      socket.off('room_created')
      socket.off('error')
    }
  }, [socket, navigate])

  const handleCreateRoom = () => {
    if (disabled || !socket || !isConnected) {
      console.log('Cannot create room:', {
        disabled,
        socketAvailable: !!socket,
        isConnected,
      })
      setError('Cannot connect to server. Please try again.')
      return
    }
    setError(null)
    setIsCreating(true)
    console.log('Emitting create_room event')
    socket.emit('create_room')
    
    // Add a timeout to avoid being stuck in creating state
    setTimeout(() => {
      if (isCreating) {
        setIsCreating(false)
        setError('Room creation timed out. Please try again.')
      }
    }, 10000)
  }

  return (
    <>
      <button
        onClick={handleCreateRoom}
        className='px-6 py-3 w-80 md:w-96 text-lg text-center bg-white rounded-lg text-sky-800 font-semibold outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
        disabled={disabled || !isConnected || isCreating}
      >
        {isCreating 
          ? 'Creating...' 
          : isConnected 
            ? 'Create New Room' 
            : 'Connecting...'}
      </button>
      
      {error && (
        <p className="text-red-300 mt-2">{error}</p>
      )}
    </>
  )
}
