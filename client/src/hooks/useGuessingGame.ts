import { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useCountdown } from './useCountdown'
import { Pokemon } from '../types/pokemon'
import { usePokemon } from './usePokemon'

type Params = {
  initialPokemon: Pokemon
  isMultiplayer: boolean
  activePlayerId?: string
  currentPlayerId?: string
  onSubmitGuess?: (guess: string) => void
}

export function useGuessingGame({
  initialPokemon,
  isMultiplayer,
  activePlayerId,
  currentPlayerId,
  onSubmitGuess,
}: Params) {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon)
  const [isGuessDisabled, setIsGuessDisabled] = useState(false)
  const [isMyTurn, setIsMyTurn] = useState(false)
  const { socket } = useSocket()
  const { refetch } = usePokemon()
  const { countdown, start: startCountdown } = useCountdown(3, fetchNewPokemon)

  useEffect(() => {
    setPokemon(initialPokemon)
    setIsGuessDisabled(false)
  }, [initialPokemon])

  useEffect(() => {
    setIsMyTurn(!isMultiplayer || activePlayerId === currentPlayerId)
  }, [isMultiplayer, activePlayerId, currentPlayerId])

  useEffect(() => {
    if (!socket) return

    const handleDisableGuess = () => setIsGuessDisabled(true)
    const handleWrongGuess = () => {
      setIsGuessDisabled(true)
      setIsMyTurn(false)
    }

    socket.on('disable_guess', handleDisableGuess)
    socket.on('wrong_guess', handleWrongGuess)

    return () => {
      socket.off('disable_guess', handleDisableGuess)
      socket.off('wrong_guess', handleWrongGuess)
    }
  }, [socket])

  async function fetchNewPokemon() {
    const { data } = await refetch()
    if (data) setPokemon(data)
  }

  function handleCorrectGuess() {
    if (isMultiplayer && onSubmitGuess) {
      onSubmitGuess(pokemon.name)
      setIsGuessDisabled(true)
    } else {
      startCountdown()
    }
  }

  function handleWrongGuess() {
    if (isMultiplayer && onSubmitGuess) {
      onSubmitGuess('')
      setIsGuessDisabled(true)
    } else {
      startCountdown()
    }
  }

  return {
    pokemon,
    isGuessDisabled,
    isMyTurn,
    countdown,
    handleCorrectGuess,
    handleWrongGuess,
  }
}
