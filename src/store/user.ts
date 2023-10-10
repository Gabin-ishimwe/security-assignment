import { create } from 'zustand'

const user = {
    email: undefined,
    name: undefined,
    token: undefined
}

export const userStore = create((set) => ({
  user,
  loading: false,
  error: undefined,
  setUser: (user: any) => set({user}),
  loadingState: (loading: any) => set({loading}),
  errorApi: (error: any) => set({error}),
  setToken: (token: string) => set({user: {
    ...user,
    token
  }})
}))