import { Progressbar } from './Progressbar'

type ScoreBoardProps = {
  correct: number
  wrong: number
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
  timer?: number
}

export const ScoreBoard = ({
  correct,
  wrong,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
  timer = 15,
}: ScoreBoardProps) => {
  const renderPlayerScore = (player: string, playerNum: number) => (
    <div
      key={player}
      className={`text-xl md:text-2xl font-semibold ${
        player === currentPlayerId ? 'text-yellow-300' : ''
      } ${player === activePlayerId ? 'underline' : ''}`}
    >
      Player {playerNum} {player === currentPlayerId ? '(You)' : ''}:
      <span className='font-medium ml-2'>{playerScores[player] || 0}</span>
    </div>
  )

  const renderScoreIndicator = (type: 'correct' | 'wrong') => (
    <div
      className={`rounded-full px-4 py-1 ${
        type === 'correct' ? 'bg-green-500' : 'bg-red-500'
      } flex items-center gap-2`}
    >
      <img
        src={`/svgs/${type === 'correct' ? 'check' : 'wrong'}.svg`}
        alt={type}
        className='size-4 filter invert'
      />
      <p className='font-bold'>{type === 'correct' ? correct : wrong}</p>
    </div>
  )

  if (isMultiplayer && players.length > 0) {
    return (
      <div className='flex justify-between gap-12 text-white mb-4'>
        {renderPlayerScore(players[0], 1)}
        <Progressbar timer={timer} />
        {renderPlayerScore(players[1], 2)}
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center gap-12 text-white mb-4'>
      {renderScoreIndicator('correct')}
      <Progressbar timer={timer} />
      {renderScoreIndicator('wrong')}
    </div>
  )
}
