'use client'

import { PokemonGame } from '@/components/PokemonGame'
import { usePokemon } from '@/hooks/usePokemon'

export default function Home() {
  const { data: pokemon, isLoading, error } = usePokemon()

  if (isLoading) {
    return (
      <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
        <h1 className='text-white text-3xl md:text-5xl font-bold mb-8 font-[Helvetica] tracking-tight'>
          Loading...
        </h1>
      </main>
    )
  }

  if (error) {
    return (
      <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
        <h1 className='text-white text-3xl md:text-5xl font-bold mb-8 font-[Helvetica] tracking-tight'>
          Error loading Pokemon
        </h1>
      </main>
    )
  }

  return (
    <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-8 font-[Helvetica] tracking-tight'>
        Who's that Pokémon?
      </h1>
      {pokemon && <PokemonGame initialPokemon={pokemon} />}
    </main>
  )
}
