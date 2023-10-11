import { create } from 'zustand'

export const requestStore = create((set) => ({
    requests: undefined,
    loading: false,
    error: undefined,
    fetchRequests: (req:any) => set({requests: req}),
    handleError: (err: any) => set({error: err}),
    loadingState: (loading: any) => set({loading}),
    addRequest: (req: any) => set((state: any) => ({
        requests: [
            req,
            ...state.requests
        ]
    })),
    updateRequest: (req:any) => set((state:any) => {
        const newRequest = state.requests.map((r:any) => {
            if(r.id === req.id) return {...r, ...req}
            return r
        })
        console.log("new requests ==> ", newRequest)
        return {
            requests: newRequest
        }
    })
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
