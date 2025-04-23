import { Card } from './Card'
import { Countdown } from './Countdown'
import { GuessingStatus } from './GuessingStatus'
import { Pokemon } from '../types/pokemon'
import { useGuessingGame } from '../hooks/useGuessingGame'

type Props = {
  initialPokemon: Pokemon
  onSubmitGuess?: (guess: string) => void
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
}

export const PokemonGame = ({
  initialPokemon,
  onSubmitGuess,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
}: Props) => {
  const {
    pokemon,
    isGuessDisabled,
    isMyTurn,
    countdown,
    handleCorrectGuess,
    handleWrongGuess,
  } = useGuessingGame({
    initialPokemon,
    isMultiplayer,
    activePlayerId,
    currentPlayerId,
    onSubmitGuess,
  })

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
        isInputDisabled={
          countdown !== null || (isMultiplayer && !isMyTurn) || isGuessDisabled
        }
        isMultiplayer={isMultiplayer}
        playerScores={playerScores}
        players={players}
        currentPlayerId={currentPlayerId}
        activePlayerId={activePlayerId}
      />

      <GuessingStatus
        isMyTurn={isMyTurn}
        isMultiplayer={isMultiplayer}
        players={players}
        activePlayerId={activePlayerId}
      />

      <Countdown value={countdown} />
    </div>
  )
}
