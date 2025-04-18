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
}
