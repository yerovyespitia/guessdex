import { PokemonGame } from './components/PokemonGame'
import { usePokemon } from './hooks/usePokemon'
import { Loading } from './components/Loading'
import { Error } from './components/Error'

function App() {
  const { data: pokemon, isLoading, error } = usePokemon()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error error={'Loading Pokémon'} />
  }

  return (
    <main className='bg-purple-800 md:h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col mt-4 md:mt-0'>
      <h1 className='text-white text-3xl md:text-4xl font-bold mb-4 font-[Helvetica] tracking-tight'>
        Who's that Pokémon?
      </h1>
      {pokemon && <PokemonGame initialPokemon={pokemon} />}
    </main>
  )
}

export default App
