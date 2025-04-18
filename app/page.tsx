import { Card } from '@/components/Card'

export default async function Home() {
  async function getPokemon() {
    const randomPokemon = Math.floor(Math.random() * 150) + 1
    const url = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  const pokemon = await getPokemon()

  console.log('pokemon:', pokemon)

  return (
    <main className='bg-red-800 h-screen flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-5xl font-bold'>Who's that Pokémon?</h1>
      <Card pokemon={pokemon} />
    </main>
  )
}
