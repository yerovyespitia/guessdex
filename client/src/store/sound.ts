import { create } from 'zustand'

interface SoundStore {
  isMuted: boolean
  toggleMute: () => void
}

export const useSoundStore = create<SoundStore>((set) => ({
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}))
