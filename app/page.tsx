'use client'

import { Error } from '@/components/Error'
import { Loading } from '@/components/Loading'
import { PokemonGame } from '@/components/PokemonGame'
import { usePokemon } from '@/hooks/usePokemon'

export default function Home() {
  const { data: pokemon, isLoading, error } = usePokemon()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-4 md:mb-8 font-[Helvetica] tracking-tight'>
        Who's that Pokémon?
      </h1>
      {pokemon && <PokemonGame initialPokemon={pokemon} />}
    </main>
  )
}
