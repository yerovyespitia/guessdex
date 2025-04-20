export async function getPokemon() {
  const randomPokemon = Math.floor(Math.random() * 150) + 1
  const url = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`
  const response = await fetch(url, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  const data = await response.json()
  return data
}
