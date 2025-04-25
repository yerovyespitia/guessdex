import { createFileRoute, useParams } from '@tanstack/react-router'
import { RoomUI } from '../../components/RoomUI'
import { useEffect, useState } from 'react'
import { useGameRoom } from '../../hooks/useGameRoom'
import { Error } from '../../components/Error'

export const Route = createFileRoute('/room/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { roomId } = useParams({ from: '/room/$roomId' })
  const [roomCode, setRoomCode] = useState<string | null>(null)

  useEffect(() => {
    if (roomId) setRoomCode(roomId)
  }, [roomId])

  const {
    gameState,
    connectedPlayers,
    currentPlayerId,
    error,
    isConnected,
    socket,
    gameOver,
    winnerId,
    restartGame,
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
      <div className='h-screen flex flex-col items-center justify-center bg-sky-800 text-white p-4'>
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
      currentPlayerId={currentPlayerId!}
      socket={socket}
      gameOver={gameOver}
      winnerId={winnerId}
      restartGame={restartGame}
    />
  )
}
