import { PokemonGame } from './PokemonGame'
import { GameState } from '../hooks/useGameRoom'
import { GameOverModal } from './GameOverModal'

interface Props {
  roomCode: string
  gameState: GameState
  currentPlayerId: string
  socket: any
  gameOver: boolean
  winnerId: string | null
  restartGame: () => void
  abandonment?: boolean
}

export function RoomUI({
  roomCode,
  gameState,
  currentPlayerId,
  socket,
  gameOver,
  winnerId,
  restartGame,
  abandonment = false,
}: Props) {
  return (
    <div className='flex flex-col items-center justify-center sm:h-[calc(100vh-76px)] bg-sky-800 text-white p-4'>
      <div className='flex items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>Room: {roomCode}</h1>
        <button
          onClick={() => navigator.clipboard.writeText(roomCode)}
          className='px-3 py-1 bg-sky-900 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer'
          title='Copy room code'
        >
          Copy
        </button>
      </div>

      {gameState.currentPokemon && gameState.players.length >= 2 ? (
        <PokemonGame
          initialPokemon={gameState.currentPokemon}
          onSubmitGuess={(guess) =>
            socket.emit('submit_guess', { roomId: roomCode, guess })
          }
          isMultiplayer={true}
          playerScores={gameState.scores}
          players={gameState.players}
          currentPlayerId={currentPlayerId}
          activePlayerId={gameState.activePlayerId || ''}
        />
      ) : (
        <div className='text-xl font-semibold text-yellow-300'>
          {gameState.players.length === 1
            ? 'Waiting for another player to join...'
            : 'Waiting for your turn...'}
        </div>
      )}

      {gameOver && (
        <GameOverModal
          isWinner={winnerId === currentPlayerId}
          onPlayAgain={restartGame}
          readyPlayers={gameState.readyPlayers || []}
          currentPlayerId={currentPlayerId}
          players={gameState.players}
          abandonment={abandonment}
        />
      )}
    </div>
  )
}
