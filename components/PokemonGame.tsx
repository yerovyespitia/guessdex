'use client'

import { useState } from 'react'
import { Card } from './Card'
import { Pokemon } from '@/types/pokemon'
import { getPokemon } from '@/utils/get'
import { useCountdown } from '@/hooks/useCountdown'
import { Countdown } from './Countdown'

type PokemonGameProps = {
  initialPokemon: Pokemon
}

export const PokemonGame = ({ initialPokemon }: PokemonGameProps) => {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon)

  const loadNewPokemon = async () => {
    const newPokemon = await getPokemon()
    setPokemon(newPokemon)
  }

  const { countdown, start: startCountdown } = useCountdown(3, loadNewPokemon)

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={() => startCountdown()}
        onWrongGuess={() => startCountdown()}
        isInputDisabled={countdown !== null}
      />

      <Countdown value={countdown} />
    </div>
  )
}
