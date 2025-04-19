'use client'

import { useState } from 'react'
import { Card } from './Card'
import { Pokemon } from '@/types/pokemon'
import { getPokemon } from '@/utils/get'
import { useCountdown } from '@/hooks/useCountdown'
import { Countdown } from './Countdown'

type PokemonGameProps = {
  initialPokemon: Pokemon
  onSubmitGuess?: (guess: string) => void
  isMultiplayer?: boolean
}

export const PokemonGame = ({
  initialPokemon,
  onSubmitGuess,
  isMultiplayer = false,
}: PokemonGameProps) => {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon)

  const loadNewPokemon = async () => {
    const newPokemon = await getPokemon()
    setPokemon(newPokemon)
  }

  const { countdown, start: startCountdown } = useCountdown(3, loadNewPokemon)

  const handleCorrectGuess = () => {
    if (isMultiplayer && onSubmitGuess) {
      onSubmitGuess(pokemon.name)
    } else {
      startCountdown()
    }
  }

  const handleWrongGuess = () => {
    if (!isMultiplayer) {
      startCountdown()
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
        isInputDisabled={countdown !== null}
      />

      <Countdown value={countdown} />
    </div>
  )
}
