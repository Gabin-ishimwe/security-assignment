import { create } from 'zustand'

export const requestDetailsStore = create((set) => ({
    request: undefined,
    loading: false,
    error: undefined,
    fetchRequest: (req:any) => set({request: req}),
    handleError: (err: any) => set({error: err}),
    loadingState: (loading: any) => set({loading})
}))