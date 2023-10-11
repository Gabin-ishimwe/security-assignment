import { create } from 'zustand'

export const requestDetailsStore = create((set) => ({
    requestDetails: undefined,
    loading: false,
    error: undefined,
    fetchRequestDetails: (req:any) => set({requestDetails: req}),
    handleError: (err: any) => set({error: err}),
    loadingState: (loading: any) => set({loading})
}))