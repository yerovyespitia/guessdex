type GuessingStatusProps = {
  isMyTurn: boolean
  isMultiplayer: boolean
  players: string[]
  activePlayerId?: string
  countdown: number | null
}

export const GuessingStatus = ({
  isMyTurn,
  isMultiplayer,
  players,
  activePlayerId,
  countdown,
}: GuessingStatusProps) => {
  // If countdown is active AND it's multiplayer, show the countdown message
  if (countdown !== null && isMultiplayer) {
    return (
      <div className='mt-4 text-xl font-semibold text-yellow-300 transition-all duration-500'>
        <p>Changing turn in: {countdown}</p>
      </div>
    )
  }

  // If not multiplayer or it's my turn, don't show anything
  if (!isMultiplayer || isMyTurn) return null

  const playerLabel =
    players.find((p) => p === activePlayerId)?.slice(0, 4) ?? '...'

  return (
    <div className='mt-4 text-xl font-semibold text-yellow-300 transition-all duration-500'>
      <p>Waiting for {playerLabel} to guess...</p>
    </div>
  )
}
