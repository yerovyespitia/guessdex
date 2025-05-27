import { create } from 'zustand'

type GameModeStore = {
  gameMode: string
  setGameMode: (gameMode: string) => void
}

export const useGameModeStore = create<GameModeStore>((set) => ({
  gameMode: 'classic',
  setGameMode: (gameMode) => set({ gameMode }),
}))
