import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'


const user = {
    email: undefined,
    name: undefined,
    token: undefined,
    role: undefined
}

export const userStore = create((set) => ({
  user,
  loading: false,
  error: undefined,
  token: undefined,
  setUser: (data: any) => set((state:any) => ({
    user: {
        ...state.user,
        ...data
    },
  })),
  loadingState: (loading: any) => set({loading}),
  errorApi: (error: any) => set({error}),
}))