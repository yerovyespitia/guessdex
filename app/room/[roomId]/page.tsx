'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGameRoom } from '@/hooks/useGameRoom'
import { useEffect, useState } from 'react'
import { RoomUI } from '@/components/RoomUI'
import { Error } from '@/components/Error'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const [roomCode, setRoomCode] = useState<string | null>(null)

  useEffect(() => {
    if (params.roomId) setRoomCode(params.roomId as string)
  }, [params.roomId])

  const {
    gameState,
    connectedPlayers,
    currentPlayerId,
    error,
    isConnected,
    socket,
  } = useGameRoom(roomCode)

  useEffect(() => {
    const revalidate = () => {
      if (socket && isConnected && roomCode) {
        socket.emit('join_room', roomCode)
      }
    }

    revalidate()
    window.addEventListener('focus', revalidate)
    return () => window.removeEventListener('focus', revalidate)
  }, [socket, isConnected, roomCode])

  if (error) {
    return <Error error={'Room not found'} />
  }

  if (!isConnected || !gameState) {
    return (
      <div className='h-screen flex flex-col items-center justify-center bg-purple-800 text-white p-4'>
        <h1 className='text-2xl mb-4'>
          {!isConnected ? 'Connecting...' : 'Waiting for players...'}
        </h1>
        <ul>
          {connectedPlayers.map((p) => (
            <li
              key={p}
              className='text-white'
            >
              {p === currentPlayerId ? 'You' : p}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <RoomUI
      roomCode={roomCode!}
      gameState={gameState}
      connectedPlayers={connectedPlayers}
      currentPlayerId={currentPlayerId!}
      socket={socket}
    />
  )
}
