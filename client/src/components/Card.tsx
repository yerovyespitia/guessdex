import { Pokemon } from '../types/pokemon'
import { ScoreBoard } from './ScoreBoard'
import { Feedback } from './Feedback'
import { GuessForm } from './GuessForm'
import { useGuess } from '../hooks/useGuess'
import { useEffect, useRef, useState } from 'react'

type CardProps = {
  pokemon: Pokemon
  onCorrectGuess: () => void
  onWrongGuess: () => void
  isInputDisabled?: boolean
  isMultiplayer?: boolean
  playerScores?: Record<string, number>
  players?: string[]
  currentPlayerId?: string
  activePlayerId?: string
}

export const Card = ({
  pokemon,
  onCorrectGuess,
  onWrongGuess,
  isInputDisabled = false,
  isMultiplayer = false,
  playerScores = {},
  players = [],
  currentPlayerId = '',
  activePlayerId = '',
}: CardProps) => {
  const {
    guess,
    setGuess,
    isCorrect,
    showWrongIcon,
    correctGuesses,
    wrongGuesses,
    submitGuess,
    incrementWrongGuesses,
  } = useGuess(pokemon)

  const [showName, setShowName] = useState(false)
  const [localInputDisabled, setLocalInputDisabled] = useState(false)
  const [keepRevealed, setKeepRevealed] = useState(false)
  const [currentPokemonId, setCurrentPokemonId] = useState<number | null>(null)
  const [timer, setTimer] = useState(15)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const hasInteractedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pokemon.id !== currentPokemonId) {
      if (keepRevealed) {
        setKeepRevealed(false)
      }
      setCurrentPokemonId(pokemon.id)
      setShowName(false)
      setLocalInputDisabled(false)
      // Reset timer when pokemon changes
      setTimer(15)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      startTimer()
    }
  }, [pokemon, currentPokemonId, keepRevealed])

  // Add effect to clean up timer when active player changes
  useEffect(() => {
    if (isMultiplayer) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setTimer(15)
      if (currentPlayerId === activePlayerId) {
        startTimer()
      }
    }
  }, [isMultiplayer, currentPlayerId, activePlayerId])

  useEffect(() => {
    if (hasInteractedRef.current && !isInputDisabled) inputRef.current?.focus()
  }, [pokemon, isInputDisabled])

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          setTimer(15)
          // Use setTimeout to avoid calling during render
          setTimeout(() => {
            incrementWrongGuesses()
            onWrongGuess()
            setShowName(true)
          }, 0)
          return 15
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleGuess = () => {
    hasInteractedRef.current = true
    setLocalInputDisabled(true)
    const isGuessCorrect = submitGuess()
    setShowName(true)

    // Clear the timer on guess
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (isGuessCorrect) {
      console.log('Correct guess, showing name for 2 seconds')
      setKeepRevealed(true)
      setTimeout(() => {
        setShowName(false)
        onCorrectGuess()
      }, 2000)
    } else {
      console.log('Wrong guess, showing feedback for 2 seconds')
      setTimeout(() => {
        setShowName(false)
        setLocalInputDisabled(false)
        // Don't restart timer here, just resume the current one
        setTimer((prev) => prev)
        // Call onWrongGuess in the timeout to avoid render issues
        onWrongGuess()
      }, 2000)
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className='flex flex-col gap-4 max-w-[280px] sm:max-w-full w-full'>
      <ScoreBoard
        correct={correctGuesses}
        wrong={wrongGuesses}
        isMultiplayer={isMultiplayer}
        playerScores={playerScores}
        players={players}
        currentPlayerId={currentPlayerId}
        activePlayerId={activePlayerId}
        timer={timer}
      />

      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={`Random pokemon artwork`}
        className={`${isCorrect || keepRevealed ? 'brightness-100 transition-all duration-500' : 'brightness-0'} w-full`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div className='transition-all duration-800 min-h-[32px] flex items-center justify-center'>
        <Feedback
          status={isCorrect ? 'correct' : showWrongIcon ? 'wrong' : null}
          name={showName ? pokemon.name : ''}
        />
      </div>

      {(!isMultiplayer ||
        (isMultiplayer &&
          currentPlayerId === activePlayerId &&
          players.length >= 2)) && (
        <div className='flex items-center justify-center gap-2 max-w-full sm:max-w-[380px] mx-auto w-full'>
          <GuessForm
            ref={inputRef}
            value={guess}
            onChange={setGuess}
            onSubmit={handleGuess}
            disabled={isInputDisabled || localInputDisabled}
          />
        </div>
      )}
    </div>
  )
}
