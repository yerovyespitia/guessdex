import { PokemonGame } from '@/components/PokemonGame'
import { getPokemon } from '@/utils/get'

export default async function Home() {
  const pokemon = await getPokemon()

  return (
    <main className='bg-purple-800 h-screen flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-5xl font-bold mb-8'>Who's that Pokémon?</h1>
      <PokemonGame initialPokemon={pokemon} />
    </main>
  )
}
