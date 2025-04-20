'use client'

import { useRouter } from 'next/navigation'
import { useSocket } from '@/contexts/SocketContext'
import { useState } from 'react'

type JoinFormProps = {
  disabled?: boolean
}

export const JoinForm = ({ disabled }: JoinFormProps) => {
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [roomCode, setRoomCode] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomCode || disabled || !socket || !isConnected) {
      console.log('Cannot join room:', {
        roomCode,
        disabled,
        socketAvailable: !!socket,
        isConnected,
      })
      return
    }
    console.log('Joining room:', roomCode)
    router.push(`/room/${roomCode}`)
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
        disabled={disabled || !isConnected}
      />
      <button
        type='submit'
        className='px-6 py-3 bg-white text-purple-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={disabled || !isConnected || !roomCode}
      >
        {isConnected ? 'Join Room' : 'Connecting...'}
      </button>
    </form>
  )
}
