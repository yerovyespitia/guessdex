import { useNavigate } from '@tanstack/react-router'

type GameOverModalProps = {
  isWinner: boolean
  onPlayAgain: () => void
  readyPlayers?: string[]
  currentPlayerId: string
  players: string[]
}

export const GameOverModal = ({
  isWinner,
  onPlayAgain,
  readyPlayers = [],
  currentPlayerId,
  players,
}: GameOverModalProps) => {
  const navigate = useNavigate()

  const handlePlayAgain = () => {
    // Just restart the game for this player
    onPlayAgain()
  }

  const handleReturnHome = () => {
    // Only navigate the current player to home
    navigate({ to: '/' })
  }

  // Check if current player is ready to restart
  const isPlayerReady = readyPlayers.includes(currentPlayerId)

  return (
    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn'>
        <h2 className='text-4xl font-bold mb-6 text-sky-600 dark:text-sky-400'>
          {isWinner ? 'You Win!' : 'You Lose!'}
        </h2>
        <p className='mb-8 text-lg text-gray-700 dark:text-gray-300'>
          {isWinner
            ? 'Congratulations! You reached 10 points first!'
            : 'Your opponent reached 10 points first.'}
        </p>

        {readyPlayers.length > 0 && (
          <div className='mb-4 text-gray-600 dark:text-gray-400'>
            {readyPlayers.length === players.length ? (
              <p>All players ready! Starting new game...</p>
            ) : (
              <p>Waiting for other players...</p>
            )}
            <div className='flex justify-center gap-2 mt-2'>
              {players.map((playerId) => (
                <div 
                  key={playerId} 
                  className={`w-3 h-3 rounded-full ${
                    readyPlayers.includes(playerId) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                  title={playerId === currentPlayerId ? 'You' : 'Other player'}
                />
              ))}
            </div>
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={handlePlayAgain}
            className='bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-md transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isPlayerReady}
          >
            {isPlayerReady ? 'Waiting...' : 'Play Again'}
          </button>
          <button
            onClick={handleReturnHome}
            className='bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-3 rounded-md transition-colors text-lg'
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}
