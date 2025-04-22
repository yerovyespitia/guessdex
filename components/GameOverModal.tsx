import { useRouter } from 'next/navigation'

type GameOverModalProps = {
  isWinner: boolean
  onPlayAgain: () => void
}

export const GameOverModal = ({ isWinner, onPlayAgain }: GameOverModalProps) => {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn">
        <h2 className="text-4xl font-bold mb-6 text-purple-600 dark:text-purple-400">
          {isWinner ? 'You Win!' : 'You Lose!'}
        </h2>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
          {isWinner 
            ? 'Congratulations! You reached 10 points first!' 
            : 'Your opponent reached 10 points first.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors font-bold text-lg"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-3 rounded-md transition-colors text-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
} 