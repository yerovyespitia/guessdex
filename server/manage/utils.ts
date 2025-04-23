export function rotateTurn(players: string[], currentId: string): string {
  if (players.length === 0) return currentId
  const index = players.indexOf(currentId)
  if (index === -1) return players[0] || currentId
  const nextPlayerIndex = (index + 1) % players.length
  return players[nextPlayerIndex] || currentId
}

export function findNextPlayer(
  players: string[],
  guessedPlayers: string[],
  currentId: string
): string | null {
  if (players.length === 0) return null
  let index = players.indexOf(currentId)
  if (index === -1) index = 0
  for (let i = 0; i < players.length; i++) {
    index = (index + 1) % players.length
    const candidate = players[index]
    if (candidate && !guessedPlayers.includes(candidate)) return candidate
  }
  return null
}
