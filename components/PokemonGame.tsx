'use client'
import { useState, useEffect } from 'react'
import { Card } from './Card'
import { Pokemon } from '@/types/pokemon'
import { getPokemon } from '@/utils/get'

type PokemonGameProps = {
  initialPokemon: Pokemon
}

export const PokemonGame = ({ initialPokemon }: PokemonGameProps) => {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon)
  const [countdown, setCountdown] = useState<number | null>(null)

  const loadNewPokemon = async () => {
    const newPokemon = await getPokemon()
    setPokemon(newPokemon)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      loadNewPokemon()
      setCountdown(null)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleCorrectGuess = () => {
    setCountdown(3)
  }

  const handleWrongGuess = () => {
    loadNewPokemon()
  }

  return (
    <div className='flex flex-col items-center'>
      <Card
        pokemon={pokemon}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
      />
      <div className='text-white text-2xl font-bold mt-4 h-[36px]'>
        {countdown !== null && (
          <p>Next Pokémon in: {countdown}</p>
        )}
      </div>
    </div>
  )
}
