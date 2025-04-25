export type PokemonSprites = {
  other: {
    'official-artwork': {
      front_default: string
    }
  }
}

export type Pokemon = {
  sprites: PokemonSprites
  name: string
  id: number
}

export type GameRoom = {
  id: string
  players: string[]
  currentPokemon: Pokemon
  scores: Record<string, number>
  activePlayerId: string
  guessedPlayers: string[]
  readyToRestart?: string[]
}
