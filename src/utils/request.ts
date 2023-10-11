export const senderRequests =async (req:any) => {
    console.log('tttt ', req.token)
    const res = await fetch('http://localhost:5000/sender/requests', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.token}`
        },
    })
    const data = await res.json()
    return data
}