import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NicknameStore {
  nickname: string
  setNickname: (nickname: string) => void
}

export const useNicknameStore = create<NicknameStore>()(
  persist(
    (set) => ({
      nickname: '',
      setNickname: (nickname) => set({ nickname }),
    }),
    {
      name: 'nickname-storage',
    }
  )
)
