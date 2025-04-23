type ScoreBoardProps = {
  correct: number
  wrong: number
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
}

export const ScoreBoard = ({
  correct,
  wrong,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
}: ScoreBoardProps) => {
  if (isMultiplayer && players.length > 0) {
    return (
      <div className='flex justify-between gap-12 text-white mb-4'>
        {players.map((playerId, index) => (
          <div
            key={playerId}
            className={`text-2xl md:text-3xl font-bold ${playerId === currentPlayerId ? 'text-yellow-300' : ''} ${playerId === activePlayerId ? 'underline' : ''}`}
          >
            Player {index + 1} {playerId === currentPlayerId ? '(You)' : ''}:
            <span className='font-medium ml-2'>
              {playerScores[playerId] || 0}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='flex justify-center gap-12 text-white mb-4'>
      <div className='rounded-full px-4 py-1 bg-green-500 flex items-center gap-2'>
        <img
          src='/svgs/check.svg'
          alt='check'
          className='size-4 filter invert'
        />
        <p>{correct}</p>
      </div>
      <div className='rounded-full px-4 py-1 bg-red-500 flex items-center gap-2'>
        <img
          src='/svgs/wrong.svg'
          alt='wrong'
          className='size-4 filter invert'
        />
        <p>{wrong}</p>
      </div>
    </div>
  )
}
