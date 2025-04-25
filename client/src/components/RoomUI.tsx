import { PokemonGame } from './PokemonGame'
import { GameState } from '../hooks/useGameRoom'

interface Props {
  roomCode: string
  gameState: GameState
  connectedPlayers: string[]
  currentPlayerId: string
  socket: any
}

export function RoomUI({
  roomCode,
  gameState,
  currentPlayerId,
  socket,
}: Props) {
  return (
    <div className='flex flex-col items-center justify-center md:h-[calc(100vh-64px)] bg-purple-800 text-white p-4 mt-4 md:mt-0'>
      <div className='flex items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>Room: {roomCode}</h1>
        <button
          onClick={() => navigator.clipboard.writeText(roomCode)}
          className='px-3 py-1 bg-purple-900 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer'
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
    </div>
  )
}
