export async function getPokemon() {
  const randomPokemon = Math.floor(Math.random() * 150) + 1
  const url = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}
