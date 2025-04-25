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
  if (isMultiplayer && players.length > 0) {
    return (
      <div className='flex justify-between gap-12 text-white mb-4'>
        <div
          key={players[0]}
          className={`text-2xl md:text-3xl font-bold ${players[0] === currentPlayerId ? 'text-yellow-300' : ''} ${players[0] === activePlayerId ? 'underline' : ''}`}
        >
          Player 1 {players[0] === currentPlayerId ? '(You)' : ''}:
          <span className='font-medium ml-2'>
            {playerScores[players[0]] || 0}
          </span>
        </div>

        <Progressbar timer={timer} />

        <div
          key={players[1]}
          className={`text-2xl md:text-3xl font-bold ${players[1] === currentPlayerId ? 'text-yellow-300' : ''} ${players[1] === activePlayerId ? 'underline' : ''}`}
        >
          Player 2 {players[1] === currentPlayerId ? '(You)' : ''}:
          <span className='font-medium ml-2'>
            {playerScores[players[1]] || 0}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center gap-12 text-white mb-4'>
      <div className='rounded-full px-4 py-1 bg-green-500 flex items-center gap-2'>
        <img
          src='/svgs/check.svg'
          alt='check'
          className='size-4 filter invert'
        />
        <p className='font-bold'>{correct}</p>
      </div>
      <Progressbar timer={timer} />
      <div className='rounded-full px-4 py-1 bg-red-500 flex items-center gap-2'>
        <img
          src='/svgs/wrong.svg'
          alt='wrong'
          className='size-4 filter invert'
        />
        <p className='font-bold'>{wrong}</p>
      </div>
    </div>
  )
}
