import { create } from 'zustand'

export const requestStore = create((set) => ({
    requests: undefined,
    loading: false,
    error: undefined,
    fetchRequests: (req:any) => set({requests: req}),
    handleError: (err: any) => set({error: err}),
    loadingState: (loading: any) => set({loading})
}))