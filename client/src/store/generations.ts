import { create } from 'zustand'

type Generation = {
  id: string
  value: number
  label: string
  offset: number
}

type GenerationStore = {
  generation: Generation
  setGeneration: (generation: Generation) => void
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  generation: {
    id: 'gen1',
    value: 151,
    label: 'Gen 1 (Kanto)',
    offset: 0,
  },
  setGeneration: (generation) => set({ generation }),
}))