import { create } from 'zustand'

export const requestStore = create((set) => ({
    requests: undefined,
    loading: false,
    error: undefined,
    fetchRequests: (req:any) => set({requests: req}),
    handleError: (err: any) => set({error: err}),
    loadingState: (loading: any) => set({loading})
}))
const singleRequest = {
    id: undefined,
    subject: undefined,
    message: undefined,
    type: undefined,
    senderId: undefined,
    receiverId: undefined
};

export const singleRequestStore = create((set) =>({
    singleRequest,
    loading: false,
    error: undefined,
    setSingleRequest: (singleRequest: any) => set({singleRequest}),
    loadingState: (loading: any) => set({loading}),
    errorApi: (error: any) => set({error}),
})) 
