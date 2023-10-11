import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'


const user = {
  email: undefined,
  name: undefined,
  token: undefined,
  role: undefined,
  id: undefined,
}

export const userStore = create((set) => ({
  user,
  loading: false,
  error: undefined,
  token: undefined,
  setUser: (data: any) => set((state: any) => ({
    user: {
      ...state.user,
      ...data
    },
  })),
  loadingState: (loading: any) => set({ loading }),
  errorApi: (error: any) => set({ error }),
}))

export const receiverStore = create((set) => ({
  receivers: undefined,
  loading: false,
  error: undefined,
  fetchReceivers: (req:any) => set({receivers: req}),
  handleError: (err: any) => set({error: err}),
  loadingState: (loading: any) => set({loading})
}))