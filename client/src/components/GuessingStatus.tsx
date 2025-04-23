type GuessingStatusProps = {
  isMyTurn: boolean
  isMultiplayer: boolean
  players: string[]
  activePlayerId?: string
}

export const GuessingStatus = ({
  isMyTurn,
  isMultiplayer,
  players,
  activePlayerId,
}: GuessingStatusProps) => {
  if (!isMultiplayer || isMyTurn) return null

  const playerLabel =
    players.find((p) => p === activePlayerId)?.slice(0, 4) ?? '...'

  return (
    <div className='mt-4 text-xl font-semibold text-yellow-300'>
      Waiting for {playerLabel} to guess...
    </div>
  )
}
