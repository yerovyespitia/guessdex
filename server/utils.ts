export function rotateTurn(players: string[], currentId: string): string {
  const index = players.indexOf(currentId)
  return players[(index + 1) % players.length]
}

export function findNextPlayer(
  players: string[],
  guessedPlayers: string[],
  currentId: string
): string | null {
  let index = players.indexOf(currentId)
  for (let i = 0; i < players.length; i++) {
    index = (index + 1) % players.length
    const candidate = players[index]
    if (!guessedPlayers.includes(candidate)) return candidate
  }
  return null
}
