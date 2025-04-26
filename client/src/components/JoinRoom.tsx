import { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSocket } from '../context/SocketContext'

type JoinFormProps = {
  disabled?: boolean
}

export const JoinForm = ({ disabled }: JoinFormProps) => {
  const { navigate } = useRouter()
  const { socket, isConnected } = useSocket()
  const [roomCode, setRoomCode] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  // Effect to detect connection issues
  useEffect(() => {
    if (!isConnected && connectionAttempts > 0) {
      setError('Connection to server failed. Please refresh the page and try again.')
    } else if (isConnected) {
      setError(null)
    }
  }, [isConnected, connectionAttempts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!roomCode) {
      setError('Please enter a room code')
      return
    }
    
    if (disabled || !socket) {
      console.log('Cannot join room:', {
        roomCode,
        disabled,
        socketAvailable: !!socket,
      })
      setError('Cannot connect to server. Please try again.')
      return
    }
    
    if (!isConnected) {
      setConnectionAttempts(prev => prev + 1)
      setError('Waiting for connection... Please try again in a moment.')
      return
    }
    
    setError(null)
    console.log('Joining room:', roomCode)
    navigate({ to: `/room/${roomCode}` })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <input
        type='text'
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={() => setShowPlaceholder(true)}
        placeholder={showPlaceholder ? 'Enter Room Code' : ''}
        className='px-6 py-3 w-80 md:w-96 border text-lg text-center border-white rounded-lg text-white outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={disabled}
      />
      <button
        type='submit'
        className='px-6 py-3 bg-white text-sky-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={disabled || !roomCode}
      >
        {isConnected ? 'Join Room' : 'Connecting...'}
      </button>
      
      {error && (
        <p className="text-red-300 mt-2">{error}</p>
      )}
      
      {!isConnected && connectionAttempts > 1 && (
        <p className="text-white mt-2">
          Try refreshing the page if the connection doesn't establish.
        </p>
      )}
    </form>
  )
}
